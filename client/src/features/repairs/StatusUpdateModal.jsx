import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStatus } from "./repairSlice";
import { VALID_NEXT, STAGES, STATUS_STYLES } from "./repairConfig";
import Modal from "../../components/common/Modal";

const StatusUpdateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedRepair, loading } = useSelector((s) => s.repairs);
  const [note, setNote] = useState("");
  const [chosen, setChosen] = useState("");

  if (!selectedRepair) return null;

  const nextStatuses = VALID_NEXT[selectedRepair.status] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chosen) return;
    dispatch(updateStatus({ id: selectedRepair._id, status: chosen, note }))
      .unwrap()
      .then(() => {
        setNote("");
        setChosen("");
        onClose();
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Repair Status"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current status */}
        <div className="bg-surface rounded-xl px-4 py-3">
          <p className="font-body text-xs text-gray-400 mb-1">Current Status</p>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-body font-semibold capitalize ${STATUS_STYLES[selectedRepair.status]}`}
          >
            {STAGES.find((s) => s.key === selectedRepair.status)?.icon}{" "}
            {selectedRepair.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Next stage choices */}
        {nextStatuses.length === 0 ? (
          <div className="text-center py-4">
            <span className="text-3xl">🎉</span>
            <p className="font-body text-sm text-gray-500 mt-2">
              This job is fully delivered. No further transitions.
            </p>
          </div>
        ) : (
          <>
            <div>
              <p className="font-body text-sm font-semibold text-dark mb-2">
                Advance to
              </p>
              <div className="space-y-2">
                {nextStatuses.map((s) => {
                  const stage = STAGES.find((st) => st.key === s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setChosen(s)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        chosen === s
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-xl">{stage?.icon}</span>
                      <span className="font-body font-semibold text-dark text-sm capitalize">
                        {s.replace(/_/g, " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-dark mb-1.5">
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Screen ordered from supplier, ETA 2 days…"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body text-sm text-dark hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!chosen || loading}
                className="flex-1 py-2.5 bg-primary text-white font-heading font-semibold rounded-xl disabled:opacity-40 transition-colors text-sm"
              >
                {loading ? "Updating…" : "Confirm Update"}
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default StatusUpdateModal;
