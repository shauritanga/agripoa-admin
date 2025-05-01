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
import { jsPDF } from "jspdf";

import { autoTable } from "jspdf-autotable";
//import "jspdf-autotable"; // For table formatting in PDF
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";

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

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch farmers from Firestore
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const farmersCollection = collection(firestore, "farmers");
        const farmersSnapshot = await getDocs(farmersCollection);
        const farmersList = farmersSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Farmer)
        );
        setFarmers(farmersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching farmers:", error);
        setLoading(false);
      }
    };

    fetchFarmers();
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

  // Filter farmers based on search and age
  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const fullName =
        `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const age = calculateAge(farmer.dob);

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
  }, [farmers, searchTerm, ageFilter]);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredFarmers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Farmers");
    XLSX.writeFile(workbook, "farmers_list.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Farmers List", 14, 20);

    // Prepare data for table
    const tableData = filteredFarmers.map((farmer) => [
      `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name}`,
      calculateAge(farmer.dob).toString(),
      farmer.gender,
      farmer.phone,
      `${farmer.village}, ${farmer.district}`,
      `${farmer.farm_size} acres`,
      farmer.number_of_trees.toString(),
      farmer.number_of_trees_with_fruits.toString(),
      farmer.bank_name,
    ]);

    // Add table to PDF
    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Name",
          "Age",
          "Gender",
          "Phone",
          "Location",
          "Farm Size",
          "Trees",
          "Trees with Fruits",
          "Bank",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("farmers_list.pdf");
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
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Farm Size</TableHead>
            <TableHead>Trees</TableHead>
            <TableHead>Trees with Fruits</TableHead>
            <TableHead>Bank</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFarmers.map((farmer) => (
            <TableRow key={farmer.id}>
              <TableCell>{`${farmer.first_name} ${farmer.middle_name} ${farmer.last_name}`}</TableCell>
              <TableCell>{calculateAge(farmer.dob)}</TableCell>
              <TableCell>{farmer.gender}</TableCell>
              <TableCell>{farmer.phone}</TableCell>
              <TableCell>{`${farmer.village}, ${farmer.district}`}</TableCell>
              <TableCell>{farmer.farm_size} acres</TableCell>
              <TableCell>{farmer.number_of_trees}</TableCell>
              <TableCell>{farmer.number_of_trees_with_fruits}</TableCell>
              <TableCell>{farmer.bank_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
