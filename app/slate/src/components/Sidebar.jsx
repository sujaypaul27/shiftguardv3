import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    Cpu,
    Activity,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { id: 'schedule', label: 'Schedule Grid', icon: Calendar },
        { id: 'roster', label: 'Workforce Roster', icon: Users },
        { id: 'solver', label: 'Solver Engine', icon: Cpu },
        { id: 'activity', label: 'System Audit', icon: Activity },
    ];

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
                height: '100vh',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                zIndex: 40,
                padding: '16px 12px'
            }}
        >
            <div>
                {/* Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px', marginBottom: '24px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
                    }}>
                        <ShieldCheck size={20} color="#ffffff" />
                    </div>
                    {!collapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', letterSpacing: '-0.3px' }}>ShiftGuard</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enterprise v3.0</div>
                        </motion.div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '13px',
                                    width: '100%',
                                    textAlign: 'left',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <Icon size={18} color={isActive ? '#818cf8' : 'var(--text-secondary)'} />
                                {!collapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer / AppSail Engine Status */}
            <div>
                {!collapsed && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
                            AppSail Java Core
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>shiftguardv3 • appV3</div>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </motion.aside>
    );
}