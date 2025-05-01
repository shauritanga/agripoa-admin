"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Farmer } from "@/models";
import { Sale } from "@/types";
import { BadgeCheck, Leaf, Users, XCircle } from "lucide-react";

interface StatsCardsProps {
  farmers: Farmer[];
  sales: Sale[];
}

export function StatsCards({ farmers, sales }: StatsCardsProps) {
  const totalFarmers = farmers.length;
  const totalSales = sales.reduce((acc, sale) => acc + sale.weight, 0);
  const goodAvocados = sales
    .filter((sale) => sale.type === "good")
    .reduce((acc, sale) => acc + sale.weight, 0);
  const rejectAvocados = sales
    .filter((sale) => sale.type === "reject")
    .reduce((acc, sale) => acc + sale.weight, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFarmers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSales}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Good Avocados</CardTitle>
          <BadgeCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{goodAvocados}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reject Avocados</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectAvocados}</div>
        </CardContent>
      </Card>
    </div>
  );
}
