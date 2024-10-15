"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ReportDownload from "./bank-report-download";
import { exportToExcel } from "@/lib/export_excel";

interface DataItem {
  id: number;
  farmer: string;
  mkulima: string;
  account: string;
  //   status: "active" | "inactive" | "pending";
}

interface CustomTableProps {
  data: DataItem[];
  initialRowsPerPage?: number;
  // onView: (id: number) => void;
  // onDelete: (id: number) => void;
}

export default function BankReportTable({
  data,
  initialRowsPerPage = 5,
}: //   onView,
//   onDelete,
CustomTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  const [filterType] = React.useState<"farmer">("farmer");
  const [filterValue] = React.useState("");

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      if (!filterValue) return true;
      const value = item[filterType].toLowerCase();
      return value.includes(filterValue.toLowerCase());
    });
  }, [data, filterType, filterValue]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const getCurrentPageData = () => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  };

  const currentPageData = getCurrentPageData();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentPageData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // const handleFilterTypeChange = (value: string) => {
  //   setFilterType(value as "date");
  //   setFilterValue("");
  //   setCurrentPage(1);
  // };

  // const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterValue(e.target.value);
  //   setCurrentPage(1);
  // };

  const isAllSelected = currentPageData.every((item) =>
    selectedItems.includes(item.id)
  );

  //   const getStatusBadge = (status: DataItem["status"]) => {
  //     const statusStyles = {
  //       active: "bg-green-100 text-green-800",
  //       inactive: "bg-red-100 text-red-800",
  //       pending: "bg-yellow-100 text-yellow-800",
  //     };
  //     return (
  //       <Badge className={statusStyles[status]}>
  //         {status.charAt(0).toUpperCase() + status.slice(1)}
  //       </Badge>
  //     );
  //   };

  return (
    <div className="w-full">
      <div className="flex w-full justify-end gap-3">
        <Button onClick={() => exportToExcel(data, "bank_report")}>
          Excel
        </Button>
        <Button>
          <ReportDownload reports={data} />
        </Button>
        <Button>Word</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Jina la mkulima</TableHead>
            <TableHead>Akaunti namba</TableHead>
            <TableHead>Malipo ya mkulima</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleSelectItem(item.id, checked as boolean)
                  }
                  aria-label={`Select ${item}`}
                />
              </TableCell>
              <TableCell>{item.farmer}</TableCell>
              <TableCell>{item.account}</TableCell>
              <TableCell>{item.mkulima}</TableCell>

              {/* <TableCell>{getStatusBadge(item.status)}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 order-1 sm:order-none">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            {selectedItems.length} of {filteredData.length} item(s) selected
          </p>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
