export const formatLKR = (n) =>
  `LKR ${Number(n || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

export const formatDate = (d) =>
  new Date(d).toLocaleString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
