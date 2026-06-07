const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // snapshot at time of sale
    sku: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    discount: { type: Number, default: 0 }, // per-item discount %
    lineTotal: { type: Number, required: true }, // (sellingPrice * qty) - discount
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    saleNumber: {
      type: String,
      unique: true,
    },
    items: { type: [saleItemSchema], required: true },

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // order-level discount (LKR)
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "mobile_wallet"],
      required: true,
    },
    amountPaid: { type: Number }, // for cash — to calculate change
    change: { type: Number, default: 0 },

    customer: {
      name: { type: String },
      phone: { type: String },
    },

    status: {
      type: String,
      enum: ["completed", "refunded", "partial_refund"],
      default: "completed",
    },

    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true },
);

// Auto-generate sale number: SL-YYYYMMDD-XXXX
saleSchema.pre("save", async function (next) {
  if (this.saleNumber) return next();
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = (await mongoose.model("Sale").countDocuments()) + 1;
  this.saleNumber = `SL-${today}-${String(count).padStart(4, "0")}`;
  next();
});

module.exports = mongoose.model("Sale", saleSchema);
