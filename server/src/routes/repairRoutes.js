const express = require("express");
const router = express.Router();
const {
  getRepairs,
  getRepairById,
  createRepair,
  updateRepair,
  updateStatus,
  deleteRepair,
} = require("../controllers/repairController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// Both roles can view and create repairs
router.get("/", getRepairs);
router.get("/:id", getRepairById);
router.post("/", createRepair);

// Both roles can update status and details
router.patch("/:id/status", updateStatus);
router.put("/:id", updateRepair);

// Only admin can delete
router.delete("/:id", authorize("admin"), deleteRepair);

module.exports = router;
