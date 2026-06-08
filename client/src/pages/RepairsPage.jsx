import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRepairs,
  deleteRepair,
  openModal,
  closeModal,
  clearSelected,
} from "../features/repairs/repairSlice";
import DashboardLayout from "../components/layout/DashboardLayout";
import RepairForm from "../features/repairs/RepairForm";
import StatusUpdateModal from "../features/repairs/StatusUpdateModal";
import RepairDetail from "../features/repairs/RepairDetail";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { STAGES, STATUS_STYLES } from "../features/repairs/repairConfig";
import { formatLKR, formatDate } from "../utils/format";

const FILTER_STAGES = [{ key: "", label: "All" }, ...STAGES];

const RepairsPage = () => {
  const dispatch = useDispatch();
  const { repairs, loading, modalMode, selectedRepair } = useSelector(
    (s) => s.repairs,
  );
  const { user } = useSelector((s) => s.auth);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailId, setDetailId] = useState(null); // drives the slide-over

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchRepairs({ search, status: statusFilter || undefined }));
    }, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter, dispatch]);

  const handleDelete = () => {
    if (selectedRepair) dispatch(deleteRepair(selectedRepair._id));
  };

  const openDetail = (id) => {
    setDetailId(id);
  };

  return (
    <DashboardLayout>
      <div className="flex gap-5 h-[calc(100vh-4rem-3rem)]">
        {/* ── LEFT: Queue ── */}
        <div
          className={`flex flex-col min-w-0 transition-all duration-300 ${detailId ? "w-[55%]" : "flex-1"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-heading font-bold text-2xl text-dark">
                Repair Queue
              </h2>
              <p className="text-gray-500 font-body text-sm mt-0.5">
                {repairs.length} jobs
              </p>
            </div>
            <button
              onClick={() => dispatch(openModal({ mode: "create" }))}
              className="px-5 py-2.5 bg-primary hover:bg-blue-900 text-white font-heading font-semibold rounded-xl transition-colors shadow-lg shadow-primary/20 text-sm"
            >
              + New Repair Job
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job, customer, IMEI…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FILTER_STAGES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all ${
                    statusFilter === s.key
                      ? "bg-primary text-white"
                      : "bg-surface text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s.icon && `${s.icon} `}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {loading && repairs.length === 0 ? (
              <div className="flex justify-center py-20">
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
            ) : repairs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <span className="text-5xl mb-4">🔧</span>
                <p className="font-heading font-semibold text-dark">
                  No repair jobs found
                </p>
                <p className="font-body text-gray-400 text-sm mt-1">
                  Create your first job to get started
                </p>
              </div>
            ) : (
              repairs.map((r) => (
                <div
                  key={r._id}
                  onClick={() => openDetail(r._id)}
                  className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer group p-4 ${
                    detailId === r._id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-primary">
                          {r.jobNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-xs font-body font-semibold capitalize ${STATUS_STYLES[r.status]}`}
                        >
                          {r.status.replace(/_/g, " ")}
                        </span>
                        {!r.isPaid && r.status === "completed" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 text-xs font-body font-semibold">
                            Unpaid
                          </span>
                        )}
                      </div>
                      <p className="font-body font-semibold text-dark text-sm">
                        {r.deviceBrand} {r.deviceModel}
                      </p>
                      <p className="font-body text-xs text-gray-400 mt-0.5 truncate">
                        {r.reportedIssue}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-bold text-sm text-dark">
                        {formatLKR(r.estimatedCost)}
                      </p>
                      <p className="font-body text-xs text-gray-400 mt-0.5">
                        {r.customer?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <p className="font-body text-xs text-gray-300">
                      {formatDate(r.createdAt)}
                    </p>
                    {/* Action buttons */}
                    <div
                      className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          dispatch(openModal({ mode: "status", repair: r }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-primary font-body text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() =>
                          dispatch(openModal({ mode: "edit", repair: r }))
                        }
                        className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-dark transition-colors"
                      >
                        ✏️
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() =>
                            dispatch(openModal({ mode: "delete", repair: r }))
                          }
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail Slide-Over ── */}
        {detailId && (
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <RepairDetail
              repairId={detailId}
              onClose={() => {
                setDetailId(null);
                dispatch(clearSelected());
              }}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <RepairForm
        isOpen={modalMode === "create" || modalMode === "edit"}
        onClose={() => dispatch(closeModal())}
      />
      <StatusUpdateModal
        isOpen={modalMode === "status"}
        onClose={() => dispatch(closeModal())}
      />
      <ConfirmDialog
        isOpen={modalMode === "delete"}
        onCancel={() => dispatch(closeModal())}
        onConfirm={handleDelete}
        title="Delete Repair Job"
        message={`Job "${selectedRepair?.jobNumber}" will be permanently deleted.`}
      />
    </DashboardLayout>
  );
};

export default RepairsPage;
