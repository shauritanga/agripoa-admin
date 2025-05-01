// sales.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { collection, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";

interface Sale {
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

interface Farmer {
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

interface SalesData {
  farmerFullName: string;
  quantity: number;
  amount: number;
  entryFee: number;
  subscriptionFee: number;
  loan: number;
  receive: number;
  charges: number;
  farmerId: string;
  dob: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesCollection = collection(firestore, "sales");
        const salesSnapshot = await getDocs(salesCollection);
        const salesList = salesSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Sale)
        );

        const farmersCollection = collection(firestore, "farmers");
        const farmersSnapshot = await getDocs(farmersCollection);
        const farmersList = farmersSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Farmer)
        );

        setSales(salesList);
        setFarmers(farmersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date("2025-03-08");
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Combine sales and farmer data
  const salesData: SalesData[] = useMemo(() => {
    return sales.map((sale) => {
      const farmer = farmers.find((f) => f.id === sale.farmer);
      return {
        farmerFullName: farmer
          ? `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name}`
          : "Unknown Farmer",
        quantity: sale.weight,
        amount: sale.amount,
        entryFee: farmer?.entry_fee || 0,
        subscriptionFee: farmer?.subscription_fee || 0,
        loan: farmer?.loan || 0,
        receive: sale.receive || 0,
        charges: sale.uwamambo,
        farmerId: sale.farmer,
        dob: farmer?.dob || "",
      };
    });
  }, [sales, farmers]);

  // Filter sales data
  const filteredSalesData = useMemo(() => {
    return salesData.filter((data) => {
      const matchesSearch = data.farmerFullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const age = data.dob ? calculateAge(data.dob) : 0;

      let matchesAge = true;
      switch (ageFilter) {
        case "under30":
          matchesAge = age < 30;
          break;
        case "30-50":
          matchesAge = age >= 30 && age <= 50;
          break;
        case "over50":
          matchesAge = age > 50;
          break;
        default:
          matchesAge = true;
      }

      return matchesSearch && matchesAge;
    });
  }, [salesData, searchTerm, ageFilter]);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, "sales_list.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Taarifa za mauzo", 14, 20);

    const tableData = filteredSalesData.map((data) => [
      data.farmerFullName,
      data.dob ? calculateAge(data.dob).toString() : "N/A",
      Intl.NumberFormat().format(data.quantity),
      Intl.NumberFormat().format(data.amount),
      Intl.NumberFormat().format(data.entryFee),
      Intl.NumberFormat().format(data.subscriptionFee),
      Intl.NumberFormat().format(data.loan),
      Intl.NumberFormat().format(data.charges),
      Intl.NumberFormat().format(data.receive),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Jina la mkulima",
          "Umri",
          "Kiasi (kg)",
          "Jumla ya mauzo (TZS)",
          "Kiingilio (TZS)",
          "Ada ya uwanachama (TZS)",
          "Mkopo (TZS)",
          "Ushuru (TZS)",
          "Kiasi cha mkulima (TZS)",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("sales_list.pdf");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-r-2  border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between mb-6">
        <div className="flex gap-4">
          <Input
            placeholder="Search farmers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="under30">Under 30</SelectItem>
              <SelectItem value="30-50">30-50</SelectItem>
              <SelectItem value="over50">Over 50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToExcel}>Export to Excel</Button>
          <Button onClick={exportToPDF}>Export to PDF</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jina la mkulima</TableHead>
            <TableHead>Umri</TableHead>
            <TableHead>Kiasi (kg)</TableHead>
            <TableHead>Jumla ya mauzo (TZS)</TableHead>
            <TableHead>Kiingilio (TZS)</TableHead>
            <TableHead>Ada ya uwanachama (TZS)</TableHead>
            <TableHead>Mkopo (TZS)</TableHead>
            <TableHead>Ushuru (TZS)</TableHead>
            <TableHead>Kiasi cha mkulima (TZS)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSalesData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.farmerFullName}</TableCell>
              <TableCell>{data.dob ? calculateAge(data.dob) : "N/A"}</TableCell>
              <TableCell>{Intl.NumberFormat().format(data.quantity)}</TableCell>
              <TableCell>{Intl.NumberFormat().format(data.amount)}</TableCell>
              <TableCell>{Intl.NumberFormat().format(data.entryFee)}</TableCell>
              <TableCell>
                {Intl.NumberFormat().format(data.subscriptionFee)}
              </TableCell>
              <TableCell>{Intl.NumberFormat().format(data.loan)}</TableCell>
              <TableCell>{Intl.NumberFormat().format(data.charges)}</TableCell>
              <TableCell>{Intl.NumberFormat().format(data.receive)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
