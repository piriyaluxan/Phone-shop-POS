const Product = require("../models/Product");

// GET /api/products  — list with search, category filter, pagination
const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20, lowStock } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (lowStock === "true") {
      query.$expr = { $lte: ["$quantity", "$lowStockThreshold"] };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("createdBy", "name");

    res.json({
      products,
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

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name",
    );
    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "SKU already exists" });
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id  (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/products/:id/stock  — adjust stock quantity
const adjustStock = async (req, res) => {
  try {
    const { adjustment, reason } = req.body; // adjustment: +10 or -5
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newQty = product.quantity + Number(adjustment);
    if (newQty < 0)
      return res.status(400).json({ message: "Stock cannot go below zero" });

    product.quantity = newQty;
    await product.save();

    res.json({ message: "Stock adjusted", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
};
