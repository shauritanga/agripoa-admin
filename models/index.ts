import { Timestamp } from "firebase/firestore";

// Collection names
export const COLLECTIONS = {
  FARMERS: "farmers",
  SALES: "sales",
  SEASONS: "seasons",
} as const;

// Firestore data models
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
  subscription_fee?: number;
  loan?: number;
}

export interface Sale {
  id: string;
  farmer: string;
  date: Timestamp;
  weight: number;
  type: "good" | "reject";
  amount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  uwamambo: number;
  receive: number;
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
  zone: string;
  totalSales: number;
  totalRevenue: number;
  goodAvocados: number;
  rejectAvocados: number;
  rejectRate: number;
}

export interface SalesData {
  farmerFullName: string;
  quantity: number;
  amount: number;
  entryFee: number;
  subscriptionFee: number;
  loan: number;
  charges: number;
}

// Data access functions
// export async function getFarmers() {
//   const farmersRef = collection(db, COLLECTIONS.FARMERS);
//   const q = query(farmersRef, where("active", "==", true));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// export async function getSales(seasonId?: string) {
//   const salesRef = collection(db, COLLECTIONS.SALES);
//   const q = seasonId
//     ? query(
//         salesRef,
//         where("seasonId", "==", seasonId),
//         orderBy("date", "desc")
//       )
//     : query(salesRef, orderBy("date", "desc"));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// export async function getSeasons() {
//   const seasonsRef = collection(db, COLLECTIONS.SEASONS);
//   const q = query(seasonsRef, orderBy("startDate", "desc"));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }
