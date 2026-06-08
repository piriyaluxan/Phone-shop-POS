const Repair = require("../models/Repair");
const Product = require("../models/Product");

const VALID_TRANSITIONS = {
  received: ["diagnosing"],
  diagnosing: ["waiting_for_parts", "repairing"],
  waiting_for_parts: ["repairing"],
  repairing: ["completed"],
  completed: ["delivered"],
  delivered: [],
};

// GET /api/repairs
const getRepairs = async (req, res) => {
  try {
    const { status, search, assignedTo, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { jobNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { deviceBrand: { $regex: search, $options: "i" } },
        { deviceModel: { $regex: search, $options: "i" } },
        { imei: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Repair.countDocuments(query);
    const repairs = await Repair.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("assignedTo", "name userId")
      .populate("createdBy", "name userId");

    res.json({
      repairs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/repairs/:id
const getRepairById = async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id)
      .populate("assignedTo", "name userId")
      .populate("createdBy", "name userId")
      .populate("timeline.updatedBy", "name userId")
      .populate("partsUsed.product", "name sku");
    if (!repair)
      return res.status(404).json({ message: "Repair job not found" });
    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/repairs  — create new repair job
const createRepair = async (req, res) => {
  try {
    const {
      deviceBrand,
      deviceModel,
      imei,
      color,
      condition,
      accessories,
      reportedIssue,
      estimatedCost,
      customer,
      assignedTo,
      warrantyDays,
    } = req.body;

    const repair = await Repair.create({
      deviceBrand,
      deviceModel,
      imei,
      color,
      condition,
      accessories,
      reportedIssue,
      estimatedCost,
      customer,
      assignedTo,
      warrantyDays,
      createdBy: req.user._id,
      // Seed the timeline with the initial "received" event
      timeline: [
        {
          status: "received",
          note: "Device received and logged.",
          updatedBy: req.user._id,
        },
      ],
    });

    res.status(201).json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/repairs/:id  — edit device/customer details (not status)
const updateRepair = async (req, res) => {
  try {
    const allowed = [
      "deviceBrand",
      "deviceModel",
      "imei",
      "color",
      "condition",
      "accessories",
      "reportedIssue",
      "diagnosisNotes",
      "estimatedCost",
      "finalCost",
      "isPaid",
      "customer",
      "assignedTo",
      "warrantyDays",
      "partsUsed",
    ];
    const update = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });

    const repair = await Repair.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!repair) return res.status(404).json({ message: "Repair not found" });
    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/repairs/:id/status  — advance the pipeline
const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    const allowed = VALID_TRANSITIONS[repair.status];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from "${repair.status}" to "${status}". Allowed: ${allowed.join(", ") || "none"}`,
      });
    }

    repair.status = status;
    repair.timeline.push({
      status,
      note: note || "",
      updatedBy: req.user._id,
    });

    // Auto-set finalCost when completed if not already set
    if (status === "completed" && !repair.finalCost) {
      repair.finalCost = repair.estimatedCost;
    }

    await repair.save();

    const populated = await Repair.findById(repair._id)
      .populate("timeline.updatedBy", "name userId")
      .populate("assignedTo", "name userId");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/repairs/:id  — admin only
const deleteRepair = async (req, res) => {
  try {
    const repair = await Repair.findByIdAndDelete(req.params.id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });
    res.json({ message: "Repair job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRepairs,
  getRepairById,
  createRepair,
  updateRepair,
  updateStatus,
  deleteRepair,
};
