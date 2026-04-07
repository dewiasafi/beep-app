import { 
  initExpenses, 
  addExpense, 
  getExpensesByRangeDate,
  getTotalExpense,
  getAverageExpense,
  getExpensesByDate
} from "./services/expense_service.js";

async function main() {
  console.log("=== EXPENSE TRACKER ===\n");
  
  await initExpenses();
  
  // Tambah data
  await addExpense("Makan Siang", 50000, "food", "Nasi Padang");
  await addExpense("Beli Buku", 75000, "shopping", "lipstik");
  await addExpense("Gojek", 25000, "transport");
  
  // Test getExpensesByDate (sudah diperbaiki)
  console.log("\n=== Expenses on 07-04-2026 ===");
  const todayExpenses = getExpensesByDate("07-04-2026");
  todayExpenses.forEach(e => {
    console.log(`  ${e.title}: Rp${e.amount}`);
  });
  
  // Test range date
  console.log("\n=== Expenses April 2026 ===");
  const aprilExpenses = getExpensesByRangeDate("01-04-2026", "30-04-2026");
  aprilExpenses.forEach(e => {
    console.log(`  ${e.title}: Rp${e.amount}`);
  });
  
  // Test total
  console.log("\n=== Summary ===");
  console.log(`  Total: Rp${getTotalExpense()}`);
  console.log(`  Average: Rp${getAverageExpense()}`);
  
  // Test invalid date (akan muncul error)
  console.log("\n=== Invalid Date Test ===");
  getExpensesByDate("31-02-2026"); // Akan error
}

main().catch(console.error);