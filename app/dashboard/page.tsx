"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";

interface Sale {
  id: string;
  farmer: string;
  date: string;
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
  gender: string;
  nida: string;
  dob: string;
  zone: string;
  district: string;
  entry_fee?: number;
  subscription_fee?: number;
  loan?: number;
}

// interface Group {
//   id: string;
//   name: string;
//   members: string[];
//   createdAt: Timestamp;
// }

export default function Dashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesSnapshot = await getDocs(collection(firestore, "sales"));
        const salesData = salesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sale[];
        setSales(salesData);

        const farmersSnapshot = await getDocs(collection(firestore, "farmers"));
        const farmersData = farmersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Farmer[];
        setFarmers(farmersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
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

  // Key metrics
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalWeight = sales.reduce((sum, sale) => sum + sale.weight, 0);
  const totalFarmers = farmers.length;
  //const totalGroups = groups.length;
  const totalGoodWeight = sales
    .filter((sale) => sale.type === "good")
    .reduce((sum, sale) => sum + sale.weight, 0);
  const totalRejectWeight = sales
    .filter((sale) => sale.type === "reject")
    .reduce((sum, sale) => sum + sale.weight, 0);
  const avgSalesPerFarmer = totalFarmers > 0 ? totalSales / totalFarmers : 0.0;

  console.log({ totalSales });
  // Top 5 performers
  const topPerformers = farmers
    .map((farmer) => {
      const farmerSales = sales
        .filter((sale) => sale.farmer === farmer.id)
        .reduce((sum, sale) => sum + sale.amount, 0);
      return {
        name: `${farmer.first_name} ${farmer.last_name}`,
        sales: farmerSales,
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Sales by type
  const salesByTypeData = [
    { name: "Good", value: totalGoodWeight },
    { name: "Reject", value: totalRejectWeight },
  ];

  // Sales by month
  const salesByMonthData = Array(12)
    .fill(0)
    .map((_, i) => ({
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
      amount: sales
        .filter((s) => new Date(s.date.toString()).getMonth() === i)
        .reduce((sum, s) => sum + s.amount, 0),
    }));

  // Gender comparison
  const genderData = [
    {
      name: "Male",
      value: farmers.filter((f) => f.gender.toLowerCase() === "me").length,
    },
    {
      name: "Female",
      value: farmers.filter((f) => f.gender.toLowerCase() === "ke").length,
    },
  ];

  // Age statistics
  const ageGroups = [
    { range: "Under 20", min: 0, max: 19 },
    { range: "20-29", min: 20, max: 29 },
    { range: "30-39", min: 30, max: 39 },
    { range: "40-49", min: 40, max: 49 },
    { range: "50+", min: 50, max: Infinity },
  ];
  const ageData = ageGroups.map((g) => ({
    range: g.range,
    count: farmers.filter((f) => {
      const age = calculateAge(f.dob);
      return age >= g.min && age <= g.max;
    }).length,
  }));

  const COLORS = ["#36A2EB", "#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-r-2  border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl text-gray-600 font-bold">
              TZS {totalSales.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl text-gray-600 font-bold">
              {totalWeight.toLocaleString()} kg
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl text-gray-600 font-bold">{totalFarmers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Sales/Farmer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl text-gray-600 font-bold">
              TZS {Intl.NumberFormat().format(avgSalesPerFarmer)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {salesByTypeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {genderData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row w-ful gap-3">
        {/* Top Performers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top 5 Performing Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Total Sales (TZS)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((performer, index) => (
                  <TableRow key={index}>
                    <TableCell>{performer.name}</TableCell>
                    <TableCell>{performer.sales.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="mb-8 flex-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Amount (TZS)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((sale) => {
                    const farmer = farmers.find((f) => f.id === sale.farmer);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {farmer
                            ? `${farmer.first_name} ${farmer.last_name}`
                            : "Unknown"}
                        </TableCell>
                        <TableCell>
                          {new Date(sale.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{sale.type}</TableCell>
                        <TableCell>{sale.weight}</TableCell>
                        <TableCell>{sale.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
