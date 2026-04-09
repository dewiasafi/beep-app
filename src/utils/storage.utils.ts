import * as fs from "fs/promises";
import type { Expense } from "../types/expense.types.js";
import path from "path";
import { storageError } from "./error.helper.js";

const DATA_DIR = "data";
const FILE_PATH = "expenses.json";
const DATA_FILE_PATH = path.join(DATA_DIR, FILE_PATH);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as { code: string }).code;
  }
  return undefined;
}

async function ensureDataDirectoryExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    throw storageError(`Cannot create data directory: ${getErrorMessage(error)}`);
  }
}

export async function loadExpensesData(): Promise<Expense[]> {
  try {
    await ensureDataDirectoryExists();

    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const expenses = JSON.parse(data) as Expense[];

    return expenses.map((expense) => ({
      ...expense,
      createdAt: new Date(expense.createdAt),
    }));
  } catch (error) {
    if (getErrorCode(error) === "ENOENT") {
      return [];
    }

    if (error instanceof SyntaxError) {
      throw storageError(`Data file is corrupted: ${error.message}`);
    }
    throw storageError(`Failed to load expenses: ${getErrorMessage(error)}`);
  }
}

export async function saveExpensesData(expenses: Expense[]): Promise<void> {
  try {
    await ensureDataDirectoryExists();
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(expenses, null, 2),
      "utf-8",
    );
  } catch (error) {
    throw storageError(`Failed to save expenses: ${getErrorMessage(error)}`)
  }
}
