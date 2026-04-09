import { existsSync } from "fs";
import * as fs from "fs/promises";
import type { Expense } from "../types/expense.types.js";
import path from "path";

const DATA_DIR = "data"
const FILE_PATH = "expenses.json";
const DATA_FILE_PATH = path.join(DATA_DIR, FILE_PATH)

async function checkDirData() {
  if (!existsSync(DATA_DIR)) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function loadExpensesData(): Promise<Expense[]> {
  try {
    await checkDirData();
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const expenses = JSON.parse(data) as Expense[];

    return expenses.map((expense) => ({
      ...expense,
      createdAt: new Date(expense.createdAt),
    }));
  } catch (error) {
    return [];
  }
}

export async function saveExpensesData(expenses: Expense[]): Promise<void> {
     try{
          await checkDirData();
          await fs.writeFile(DATA_FILE_PATH, JSON.stringify(expenses, null, 2), 'utf-8')
     } catch (error) {
          console.error('Gagal menyimpan data ke file:', error)
          throw error;
     }
}

