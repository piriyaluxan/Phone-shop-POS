import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  lookupProduct,
  addToCart,
  clearSearchResults,
  setScreen,
} from "../features/pos/posSlice";
import CartPanel from "../features/pos/CartPanel";
import PaymentScreen from "../features/pos/PaymentScreen";
import Receipt from "../features/pos/Receipt";
import DashboardLayout from "../components/layout/DashboardLayout";
import { formatLKR } from "../utils/format";

const POSPage = () => {
  const dispatch = useDispatch();
  const { searchResults, searchLoading, cartItems, screen } = useSelector(
    (s) => s.pos,
  );

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearchResults());
      return;
    }
    const t = setTimeout(() => dispatch(lookupProduct(query)), 250);
    return () => clearTimeout(t);
  }, [query, dispatch]);

  const handleAddProduct = (product) => {
    dispatch(addToCart(product));
    setQuery("");
    inputRef.current?.focus();
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const RightPanel = () => {
    if (screen === "payment") return <PaymentScreen />;
    if (screen === "receipt") return <Receipt />;
    return <CartPanel />;
  };

  return (
    <DashboardLayout>
      <div className="flex gap-5 h-[calc(100vh-4rem-3rem)]">
        {/* ── LEFT: Product Search ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Scan barcode or search product name / SKU..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 font-body text-base focus:outline-none focus:border-primary transition-all"
              />
              {searchLoading && (
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 text-primary"
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
              )}
            </div>

            {/* Keyboard hint */}
            <p className="font-body text-xs text-gray-300 mt-2 ml-1">
              Tip: Connect a barcode scanner — it types directly into this field
            </p>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <div className="px-4 py-2.5 border-b border-gray-50 bg-surface">
                <p className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {searchResults.length} result
                  {searchResults.length !== 1 ? "s" : ""}
                </p>
              </div>
              {searchResults.map((p) => (
                <button
                  type="button"
                  key={p._id}
                  onClick={() => handleAddProduct(p)}
                  disabled={p.quantity === 0}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-surface transition-colors border-b border-gray-50 last:border-0 disabled:opacity-40 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-dark text-sm">
                      {p.name}
                    </p>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">
                      {p.sku}
                      {p.brand && ` · ${p.brand}`}
                    </p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-mono font-bold text-dark text-sm">
                      {formatLKR(p.sellingPrice)}
                    </p>
                    <p
                      className={`font-body text-xs mt-0.5 ${p.quantity === 0 ? "text-red-400" : p.isLowStock ? "text-warning" : "text-success"}`}
                    >
                      {p.quantity === 0
                        ? "Out of stock"
                        : `${p.quantity} in stock`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty state + instructions */}
          {searchResults.length === 0 && !query && (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-200 p-10">
              <span className="text-6xl mb-5">📡</span>
              <h3 className="font-heading font-bold text-dark text-xl mb-2">
                Ready to Scan
              </h3>
              <p className="font-body text-gray-400 text-sm max-w-sm leading-relaxed">
                Type a product name, SKU, or barcode above. Use a USB barcode
                scanner for one-scan checkout.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-md">
                {[
                  { icon: "📱", label: "New Phones" },
                  { icon: "♻️", label: "Used Phones" },
                  { icon: "🎧", label: "Accessories" },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.label}
                    onClick={() => {
                      setQuery(c.label.split(" ")[1]?.toLowerCase() || "");
                    }}
                    className="px-3 py-2.5 bg-surface hover:bg-gray-200 rounded-xl font-body text-sm text-dark transition-colors"
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Cart / Payment / Receipt ── */}
        <div className="w-80 xl:w-96 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Cart tab bar */}
          {screen === "pos" && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-surface/50">
              <h3 className="font-heading font-semibold text-dark text-sm">
                Cart
              </h3>
              {totalItems > 0 && (
                <span className="bg-primary text-white font-mono font-bold text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
          )}
          <RightPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default POSPage;
