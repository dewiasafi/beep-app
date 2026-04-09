import { loadExpensesData, saveExpensesData } from "../utils/storage.utils.js";
import type {
  Category,
  CreateExpensePayload,
  Expense,
  PaymentMethod,
  UpdateExpensePayload,
} from "../types/expense.types.js";

let expenses: Expense[] = [];

export async function initExpenses() {
  expenses = await loadExpensesData();
}

export const addExpense = async (
  payload: CreateExpensePayload,
): Promise<Expense> => {
  if (!payload.title || payload.title.trim().length === 0) {
    throw new Error("Title is required");
  }
  if (!payload.amount || payload.amount < 0) {
    throw new Error("Amount is required and must be greater than 0");
  }
  if (!payload.paymentMethod) {
    throw new Error("Payment method is required");
  }
  let newId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) : 0;
  const newExpense: Expense = {
    id: newId + 1,
    title: payload.title,
    amount: payload.amount,
    category: payload.category,
    paymentMethod: payload.paymentMethod,
    createdAt: new Date(),
  };
  if (payload.note) newExpense.note = payload.note;
  if (payload.paymentProvider)
    newExpense.paymentProvider = payload.paymentProvider;

  expenses.push(newExpense);
  await saveExpensesData(expenses);
  console.log(
    `✅ Added: ${payload.title} - Rp${payload.amount} (${payload.paymentMethod}${payload.paymentProvider ? ` - ${payload.paymentProvider}` : ""})`,
  );
  return newExpense;
};

export const getExpenses = (): Expense[] => {
  return [...expenses];
};

export const getExpensesById = (id: number): Expense | undefined => {
  return expenses.find((e) => e.id === id);
};

export const deleteExpense = async (id: number): Promise<boolean> => {
  const initialLength = expenses.length;
  expenses = expenses.filter((ex) => ex.id !== id);

  if (expenses.length < initialLength) {
    await saveExpensesData(expenses);
    console.log(`🗑️ Deleted expense ID: ${id}`);
    return true;
  }
  return false;
};

export const updateExpense = async (
  payload: UpdateExpensePayload,
): Promise<Expense | null> => {
  const expense = expenses.find((e) => e.id === payload.id);
  if (!expense) return null;

  if ("title" in payload) expense.title = payload.title;
  if ("amount" in payload) expense.amount = payload.amount;
  if ("note" in payload) expense.note = payload.note;
  if (payload.category) expense.category = payload.category;
  if (payload.paymentMethod) expense.paymentProvider = payload.paymentMethod;
  if ("paymentProvider" in payload)
    expense.paymentProvider = payload.paymentProvider;

  await saveExpensesData(expenses);
  console.log(`✏️ Updated expense ID: ${payload.id}`);
  return expense;
};