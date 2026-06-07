const variants = {
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  danger: "bg-red-100 text-red-600 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
};

const Badge = ({ label, variant = "gray", dot = false }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-body font-semibold ${variants[variant]}`}
  >
    {dot && (
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === "success"
            ? "bg-green-500"
            : variant === "warning"
              ? "bg-yellow-500"
              : variant === "danger"
                ? "bg-red-500"
                : "bg-gray-400"
        }`}
      />
    )}
    {label}
  </span>
);

export default Badge;
