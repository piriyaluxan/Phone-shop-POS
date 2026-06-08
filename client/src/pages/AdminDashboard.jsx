import { useEffect, useState } from 'react';
import { useSelector }         from 'react-redux';
import { Link }                from 'react-router-dom';
import DashboardLayout         from '../components/layout/DashboardLayout';
import KPICard                 from '../components/common/KPICard';
import { fetchDashboardKPIsApi } from '../api/financeApi';
import { fetchRepairsApi }       from '../api/repairApi';
import { fetchProductsApi }      from '../api/productApi';
import { formatLKR }             from '../utils/format';

const AdminDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const [kpis,       setKpis]       = useState(null);
  const [repairs,    setRepairs]    = useState([]);
  const [lowStock,   setLowStock]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDashboardKPIsApi(),
      fetchRepairsApi({ limit: 5, status: 'repairing' }),
      fetchProductsApi({ lowStock: 'true', limit: 5 }),
    ]).then(([k, r, p]) => {
      setKpis(k.data);
      setRepairs(r.data.repairs);
      setLowStock(p.data.products);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    received:          'bg-blue-100   text-blue-700',
    diagnosing:        'bg-indigo-100 text-indigo-700',
    waiting_for_parts: 'bg-yellow-100 text-yellow-700',
    repairing:         'bg-orange-100 text-orange-700',
    completed:         'bg-green-100  text-green-700',
    delivered:         'bg-teal-100   text-teal-700',
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-dark">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="font-body text-gray-500 text-sm mt-1">Here's your shop at a glance.</p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : kpis && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KPICard title="Today's Revenue"  value={formatLKR(kpis.todayRevenue)}  subtitle={`${kpis.todayTxnCount} transactions`} icon="💰" status="success" />
          <KPICard title="Month Revenue"    value={formatLKR(kpis.monthRevenue)}  subtitle="This month"                           icon="📈" status="info"    />
          <KPICard title="Active Repairs"   value={String(kpis.activeRepairs)}    subtitle="Not yet delivered"                    icon="⚙️" status="warning" />
          <KPICard title="Low Stock Items"  value={String(kpis.lowStockCount)}    subtitle="Need restocking"                      icon="📦" status={kpis.lowStockCount > 0 ? 'danger' : 'success'} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Repairs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-dark">Active Repairs</h3>
            <Link to="/admin/repairs" className="font-body text-sm text-primary hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-surface rounded-xl animate-pulse" />)}
            </div>
          ) : repairs.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-body text-gray-400 text-sm">No active repairs 🎉</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {repairs.map((r) => (
                <div key={r._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{r.jobNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold capitalize ${STATUS_COLORS[r.status]}`}>
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="font-body text-sm text-dark mt-0.5">{r.deviceBrand} {r.deviceModel}</p>
                  </div>
                  <p className="font-body text-xs text-gray-400">{r.customer?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-dark">Low Stock Alerts</h3>
            <Link to="/admin/inventory" className="font-body text-sm text-primary hover:underline">Manage →</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-surface rounded-xl animate-pulse" />)}
            </div>
          ) : lowStock.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-body text-gray-400 text-sm">All stock levels healthy ✅</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStock.map((p) => (
                <div key={p._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/50 transition-colors">
                  <div>
                    <p className="font-body text-sm font-medium text-dark">{p.name}</p>
                    <p className="font-mono text-xs text-gray-400">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${p.quantity === 0 ? 'text-red-500' : 'text-warning'}`}>
                      {p.quantity} left
                    </span>
                    {p.quantity === 0 && (
                      <p className="font-body text-xs text-red-400">Out of stock</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;