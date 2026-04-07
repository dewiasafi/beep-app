import { start } from "node:repl";
import { loadExpensesData, saveExpensesData } from "../utils/storage.js";
import type { Expense } from "./../models/expense.js";
import { isValidDate, parseDate } from "../utils/function/formatDate.js";

let expenses: Expense[] = [];

export async function initExpenses() {
  expenses = await loadExpensesData();
  console.log(`Loaded ${expenses.length} expenses from file`);
}

export const addExpense = async (
  title: string,
  amount: number,
  category: Expense["category"],
  note?: string,
): Promise<Expense> => {
  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }
  if (!amount || amount < 0) {
    throw new Error("Amount is required and must be greater than 0");
  }
  let newId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) : 0;
  const newExpense: Expense = {
    id: newId + 1,
    title,
    amount,
    category,
    createdAt: new Date(),
  };
  if (note) {
    newExpense.note = note;
  }
  expenses.push(newExpense);
  await saveExpensesData(expenses);
  console.log(`✅ Added: ${title} - Rp${amount}`);

  return newExpense;
};

export const getExpenses = (): Expense[] => {
  return [...expenses];
};

export const getExpensesById = (id: number): Expense | undefined => {
  return expenses.find((e) => e.id === id);
};

export const getExpensesByCategory = (
  category: Expense["category"],
): Expense[] => {
  return expenses.filter((e) => e.category === category);
};

export const getExpensesByDate = (dateString: string): Expense[] => {
  if (isValidDate(dateString)) {
    console.error(`❌ Format tanggal salah: "${dateString}"`);
    console.error(`   Gunakan format: dd-mm-yyyy (contoh: 08-04-2026)`);
  }
  const targetDate = parseDate(dateString);
  if (!targetDate) return [];

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  return expenses.filter((e) => {
    const expenseDate = new Date(e.createdAt);
    return expenseDate >= startOfDay && expenseDate <= endOfDay;
  });
};

export const getExpensesByRangeDate = (startDateString: string, endDateString: string): Expense[] => {
  if (!isValidDate(startDateString)) {
    console.error(`❌ Format tanggal awal salah: ${startDateString}`);
    return [];
  }
  
  if (!isValidDate(endDateString)) {
    console.error(`❌ Format tanggal akhir salah: ${endDateString}`);
    return [];
  }
  
  const startDate = parseDate(startDateString);
  const endDate = parseDate(endDateString);
  
  if (!startDate || !endDate) return [];
  
  if (startDate > endDate) {
    console.error(`❌ Tanggal awal harus lebih kecil dari tanggal akhir`);
    return [];
  }
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return expenses.filter(e => {
    const expenseDate = new Date(e.createdAt);
    return expenseDate >= start && expenseDate <= end;
  });
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
  id: number,
  title: string,
  amount?: number,
  note?: string,
  category?: Expense["category"],
): Promise<Expense | null> => {
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return null;

  if (title) expense.title = title;
  if (amount) expense.amount = amount;
  if (note) expense.note = note;
  if (category) expense.category = category;

  await saveExpensesData(expenses);
  console.log(`✏️ Updated expense ID: ${id}`);
  return expense;
};

export const getTotalExpense = (): number => {
  return expenses.reduce((sum, ex) => sum + ex.amount, 0);
};

export const getAverageExpense = (): number => {
  if (expenses.length === 0) return 0;
  return getTotalExpense() / expenses.length;
};
