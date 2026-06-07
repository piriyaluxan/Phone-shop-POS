import DashboardLayout from "../components/layout/DashboardLayout";
import KPICard from "../components/common/KPICard";
import { useSelector } from "react-redux";

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

const TechnicianDashboard = () => {
  const { user } = useSelector((s) => s.auth);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-dark">
          Repair Queue 🔧
        </h2>
        <p className="text-gray-500 font-body text-sm mt-1">
          Hello {user?.name?.split(" ")[0]} — you have 3 active repairs today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard title="Active Repairs" value="3" icon="🔧" status="warning" />
        <KPICard
          title="Completed Today"
          value="5"
          icon="✅"
          status="success"
          trend={25}
        />
        <KPICard title="Awaiting Parts" value="1" icon="⏳" status="danger" />
      </div>

      {/* Repair Queue Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-dark">
            Today's Queue
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                {["Job ID", "Device", "Issue", "Customer", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-body text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
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
                  <td className="px-5 py-3 font-body text-sm text-dark">
                    {job.device}
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-gray-500">
                    {job.issue}
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-dark">
                    {job.customer}
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
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
