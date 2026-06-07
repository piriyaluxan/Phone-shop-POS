import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "./posSlice";
import { formatLKR, formatDate } from "../../utils/format";

const methodLabel = {
  cash: "Cash",
  card: "Card",
  bank_transfer: "Bank Transfer",
  mobile_wallet: "Mobile Wallet",
};

const Receipt = () => {
  const dispatch = useDispatch();
  const { completedSale } = useSelector((s) => s.pos);

  if (!completedSale) return null;

  const handlePrint = () => window.print();
  const handleNewSale = () => dispatch(resetCart());

  return (
    <div className="flex flex-col h-full">
      {/* Success banner */}
      <div className="bg-success p-5 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="font-heading font-bold text-white text-xl">
          Payment Complete!
        </h3>
        <p className="font-body text-green-100 text-sm mt-0.5">
          {completedSale.saleNumber}
        </p>
      </div>

      {/* Receipt body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" id="receipt-print">
        {/* Shop header */}
        <div className="text-center border-b border-dashed border-gray-200 pb-4">
          <h2 className="font-heading font-bold text-dark text-lg">
            PhoneShop POS
          </h2>
          <p className="font-body text-gray-400 text-xs mt-0.5">
            {formatDate(completedSale.createdAt)}
          </p>
          {completedSale.customer?.name && (
            <p className="font-body text-sm text-dark mt-1">
              Customer: <strong>{completedSale.customer.name}</strong>
              {completedSale.customer.phone &&
                ` · ${completedSale.customer.phone}`}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="space-y-2">
          {completedSale.items.map((item, i) => (
            <div key={i} className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-dark font-medium">
                  {item.name}
                </p>
                <p className="font-body text-xs text-gray-400">
                  {item.quantity} × {formatLKR(item.sellingPrice)}
                  {item.discount > 0 && ` − ${formatLKR(item.discount)}`}
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-dark ml-3">
                {formatLKR(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-gray-200 pt-3 space-y-1">
          <div className="flex justify-between font-body text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-mono">
              {formatLKR(completedSale.subtotal)}
            </span>
          </div>
          {completedSale.discount > 0 && (
            <div className="flex justify-between font-body text-sm text-success">
              <span>Discount</span>
              <span className="font-mono">
                − {formatLKR(completedSale.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-heading font-bold text-dark text-lg pt-1">
            <span>Total</span>
            <span className="font-mono text-primary">
              {formatLKR(completedSale.total)}
            </span>
          </div>
          <div className="flex justify-between font-body text-sm text-gray-500">
            <span>Paid by {methodLabel[completedSale.paymentMethod]}</span>
            <span className="font-mono">
              {formatLKR(completedSale.amountPaid)}
            </span>
          </div>
          {completedSale.change > 0 && (
            <div className="flex justify-between font-body text-sm font-semibold text-success">
              <span>Change</span>
              <span className="font-mono">
                {formatLKR(completedSale.change)}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center font-body text-xs text-gray-300 pt-2 border-t border-dashed border-gray-200">
          Thank you for shopping with us! 🙏
        </p>
      </div>

      {/* Actions */}
      <div className="p-5 border-t border-gray-100 space-y-3">
        <button
          onClick={handlePrint}
          className="w-full py-3 border-2 border-primary text-primary font-heading font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
        >
          🖨 Print Receipt
        </button>
        <button
          onClick={handleNewSale}
          className="w-full py-3 bg-primary text-white font-heading font-semibold rounded-xl hover:bg-blue-900 transition-colors text-sm"
        >
          + New Sale
        </button>
      </div>
    </div>
  );
};

export default Receipt;
