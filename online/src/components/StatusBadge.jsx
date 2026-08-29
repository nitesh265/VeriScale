const StatusBadge = ({ status }) => {
  const normalized = String(status || "UNKNOWN").toUpperCase();

  const styles = {
    ACTIVE: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    VERIFIED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    APPROVED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    PAYMENT_COMPLETED: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    PENDING: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
    INACTIVE: "bg-red-100 text-red-700 ring-1 ring-red-200",
    REJECTED: "bg-red-100 text-red-700 ring-1 ring-red-200",
    SCHEDULED: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
    SUBMITTED: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    INSPECTION: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  };

  const label = normalized.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalized] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
      }`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;