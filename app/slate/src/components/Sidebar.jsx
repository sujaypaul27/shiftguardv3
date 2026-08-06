import React from "react";
import { Calendar, Users, Cpu, Activity, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
    { id: "grid", label: "Schedule Grid", icon: Calendar },
    { id: "roster", label: "Workforce Roster", icon: Users },
    { id: "solver", label: "Solver Engine", icon: Cpu },
    { id: "audit", label: "System Audit", icon: Activity },
];

export default function Sidebar({ page, setPage, collapsed, setCollapsed, connErr, liveMode }) {
    return (
        <aside className={`sg-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sg-brand">
                <div className="sg-brand-mark">
                    <ShieldCheck size={18} strokeWidth={2.4} />
                </div>
                {!collapsed && (
                    <div>
                        <div className="sg-brand-name">ShiftGuard</div>
                        <div className="sg-brand-sub">Enterprise v4.0</div>
                    </div>
                )}
            </div>

            <nav className="sg-nav">
                {NAV_ITEMS.map((it) => (
                    <button
                        key={it.id}
                        className={`sg-nav-item ${page === it.id ? "active" : ""}`}
                        onClick={() => setPage(it.id)}
                    >
                        <it.icon size={17} strokeWidth={2} />
                        {!collapsed && <span>{it.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sg-sidebar-footer">
                <div className="sg-core-status">
                    <span className={`sg-dot ${connErr ? "warn" : "ok"}`} />
                    {!collapsed && (
                        <div>
                            <div className="sg-core-name">AppSail Java Core</div>
                            <div className="sg-core-sub">{liveMode ? "shiftguardv3 · appV3" : "offline demo"}</div>
                        </div>
                    )}
                </div>
                <button className="sg-collapse-btn" onClick={() => setCollapsed((c) => !c)}>
                    {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                </button>
            </div>
        </aside>
    );
}