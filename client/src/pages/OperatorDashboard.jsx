import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import KPICard from "../components/common/KPICard";

const statusColors = {
  Diagnosing: "bg-blue-100 text-blue-700",
  "Waiting for Parts": "bg-yellow-100 text-yellow-700",
  Repairing: "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
};

const mockQueue = [
  {
    id: "R-0041",
    device: "iPhone 13 Pro",
    issue: "Screen replacement",
    status: "Repairing",
    customer: "Ashan P.",
  },
  {
    id: "R-0040",
    device: "Samsung S23",
    issue: "Battery swollen",
    status: "Diagnosing",
    customer: "Nimal K.",
  },
  {
    id: "R-0039",
    device: "Redmi Note 12",
    issue: "Charging port",
    status: "Waiting for Parts",
    customer: "Priya S.",
  },
  {
    id: "R-0038",
    device: "Oppo Reno 8",
    issue: "Back glass crack",
    status: "Completed",
    customer: "Ruwan J.",
  },
];

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
    item: "Screen Protector",
    amount: "LKR 600",
    method: "Mobile Wallet",
    time: "09:50 AM",
  },
];

const methodColors = {
  Cash: "bg-green-100 text-green-700",
  Card: "bg-blue-100 text-blue-700",
  "Mobile Wallet": "bg-purple-100 text-purple-700",
  "Bank Transfer": "bg-orange-100 text-orange-700",
};

const OperatorDashboard = () => {
  const { user } = useSelector((s) => s.auth);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark">
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-gray-500 font-body text-sm mt-1">
            Here's your shift overview.
          </p>
        </div>
        <Link
          to="/operator/pos"
          className="px-5 py-2.5 bg-success hover:bg-emerald-600 text-white font-heading font-semibold rounded-xl transition-colors shadow-md shadow-success/20 text-sm"
        >
          + New Sale
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Today's Sales"
          value="LKR 18,200"
          icon="💵"
          status="success"
          trend={8}
        />
        <KPICard title="Transactions" value="14" icon="🧾" status="info" />
        <KPICard title="Active Repairs" value="3" icon="🔧" status="warning" />
        <KPICard
          title="Completed Today"
          value="5"
          icon="✅"
          status="success"
          trend={25}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Repair Queue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-dark">
              Repair Queue
            </h3>
            <Link
              to="/operator/repairs"
              className="text-primary font-body text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  {["Job", "Device", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-body text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockQueue.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-sm font-bold text-primary">
                      {job.id}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-body text-sm font-medium text-dark">
                        {job.device}
                      </p>
                      <p className="font-body text-xs text-gray-400">
                        {job.customer}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold ${statusColors[job.status]}`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-dark">
              Recent Transactions
            </h3>
            <Link
              to="/operator/transactions"
              className="text-primary font-body text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/50 transition-colors"
              >
                <div>
                  <p className="font-body text-sm font-medium text-dark">
                    {tx.item}
                  </p>
                  <p className="font-body text-xs text-gray-400">
                    {tx.id} · {tx.time}
                  </p>
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
      </div>
    </DashboardLayout>
  );
};

export default OperatorDashboard;
