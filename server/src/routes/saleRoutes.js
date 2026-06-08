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

module.exports = router;
