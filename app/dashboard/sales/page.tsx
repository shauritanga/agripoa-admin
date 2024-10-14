import CustomTable from "@/components/dashboard/sales/custom-table";
import { getSales } from "@/firestore";

export default async function Sales() {
  const farmers = await getSales();
  const data = farmers.map((sale) => {
    const date = new Date(sale.date);
    const dateInfo = new Intl.DateTimeFormat("en-US").format(date);
    const uwamambo = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.035);
    const mkulima = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.965);

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
      Hello
      <CustomTable
        data={data}
        initialRowsPerPage={5}
        // onView={handleView}
        // onDelete={handleDelete}
      />
    </div>
  );
}
