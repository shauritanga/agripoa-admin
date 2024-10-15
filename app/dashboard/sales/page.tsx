import CustomTable from "@/components/dashboard/sales/custom-table";
import { getDocuments, getSales } from "@/firestore";

export default async function Sales() {
  const farmers = await getDocuments();
  const sales = await getSales();

  const data = sales.map((sale) => {
    const date = new Date(sale.date);

    const dateInfo = new Intl.DateTimeFormat("en-US").format(date);
    const uwamambo = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.035);
    const mkulima = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(sale.amount * 0.965);

    const amount = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(sale.amount);

    const farmer = farmers.filter(
      (farmer) =>
        sale.farmer.toLowerCase().includes(farmer.first_name.toLowerCase()) &&
        sale.farmer.toLowerCase().includes(farmer.middle_name.toLowerCase())
    )[0];
    const dob = farmer.dob?.split("/")[2];
    const bornYear = parseInt(dob);
    const currentYear = new Date().getFullYear();

    return {
      id: sale.id,
      farmer: sale.farmer,
      amount: amount,
      weight: sale.weight,
      date: dateInfo,
      zone: farmer.zone,
      gender: farmer.gender,
      age: currentYear - bornYear,
      ward: farmer.ward,
      village: farmer.village,
      commission: 3.5,
      uwamambo: uwamambo,
      mkulima: mkulima,
      account: farmer.account_number,
      phone: farmer.phone,
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
