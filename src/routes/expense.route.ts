import { Router } from "express";
import { createExpense, deleteById, editById, getAll, getById } from "../controllers/expense.controller.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import { CreateExpensePayloadSchema, ExpenseQuerySchema, IdParamSchema } from "../schemas/expense.schema.js";

const router = Router()


router.get("/", validateQuery(ExpenseQuerySchema), getAll)
router.get("/:id", validateParams(IdParamSchema) , getById)
router.post("/", validateBody(CreateExpensePayloadSchema), createExpense)
router.put("/:id",validateParams(IdParamSchema), editById)
router.delete("/:id", validateParams(IdParamSchema), deleteById)

export default router