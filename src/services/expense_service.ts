import { loadExpensesData, saveExpensesData } from "../utils/storage.js";
import type { Expense } from "./../models/expense.js";
import { isValidDate, parseDate } from "../utils/function/formatDate.js";

let expenses: Expense[] = [];

export async function initExpenses() {
  expenses = await loadExpensesData();
}

export const addExpense = async (
  payload: {
    title: string;
    amount: number;
    category: Expense["category"];
    paymentMethod: Expense["paymentMethod"];
    note?: string;
    paymentProvider?: string;
  },
  //note: params yang required didahulukan baru yang opsional (wajib)
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

export const updateExpense = async (update: {
  id: number;
  title?: string;
  amount?: number;
  note?: string;
  category?: Expense["category"];
  paymentMethod?: Expense["paymentMethod"];
  paymentProvider?: string;
}): Promise<Expense | null> => {
  const expense = expenses.find((e) => e.id === update.id);
  if (!expense) return null;

  if ("title" in update) expense.title = update.title;
  if ("amount" in update) expense.amount = update.amount;
  if ("note" in update) expense.note = update.note;
  if (update.category) expense.category = update.category;
  if (update.paymentMethod) expense.paymentProvider = update.paymentMethod;
  if ("paymentProvider" in update) expense.paymentProvider = update.paymentProvider;

  await saveExpensesData(expenses);
  console.log(`✏️ Updated expense ID: ${update.id}`);
  return expense;
};

export const getTotalExpense = (): number => {
  return expenses.reduce((sum, ex) => sum + ex.amount, 0);
};

export const getAverageExpense = (): number => {
  if (expenses.length === 0) return 0;
  return getTotalExpense() / expenses.length;
};
