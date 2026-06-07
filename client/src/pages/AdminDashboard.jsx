import DashboardLayout from "../components/layout/DashboardLayout";
import KPICard from "../components/common/KPICard";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { user } = useSelector((s) => s.auth);

  const kpis = [
    {
      title: "Total Revenue",
      value: "LKR 284,500",
      subtitle: "This month",
      icon: "💰",
      status: "success",
      trend: 12,
    },
    {
      title: "Active Repairs",
      value: "23",
      subtitle: "4 waiting for parts",
      icon: "⚙️",
      status: "warning",
      trend: -3,
    },
    {
      title: "Low Stock Items",
      value: "7",
      subtitle: "Needs reorder",
      icon: "📦",
      status: "danger",
    },
    {
      title: "Today's Sales",
      value: "LKR 18,200",
      subtitle: "14 transactions",
      icon: "🧾",
      status: "info",
      trend: 8,
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-dark">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-gray-500 font-body text-sm mt-1">
          Here's what's happening in your shop today.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Placeholder chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-semibold text-dark mb-4">
            Revenue Overview
          </h3>
          <div className="h-48 flex items-center justify-center bg-surface rounded-xl">
            <p className="text-gray-400 font-body text-sm">
              📊 Chart coming Day 5
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-semibold text-dark mb-4">
            Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {["iPhone 14 Screen", "Samsung A54 Battery", "USB-C Cables"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="font-body text-sm text-dark">{item}</span>
                  <span className="text-xs font-body font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    Low
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
