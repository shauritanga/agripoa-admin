// components/DeliveryNotePDF.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import { BankReport } from "@/types";
interface DeliveryNotePDFProps {
  reports: BankReport[];
}
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  body: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottom: "0.5 solid black",
    borderLeft: "0.5 solid black",
    borderRight: "0.5 solid black",
  },
  bodyText: {
    fontSize: 7.5,
    borderRight: "0.5px solid black",
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    width: "100%",
  },
  header: {
    fontSize: 8,
    backgroundColor: "rgba(53,53,53,0.3)",
    borderRight: "0.5px solid black",
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    textAlign: "center",
    width: "100%",
  },
});

const ReportsPDF: React.FC<DeliveryNotePDFProps> = ({ reports }) => {
  const itemsPerPage = 25;
  const pages = Math.ceil((reports.length + 1) / itemsPerPage);
  
  return (
    <Document>
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <View
            fixed={true}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {pageIndex === 0 && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginBottom: 8 }}>UWAMAMBO GROUP</Text>
                <Text style={{ marginBottom: 16 }}>Bank report 2024</Text>
              </View>
            )}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                border: "0.5 solid black",
              }}
            >
              <Text style={styles.header}>Jina la mkulima</Text>
              <Text style={styles.header}>Akaunti namba</Text>
              <Text style={styles.header}>Malipo ya mkkulima</Text>
            </View>
            {reports
              .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
              .map((sale) => (
                <View key={sale.id} style={styles.body}>
                  <Text style={styles.bodyText}>{sale.farmer}</Text>
                  <Text style={styles.bodyText}>{sale.account}</Text>
                  <Text style={styles.bodyText}>{sale.mkulima}</Text>
                </View>
              ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ReportsPDF;
