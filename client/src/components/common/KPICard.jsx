const statusConfig = {
  success: { bar: "bg-success", text: "text-success", bg: "bg-green-50" },
  warning: { bar: "bg-warning", text: "text-warning", bg: "bg-orange-50" },
  danger: { bar: "bg-red-500", text: "text-red-500", bg: "bg-red-50" },
  info: { bar: "bg-primary", text: "text-primary", bg: "bg-blue-50" },
};

const KPICard = ({ title, value, subtitle, icon, status = "info", trend }) => {
  const cfg = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center text-lg`}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-body font-semibold ${trend >= 0 ? "text-success" : "text-red-500"}`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="font-body text-sm text-gray-500 mb-1">{title}</p>
      <p className="font-mono font-bold text-2xl text-dark tracking-tight">
        {value}
      </p>
      {subtitle && (
        <p className="font-body text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
      <div className={`mt-4 h-1 ${cfg.bar} rounded-full opacity-40`} />
    </div>
  );
};

export default KPICard;
