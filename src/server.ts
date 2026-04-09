import express from "express";
import expensesRoutes from "./routes/expense.route.js";
import { initExpenses } from "./services/expense.service.js";

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
