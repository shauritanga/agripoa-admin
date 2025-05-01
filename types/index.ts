export type Sale = {
  id: string;
  farmer: string;
  amount: number;
  weight: number;
  type: string;
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
