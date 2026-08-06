import React from "react";
import { CheckCircle2 } from "lucide-react";

function ConstraintChip({ title, sub }) {
    return (
        <div className="sg-chip">
            <CheckCircle2 size={14} className="sg-chip-icon" />
            <div>
                <div className="sg-chip-title">{title}</div>
                <div className="sg-chip-sub">{sub}</div>
            </div>
        </div>
    );
}

export function ConstraintRow() {
    return (
        <div className="sg-constraint-row">
            <ConstraintChip title="Max Weekly Hours" sub="Prevents overworking beyond limits" />
            <ConstraintChip title="Back-to-Back Rest" sub="Restricts Evening → Morning shifts" />
            <ConstraintChip title="Unavailability" sub="Respects employee unavailabilities" />
        </div>
    );
}

const RULES = [
    { title: "Maximum Weekly Hours Limit", sub: "Ensures no employee exceeds designated weekly maximum hours." },
    { title: "Rest Period Enforcement", sub: "Prevents scheduling an Evening shift followed immediately by next-day Morning shift." },
    { title: "Unavailability Blackout Windows", sub: "Strictly respects non-working slots declared by employees." },
    { title: "Single Assignment Per Slot", sub: "Guarantees an employee is assigned at most once per shift slot." },
];

export default function SolverConsole() {
    return (
        <div className="sg-panel">
            <div className="sg-panel-head">
                <div>
                    <h2>Constraint Solver Engine</h2>
                    <p>Algorithmic rules and backend solver pipeline configuration</p>
                </div>
                <span className="sg-panel-note">Engine Idle / Ready</span>
            </div>

            <ConstraintRow />

            <div className="sg-rule-list">
                {RULES.map((r) => (
                    <div key={r.title} className="sg-rule-row">
                        <div>
                            <div className="sg-rule-title">{r.title}</div>
                            <div className="sg-rule-sub">{r.sub}</div>
                        </div>
                        <span className="sg-rule-badge">Active</span>
                    </div>
                ))}
            </div>
        </div>
    );
}