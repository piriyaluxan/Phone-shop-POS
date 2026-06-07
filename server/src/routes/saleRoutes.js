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

router.post("/", authorize("admin", "cashier"), createSale);
router.get("/", authorize("admin", "cashier"), getSales);
router.get("/:id", authorize("admin", "cashier"), getSaleById);
router.post("/:id/refund", authorize("admin"), refundSale);

module.exports = router;
