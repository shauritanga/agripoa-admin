import BankReportTable from "@/components/dashboard/reports/custom-table";
import { getDocuments, getSales } from "@/firestore";

export default async function BankReport() {
  const farmers = await getDocuments();
  const sales = await getSales();

  const data = sales.map((sale) => {
    const mkulima = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.965);

    const farmer = farmers.filter(
      (farmer) =>
        sale.farmer.toLowerCase().includes(farmer.first_name.toLowerCase()) &&
        sale.farmer.toLowerCase().includes(farmer.middle_name.toLowerCase())
    )[0];

    return {
      id: sale.id,
      farmer: sale.farmer,
      account: farmer.account_number,
      mkulima: mkulima,
    };
  });

  return (
    <div>
      <h1>All Sales Bank report</h1>
      <BankReportTable data={data} initialRowsPerPage={5} />
    </div>
  );
}
