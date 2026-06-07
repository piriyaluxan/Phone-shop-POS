import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adjustStock } from "./inventorySlice";
import Modal from "../../components/common/Modal";

const StockAdjustModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((s) => s.inventory);
  const [adjustment, setAdjustment] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("add"); // 'add' | 'remove'

  const finalAdj =
    type === "add"
      ? Math.abs(Number(adjustment))
      : -Math.abs(Number(adjustment));
  const newQty = selectedProduct ? selectedProduct.quantity + finalAdj : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adjustment) return;
    dispatch(
      adjustStock({ id: selectedProduct._id, adjustment: finalAdj, reason }),
    );
  };

  const input =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Stock" size="sm">
      {selectedProduct && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product info */}
          <div className="bg-surface rounded-xl px-4 py-3">
            <p className="font-body font-semibold text-dark text-sm">
              {selectedProduct.name}
            </p>
            <p className="font-body text-xs text-gray-400 mt-0.5">
              Current stock:{" "}
              <span className="font-mono font-bold text-dark">
                {selectedProduct.quantity}
              </span>
            </p>
          </div>

          {/* Add / Remove toggle */}
          <div className="grid grid-cols-2 gap-2">
            {["add", "remove"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 rounded-xl font-body text-sm font-semibold border-2 transition-all capitalize ${
                  type === t
                    ? t === "add"
                      ? "border-success bg-green-50 text-success"
                      : "border-red-400 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                {t === "add" ? "+ Add Stock" : "− Remove Stock"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-dark font-body font-medium text-sm mb-1.5">
              Amount
            </label>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              placeholder="e.g. 10"
              min="1"
              required
              className={input}
            />
          </div>

          {/* New qty preview */}
          {adjustment && (
            <div
              className={`px-4 py-3 rounded-xl border-2 text-center ${
                newQty < 0
                  ? "border-red-200 bg-red-50"
                  : "border-success/30 bg-green-50"
              }`}
            >
              <p className="font-body text-xs text-gray-500 mb-0.5">
                New Quantity
              </p>
              <p
                className={`font-mono font-bold text-2xl ${newQty < 0 ? "text-red-500" : "text-success"}`}
              >
                {newQty < 0 ? "Invalid" : newQty}
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-dark font-body font-medium text-sm mb-1.5">
              Reason (optional)
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Stock received from supplier"
              className={input}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body text-sm text-dark hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || newQty < 0}
              className="flex-1 py-2.5 bg-primary text-white font-heading font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default StockAdjustModal;
