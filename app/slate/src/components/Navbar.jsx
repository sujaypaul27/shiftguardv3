import React from "react";
import { Search, Zap } from "lucide-react";

export default function Navbar({ connErr, liveMode, setLiveMode }) {
    return (
        <header className="sg-topbar">
            <div className="sg-search">
                <Search size={15} strokeWidth={2} />
                <input placeholder="Search constraints or shifts..." />
            </div>
            <div className="sg-topbar-right">
                <button
                    className={`sg-toggle ${liveMode ? "on" : ""}`}
                    onClick={() => setLiveMode((v) => !v)}
                    title="Toggle live AppSail calls vs. offline demo simulation"
                >
                    <Zap size={13} strokeWidth={2.4} />
                    {liveMode ? "Live API" : "Demo Mode"}
                </button>
                <div className={`sg-status-pill ${connErr ? "warn" : "ok"}`}>
                    <span className="sg-pulse" />
                    {connErr ? "Demo Data Active" : "AppSail Synchronized"}
                </div>
            </div>
        </header>
    );
}