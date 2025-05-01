import { firestore } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { COLLECTIONS, FarmerPerformance } from "./models";
import { Sale } from "./types";

export interface Farmer {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  corperate_id?: string;
  gender: string;
  nida: string;
  dob: string;
  zone: string;
  ward: string;
  district: string;
  village: string;
  account_number: string;
  bank_name: string;
  farm_size: number;
  number_of_trees: number;
  number_of_trees_with_fruits: number;
  entry_fee?: number;
  ubscription_fee?: number;
  loan: number;
}
export const getFarmers = async () => {
  const myCollection = collection(firestore, COLLECTIONS.FARMERS);
  const querySnapshot = await getDocs(myCollection);
  const farmers = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Farmer[];
  return farmers;
};

export const getSales = async () => {
  const myCollection = collection(firestore, COLLECTIONS.SALES);
  const querySnapshot = await getDocs(myCollection);
  const sales = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sale[];
  return sales;
};

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
      name: farmer.first_name,
      zone: farmer.zone,
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
