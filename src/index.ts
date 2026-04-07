import {
  initExpenses,
  addExpense,
  getExpensesByRangeDate,
  getTotalExpense,
  getAverageExpense,
  getExpensesByDate,
  getExpensesByPaymentMethod,
  getExpensesByPaymentProvider,
} from "./services/expense_service.js";

async function main() {
 // Tambah berbagai jenis pembayaran
await addExpense("Makan Siang", 50000, "food", "qris", "ShopeePay", "Nasi Padang");
await addExpense("Makan Malam", 80000, "food", "qris", "BCA");
await addExpense("Tagihan Listrik", 200000, "bills", "virtual_account", "BCA", "VA:1234567890");
await addExpense("Transfer ke Teman", 100000, "other", "bank_transfer", "BCA");
await addExpense("Belanja di Mall", 250000, "shopping", "debit_card", "BCA");
await addExpense("Top Up Gopay", 50000, "other", "e_wallet", "GoPay");

// Filter berdasarkan provider
console.log("\n=== Pembayaran via BCA ===");
const bcaPayments = getExpensesByPaymentProvider("BCA");
bcaPayments.forEach(e => {
  console.log(`  ${e.title}: Rp${e.amount} (${e.paymentMethod}) - ${e.paymentProvider || '-'}`);
});

// Filter berdasarkan payment detail
console.log("\n=== Cari VA: ===");
const vaPayments = getExpensesByPaymentMethod("virtual_account");
vaPayments.forEach(e => {
  console.log(`  ${e.title}: ${e.paymentProvider}`);
});
}

main().catch(console.error);
