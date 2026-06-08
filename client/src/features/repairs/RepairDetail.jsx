import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepairById, openModal } from "./repairSlice";
import { STAGES, STATUS_STYLES, getStageIndex } from "./repairConfig";
import { formatLKR, formatDate } from "../../utils/format";

const RepairDetail = ({ repairId, onClose }) => {
  const dispatch = useDispatch();
  const { selectedRepair, detailLoading } = useSelector((s) => s.repairs);

  useEffect(() => {
    if (repairId) dispatch(fetchRepairById(repairId));
  }, [repairId, dispatch]);

  if (detailLoading || !selectedRepair) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  const r = selectedRepair;
  const currentIdx = getStageIndex(r.status);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
        <div>
          <p className="font-mono text-xs text-primary font-bold">
            {r.jobNumber}
          </p>
          <h3 className="font-heading font-bold text-dark text-xl mt-0.5">
            {r.deviceBrand} {r.deviceModel}
          </h3>
          <p className="font-body text-sm text-gray-500">
            {r.customer?.name} · {r.customer?.phone}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(openModal({ mode: "status", repair: r }))}
            className="px-4 py-2 bg-primary text-white font-heading font-semibold text-sm rounded-xl hover:bg-blue-900 transition-colors"
          >
            Update Status
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Pipeline progress bar */}
        <div className="bg-surface rounded-2xl p-4">
          <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Pipeline
          </p>
          <div className="flex items-center">
            {STAGES.map((stage, idx) => {
              const done = idx < currentIdx;
              const active = idx === currentIdx;
              const pending = idx > currentIdx;
              return (
                <div
                  key={stage.key}
                  className="flex items-center flex-1 last:flex-none"
                >
                  {/* Node */}
                  <div
                    className={`flex flex-col items-center ${pending ? "opacity-40" : ""}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                        done
                          ? "bg-success text-white shadow-md shadow-success/30"
                          : active
                            ? "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {done ? "✓" : stage.icon}
                    </div>
                    <p
                      className={`font-body text-xs mt-1.5 text-center leading-tight max-w-[60px] ${
                        active ? "text-primary font-semibold" : "text-gray-400"
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>
                  {/* Connector */}
                  {idx < STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 mb-5 rounded transition-all ${
                        idx < currentIdx ? "bg-success" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-column info */}
        <div className="grid grid-cols-2 gap-5">
          {/* Device info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Device
            </p>
            <dl className="space-y-2">
              {[
                { label: "Brand", value: r.deviceBrand },
                { label: "Model", value: r.deviceModel },
                { label: "IMEI", value: r.imei || "—", mono: true },
                { label: "Color", value: r.color || "—" },
                { label: "Condition", value: r.condition || "—" },
                { label: "Accessories", value: r.accessories || "—" },
              ].map(({ label, value, mono }) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-2"
                >
                  <dt className="font-body text-xs text-gray-400 flex-shrink-0">
                    {label}
                  </dt>
                  <dd
                    className={`font-body text-xs text-dark text-right ${mono ? "font-mono" : ""}`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Finance info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Finance
            </p>
            <dl className="space-y-2">
              {[
                { label: "Est. Cost", value: formatLKR(r.estimatedCost) },
                {
                  label: "Final Cost",
                  value: r.finalCost ? formatLKR(r.finalCost) : "—",
                },
                { label: "Payment", value: r.isPaid ? "✅ Paid" : "❌ Unpaid" },
                { label: "Warranty", value: `${r.warrantyDays} days` },
                { label: "Assigned To", value: r.assignedTo?.name || "—" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-2"
                >
                  <dt className="font-body text-xs text-gray-400 flex-shrink-0">
                    {label}
                  </dt>
                  <dd className="font-body text-xs text-dark text-right font-medium">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="font-body text-xs text-gray-400 mb-1">
                Reported Issue
              </p>
              <p className="font-body text-sm text-dark">{r.reportedIssue}</p>
            </div>
            {r.diagnosisNotes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="font-body text-xs text-gray-400 mb-1">
                  Diagnosis Notes
                </p>
                <p className="font-body text-sm text-dark">
                  {r.diagnosisNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Timeline
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-4">
              {[...r.timeline].reverse().map((event, idx) => {
                const stage = STAGES.find((s) => s.key === event.status);
                return (
                  <div key={idx} className="flex gap-4 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs z-10 ${
                        idx === 0
                          ? "bg-primary text-white shadow-md"
                          : "bg-surface text-gray-500 border border-gray-200"
                      }`}
                    >
                      {stage?.icon}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <p className="font-body font-semibold text-dark text-sm capitalize">
                          {event.status.replace(/_/g, " ")}
                        </p>
                        <p className="font-body text-xs text-gray-400">
                          {formatDate(event.updatedAt)}
                        </p>
                      </div>
                      {event.note && (
                        <p className="font-body text-xs text-gray-500 mt-0.5">
                          {event.note}
                        </p>
                      )}
                      {event.updatedBy && (
                        <p className="font-body text-xs text-gray-300 mt-0.5">
                          by {event.updatedBy.name} ({event.updatedBy.userId})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairDetail;
