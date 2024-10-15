export type Farmer = {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  number_of_trees_with_fruits: number;
  number_of_trees: number;
  bank_name: string;
  village: string;
  phone: string;
  account_number: string;
  id: number;
  age: null;
  ward: string;
  zone: string;
  nida: string;
  dob: string;
  farm_size: number;
};

export type Sale = {
  id: number;
  farmer: string;
  amount: string;
  weight: number;
  date: string;
  commission: number;
  zone: string;
  age: number;
  gender: string;
  village: string;
  ward: string;
  uwamambo: string;
  mkulima: string;
  phone: string;
  account: string;
};

export type BankReport = {
  id: number;
  farmer: string;
  mkulima: string;
  account: string;
};
