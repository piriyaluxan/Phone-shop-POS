const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { runWithSession } = require("../utils/dbUtils");

// POST /api/sales  — process a new sale
const createSale = async (req, res) => {
  try {
    const {
      items,
      discount = 0,
      paymentMethod,
      amountPaid,
      customer,
      notes,
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const result = await runWithSession(async (session) => {
      // Validate stock and build enriched items
      const enrichedItems = [];
      let subtotal = 0;

      for (const item of items) {
        const product = await Product.findById(item.product).session(session);

        if (!product || !product.isActive)
          throw new Error(`Product not found: ${item.product}`);

        if (product.quantity < item.quantity)
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.quantity}`,
          );

        const lineTotal =
          product.sellingPrice * item.quantity - (item.discount || 0);
        subtotal += lineTotal;

        enrichedItems.push({
          product: product._id,
          name: product.name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
          costPrice: product.costPrice,
          quantity: item.quantity,
          discount: item.discount || 0,
          lineTotal,
        });

        // Deduct stock
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { quantity: -item.quantity } },
          { session },
        );
      }

      const total = subtotal - discount;
      const change =
        paymentMethod === "cash" && amountPaid ? amountPaid - total : 0;

      const sale = new Sale({
        items: enrichedItems,
        subtotal,
        discount,
        total,
        paymentMethod,
        amountPaid,
        change: Math.max(0, change),
        customer,
        notes,
        processedBy: req.user._id,
      });

      await sale.save({ session });
      return sale;
    });

    const populated = await Sale.findById(result._id).populate(
      "processedBy",
      "name",
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/sales  — list sales with filters
const getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      method,
      startDate,
      endDate,
      search,
    } = req.query;
    const query = {};

    if (method) query.paymentMethod = method;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + "T23:59:59");
    }
    if (search) {
      query.$or = [
        { saleNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("processedBy", "name");

    res.json({
      sales,
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

// GET /api/sales/:id
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "processedBy",
      "name",
    );
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sales/:id/refund  — full refund, restock items
const refundSale = async (req, res) => {
  try {
    const sale = await runWithSession(async (session) => {
      const foundSale = await Sale.findById(req.params.id).session(session);
      if (!foundSale) throw new Error("Sale not found");
      if (foundSale.status === "refunded")
        throw new Error("Sale already refunded");

      // Restock all items
      for (const item of foundSale.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: item.quantity } },
          { session },
        );
      }

      foundSale.status = "refunded";
      await foundSale.save({ session });
      return foundSale;
    });

    res.json({ message: "Refund processed", sale });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createSale, getSales, getSaleById, refundSale };
