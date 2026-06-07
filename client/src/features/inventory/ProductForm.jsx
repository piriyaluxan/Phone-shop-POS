import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "./inventorySlice";
import Modal from "../../components/common/Modal";

const CATEGORIES = [
  { value: "new_phone", label: "📱 New Phone" },
  { value: "used_phone", label: "♻️ Used Phone" },
  { value: "accessory", label: "🎧 Accessory" },
  { value: "spare_part", label: "🔩 Spare Part" },
];

const empty = {
  name: "",
  sku: "",
  category: "new_phone",
  brand: "",
  model: "",
  description: "",
  costPrice: "",
  sellingPrice: "",
  quantity: "",
  lowStockThreshold: 5,
  barcode: "",
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-dark font-body font-medium text-sm mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const input =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

const ProductForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct, modalMode, loading, error } = useSelector(
    (s) => s.inventory,
  );
  const isEdit = modalMode === "edit";

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && selectedProduct) {
      setForm({
        name: selectedProduct.name || "",
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "new_phone",
        brand: selectedProduct.brand || "",
        model: selectedProduct.model || "",
        description: selectedProduct.description || "",
        costPrice: selectedProduct.costPrice || "",
        sellingPrice: selectedProduct.sellingPrice || "",
        quantity: selectedProduct.quantity || "",
        lowStockThreshold: selectedProduct.lowStockThreshold || 5,
        barcode: selectedProduct.barcode || "",
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [isEdit, selectedProduct, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.costPrice) e.costPrice = "Cost price is required";
    if (!form.sellingPrice) e.sellingPrice = "Selling price is required";
    if (form.quantity === "") e.quantity = "Quantity is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
    };
    if (isEdit) {
      dispatch(updateProduct({ id: selectedProduct._id, data: payload }));
    } else {
      dispatch(createProduct(payload));
    }
  };

  // Computed margin preview
  const margin =
    form.costPrice && form.sellingPrice
      ? (((form.sellingPrice - form.costPrice) / form.costPrice) * 100).toFixed(
          1,
        )
      : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Product" : "Add New Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error banner */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Row 1: Name + SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Product Name *" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. iPhone 15 Pro"
              className={input}
            />
          </Field>
          <Field label="SKU *" error={errors.sku}>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. APL-IP15P-256"
              className={`${input} uppercase`}
            />
          </Field>
        </div>

        {/* Row 2: Category + Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category *">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={input}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Apple, Samsung"
              className={input}
            />
          </Field>
        </div>

        {/* Row 3: Model + Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Model">
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="e.g. A2890"
              className={input}
            />
          </Field>
          <Field label="Barcode">
            <input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="Scan or type barcode"
              className={input}
            />
          </Field>
        </div>

        {/* Pricing row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Cost Price (LKR) *" error={errors.costPrice}>
            <input
              name="costPrice"
              type="number"
              value={form.costPrice}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              className={input}
            />
          </Field>
          <Field label="Selling Price (LKR) *" error={errors.sellingPrice}>
            <input
              name="sellingPrice"
              type="number"
              value={form.sellingPrice}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              className={input}
            />
          </Field>
          {/* Live margin preview */}
          <div className="flex flex-col justify-end pb-0.5">
            <div
              className={`px-4 py-2.5 rounded-xl border-2 text-center ${
                margin === null
                  ? "border-gray-100 bg-surface"
                  : margin > 0
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
              }`}
            >
              <p className="font-body text-xs text-gray-400 mb-0.5">Margin</p>
              <p
                className={`font-mono font-bold text-lg ${
                  margin === null
                    ? "text-gray-300"
                    : margin > 0
                      ? "text-success"
                      : "text-red-500"
                }`}
              >
                {margin !== null ? `${margin}%` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Stock row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Quantity *" error={errors.quantity}>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={input}
            />
          </Field>
          <Field label="Low Stock Threshold">
            <input
              name="lowStockThreshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={handleChange}
              placeholder="5"
              min="0"
              className={input}
            />
          </Field>
        </div>

        {/* Description */}
        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional product notes..."
            rows={3}
            className={`${input} resize-none`}
          />
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body font-medium text-dark hover:bg-surface transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-primary hover:bg-blue-900 disabled:opacity-60 text-white font-heading font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>{" "}
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
