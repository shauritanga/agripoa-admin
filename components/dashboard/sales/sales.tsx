// components/DeliveryNotePDF.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Sale } from "@/types";

interface DeliveryNotePDFProps {
  sales: Sale[];
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
  },
});

const SalesPDF: React.FC<DeliveryNotePDFProps> = ({ sales }) => {
  const itemsPerPage = 25;
  const pages = Math.ceil((sales.length + 1) / itemsPerPage);

  return (
    <Document>
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <Page
          size="A4"
          style={styles.page}
          orientation="landscape"
          key={pageIndex}
        >
          <View
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
                <Text style={{ marginBottom: 16 }}>List of all sales 2024</Text>
              </View>
            )}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                border: "0.5 solid black",
              }}
            >
              <Text style={[styles.header, { width: "160px" }]}>
                Jina la mkulima
              </Text>
              <Text style={[styles.header, { width: "50px" }]}>Jinsia</Text>
              <Text style={[styles.header, { width: "40px" }]}>Umri</Text>
              <Text style={[styles.header, { width: "70px" }]}>Kata</Text>
              <Text style={[styles.header, { width: "70px" }]}>Kijiji</Text>
              <Text style={[styles.header, { width: "70px" }]}>Kanda</Text>
              <Text style={[styles.header, { width: "80px" }]}>
                Namba ya simu
              </Text>
              <Text style={[styles.header, { width: "70px" }]}>
                Akaunti namba
              </Text>
              <Text style={[styles.header, { width: "70px" }]}>
                Jumla ya kilo
              </Text>
              <Text style={[styles.header, { width: "70px" }]}>
                Jumla ya mauzo
              </Text>
              <Text style={[styles.header, { width: "70px" }]}>
                Malipo ya mkkulima
              </Text>
              <Text style={[styles.header, { width: "70px" }]}>
                Malipo ya uwamambo
              </Text>
            </View>
            {sales
              .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
              .map((sale) => (
                <View key={sale.id} style={styles.body}>
                  <Text style={[styles.bodyText, { width: "160px" }]}>
                    {sale.farmer}
                  </Text>
                  <Text style={[styles.bodyText, { width: "50px" }]}>
                    {sale.gender}
                  </Text>
                  <Text style={[styles.bodyText, { width: "40px" }]}>
                    {sale.age}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.ward}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.village}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.zone}
                  </Text>
                  <Text style={[styles.bodyText, { width: "80px" }]}>
                    {sale.phone}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.account}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.weight}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.amount}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.mkulima}
                  </Text>
                  <Text style={[styles.bodyText, { width: "70px" }]}>
                    {sale.uwamambo}
                  </Text>
                </View>
              ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default SalesPDF;
