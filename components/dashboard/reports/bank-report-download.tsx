"use client";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BankReport } from "@/types";
import ReportsPDF from "./bank-report";

interface BankReportsDownloadProps {
  reports: BankReport[];
}

const ReportDownload: React.FC<BankReportsDownloadProps> = ({ reports }) => (
  <div>
    <PDFDownloadLink
      document={<ReportsPDF reports={reports} />}
      fileName="bank-report.pdf"
    >
      PDF
    </PDFDownloadLink>
  </div>
);

export default ReportDownload;
