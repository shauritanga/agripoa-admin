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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Trash2 } from "lucide-react";

interface DataItem {
  id: number;
  name: string;
  gender: string;
  ward: string;
  village: string;
  nida: string;
  zone: string;
  phone: string;
  matunda: number;
  nomatunda: number;
  account: string;
  bank: string;
  //email: string;
  date: string;
  //   status: "active" | "inactive" | "pending";
}

interface CustomTableProps {
  data: DataItem[];
  initialRowsPerPage?: number;
  // onView: (id: number) => void;
  // onDelete: (id: number) => void;
}

export default function CustomTable({
  data,
  initialRowsPerPage = 5,
}: //   onView,
//   onDelete,
CustomTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  // const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  const [filterType, setFilterType] = React.useState<"date">("date");
  const [filterValue, setFilterValue] = React.useState("");

  // const handleView = (id: number) => {
  //   toast({
  //     title: "View Action",
  //     description: `Viewing item with ID: ${id}`,
  //   });
  // };

  // const handleDelete = (id: number) => {
  //   const newData = data.filter((item: any) => item.id !== id);
  //   // setData(newData);
  //   toast({
  //     title: "Delete Action",
  //     description: `Deleted item with ID: ${id}`,
  //   });
  // };

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

  // const handleSelectAll = (checked: boolean) => {
  //   if (checked) {
  //     setSelectedItems(currentPageData.map((item) => item.id));
  //   } else {
  //     setSelectedItems([]);
  //   }
  // };

  // const handleSelectItem = (id: number, checked: boolean) => {
  //   if (checked) {
  //     setSelectedItems((prev) => [...prev, id]);
  //   } else {
  //     setSelectedItems((prev) => prev.filter((item) => item !== id));
  //   }
  // };

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value as "date");
    setFilterValue("");
    setCurrentPage(1);
  };

  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  // const isAllSelected = currentPageData.every((item) =>
  //   selectedItems.includes(item.id)
  // );

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
      <div className="mb-4 flex items-center space-x-2">
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type={filterType === "date" ? "date" : "text"}
          placeholder={`Filter by ${filterType}`}
          value={filterValue}
          onChange={handleFilterValueChange}
          className="w-[250px]"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead> */}
            {/* <TableHead className="w-[100px]">ID</TableHead> */}
            <TableHead>Jina kamili</TableHead>
            {/* <TableHead>Jina la Pili</TableHead>
            <TableHead>Jina la ukoo</TableHead> */}
            <TableHead>Jinsia</TableHead>
            <TableHead>Tarehe ya kuzaliwa</TableHead>
            <TableHead>NIDA</TableHead>
            <TableHead>Kata</TableHead>
            <TableHead>Kijiji</TableHead>
            <TableHead>Kanda</TableHead>
            <TableHead>Namba ya simu</TableHead>
            <TableHead>Miti yenye matunda</TableHead>
            <TableHead>Miti isiyo na matunda</TableHead>
            <TableHead>Namba ya akaunti</TableHead>
            <TableHead>Jina la benki</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPageData.map((item) => {
            const isNAN = Number.isNaN(item.nomatunda);
            return (
              <TableRow key={item.id}>
                {/* <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleSelectItem(item.id, checked as boolean)
                  }
                  aria-label={`Select ${item}`}
                />
              </TableCell> */}
                {/* <TableCell className="font-medium">{item.id}</TableCell> */}
                {/* <TableCell>{item.fname}</TableCell>
              <TableCell>{item.mname}</TableCell>
              <TableCell>{item.lname}</TableCell> */}
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.nida}</TableCell>
                <TableCell>{item.ward}</TableCell>
                <TableCell>{item.village}</TableCell>
                <TableCell>{item.zone}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.matunda}</TableCell>
                <TableCell>{isNAN ? "" : item.nomatunda}</TableCell>
                <TableCell>{item.account}</TableCell>
                <TableCell>{item.bank}</TableCell>
                {/* <TableCell>{getStatusBadge(item.status)}</TableCell> */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
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
          {/* <p className="text-sm text-gray-500">
            {selectedItems.length} of {filteredData.length} item(s) selected
          </p> */}
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
