import React from "react";
import { Clock } from "lucide-react";

export default function AuditLog({ logs }) {
    return (
        <div className="sg-panel">
            <div className="sg-panel-head">
                <div>
                    <h2>System Audit &amp; Logs</h2>
                    <p>Real-time execution log stream from the AppSail engine</p>
                </div>
            </div>
            <div className="sg-log-list">
                {logs.map((l, i) => (
                    <div key={i} className="sg-log-row">
                        <Clock size={12} className="sg-log-clock" />
                        <span className="sg-mono sg-log-time">{l.time}</span>
                        <span className={`sg-log-type ${l.type.includes("ERROR") || l.type.includes("REJECT") ? "warn" : ""}`}>
              {l.type}
            </span>
                        <span className="sg-log-msg">{l.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}