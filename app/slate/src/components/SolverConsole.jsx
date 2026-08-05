import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldAlert, CheckCircle, Zap } from 'lucide-react';

export default function SolverConsole({ statusMessage, loading }) {
    const rules = [
        { name: 'Max Weekly Hours', key: 'max_weekly_hours', desc: 'Prevents overworking beyond limits' },
        { name: 'Back-to-Back Rest', key: 'back_to_back', desc: 'Restricts Evening -> Morning shifts' },
        { name: 'Unavailability', key: 'unavailability', desc: 'Respects employee unavailabilities' }
    ];

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Constraint Solver Engine Status
                    </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: loading ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                    <Zap size={12} />
                    <span>{loading ? 'Greedy Assignment Active...' : 'Engine Idle / Ready'}</span>
                </div>
            </div>

            {/* Rules Indicator Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {rules.map(r => (
                    <div key={r.key} style={{ padding: '10px 12px', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{r.name}</span>
                            <CheckCircle size={12} color="var(--accent-emerald)" />
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{r.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}