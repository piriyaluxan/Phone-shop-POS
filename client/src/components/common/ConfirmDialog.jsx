const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "Delete",
  danger = true,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-100" : "bg-blue-100"}`}
        >
          <span className="text-2xl">{danger ? "🗑️" : "ℹ️"}</span>
        </div>
        <h3 className="font-heading font-bold text-dark text-center text-lg mb-2">
          {title}
        </h3>
        <p className="font-body text-gray-500 text-center text-sm mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body font-medium text-dark hover:bg-surface transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-body font-semibold text-white transition-colors text-sm ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-blue-900"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
