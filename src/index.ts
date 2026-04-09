import { initExpenses } from "./services/expense.service.js";

async function main() {
  await initExpenses();
}

main().catch(console.error);
