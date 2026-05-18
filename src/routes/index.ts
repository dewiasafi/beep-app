import { Router } from "express";

import expenseRoutes from "./expense.route.js"

const router = Router()

router.use("/expenses", expenseRoutes)

export default router