const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const userRoutes = require("./routes/userRoutes");
const repairRoutes = require("./routes/repairRoutes");
const financeRoutes = require("./routes/financeRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/finance", financeRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Phone Shop POS API running" });
});

module.exports = app;
