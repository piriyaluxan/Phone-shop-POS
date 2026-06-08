const Sale = require("../models/Sale");
const Repair = require("../models/Repair");

// GET /api/finance/summary?period=month|week|year
const getSummary = async (req, res) => {
  try {
    const { period = "month" } = req.query;

    const now = new Date();
    let startDate;
    if (period === "week") startDate = new Date(now - 7 * 864e5);
    if (period === "month")
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    if (period === "year") startDate = new Date(now.getFullYear(), 0, 1);

    // ── Sales aggregation ──
    const salesAgg = await Sale.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: "completed" } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
          cogs: {
            $sum: {
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    { $multiply: ["$$this.costPrice", "$$this.quantity"] },
                  ],
                },
              },
            },
          },
          count: { $sum: 1 },
          discount: { $sum: "$discount" },
        },
      },
    ]);

    // ── Repair aggregation ──
    const repairAgg = await Repair.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          repairRevenue: { $sum: "$finalCost" },
          repairCount: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $ne: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    const sales = salesAgg[0] || { revenue: 0, cogs: 0, count: 0, discount: 0 };
    const repairs = repairAgg[0] || {
      repairRevenue: 0,
      repairCount: 0,
      pendingCount: 0,
    };

    const totalRevenue = sales.revenue + (repairs.repairRevenue || 0);
    const grossProfit = totalRevenue - sales.cogs;

    res.json({
      period,
      revenue: totalRevenue,
      salesRevenue: sales.revenue,
      repairRevenue: repairs.repairRevenue || 0,
      cogs: sales.cogs,
      grossProfit,
      margin:
        totalRevenue > 0
          ? ((grossProfit / totalRevenue) * 100).toFixed(1)
          : "0.0",
      salesCount: sales.count,
      repairCount: repairs.repairCount,
      pendingRepairs: repairs.pendingCount,
      discountsGiven: sales.discount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/finance/daily?days=30  — daily revenue for the chart
const getDailyRevenue = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 864e5);

    const dailySales = await Sale.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyRepairs = await Repair.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: "delivered" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$finalCost" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge by date
    const map = {};
    dailySales.forEach((d) => {
      map[d._id] = {
        date: d._id,
        sales: d.revenue,
        repairs: 0,
        count: d.count,
      };
    });
    dailyRepairs.forEach((d) => {
      if (map[d._id]) map[d._id].repairs = d.revenue;
      else map[d._id] = { date: d._id, sales: 0, repairs: d.revenue, count: 0 };
    });

    res.json(Object.values(map).sort((a, b) => a.date.localeCompare(b.date)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/finance/payment-breakdown  — payment method split
const getPaymentBreakdown = async (req, res) => {
  try {
    const breakdown = await Sale.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/finance/dashboard-kpis  — combined for Admin dashboard
const getDashboardKPIs = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const [todaySales, monthSales, activeRepairs, lowStockCount] =
      await Promise.all([
        Sale.aggregate([
          { $match: { createdAt: { $gte: todayStart }, status: "completed" } },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$total" },
              count: { $sum: 1 },
            },
          },
        ]),
        Sale.aggregate([
          { $match: { createdAt: { $gte: monthStart }, status: "completed" } },
          { $group: { _id: null, revenue: { $sum: "$total" } } },
        ]),
        Repair.countDocuments({ status: { $nin: ["completed", "delivered"] } }),
        require("../models/Product").aggregate([
          {
            $match: {
              isActive: true,
              $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
            },
          },
          { $count: "count" },
        ]),
      ]);

    res.json({
      todayRevenue: todaySales[0]?.revenue || 0,
      todayTxnCount: todaySales[0]?.count || 0,
      monthRevenue: monthSales[0]?.revenue || 0,
      activeRepairs,
      lowStockCount: lowStockCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  getDailyRevenue,
  getPaymentBreakdown,
  getDashboardKPIs,
};
