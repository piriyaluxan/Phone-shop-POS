const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require login
router.use(protect);

router.get("/", getProducts);
router.get("/:id", getProductById);

// Only admin can create, update, delete, adjust stock
router.post("/", authorize("admin"), createProduct);
router.put("/:id", authorize("admin"), updateProduct);
router.delete("/:id", authorize("admin"), deleteProduct);
router.patch("/:id/stock", authorize("admin"), adjustStock);

module.exports = router;
