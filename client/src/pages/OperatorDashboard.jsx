import { useEffect, useState } from 'react';
import { useSelector }         from 'react-redux';
import { Link }                from 'react-router-dom';
import DashboardLayout         from '../components/layout/DashboardLayout';
import KPICard                 from '../components/common/KPICard';
import { fetchOperatorKPIsApi } from '../api/financeApi';
import { fetchRepairsApi }      from '../api/repairApi';
import { getSalesApi }          from '../api/saleApi';
import { formatLKR, formatDate } from '../utils/format';

const STATUS_COLORS = {
  received:          'bg-blue-100   text-blue-700',
  diagnosing:        'bg-indigo-100 text-indigo-700',
  waiting_for_parts: 'bg-yellow-100 text-yellow-700',
  repairing:         'bg-orange-100 text-orange-700',
  completed:         'bg-green-100  text-green-700',
  delivered:         'bg-teal-100   text-teal-700',
};
const METHOD_COLORS = {
  cash:          'bg-green-100 text-green-700',
  card:          'bg-blue-100 text-blue-700',
  mobile_wallet: 'bg-purple-100 text-purple-700',
  bank_transfer: 'bg-orange-100 text-orange-700',
};
const METHOD_LABELS = {
  cash: 'Cash', card: 'Card', mobile_wallet: 'Mobile Wallet', bank_transfer: 'Bank Transfer',
};

const OperatorDashboard = () => {
  const { user }   = useSelector((s) => s.auth);
  const [kpis,     setKpis]    = useState(null);
  const [repairs,  setRepairs] = useState([]);
  const [sales,    setSales]   = useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOperatorKPIsApi(),
      fetchRepairsApi({ limit: 4, status: 'repairing' }),
      getSalesApi({ limit: 4 }),
    ]).then(([k, r, s]) => {
      setKpis(k.data);
      setRepairs(r.data.repairs);
      setSales(s.data.sales);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const Skeleton = () => (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />)}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="font-body text-gray-500 text-sm mt-1">Your shift overview for today.</p>
        </div>
        <Link to="/operator/pos"
          className="px-5 py-2.5 bg-success hover:bg-emerald-600 text-white font-heading font-semibold rounded-xl transition-colors shadow-md shadow-success/20 text-sm">
          + New Sale
        </Link>
      </div>

      {loading ? <Skeleton /> : kpis && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KPICard title="Today's Sales"   value={formatLKR(kpis.todayRevenue)}  subtitle={`${kpis.todayTxnCount} transactions`} icon="💵" status="success" />
          <KPICard title="Active Repairs"  value={String(kpis.activeRepairs)}   subtitle="In pipeline"                           icon="🔧" status="warning" />
          <KPICard title="Completed Today" value={String(kpis.completedToday)}  subtitle="Ready for pickup"                      icon="✅" status="info"    />
          <KPICard title="Avg. Sale"
            value={kpis.todayTxnCount ? formatLKR(kpis.todayRevenue / kpis.todayTxnCount) : 'LKR 0'}
            subtitle="Per transaction" icon="📊" status="info" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Repair Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-dark">Repair Queue</h3>
            <Link to="/operator/repairs" className="font-body text-sm text-primary hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-surface rounded-xl animate-pulse" />)}</div>
          ) : repairs.length === 0 ? (
            <div className="px-5 py-10 text-center"><p className="font-body text-gray-400 text-sm">No active repairs</p></div>
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

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-dark">Recent Sales</h3>
            <Link to="/operator/pos" className="font-body text-sm text-primary hover:underline">New sale →</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-surface rounded-xl animate-pulse" />)}</div>
          ) : sales.length === 0 ? (
            <div className="px-5 py-10 text-center"><p className="font-body text-gray-400 text-sm">No sales yet today</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sales.map((s) => (
                <div key={s._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/50 transition-colors">
                  <div>
                    <p className="font-mono text-xs font-bold text-primary">{s.saleNumber}</p>
                    <p className="font-body text-xs text-gray-400 mt-0.5">{formatDate(s.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${METHOD_COLORS[s.paymentMethod]}`}>
                      {METHOD_LABELS[s.paymentMethod]}
                    </span>
                    <span className="font-mono font-bold text-sm text-dark">{formatLKR(s.total)}</span>
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

export default OperatorDashboard;