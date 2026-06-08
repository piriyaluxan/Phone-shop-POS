const mongoose = require("mongoose");

// Every status change is recorded as a timeline event
const timelineEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const repairSchema = new mongoose.Schema(
  {
    jobNumber: {
      type: String,
      unique: true,
    },

    // Device info
    deviceBrand: {
      type: String,
      required: [true, "Device brand is required"],
      trim: true,
    },
    deviceModel: {
      type: String,
      required: [true, "Device model is required"],
      trim: true,
    },
    imei: { type: String, trim: true }, // IMEI or serial
    color: { type: String, trim: true },
    condition: { type: String, trim: true }, // cosmetic condition on intake
    accessories: { type: String, trim: true }, // charger, case, etc. handed in

    // Fault
    reportedIssue: {
      type: String,
      required: [true, "Reported issue is required"],
      trim: true,
    },
    diagnosisNotes: { type: String, trim: true },

    // Status pipeline
    status: {
      type: String,
      enum: [
        "received",
        "diagnosing",
        "waiting_for_parts",
        "repairing",
        "completed",
        "delivered",
      ],
      default: "received",
    },

    // Financial
    estimatedCost: { type: Number, default: 0 },
    finalCost: { type: Number },
    isPaid: { type: Boolean, default: false },

    // Customer
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true,
      },
      email: { type: String, trim: true },
    },

    // Timeline — full history of every status change
    timeline: [timelineEventSchema],

    // Parts used (links to inventory products)
    partsUsed: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: { type: Number, default: 1 },
        cost: Number,
        _id: false,
      },
    ],

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    warrantyDays: { type: Number, default: 30 },
  },
  { timestamps: true },
);

// Auto-generate job number: REP-YYYYMMDD-XXXX
repairSchema.pre("save", async function () {
  if (this.jobNumber) return;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = (await mongoose.model("Repair").countDocuments()) + 1;
  this.jobNumber = `REP-${today}-${String(count).padStart(4, "0")}`;
});

module.exports = mongoose.model("Repair", repairSchema);
