import { addExpense, getExpenses } from "./services/expense_service.js";

const expense1 = addExpense("Kopi", 16000, "food");
const expense2 = addExpense("Angkot", 7000, "transport");

console.log("All Expenses: ", getExpenses());
console.log(
  "Total Spent: ",
  getExpenses().reduce((sum, e) => sum + e.amount, 0),
);
