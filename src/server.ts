import express from "express";
import expensesRoutes from "./routes/expense_routes.js";
import { initExpenses } from "./services/expense_service.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

await initExpenses();
app.get("/api/health", (_, res) => {
  res.json({ status: "OK", timeStamp: new Date() });
});
app.use("/api/expense", expensesRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
