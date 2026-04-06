import type { Expense } from "./../models/expense.js";

let expenses: Expense[] = [];

export const addExpense = (
  title: string,
  amount: number,
  category: Expense["category"],
): Expense => {
  let newId = 1;
  const newExpense: Expense = {
    id: newId + 1,
    title,
    amount,
    category,
    createdAt: new Date(),
  };

  expenses.push(newExpense);
  return newExpense;
};

export const getExpenses = () => {
  return expenses;
};
