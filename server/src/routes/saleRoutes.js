const express = require("express");
const router = express.Router();
const {
  createSale,
  getSales,
  getSaleById,
  refundSale,
} = require("../controllers/saleController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// New
router.post("/", authorize("admin", "retail_operator"), createSale);
router.get("/", authorize("admin", "retail_operator"), getSales);
router.get("/:id", authorize("admin", "retail_operator"), getSaleById);
router.post("/:id/refund", authorize("admin"), refundSale);
// GET /api/sales/my-kpis  — operator's own today stats
router.get(
  "/my-kpis",
  authorize("admin", "retail_operator"),
  async (req, res) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const Sale = require("../models/Sale");
      const Repair = require("../models/Repair");

      const [todaySales, activeRepairs, completedToday] = await Promise.all([
        Sale.aggregate([
          {
            $match: {
              createdAt: { $gte: todayStart },
              status: "completed",
              processedBy: req.user._id,
            },
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$total" },
              count: { $sum: 1 },
            },
          },
        ]),
        Repair.countDocuments({ status: { $nin: ["completed", "delivered"] } }),
        Repair.countDocuments({
          status: "completed",
          updatedAt: { $gte: todayStart },
        }),
      ]);

      res.json({
        todayRevenue: todaySales[0]?.revenue || 0,
        todayTxnCount: todaySales[0]?.count || 0,
        activeRepairs,
        completedToday,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
);

module.exports = router;
