import z from "zod";
import { parseDate } from "../utils/date.formatter.js";

export const CategorySchema = z.enum([
  "food",
  "transport",
  "shopping",
  "bills",
  "savings",
  "other",
]);

export const PaymentMethodSchema = z.enum([
  "cash",
  "qris",
  "credit",
  "virtual_account",
  "bank_transfer",
  "debit_card",
  "e_wallet",
  "other",
]);

export const CreateExpensePayloadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  amount: z.number().positive("Amount must be greater than 0"),
  category: CategorySchema,
  paymentMethod: PaymentMethodSchema,
  note: z
    .string()
    .max(500, "Note cannot exceed 500 characters")
    .trim()
    .optional(),
  paymentProvider: z
    .string()
    .max(50, "Payment provider name is too long")
    .trim()
    .optional(),
});

export const UpdateExpensePayloadSchema =
  CreateExpensePayloadSchema.partial().extend({
    id: z.number().int().positive(),
  });

export const ExpenseQuerySchema = z
  .object({
    search: z.string().optional(),
    category: CategorySchema.optional(),
    paymentMethod: PaymentMethodSchema.optional(),
    paymentProvider: z.string().max(50).optional(),
    date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format (dd-mm-yyyy)")
      .optional(),
    start: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format (dd-mm-yyyy)")
      .optional(),
    end: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format (dd-mm-yyyy)")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.start && data.end) {
        const startDate = parseDate(data.start);
        const endDate = parseDate(data.end);
        return startDate && endDate && startDate <= endDate;
      }
      return true;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["start", "end"],
    },
  );

export const IdParamSchema = z.object({
  id: z.coerce.number().positive(),
});


export type ExpenseQuery = z.infer<typeof ExpenseQuerySchema>;
export type CreateExpensePayload = z.infer<typeof CreateExpensePayloadSchema>;
export type UpdateExpensePayload = z.infer<typeof UpdateExpensePayloadSchema>;
