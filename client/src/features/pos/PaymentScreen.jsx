import { useDispatch, useSelector } from "react-redux";
import {
  setPaymentMethod,
  setAmountPaid,
  setScreen,
  submitSale,
} from "./posSlice";
import { formatLKR } from "../../utils/format";

const METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "mobile_wallet", label: "Mobile Wallet", icon: "📱" },
];

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const {
    cartItems,
    orderDiscount,
    customer,
    paymentMethod,
    amountPaid,
    loading,
    error,
  } = useSelector((s) => s.pos);

  const subtotal = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const total = Math.max(0, subtotal - orderDiscount);
  const change =
    paymentMethod === "cash" && amountPaid ? Number(amountPaid) - total : 0;

  const canPay = paymentMethod !== "cash" || Number(amountPaid) >= total;

  const handlePay = () => {
    dispatch(
      submitSale({
        items: cartItems.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          discount: i.discount,
        })),
        discount: orderDiscount,
        paymentMethod,
        amountPaid: paymentMethod === "cash" ? Number(amountPaid) : total,
        customer,
      }),
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={() => dispatch(setScreen("pos"))}
          className="p-2 rounded-xl hover:bg-surface transition-colors text-gray-400"
        >
          ← Back
        </button>
        <div>
          <h3 className="font-heading font-bold text-dark">Payment</h3>
          <p className="font-body text-xs text-gray-400">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Order total */}
        <div className="bg-primary rounded-2xl p-5 text-center">
          <p className="font-body text-blue-200 text-sm mb-1">Amount Due</p>
          <p className="font-mono font-bold text-white text-4xl">
            {formatLKR(total)}
          </p>
          {orderDiscount > 0 && (
            <p className="font-body text-blue-300 text-xs mt-1">
              Includes {formatLKR(orderDiscount)} discount
            </p>
          )}
        </div>

        {/* Payment method */}
        <div>
          <p className="font-body text-sm font-semibold text-dark mb-3">
            Payment Method
          </p>
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => dispatch(setPaymentMethod(m.value))}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 font-body text-sm font-semibold transition-all ${
                  paymentMethod === m.value
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cash fields */}
        {paymentMethod === "cash" && (
          <div className="space-y-3">
            <div>
              <label className="block font-body text-sm font-semibold text-dark mb-1.5">
                Amount Received (LKR)
              </label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => dispatch(setAmountPaid(e.target.value))}
                placeholder={String(total)}
                min={total}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 font-mono text-xl font-bold text-dark focus:outline-none focus:border-primary transition-all text-center"
              />
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2">
              {[
                total,
                Math.ceil(total / 500) * 500,
                Math.ceil(total / 1000) * 1000,
                Math.ceil(total / 5000) * 5000,
              ]
                .filter((v, i, a) => a.indexOf(v) === i)
                .slice(0, 4)
                .map((v) => (
                  <button
                    key={v}
                    onClick={() => dispatch(setAmountPaid(String(v)))}
                    className="py-2 bg-surface hover:bg-gray-200 rounded-xl font-mono text-xs font-bold text-dark transition-colors"
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
            </div>

            {/* Change */}
            {amountPaid && (
              <div
                className={`px-4 py-3 rounded-xl border-2 text-center ${
                  change >= 0
                    ? "border-success/30 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p className="font-body text-xs text-gray-500 mb-0.5">
                  {change >= 0 ? "Change to return" : "Insufficient amount"}
                </p>
                <p
                  className={`font-mono font-bold text-2xl ${change >= 0 ? "text-success" : "text-red-500"}`}
                >
                  {change >= 0
                    ? formatLKR(change)
                    : `Short by ${formatLKR(Math.abs(change))}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Confirm button */}
      <div className="p-5 border-t border-gray-100">
        <button
          onClick={handlePay}
          disabled={!canPay || loading}
          className="w-full py-4 bg-success hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold rounded-xl transition-colors shadow-xl shadow-success/30 text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
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
              Processing...
            </span>
          ) : (
            `Confirm ${METHODS.find((m) => m.value === paymentMethod)?.label} Payment`
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;
