import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQty,
  updateItemDiscount,
  setOrderDiscount,
  setCustomer,
  setScreen,
} from "./posSlice";
import { formatLKR } from "../../utils/format";

const CartPanel = () => {
  const dispatch = useDispatch();
  const { cartItems, orderDiscount, customer } = useSelector((s) => s.pos);

  const subtotal = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const total = Math.max(0, subtotal - orderDiscount);
  const profit =
    cartItems.reduce(
      (sum, i) =>
        sum + (i.sellingPrice - i.costPrice) * i.quantity - i.discount,
      0,
    ) - orderDiscount;

  const inputCls =
    "w-full px-3 py-2 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white";

  return (
    <div className="flex flex-col h-full">
      {/* Customer info */}
      <div className="p-4 border-b border-gray-100">
        <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Customer (optional)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            autoComplete="name"
            placeholder="Name"
            value={customer.name}
            onChange={(e) => dispatch(setCustomer({ name: e.target.value }))}
            className={inputCls}
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) => dispatch(setCustomer({ phone: e.target.value }))}
            className={inputCls}
          />
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <span className="text-4xl mb-3">🛒</span>
            <p className="font-body text-sm text-gray-400">Cart is empty</p>
            <p className="font-body text-xs text-gray-300 mt-1">
              Scan or search a product
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product}
              className="bg-surface rounded-xl p-3 border border-gray-100"
            >
              {/* Item header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-dark text-sm truncate">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-gray-400">{item.sku}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.product))}
                  className="ml-2 w-6 h-6 rounded-lg hover:bg-red-100 text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Qty + price row */}
              <div className="flex items-center gap-2">
                {/* Qty stepper */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateQty({
                          productId: item.product,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                    className="px-2.5 py-1.5 text-gray-500 hover:bg-surface transition-colors font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 font-mono font-bold text-sm text-dark border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateQty({
                          productId: item.product,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                    disabled={item.quantity >= item.maxQty}
                    className="px-2.5 py-1.5 text-gray-500 hover:bg-surface disabled:opacity-30 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="font-body text-xs text-gray-400">
                  × {formatLKR(item.sellingPrice)}
                </span>
                <span className="ml-auto font-mono font-bold text-sm text-dark">
                  {formatLKR(item.lineTotal)}
                </span>
              </div>

              {/* Per-item discount */}
              <div className="mt-2 flex items-center gap-2">
                <span className="font-body text-xs text-gray-400">
                  Item discount (LKR)
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={item.discount || ""}
                  onChange={(e) =>
                    dispatch(
                      updateItemDiscount({
                        productId: item.product,
                        discount: Number(e.target.value),
                      }),
                    )
                  }
                  placeholder="0"
                  className="w-24 px-2 py-1 rounded-lg border border-gray-200 font-mono text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary/30 text-right"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order summary */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-2">
        {/* Order-level discount */}
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-gray-500">
            Order Discount (LKR)
          </span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={orderDiscount || ""}
            onChange={(e) => dispatch(setOrderDiscount(Number(e.target.value)))}
            placeholder="0"
            className="w-28 px-3 py-1.5 rounded-xl border border-gray-200 font-mono text-sm text-dark text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex justify-between font-body text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-mono">{formatLKR(subtotal)}</span>
        </div>

        {orderDiscount > 0 && (
          <div className="flex justify-between font-body text-sm text-success">
            <span>Discount</span>
            <span className="font-mono">− {formatLKR(orderDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between font-heading font-bold text-dark text-lg pt-1 border-t border-gray-100">
          <span>Total</span>
          <span className="font-mono text-primary">{formatLKR(total)}</span>
        </div>

        {/* Profit hint (admin-facing) */}
        <p className="text-xs font-body text-gray-300 text-right">
          Est. profit:{" "}
          <span className={profit >= 0 ? "text-success" : "text-red-400"}>
            {formatLKR(profit)}
          </span>
        </p>

        {/* Checkout button */}
        <button
          type="button"
          disabled={cartItems.length === 0}
          onClick={() => dispatch(setScreen("payment"))}
          className="w-full py-3.5 bg-success hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold rounded-xl transition-colors shadow-lg shadow-success/25 text-base mt-1"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
