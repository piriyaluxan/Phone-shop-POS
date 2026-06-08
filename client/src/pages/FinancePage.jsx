import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  fetchSummaryApi, fetchDailyRevenueApi, fetchPaymentBreakdownApi,
} from '../api/financeApi';
import { formatLKR } from '../utils/format';

const PERIODS  = ['week', 'month', 'year'];
const PIE_COLORS = ['#1E3A8A', '#10B981', '#F97316', '#6366F1'];

const METHOD_LABELS = {
  cash: 'Cash', card: 'Card',
  bank_transfer: 'Bank Transfer', mobile_wallet: 'Mobile Wallet',
};

const StatCard = ({ title, value, sub, accent = 'blue' }) => {
  const accents = {
    blue:   'border-l-primary  bg-blue-50/50',
    green:  'border-l-success  bg-green-50/50',
    orange: 'border-l-warning  bg-orange-50/50',
    indigo: 'border-l-indigo-500 bg-indigo-50/50',
  };
  return (
    <div className={`bg-white rounded-2xl border-l-4 px-5 py-4 shadow-sm border border-gray-100 ${accents[accent]}`}>
      <p className="font-body text-xs text-gray-500 uppercase tracking-wide mb-1">{title}</p>
      <p className="font-mono font-bold text-2xl text-dark">{value}</p>
      {sub && <p className="font-body text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm font-body">
      <p className="font-semibold text-dark mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatLKR(p.value)}
        </p>
      ))}
    </div>
  );
};

const FinancePage = () => {
  const [period,    setPeriod]    = useState('month');
  const [summary,   setSummary]   = useState(null);
  const [daily,     setDaily]     = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSummaryApi({ period }),
      fetchDailyRevenueApi({ days: period === 'week' ? 7 : period === 'month' ? 30 : 365 }),
      fetchPaymentBreakdownApi(),
    ]).then(([s, d, b]) => {
      setSummary(s.data);
      setDaily(d.data.map((row) => ({
        ...row,
        date:  row.date.slice(5),   // show MM-DD
        total: row.sales + row.repairs,
      })));
      setBreakdown(b.data.map((item) => ({
        name:  METHOD_LABELS[item._id] || item._id,
        value: item.total,
        count: item.count,
      })));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark">Finance Overview</h2>
          <p className="font-body text-gray-500 text-sm mt-0.5">Revenue, profit, and payment insights</p>
        </div>
        {/* Period selector */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg font-body text-sm font-semibold capitalize transition-all ${
                period === p ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-surface'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      {summary && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Revenue"  value={formatLKR(summary.revenue)}     sub={`${summary.salesCount} sales`}      accent="blue"   />
          <StatCard title="Gross Profit"   value={formatLKR(summary.grossProfit)}  sub={`${summary.margin}% margin`}        accent="green"  />
          <StatCard title="Repair Revenue" value={formatLKR(summary.repairRevenue)} sub={`${summary.repairCount} jobs`}     accent="orange" />
          <StatCard title="Discounts Given" value={formatLKR(summary.discountsGiven)} sub="Order-level discounts"           accent="indigo" />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Revenue Area Chart — spans 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-dark">Daily Revenue</h3>
            <div className="flex gap-4 text-xs font-body">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"/>Sales</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block"/>Repairs</span>
            </div>
          </div>
          {daily.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-300 font-body text-sm">
              No data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={daily} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1E3A8A" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Inter' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Inter' }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales"   name="Sales"   stroke="#1E3A8A" strokeWidth={2} fill="url(#colorSales)"   />
                <Area type="monotone" dataKey="repairs" name="Repairs" stroke="#10B981" strokeWidth={2} fill="url(#colorRepairs)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payment Breakdown Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-dark mb-4">Payment Methods</h3>
          {breakdown.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-300 font-body text-sm">No sales yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={breakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    paddingAngle={3} dataKey="value">
                    {breakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatLKR(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {breakdown.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="font-body text-xs text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-dark">{formatLKR(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profit breakdown bar */}
      {summary && daily.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-dark mb-4">Revenue vs COGS</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={daily.slice(-14)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales"   name="Sales Revenue" fill="#1E3A8A" radius={[4,4,0,0]} />
              <Bar dataKey="repairs" name="Repair Revenue" fill="#10B981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FinancePage;