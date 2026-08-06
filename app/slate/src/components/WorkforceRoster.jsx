import React from "react";
import { initials } from "../lib/constants";

export default function WorkforceRoster({ employees }) {
    return (
        <div className="sg-panel">
            <div className="sg-panel-head">
                <div>
                    <h2>Workforce Roster</h2>
                    <p>Managed active staff members and constraints</p>
                </div>
                <span className="sg-panel-note">Total Pool: {employees.length} Members</span>
            </div>
            <div className="sg-roster-grid">
                {employees.map((e) => (
                    <div key={e.id} className="sg-roster-card">
                        <div className="sg-roster-avatar">{initials(e.name)}</div>
                        <div className="sg-roster-info">
                            <div className="sg-roster-name">{e.name}</div>
                            <div className="sg-roster-role">{(e.role || "").toUpperCase()}</div>
                        </div>
                        <div className="sg-roster-hours">
                            <span className="sg-mono">{e.maxWeeklyHours ?? e.max_weekly_hours}h</span>
                            <span className="sg-roster-hours-label">/ wk max</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}