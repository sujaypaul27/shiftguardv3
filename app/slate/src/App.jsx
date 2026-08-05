import React, { useState, useEffect } from 'react';
import { ShiftGuardAPI } from './api/client';
import './App.css';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SLOTS = ["Morning", "Evening"];

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [unfilledShifts, setUnfilledShifts] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: 'info', rule: 'READY', text: 'ShiftGuard engine initialized.' });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [empRes, shiftRes] = await Promise.all([
        ShiftGuardAPI.getEmployees(),
        ShiftGuardAPI.getShifts()
      ]);
      setEmployees(empRes.data || []);
      setShifts(shiftRes.data || []);
      setStatusMessage({ type: 'info', rule: 'LOADED', text: 'Employees and fixed shift slots synchronized.' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', rule: 'NETWORK_ERR', text: 'Could not connect to AppSail backend.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setLoading(true);
    setStatusMessage({ type: 'info', rule: 'SOLVER_RUNNING', text: 'Executing greedy assignment algorithm against active constraints...' });
    try {
      const response = await ShiftGuardAPI.generateSchedule();
      const { assignments: resultAssignments, unfilledShifts: resultUnfilled, fullyScheduled, message } = response.data;

      setAssignments(resultAssignments || []);
      setUnfilledShifts(resultUnfilled || []);

      if (fullyScheduled) {
        setStatusMessage({ type: 'success', rule: 'SOLVED_OK', text: `Weekly schedule solved! ${message || ''}` });
      } else {
        setStatusMessage({ type: 'warning', rule: 'PARTIAL_FEASIBLE', text: `Generated partial schedule (${resultUnfilled.length} unfilled slots remaining).` });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', rule: 'SOLVER_FAILED', text: 'Solver pipeline execution error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (shift) => {
    if (!selectedEmployeeId) {
      setStatusMessage({ type: 'warning', rule: 'NO_SELECTION', text: 'Please choose an employee from the dropdown before assigning.' });
      return;
    }

    const empId = Number(selectedEmployeeId);
    const emp = employees.find(e => e.id === empId);

    setLoading(true);
    try {
      const res = await ShiftGuardAPI.validateAssignment(empId, shift.id);
      const { valid, violatedRule, message } = res.data;

      if (valid) {
        const newAssignment = { employeeId: empId, shiftId: shift.id, status: 'confirmed' };
        setAssignments(prev => [...prev.filter(a => !(a.shiftId === shift.id && a.employeeId === empId)), newAssignment]);
        setStatusMessage({
          type: 'success',
          rule: 'VALIDATED',
          text: `Successfully assigned ${emp ? emp.name : 'employee'} to ${shift.day} ${shift.slotType || shift.slot_type}.`
        });
      } else {
        setStatusMessage({
          type: 'error',
          rule: violatedRule || 'CONSTRAINT_VIOLATION',
          text: message || 'Selected shift violates active operational constraints.'
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', rule: 'VALIDATION_ERR', text: 'Failed to complete constraint validation.' });
    } finally {
      setLoading(false);
    }
  };

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

  // Metrics computations
  const totalSlots = shifts.length || 14;
  const filledCount = assignments.length;
  const coveragePercent = totalSlots > 0 ? Math.round((filledCount / totalSlots) * 100) : 0;

  return (
      <div className="dashboard-container">
        {/* Enterprise Header */}
        <header className="header-bar">
          <div className="brand-section">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="brand-title">ShiftGuard</h1>
              <p className="brand-subtitle">Automated Constraint Solver & Workforce Scheduler</p>
            </div>
          </div>
          <div className="system-status">
            <span className="status-dot"></span>
            AppSail Engine Active
          </div>
        </header>

        {/* Realtime Stat Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Staff Pool</div>
            <div className="metric-value">{employees.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Weekly Shifts</div>
            <div className="metric-value">{shifts.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Scheduled Slots</div>
            <div className="metric-value">{assignments.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Schedule Fill Rate</div>
            <div className="metric-value" style={{ color: coveragePercent === 100 ? 'var(--accent-emerald)' : 'var(--accent-blue)' }}>
              {coveragePercent}%
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <button className="btn-primary" onClick={handleGenerateSchedule} disabled={loading}>
            {loading ? (
                <>
                  <div className="spinner"></div>
                  Computing...
                </>
            ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Auto-Generate Schedule
                </>
            )}
          </button>

          <div className="action-group">
            <label htmlFor="emp-select" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Manual Override:
            </label>
            <div className="select-wrapper">
              <select
                  id="emp-select"
                  className="custom-select"
                  value={selectedEmployeeId}
                  onChange={e => setSelectedEmployeeId(e.target.value)}
              >
                <option value="">-- Choose Staff Member --</option>
                {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role} • {emp.maxWeeklyHours || emp.max_weekly_hours}h max)
                    </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Status / Rejection Toast Banner */}
        {statusMessage.text && (
            <div className={`toast-banner ${statusMessage.type}`}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="rule-code">{statusMessage.rule}</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{statusMessage.text}</span>
              </div>
            </div>
        )}

        {/* 7x2 Grid Schedule Table */}
        <div className="grid-card">
          <table className="schedule-table">
            <thead>
            <tr>
              <th className="slot-label-cell">Slot</th>
              {DAYS.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {SLOTS.map(slot => (
                <tr key={slot}>
                  <td className="slot-label-cell">{slot}</td>
                  {DAYS.map(day => {
                    const shift = getShift(day, slot);
                    const assigned = shift ? getAssignedEmployees(shift.id) : [];
                    return (
                        <td
                            key={day + slot}
                            className="grid-cell-interactive"
                            onClick={() => shift && handleSlotClick(shift)}
                            title="Click to perform live constraint evaluation and assign staff"
                        >
                          {assigned.length > 0 ? (
                              assigned.map(emp => (
                                  <div key={emp.id} className="assignment-chip">
                                    <span className="chip-name">{emp.name}</span>
                                    <span className="chip-role">{emp.role}</span>
                                  </div>
                              ))
                          ) : (
                              <div className="empty-cell-placeholder">
                                + Assign
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