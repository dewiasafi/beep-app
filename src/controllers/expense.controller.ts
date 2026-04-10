import type { Request, Response } from "express";
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
} from "../services/expense.service.js";
import { isValidDate, parseDate } from "../utils/date.formatter.js";
import type { BaseError } from "../utils/error.helper.js";
import type {
  CreateExpensePayload,
  ExpenseQuery,
  UpdateExpensePayload,
} from "../schemas/expense.schema.js";
import {
  internalError,
  notFound,
  successCreated,
  successResponse,
} from "../utils/response.helper.js";

export const getAll = async (req: Request, res: Response) => {
  try {
    let result = await getAllExpenses();
    const query = req.validatedQuery as ExpenseQuery;
    const {
      search,
      category,
      paymentMethod,
      paymentProvider,
      date,
      start,
      end,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    if (category) {
      result = result.filter((e) => e.category === category);
    }

    if (paymentMethod) {
      result = result.filter((e) => e.paymentMethod === paymentMethod);
    }

    if (paymentProvider) {
      result = result.filter((e) => e.paymentProvider === paymentProvider);
    }

    if (date) {
      const targetDate = parseDate(date);
      if (targetDate) {
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        result = result.filter((e) => {
          const expenseDate = new Date(e.createdAt);
          return expenseDate >= startOfDay && expenseDate <= endOfDay;
        });
      }
    }

    if (start && end) {
      const startDate = parseDate(start);
      const endDate = parseDate(end);

      if (startDate && endDate) {
        const startOfRange = new Date(startDate);
        startOfRange.setHours(0, 0, 0, 0);
        const endOfRange = new Date(endDate);
        endOfRange.setHours(23, 59, 59, 999);

        result = result.filter((e) => {
          const expenseDate = new Date(e.createdAt);
          return expenseDate >= startOfRange && expenseDate <= endOfRange;
        });
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(searchLower) ||
          (e.note && e.note.toLowerCase().includes(searchLower)),
      );
    }

    result.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];

      if (sortBy === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const totalAmount = result.reduce((sum, e) => sum + e.amount, 0);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = result.slice(startIndex, endIndex);
    const totalData = result.length
    successResponse({
      res,
      data: paginatedData,
      total: totalAmount,
      page,
      limit,
      totalData
    });
  } catch (error) {
    const err = error as BaseError;
    return internalError(res, err.message || "Internal server error");
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.validatedParams as { id: number };
    const expense = await getExpenseById(id);
    return successResponse({ res, data: expense });
  } catch (error) {
    const err = error as BaseError;
    if (err.code === "NOT_FOUND") {
      return notFound(res, err.message);
    }
    return internalError(res, err.message);
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.validatedParams as { id: number };
    const result = await deleteExpense(id);
    return successResponse({ res, message: result.message });
  } catch (error) {
    const err = error as BaseError;
    if (err.code === "NOT_FOUND") {
      return notFound(res, err.message);
    }
    return internalError(res, err.message);
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreateExpensePayload;
    const newExpense = await addExpense(payload);

    successCreated(res, newExpense);
  } catch (error) {
    const err = error as BaseError;

    if (err.code === "STORAGE_ERROR") {
      return internalError(res, "Failed to save data. Please try again.");
    }
    return internalError(res, err.message || "Internal server error");
  }
};

export const editById = async (req: Request, res: Response) => {
  try {
    const { id } = req.validatedParams as { id: number };
    const updates = req.validatedBody as UpdateExpensePayload;
    const updated = await updateExpense({ ...updates, id });
    return successResponse({ res, data: updated });
  } catch (error) {
    const err = error as BaseError;
    if (err.code === "NOT_FOUND") {
      return notFound(res, err.message);
    }

    return internalError(res, err.message || "Internal server error");
  }
};
