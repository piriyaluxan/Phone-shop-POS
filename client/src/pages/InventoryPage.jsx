import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  openModal,
  closeModal,
} from "../features/inventory/inventorySlice";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductForm from "../features/inventory/ProductForm";
import StockAdjustModal from "../features/inventory/StockAdjustModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Badge from "../components/common/Badge";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "new_phone", label: "📱 New Phones" },
  { value: "used_phone", label: "♻️ Used Phones" },
  { value: "accessory", label: "🎧 Accessories" },
  { value: "spare_part", label: "🔩 Spare Parts" },
];

const stockBadge = (p) => {
  if (p.quantity === 0)
    return <Badge label="Out of Stock" variant="danger" dot />;
  if (p.isLowStock) return <Badge label="Low Stock" variant="warning" dot />;
  return <Badge label="In Stock" variant="success" dot />;
};

const formatLKR = (n) => `LKR ${Number(n).toLocaleString()}`;

const InventoryPage = () => {
  const dispatch = useDispatch();
  const { products, loading, modalMode, selectedProduct } = useSelector(
    (s) => s.inventory,
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [lowStock, setLowStock] = useState(false);

  // Fetch on filter change (debounced search)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchProducts({ search, category, lowStock: lowStock || undefined }),
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, lowStock, dispatch]);

  const handleDelete = () => {
    if (selectedProduct) dispatch(deleteProduct(selectedProduct._id));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark">
            Inventory
          </h2>
          <p className="text-gray-500 font-body text-sm mt-0.5">
            {products.length} products listed
          </p>
        </div>
        <button
          onClick={() => dispatch(openModal({ mode: "add" }))}
          className="px-5 py-2.5 bg-primary hover:bg-blue-900 text-white font-heading font-semibold rounded-xl transition-colors shadow-lg shadow-primary/20 text-sm flex items-center gap-2"
        >
          + Add Product
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, brand, barcode..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-2 rounded-xl font-body text-xs font-semibold transition-all ${
                category === c.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-gray-500 hover:bg-gray-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Low stock toggle */}
        <button
          onClick={() => setLowStock(!lowStock)}
          className={`px-3 py-2 rounded-xl font-body text-xs font-semibold transition-all flex items-center gap-1.5 ${
            lowStock
              ? "bg-warning text-white"
              : "bg-surface text-gray-500 hover:bg-gray-200"
          }`}
        >
          ⚠ Low Stock Only
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <svg
              className="animate-spin h-8 w-8 text-primary"
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
            </svg>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📦</span>
            <p className="font-heading font-semibold text-dark">
              No products found
            </p>
            <p className="font-body text-gray-400 text-sm mt-1">
              {search
                ? "Try a different search term"
                : "Add your first product to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-gray-100">
                <tr>
                  {[
                    "Product",
                    "SKU",
                    "Category",
                    "Cost",
                    "Price",
                    "Margin",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left font-body text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-surface/40 transition-colors group"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <p className="font-body font-semibold text-dark text-sm">
                        {p.name}
                      </p>
                      {p.brand && (
                        <p className="font-body text-xs text-gray-400">
                          {p.brand}
                        </p>
                      )}
                    </td>
                    {/* SKU */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-primary bg-blue-50 px-2 py-0.5 rounded">
                        {p.sku}
                      </span>
                    </td>
                    {/* Category */}
                    <td className="px-5 py-4 font-body text-sm text-gray-500 capitalize whitespace-nowrap">
                      {p.category.replace("_", " ")}
                    </td>
                    {/* Cost */}
                    <td className="px-5 py-4 font-mono text-sm text-gray-500">
                      {formatLKR(p.costPrice)}
                    </td>
                    {/* Selling Price */}
                    <td className="px-5 py-4 font-mono text-sm font-bold text-dark">
                      {formatLKR(p.sellingPrice)}
                    </td>
                    {/* Margin */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-mono text-sm font-bold ${
                          p.margin > 20
                            ? "text-success"
                            : p.margin > 0
                              ? "text-warning"
                              : "text-red-500"
                        }`}
                      >
                        {p.margin}%
                      </span>
                    </td>
                    {/* Qty */}
                    <td className="px-5 py-4 font-mono font-bold text-dark text-sm">
                      {p.quantity}
                    </td>
                    {/* Status badge */}
                    <td className="px-5 py-4">{stockBadge(p)}</td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Adjust stock */}
                        <button
                          onClick={() =>
                            dispatch(openModal({ mode: "stock", product: p }))
                          }
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-primary transition-colors"
                          title="Adjust stock"
                        >
                          📦
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() =>
                            dispatch(openModal({ mode: "edit", product: p }))
                          }
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() =>
                            dispatch(openModal({ mode: "delete", product: p }))
                          }
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductForm
        isOpen={modalMode === "add" || modalMode === "edit"}
        onClose={() => dispatch(closeModal())}
      />
      <StockAdjustModal
        isOpen={modalMode === "stock"}
        onClose={() => dispatch(closeModal())}
      />
      <ConfirmDialog
        isOpen={modalMode === "delete"}
        onCancel={() => dispatch(closeModal())}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`"${selectedProduct?.name}" will be permanently removed from inventory.`}
      />
    </DashboardLayout>
  );
};

export default InventoryPage;
