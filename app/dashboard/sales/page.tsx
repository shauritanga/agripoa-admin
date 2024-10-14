import CustomTable from "@/components/dashboard/sales/custom-table";
import { getDocuments, getSales } from "@/firestore";

export default async function Sales() {
  const farmers = await getDocuments();
  const sales = await getSales();
  const data = sales.map((sale) => {
    const date = new Date(sale.date);
    const dateInfo = new Intl.DateTimeFormat("en-US").format(date);
    const uwamambo = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.035);
    const mkulima = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.965);

    const farmer = farmers.filter((farmer) =>
      farmer.first_name.toLowerCase().includes(sale.farmer.toLowerCase())
    );
    console.log(farmer);

    return {
      id: sale.id,
      farmer: sale.farmer,
      amount: sale.amount,
      weight: sale.weight,
      date: dateInfo,
      commission: 3.5,
      uwamambo: uwamambo,
      mkulima: mkulima,
    };
  });

  return (
    <div>
      <h1>All Sales</h1>
      <CustomTable
        data={data}
        initialRowsPerPage={5}
        // onView={handleView}
        // onDelete={handleDelete}
      />
    </div>
  );
}
