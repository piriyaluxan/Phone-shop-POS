export const STAGES = [
  { key: "received", label: "Received", icon: "📥", color: "blue" },
  { key: "diagnosing", label: "Diagnosing", icon: "🔍", color: "indigo" },
  {
    key: "waiting_for_parts",
    label: "Waiting for Parts",
    icon: "⏳",
    color: "yellow",
  },
  { key: "repairing", label: "Repairing", icon: "🔧", color: "orange" },
  { key: "completed", label: "Completed", icon: "✅", color: "green" },
  { key: "delivered", label: "Delivered", icon: "🚀", color: "teal" },
];

export const VALID_NEXT = {
  received: ["diagnosing"],
  diagnosing: ["waiting_for_parts", "repairing"],
  waiting_for_parts: ["repairing"],
  repairing: ["completed"],
  completed: ["delivered"],
  delivered: [],
};

export const STATUS_STYLES = {
  received: "bg-blue-100   text-blue-700   border-blue-200",
  diagnosing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  waiting_for_parts: "bg-yellow-100 text-yellow-700 border-yellow-200",
  repairing: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-green-100  text-green-700  border-green-200",
  delivered: "bg-teal-100   text-teal-700   border-teal-200",
};

export const getStageIndex = (status) =>
  STAGES.findIndex((s) => s.key === status);
