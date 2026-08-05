import React from 'react';
import { motion } from 'framer-motion';
import { Plus, User } from 'lucide-react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SLOTS = ["Morning", "Evening"];

export default function SchedulerGrid({
                                          shifts,
                                          employees,
                                          assignments,
                                          selectedEmployeeId,
                                          setSelectedEmployeeId,
                                          onSlotClick,
                                          loading
                                      }) {
    const getShift = (day, slot) => {
        return shifts.find(s => s.day === day && (s.slotType === slot || s.slot_type === slot));
    };

    const getAssignedEmployees = (shiftId) => {
        if (!shiftId) return [];
        const assignedIds = assignments
            .filter(a => a.shiftId === shiftId || a.shift_id === shiftId)
            .map(a => a.employeeId || a.employee_id);
        return employees.filter(e => assignedIds.includes(e.id));
    };

    return (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
            {/* Grid Top Toolbar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Weekly Shift Matrix (7 Days x 2 Slots)
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Manual Assign:</label>
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        style={{
                            background: 'var(--bg-app)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">-- Choose Employee --</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.role} • {emp.maxWeeklyHours || emp.max_weekly_hours}h)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 7x2 Grid */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', width: '80px' }}>Slot</th>
                        {DAYS.map(d => (
                            <th key={d} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>
                                {d}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {SLOTS.map(slot => (
                        <tr key={slot} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '16px', fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(0, 0, 0, 0.15)', verticalAlign: 'top' }}>
                                {slot}
                            </td>
                            {DAYS.map(day => {
                                const shift = getShift(day, slot);
                                const assigned = shift ? getAssignedEmployees(shift.id) : [];

                                return (
                                    <td
                                        key={day + slot}
                                        onClick={() => shift && onSlotClick(shift)}
                                        style={{
                                            padding: '8px',
                                            verticalAlign: 'top',
                                            height: '100px',
                                            width: '13%',
                                            borderRight: '1px solid var(--border-subtle)',
                                            cursor: shift ? 'pointer' : 'default',
                                            transition: 'background 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {assigned.length > 0 ? (
                                            assigned.map(emp => (
                                                <motion.div
                                                    key={emp.id}
                                                    initial={{ scale: 0.95, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                                        borderRadius: '6px',
                                                        padding: '6px 8px',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <User size={10} color="#a5b4fc" />
                                                        {emp.name}
                                                    </div>
                                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                                                        {emp.role}
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div style={{
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--text-muted)',
                                                fontSize: '11px',
                                                border: '1px dashed rgba(255, 255, 255, 0.08)',
                                                borderRadius: '6px',
                                                gap: '4px'
                                            }}>
                                                <Plus size={12} /> Assign
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}