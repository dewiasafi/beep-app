import { loadExpensesData, saveExpensesData } from "../utils/storage.utils.js";
import { notFoundError } from "../utils/error.helper.js";
import type { Expense } from "../types/expense.types.js";
import type {
  CreateExpensePayload,
  UpdateExpensePayload,
} from "../schemas/expense.schema.js";

let expenses: Expense[] | null = null;

async function ensureExpensesLoaded(): Promise<Expense[]> {
  if (expenses === null) {
    expenses = await loadExpensesData();
  }
  return expenses;
}

async function saveExpenses(newExpense: Expense[]): Promise<void> {
  expenses = newExpense;
  await saveExpensesData(newExpense);
}

function generateId(expensesList: Expense[]): number {
  return expensesList.length > 0
    ? Math.max(...expensesList.map((e) => e.id)) + 1
    : 1;
}

export const addExpense = async (
  payload: CreateExpensePayload,
): Promise<Expense> => {
  const expensesList = await ensureExpensesLoaded();
  const newId = generateId(expensesList);

  const newExpense: Expense = {
    id: newId,
    title: payload.title,
    amount: payload.amount,
    category: payload.category,
    paymentMethod: payload.paymentMethod,
    createdAt: new Date(),
  };

  if (payload.note !== undefined) {
    newExpense.note = payload.note;
  }
  if (payload.paymentProvider !== undefined) {
    newExpense.paymentProvider = payload.paymentProvider;
  }

  expensesList.push(newExpense);
  await saveExpenses(expensesList);
  return newExpense;
};

export const getExpenseById = async (id: number): Promise<Expense> => {
  const expenses = await ensureExpensesLoaded();
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    throw notFoundError(`Expense with id ${id} not found`);
  }

  return expense;
};

export const getAllExpenses = async (): Promise<Expense[]> => {
  const expensesList = await ensureExpensesLoaded();
  return [...expensesList];
};

export const updateExpense = async (
  payload: UpdateExpensePayload & { id: number },
): Promise<Expense> => {
  const expensesList = await ensureExpensesLoaded();
  const index = expensesList.findIndex((e) => e.id === payload.id);

  if (index === -1) {
    throw notFoundError(`Expense with id ${payload.id} not found`);
  }

  const expense = expensesList[index]!;

  if (payload.title !== undefined) {
    expense.title = payload.title;
  }
  if (payload.amount !== undefined) {
    expense.amount = payload.amount;
  }
  if (payload.category !== undefined) {
    expense.category = payload.category;
  }
  if (payload.paymentMethod !== undefined) {
    expense.paymentMethod = payload.paymentMethod;
  }
  if (payload.note !== undefined) {
    expense.note = payload.note;
  }
  if (payload.paymentProvider !== undefined) {
    expense.paymentProvider = payload.paymentProvider;
  }

  await saveExpenses(expensesList);

  return expense;
};

export async function deleteExpense(
  id: number,
): Promise<{ success: boolean; message: string }> {
  const expensesList = await ensureExpensesLoaded();
  const filteredExpenses = expensesList.filter((ex) => ex.id !== id);

  if (filteredExpenses.length === expensesList.length) {
    throw notFoundError(`Expense with id ${id} not found`);
  }

  await saveExpenses(filteredExpenses);

  return {
    success: true,
    message: `Expense with id ${id} deleted successfully`,
  };
}
