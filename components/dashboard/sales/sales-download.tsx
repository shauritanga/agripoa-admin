"use client";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalesPDF from "./sales";
import { Sale } from "@/types";

interface InvoiceDownloadProps {
  sales: Sale[];
}

const SalesDownload: React.FC<InvoiceDownloadProps> = ({ sales }) => (
  <div>
    <PDFDownloadLink document={<SalesPDF sales={sales} />} fileName="sales.pdf">
      PDF
    </PDFDownloadLink>
  </div>
);

export default SalesDownload;
