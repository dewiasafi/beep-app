import { Router } from "express";
import { createExpense, deleteById, editById, getAll, getById } from "../controllers/expense_controller.js";

const router = Router()

router.get("/:id", getById)
router.get("/", getAll)
router.delete("/:id", deleteById)
router.post("/", createExpense)
router.put("/:id", editById)
export default router