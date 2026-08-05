import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle2, Percent } from 'lucide-react';

export default function MetricsOverview({ employees, shifts, assignments }) {
    const totalSlots = shifts.length || 14;
    const assignedCount = assignments.length;
    const fillRate = totalSlots > 0 ? Math.round((assignedCount / totalSlots) * 100) : 0;

    const metrics = [
        { label: 'Total Employees', value: employees.length, icon: Users, color: '#3b82f6' },
        { label: 'Weekly Fixed Shifts', value: shifts.length, icon: Calendar, color: '#06b6d4' },
        { label: 'Assigned Slots', value: assignedCount, icon: CheckCircle2, color: '#10b981' },
        { label: 'Schedule Fill Rate', value: `${fillRate}%`, icon: Percent, color: '#6366f1' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {metrics.map((m, idx) => {
                const Icon = m.icon;
                return (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="glass-card"
                        style={{ padding: '20px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {m.label}
              </span>
                            <div style={{ padding: '6px', borderRadius: '6px', background: `${m.color}15`, color: m.color }}>
                                <Icon size={16} />
                            </div>
                        </div>
                        <div style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                            {m.value}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}