import { initExpenses } from "./services/expense_service.js";

async function main() {
  await initExpenses();
}

main().catch(console.error);
