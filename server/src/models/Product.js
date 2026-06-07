const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["new_phone", "used_phone", "accessory", "spare_part"],
      required: [true, "Category is required"],
    },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    description: { type: String, trim: true },

    // Pricing
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },

    // Stock
    quantity: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    // Tracking
    barcode: { type: String, trim: true },
    serialNumber: { type: String, trim: true },

    // Status
    isActive: { type: Boolean, default: true },

    // Who created/updated it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

// Virtual: is stock low?
productSchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.lowStockThreshold;
});

// Virtual: profit margin %
productSchema.virtual("margin").get(function () {
  if (!this.costPrice) return 0;
  return (
    ((this.sellingPrice - this.costPrice) / this.costPrice) *
    100
  ).toFixed(1);
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
