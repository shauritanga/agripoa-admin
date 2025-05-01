import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "./firebase";

// Collection names
const COLLECTIONS = {
  FARMERS: "farmers",
  SALES: "sales",
  SEASONS: "seasons",
} as const;

// Firestore data models
export interface FirestoreFarmer {
  id: string;
  name: string;
  location: string;
  joinDate: Timestamp;
  totalTrees: number;
  contact: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreSale {
  id: string;
  farmerId: string;
  seasonId: string;
  date: Timestamp;
  quantity: number;
  price: number;
  type: "good" | "reject";
  totalAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreSeason {
  id: string;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: "active" | "completed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FarmerPerformance {
  id: string;
  name: string;
  location: string;
  totalSales: number;
  totalRevenue: number;
  goodAvocados: number;
  rejectAvocados: number;
  rejectRate: number;
}

// Data access functions
export async function getFarmers() {
  const farmersRef = collection(firestore, COLLECTIONS.FARMERS);
  const q = query(farmersRef, where("active", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FirestoreFarmer[];
}

export async function getSales(seasonId?: string) {
  const salesRef = collection(firestore, COLLECTIONS.SALES);
  const q = seasonId
    ? query(
        salesRef,
        where("seasonId", "==", seasonId),
        orderBy("date", "desc")
      )
    : query(salesRef, orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// export async function getSeasons() {
//   const seasonsRef = collection(firestore, COLLECTIONS.SEASONS);
//   const q = query(seasonsRef, orderBy("startDate", "desc"));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// New functions for analyzing farmer performance
export async function getTopFarmers(
  seasonId?: string,
  limit: number = 5
): Promise<FarmerPerformance[]> {
  // Get all active farmers
  const farmers = await getFarmers();
  const farmerMap = new Map(farmers.map((f) => [f.id, f]));

  // Get relevant sales
  const salesRef = collection(firestore, COLLECTIONS.SALES);
  const salesQuery = seasonId
    ? query(salesRef, where("seasonId", "==", seasonId))
    : query(salesRef);
  const salesSnapshot = await getDocs(salesQuery);
  const sales = salesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Calculate performance metrics for each farmer
  const performanceMap = new Map<string, FarmerPerformance>();

  sales.forEach((sale: DocumentData) => {
    const farmer = farmerMap.get(sale.farmerId);
    if (!farmer) return;

    const existing = performanceMap.get(farmer.id) || {
      id: farmer.id,
      name: farmer.id,
      location: farmer.id,
      totalSales: 0,
      totalRevenue: 0,
      goodAvocados: 0,
      rejectAvocados: 0,
      rejectRate: 0,
    };

    existing.totalSales += sale.quantity;
    existing.totalRevenue += sale.totalAmount;

    if (sale.type === "good") {
      existing.goodAvocados += sale.quantity;
    } else {
      existing.rejectAvocados += sale.quantity;
    }

    existing.rejectRate = existing.rejectAvocados / existing.totalSales;
    performanceMap.set(farmer.id, existing);
  });

  // Convert to array and sort by revenue
  return Array.from(performanceMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
}

export async function getFarmerPerformanceByPeriod(
  farmerId: string,
  startDate: Date,
  endDate: Date
): Promise<FarmerPerformance> {
  const salesRef = collection(firestore, COLLECTIONS.SALES);
  const q = query(
    salesRef,
    where("farmerId", "==", farmerId),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<=", Timestamp.fromDate(endDate))
  );

  const salesSnapshot = await getDocs(q);
  const sales = salesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const farmer = (await getFarmers()).find((f) => f.id === farmerId);

  if (!farmer) {
    throw new Error("Farmer not found");
  }

  const performance: FarmerPerformance = {
    id: farmer.id,
    name: farmer.id,
    location: farmer.id,
    totalSales: 0,
    totalRevenue: 0,
    goodAvocados: 0,
    rejectAvocados: 0,
    rejectRate: 0,
  };

  sales.forEach((sale: DocumentData) => {
    performance.totalSales += sale.quantity;
    performance.totalRevenue += sale.totalAmount;

    if (sale.type === "good") {
      performance.goodAvocados += sale.quantity;
    } else {
      performance.rejectAvocados += sale.quantity;
    }
  });

  performance.rejectRate =
    performance.totalSales > 0
      ? performance.rejectAvocados / performance.totalSales
      : 0;

  return performance;
}
