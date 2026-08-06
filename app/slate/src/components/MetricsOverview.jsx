import React from "react";
import { Users, Calendar, CheckCircle2, Zap } from "lucide-react";

function StatCard({ label, value, icon: Icon, accent }) {
    return (
        <div className="sg-stat-card">
            <div className="sg-stat-top">
                <span className="sg-stat-label">{label}</span>
                <span className={`sg-stat-icon ${accent || ""}`}>
          <Icon size={13} strokeWidth={2.2} />
        </span>
            </div>
            <div className="sg-stat-value">{value}</div>
        </div>
    );
}

export default function MetricsOverview({ employeeCount, shiftCount, filledCount, fillRate }) {
    return (
        <div className="sg-stat-row">
            <StatCard label="Total Employees" value={employeeCount} icon={Users} />
            <StatCard label="Weekly Fixed Shifts" value={shiftCount || 14} icon={Calendar} />
            <StatCard label="Assigned Slots" value={filledCount} icon={CheckCircle2} accent="teal" />
            <StatCard label="Schedule Fill Rate" value={`${fillRate}%`} icon={Zap} accent="amber" />
        </div>
    );
}