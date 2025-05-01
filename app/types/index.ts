import { Timestamp } from 'firebase/firestore';

export interface Farmer {
  id: string;
  name: string;
  location: string;
  joinDate: string;
  totalTrees: number;
  contact: string;
  active: boolean;
}

export interface Sale {
  id: string;
  farmerId: string;
  seasonId: string;
  date: string;
  quantity: number;
  price: number;
  type: 'good' | 'reject';
  totalAmount: number;
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
}

// Firestore data conversion helpers
export function formatTimestamp(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

export function parseTimestamp(dateString: string): Timestamp {
  return Timestamp.fromDate(new Date(dateString));
}