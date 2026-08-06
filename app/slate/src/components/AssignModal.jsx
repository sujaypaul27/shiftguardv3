import React from "react";
import { X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { VIOLATION_COPY } from "../lib/constants";

export default function AssignModal({
                                        shift,
                                        employees,
                                        assignEmp,
                                        setAssignEmp,
                                        validating,
                                        validationErr,
                                        onClose,
                                        onConfirm,
                                    }) {
    return (
        <div className="sg-modal-backdrop" onClick={onClose}>
            <div className="sg-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sg-modal-head">
                    <div>
                        <div className="sg-modal-eyebrow">Manual Assignment</div>
                        <h3>
                            {shift.day} · {shift.slotType}
                        </h3>
                    </div>
                    <button className="sg-modal-close" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <label className="sg-modal-label">Choose employee</label>
                <select className="sg-select" value={assignEmp} onChange={(e) => setAssignEmp(e.target.value)}>
                    <option value="">— Select —</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.name} — {e.role}
                        </option>
                    ))}
                </select>

                {validationErr && (
                    <div className="sg-validation-error">
                        <XCircle size={14} />
                        <div>
                            <div className="sg-validation-rule">{validationErr.violatedRule}</div>
                            <div className="sg-validation-msg">
                                {VIOLATION_COPY[validationErr.violatedRule] || validationErr.message}
                            </div>
                        </div>
                    </div>
                )}

                <div className="sg-modal-actions">
                    <button className="sg-btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="sg-btn-primary" onClick={onConfirm} disabled={!assignEmp || validating}>
                        {validating ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                        {validating ? "Validating…" : "Validate & Assign"}
                    </button>
                </div>
            </div>
        </div>
    );
}