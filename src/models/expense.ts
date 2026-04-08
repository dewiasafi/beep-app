export type Category =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "savings"
  | "other";

export type PaymentMethod =
  | "cash"
  | "qris"
  | "credit"
  | "virtual_account"
  | "bank_transfer"
  | "debit_card"
  | "e_wallet"
  | "other";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  note?: string;
  paymentMethod: PaymentMethod,
  paymentProvider?: string,
  createdAt: Date;
}
