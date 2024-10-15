import CustomTable from "@/components/dashboard/farmers/custom-table";
import { getDocuments } from "@/firestore";

export default async function Farmers() {
  const farmers = await getDocuments();
  const data = farmers.map((farmer) => {
    return {
      id: farmer.id,
      date: farmer.dob,
      name: `${farmer.first_name} ${farmer.middle_name} ${farmer.last_name}`,
      gender: farmer.gender,
      ward: farmer.ward,
      village: farmer.village,
      nida: farmer.nida,
      zone: farmer.zone,
      phone: farmer.phone,
      matunda: farmer.number_of_trees_with_fruits,
      nomatunda: farmer.number_of_trees - farmer.number_of_trees_with_fruits,
      account: farmer.account_number,
      bank: farmer.bank_name,
    };
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">List of registered farmers</h1>
      <CustomTable
        data={data}
        initialRowsPerPage={5}
        // onView={handleView}
        // onDelete={handleDelete}
      />
    </div>
  );
}
