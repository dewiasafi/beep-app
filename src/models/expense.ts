export type Category =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "savings"
  | "other";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  note?: string;
  createdAt: Date;
}
