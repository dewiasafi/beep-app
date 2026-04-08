import {
  initExpenses,
  addExpense,
  getExpensesByRangeDate,
  getTotalExpense,
  getAverageExpense,
  getExpensesByDate,
  getExpensesByPaymentMethod,
  getExpensesByPaymentProvider,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "./services/expense_service.js";

async function main() {
  await initExpenses();
  //   await addExpense({
  //     title: "Transfer ke Teman",
  //     amount: 10000,
  //     category: "other",
  //     paymentMethod: "bank_transfer",
  //     paymentProvider: "BCA",
  //     note: "Ganti uang temen"
  //   });
//   await updateExpense({ id: 4, paymentProvider: "Gopay", note: "" });
await deleteExpense(5)
  // // Filter berdasarkan provider
  const all = getExpensesByDate("08-04-2026");
  //   const bcaPayments = getExpensesByPaymentProvider("BCA");
  console.log(all);

  // Filter berdasarkan payment detail
  //   console.log("\n=== Cari VA: ===");
  //   const vaPayments = getExpensesByPaymentMethod("virtual_account");
  //   vaPayments.forEach(e => {
  //     console.log(`${e.title}: ${e.paymentProvider}`);
  //   });
}

main().catch(console.error);
