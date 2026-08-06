import React from "react";
import { Plus, Zap, Loader2, XCircle } from "lucide-react";
import { DAYS, SLOTS, initials, shiftKey } from "../lib/constants";
import { ConstraintRow } from "./SolverConsole";

export default function SchedulerGrid({
                                          shifts,
                                          empById,
                                          assignmentByShift,
                                          generating,
                                          onGenerate,
                                          onOpenAssign,
                                          unfilled,
                                          fullyScheduled,
                                      }) {
    const shiftByDaySlot = {};
    shifts.forEach((s) => (shiftByDaySlot[shiftKey(s.day, s.slotType)] = s));

    return (
        <>
            <div className="sg-panel">
                <div className="sg-panel-head">
                    <div>
                        <h2>Constraint Solver Engine</h2>
                        <p>Live rule enforcement for every generated and manual assignment</p>
                    </div>
                    <button className="sg-generate-btn" onClick={onGenerate} disabled={generating}>
                        {generating ? <Loader2 size={15} className="spin" /> : <Zap size={15} />}
                        {generating ? "Solving…" : "Generate Schedule"}
                    </button>
                </div>

                <ConstraintRow />

                {fullyScheduled === false && unfilled?.length > 0 && (
                    <div className="sg-warn-strip">
                        <XCircle size={14} /> {unfilled.length} shift{unfilled.length > 1 ? "s" : ""} could not be
                        fully staffed — resolve manually below.
                    </div>
                )}
            </div>

            <div className="sg-panel sg-grid-panel">
                <div className="sg-panel-head tight">
                    <h2>Weekly Shift Matrix</h2>
                    <span className="sg-panel-note">7 days × 2 slots</span>
                </div>

                <div className="sg-matrix-scroll">
                    <div
                        className="sg-matrix"
                        style={{ gridTemplateColumns: `90px repeat(${DAYS.length}, minmax(96px, 1fr))` }}
                    >
                        <div className="sg-matrix-corner">Slot</div>
                        {DAYS.map((d) => (
                            <div key={d} className="sg-matrix-day">
                                {d.slice(0, 3).toUpperCase()}
                            </div>
                        ))}

                        {SLOTS.map((slot) => (
                            <React.Fragment key={slot}>
                                <div className="sg-matrix-slot-label">{slot}</div>
                                {DAYS.map((day) => {
                                    const shift = shiftByDaySlot[shiftKey(day, slot)];
                                    const assignment = shift && assignmentByShift[shift.id];
                                    const emp = assignment && empById[assignment.employeeId];
                                    return (
                                        <button
                                            key={day + slot}
                                            className={`sg-cell ${emp ? "filled" : ""}`}
                                            onClick={() => shift && onOpenAssign(shift)}
                                            disabled={!shift}
                                        >
                                            <span className="sg-cell-notch tl" />
                                            <span className="sg-cell-notch tr" />
                                            <span className="sg-cell-notch bl" />
                                            <span className="sg-cell-notch br" />
                                            {emp ? (
                                                <>
                                                    <span className="sg-cell-avatar">{initials(emp.name)}</span>
                                                    <span className="sg-cell-name">{emp.name.split(" ")[0]}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={13} strokeWidth={2.4} />
                                                    <span className="sg-cell-name muted">Assign</span>
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}