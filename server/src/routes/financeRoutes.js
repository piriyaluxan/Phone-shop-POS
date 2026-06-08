const express = require("express");
const router = express.Router();
const {
  getSummary,
  getDailyRevenue,
  getPaymentBreakdown,
  getDashboardKPIs,
} = require("../controllers/financeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/summary", getSummary);
router.get("/daily", getDailyRevenue);
router.get("/payment-breakdown", getPaymentBreakdown);
router.get("/dashboard-kpis", getDashboardKPIs);

module.exports = router;
