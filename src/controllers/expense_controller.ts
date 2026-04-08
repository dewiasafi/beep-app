import type { Request, Response } from "express";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  getExpensesById,
  updateExpense,
} from "../services/expense_service.js";
import { isValidDate, parseDate } from "../utils/function/formatDate.js";

export const getAll = (req: Request, res: Response) => {
  let result = getExpenses();

  const { search, category, paymentMethod, paymentProvider, date, start, end } =
    req.query;

  if (category && typeof category === "string") {
    result = result.filter((e) => e.category === category);
  }

  if (paymentMethod && typeof paymentMethod === "string") {
    result = result.filter((e) => e.paymentMethod === paymentMethod);
  }

  if (paymentProvider && typeof paymentProvider === "string") {
    result = result.filter((e) => e.paymentProvider === paymentProvider);
  }

  if (date && typeof date === "string") {
    if (!isValidDate(date)) {
      return res.status(400).json({
        status: false,
        message: `Invalid date format (dd-mm-yyy)`,
      });
    }

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

  if (start && end && typeof start === "string" && typeof end === "string") {
    if (!isValidDate(start) && !isValidDate(end)) {
      return res.status(400).json({
        status: false,
        message: `Invalid date format (dd-mm-yyyy)`,
      });
    }

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (startDate && endDate) {
      if (startDate > endDate) {
        return res.status(400).json({
          status: false,
          message: `Invalid Date`,
        });
      }

      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((e) => {
        const expenseDate = new Date(e.createdAt);
        return expenseDate >= start && expenseDate <= end;
      });
    }
  }

  if (search && typeof search === "string") {
    const searchLower = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        (e.note && e.note.toLowerCase().includes(searchLower)),
    );
  }
  const total = result.reduce((sum, e) => sum + e.amount, 0);
  res.json({
    success: true,
    data: result,
    total,
  });
};

export const getById = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const expense = getExpensesById(id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: `Expense with id ${id} not found`,
    });
  }

  res.json({ success: true, data: expense });
};

export const deleteById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await deleteExpense(id);

  if (!deleted) {
    return res.status(404).json({
      status: false,
      message: `Delete failed. Id ${id} not found`,
    });
  }

  res.json({ success: true, message: "Delete Success" });
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { title, amount, category, paymentMethod, paymentProvider, note } =
      req.body;
    if (!title || !amount || !category || !paymentMethod) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    const newExpense = await addExpense({
      title,
      amount,
      category,
      paymentMethod,
      paymentProvider,
      note,
    });
    res.status(201).json({
      status: true,
      data: newExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const editById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    const updated = await updateExpense({...updates, id});
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Expense with id ${id} not found`,
      });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res
      .status(400)
      .json({
        status: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
  }
};
