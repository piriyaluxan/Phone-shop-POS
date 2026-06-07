import DashboardLayout from "../components/layout/DashboardLayout";
import KPICard from "../components/common/KPICard";
import { useSelector } from "react-redux";

const mockTransactions = [
  {
    id: "TXN-201",
    item: "iPhone 15 Case",
    amount: "LKR 850",
    method: "Cash",
    time: "10:42 AM",
  },
  {
    id: "TXN-200",
    item: "Samsung Charger",
    amount: "LKR 1,200",
    method: "Card",
    time: "10:15 AM",
  },
  {
    id: "TXN-199",
    item: "Screen Protector x2",
    amount: "LKR 600",
    method: "Mobile Wallet",
    time: "09:50 AM",
  },
  {
    id: "TXN-198",
    item: "Redmi Note 13",
    amount: "LKR 68,000",
    method: "Bank Transfer",
    time: "09:20 AM",
  },
];

const methodColors = {
  Cash: "bg-green-100 text-green-700",
  Card: "bg-blue-100 text-blue-700",
  "Mobile Wallet": "bg-purple-100 text-purple-700",
  "Bank Transfer": "bg-orange-100 text-orange-700",
};

const CashierDashboard = () => {
  const { user } = useSelector((s) => s.auth);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark">
            Point of Sale 🧾
          </h2>
          <p className="text-gray-500 font-body text-sm mt-1">
            Hi {user?.name?.split(" ")[0]} — ready for today's sales.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-success hover:bg-emerald-600 text-white font-heading font-semibold rounded-xl transition-colors shadow-md shadow-success/20 text-sm">
          + New Sale
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard
          title="Today's Sales"
          value="LKR 18,200"
          icon="💵"
          status="success"
          trend={8}
        />
        <KPICard title="Transactions" value="14" icon="🧾" status="info" />
        <KPICard
          title="Avg. Sale Value"
          value="LKR 1,300"
          icon="📈"
          status="warning"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-dark">
            Recent Transactions
          </h3>
          <button className="text-primary font-body text-sm hover:underline">
            View all
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-gray-400">
                    #
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-dark">
                    {tx.item}
                  </p>
                  <p className="font-body text-xs text-gray-400">
                    {tx.id} · {tx.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${methodColors[tx.method]}`}
                >
                  {tx.method}
                </span>
                <span className="font-mono font-bold text-sm text-dark">
                  {tx.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CashierDashboard;
