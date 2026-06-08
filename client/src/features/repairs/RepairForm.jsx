import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRepair, updateRepair } from "./repairSlice";
import Modal from "../../components/common/Modal";

const empty = {
  deviceBrand: "",
  deviceModel: "",
  imei: "",
  color: "",
  condition: "",
  accessories: "",
  reportedIssue: "",
  diagnosisNotes: "",
  estimatedCost: "",
  warrantyDays: 30,
  customer: { name: "", phone: "", email: "" },
};

const inp =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-dark font-body font-medium text-sm mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const RepairForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedRepair, modalMode, loading, error } = useSelector(
    (s) => s.repairs,
  );
  const isEdit = modalMode === "edit";

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && selectedRepair) {
      setForm({
        deviceBrand: selectedRepair.deviceBrand || "",
        deviceModel: selectedRepair.deviceModel || "",
        imei: selectedRepair.imei || "",
        color: selectedRepair.color || "",
        condition: selectedRepair.condition || "",
        accessories: selectedRepair.accessories || "",
        reportedIssue: selectedRepair.reportedIssue || "",
        diagnosisNotes: selectedRepair.diagnosisNotes || "",
        estimatedCost: selectedRepair.estimatedCost || "",
        warrantyDays: selectedRepair.warrantyDays || 30,
        customer: {
          name: selectedRepair.customer?.name || "",
          phone: selectedRepair.customer?.phone || "",
          email: selectedRepair.customer?.email || "",
        },
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [isEdit, selectedRepair, isOpen]);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setCust = (field, val) =>
    setForm((f) => ({ ...f, customer: { ...f.customer, [field]: val } }));

  const validate = () => {
    const e = {};
    if (!form.deviceBrand.trim()) e.deviceBrand = "Required";
    if (!form.deviceModel.trim()) e.deviceModel = "Required";
    if (!form.reportedIssue.trim()) e.reportedIssue = "Required";
    if (!form.customer.name.trim()) e.customerName = "Required";
    if (!form.customer.phone.trim()) e.customerPhone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, estimatedCost: Number(form.estimatedCost) || 0 };
    if (isEdit)
      dispatch(updateRepair({ id: selectedRepair._id, data: payload }));
    else dispatch(createRepair(payload));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Repair Job" : "New Repair Job"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Section: Device */}
        <div>
          <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Device Information
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand" required>
              <input
                value={form.deviceBrand}
                onChange={(e) => set("deviceBrand", e.target.value)}
                placeholder="Apple, Samsung…"
                className={`${inp} ${errors.deviceBrand ? "border-red-300" : ""}`}
              />
              {errors.deviceBrand && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.deviceBrand}
                </p>
              )}
            </Field>
            <Field label="Model" required>
              <input
                value={form.deviceModel}
                onChange={(e) => set("deviceModel", e.target.value)}
                placeholder="iPhone 13 Pro"
                className={`${inp} ${errors.deviceModel ? "border-red-300" : ""}`}
              />
              {errors.deviceModel && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.deviceModel}
                </p>
              )}
            </Field>
            <Field label="IMEI / Serial">
              <input
                value={form.imei}
                onChange={(e) => set("imei", e.target.value)}
                placeholder="15-digit IMEI"
                className={`${inp} font-mono`}
              />
            </Field>
            <Field label="Color">
              <input
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="Space Black"
                className={inp}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Cosmetic Condition">
              <input
                value={form.condition}
                onChange={(e) => set("condition", e.target.value)}
                placeholder="Cracked screen, dents…"
                className={inp}
              />
            </Field>
            <Field label="Accessories Handed In">
              <input
                value={form.accessories}
                onChange={(e) => set("accessories", e.target.value)}
                placeholder="Charger, case, earphones…"
                className={inp}
              />
            </Field>
          </div>
        </div>

        {/* Section: Fault */}
        <div>
          <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Fault Details
          </p>
          <Field label="Reported Issue" required>
            <textarea
              value={form.reportedIssue}
              onChange={(e) => set("reportedIssue", e.target.value)}
              placeholder="Describe what the customer reported…"
              rows={2}
              className={`${inp} resize-none ${errors.reportedIssue ? "border-red-300" : ""}`}
            />
            {errors.reportedIssue && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reportedIssue}
              </p>
            )}
          </Field>
          {isEdit && (
            <Field label="Diagnosis Notes">
              <textarea
                value={form.diagnosisNotes}
                onChange={(e) => set("diagnosisNotes", e.target.value)}
                placeholder="Technician findings…"
                rows={2}
                className={`${inp} resize-none mt-3`}
              />
            </Field>
          )}
        </div>

        {/* Section: Customer */}
        <div>
          <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Customer
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" required>
              <input
                value={form.customer.name}
                onChange={(e) => setCust("name", e.target.value)}
                placeholder="Full name"
                className={`${inp} ${errors.customerName ? "border-red-300" : ""}`}
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerName}
                </p>
              )}
            </Field>
            <Field label="Phone" required>
              <input
                value={form.customer.phone}
                onChange={(e) => setCust("phone", e.target.value)}
                placeholder="07X XXXXXXX"
                className={`${inp} ${errors.customerPhone ? "border-red-300" : ""}`}
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerPhone}
                </p>
              )}
            </Field>
            <Field label="Email (optional)">
              <input
                type="email"
                value={form.customer.email}
                onChange={(e) => setCust("email", e.target.value)}
                placeholder="customer@email.com"
                className={inp}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Est. Cost (LKR)">
                <input
                  type="number"
                  min="0"
                  value={form.estimatedCost}
                  onChange={(e) => set("estimatedCost", e.target.value)}
                  placeholder="0"
                  className={inp}
                />
              </Field>
              <Field label="Warranty (days)">
                <input
                  type="number"
                  min="0"
                  value={form.warrantyDays}
                  onChange={(e) => set("warrantyDays", Number(e.target.value))}
                  className={inp}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl font-body text-sm text-dark hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-primary text-white font-heading font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Job"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RepairForm;
