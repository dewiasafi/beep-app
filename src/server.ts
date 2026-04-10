import express from "express";
import expensesRoutes from "./routes/expense.route.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ status: "OK", timeStamp: new Date() });
});
app.use("/api/expense", expensesRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
