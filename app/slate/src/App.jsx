import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MetricsOverview from './components/MetricsOverview';
import SolverConsole from './components/SolverConsole';
import SchedulerGrid from './components/SchedulerGrid';
import Toast from './components/Toast';
import { ShiftGuardAPI } from './api/client';
import { Users, Cpu, Activity, Clock, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '10:18:02 PM', event: 'SYSTEM_INIT', details: 'ShiftGuard Frontend v3.0 initialized', level: 'info' }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const addLog = (event, details, level = 'info') => {
    const time = new Date().toLocaleTimeString();
    setAuditLogs(prev => [{ id: Date.now(), time, event, details, level }, ...prev]);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, shiftRes] = await Promise.all([
        ShiftGuardAPI.getEmployees(),
        ShiftGuardAPI.getShifts()
      ]);
      setEmployees(empRes.data || []);
      setShifts(shiftRes.data || []);
      setStatusMessage({ type: 'success', rule: 'CONNECTED', text: 'AppSail Data Store synchronized successfully.' });
      addLog('DATA_SYNC', 'Successfully fetched workforce roster and shift matrix from backend.', 'success');
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', rule: 'FETCH_ERROR', text: 'Could not connect to AppSail backend.' });
      addLog('BACKEND_DISCONNECTED', 'Failed to reach Java Spring Boot backend at AppSail endpoint.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStatusMessage({ type: 'info', rule: 'SOLVER_RUNNING', text: 'Executing constraint solver pipeline...' });
    addLog('SOLVER_START', 'Initiated automated constraint solver pipeline execution.', 'info');

    try {
      const res = await ShiftGuardAPI.generateSchedule();
      const { assignments: resultAssignments, unfilledShifts, fullyScheduled, message } = res.data;
      setAssignments(resultAssignments || []);

      if (fullyScheduled) {
        setStatusMessage({ type: 'success', rule: 'SOLVED', text: `Weekly schedule solved! ${message || ''}` });
        addLog('SOLVER_SUCCESS', `Solver completed with zero hard constraint violations.`, 'success');
      } else {
        setStatusMessage({ type: 'error', rule: 'PARTIAL', text: `Partial schedule generated (${unfilledShifts?.length || 0} unfilled).` });
        addLog('SOLVER_PARTIAL', `Solver completed with ${unfilledShifts?.length || 0} unfilled slots.`, 'warning');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', rule: 'SOLVER_FAILED', text: 'Schedule generation pipeline failed.' });
      addLog('SOLVER_ERROR', 'Constraint solver failed during backend pipeline execution.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = async (shift) => {
    if (!selectedEmployeeId) {
      setStatusMessage({ type: 'error', rule: 'NO_SELECTION', text: 'Please select an employee from the dropdown first.' });
      return;
    }

    const empId = Number(selectedEmployeeId);
    const emp = employees.find(e => e.id === empId);

    setLoading(true);
    try {
      const res = await ShiftGuardAPI.validateAssignment(empId, shift.id);
      const { valid, violatedRule, message } = res.data;

      if (valid) {
        const newAssign = { employeeId: empId, shiftId: shift.id, status: 'confirmed' };
        setAssignments(prev => [...prev.filter(a => !(a.shiftId === shift.id && a.employeeId === empId)), newAssign]);
        setStatusMessage({ type: 'success', rule: 'VALIDATED', text: `Assigned ${emp?.name || 'employee'} to ${shift.day} ${shift.slotType || shift.slot_type}` });
        addLog('MANUAL_ASSIGN', `Assigned ${emp?.name || empId} to shift #${shift.id}`, 'success');
      } else {
        setStatusMessage({ type: 'error', rule: violatedRule?.toUpperCase() || 'RULE_VIOLATION', text: message || 'Constraint violation.' });
        addLog('VALIDATION_FAILED', `Manual assignment blocked: ${violatedRule}`, 'error');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', rule: 'VALIDATION_ERR', text: 'Manual validation request failed.' });
      addLog('API_ERROR', 'Failed to validate assignment with backend server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
        <Toast message={statusMessage} />

        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          <Navbar
              onGenerate={handleGenerate}
              loading={loading}
              employeeCount={employees.length}
              shiftCount={shifts.length}
          />

          <main style={{ padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
            {/* TAB 1: SCHEDULE GRID */}
            {activeTab === 'schedule' && (
                <>
                  <MetricsOverview employees={employees} shifts={shifts} assignments={assignments} />
                  <SolverConsole statusMessage={statusMessage} loading={loading} />
                  <SchedulerGrid
                      shifts={shifts}
                      employees={employees}
                      assignments={assignments}
                      selectedEmployeeId={selectedEmployeeId}
                      setSelectedEmployeeId={setSelectedEmployeeId}
                      onSlotClick={handleSlotClick}
                      loading={loading}
                  />
                </>
            )}

            {/* TAB 2: WORKFORCE ROSTER */}
            {activeTab === 'roster' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Workforce Roster</h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Managed active staff members and constraints</p>
                    </div>
                    <div style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      Total Pool: {employees.length} Members
                    </div>
                  </div>

                  {employees.length === 0 ? (
                      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Users size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                        <p>No workforce members loaded from AppSail backend.</p>
                      </div>
                  ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {employees.map(emp => (
                            <div key={emp.id} className="glass-card" style={{ padding: '18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                                  {emp.name ? emp.name.charAt(0) : 'E'}
                                </div>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{emp.role || 'Staff'}</div>
                                </div>
                              </div>
                              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <span>Max Hours:</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>{emp.maxWeeklyHours || emp.max_weekly_hours || 40}h / wk</span>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {/* TAB 3: SOLVER ENGINE */}
            {activeTab === 'solver' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Constraint Solver Engine</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Algorithmic rules and backend solver pipeline configuration</p>
                  </div>

                  <SolverConsole statusMessage={statusMessage} loading={loading} />

                  <div className="glass-panel" style={{ padding: '24px', marginTop: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} color="var(--accent-emerald)" /> Active Hard Constraints
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Maximum Weekly Hours Limit', detail: 'Ensures no employee exceeds designated weekly maximum hours.', status: 'Active' },
                        { title: 'Rest Period Enforcement', detail: 'Prevents scheduling Evening shift followed immediately by next morning Morning shift.', status: 'Active' },
                        { title: 'Unavailability Blackout Windows', detail: 'Strictly respects non-working slots declared by employees.', status: 'Active' },
                        { title: 'Single Assignment Per Slot', detail: 'Guarantees an employee is assigned at most once per shift slot.', status: 'Active' }
                      ].map((rule, i) => (
                          <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{rule.title}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{rule.detail}</div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                        {rule.status}
                      </span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
            )}

            {/* TAB 4: SYSTEM AUDIT */}
            {activeTab === 'activity' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>System Audit & Logs</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time execution log stream from AppSail engine</p>
                  </div>

                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {auditLogs.map((log) => (
                          <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                            <Clock size={14} color="var(--text-muted)" />
                            <span style={{ color: 'var(--text-muted)', minWidth: '85px' }}>{log.time}</span>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 700,
                              background: log.level === 'error' ? 'rgba(244, 63, 94, 0.2)' : log.level === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                              color: log.level === 'error' ? 'var(--accent-rose)' : log.level === 'success' ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                              minWidth: '110px',
                              textAlign: 'center'
                            }}>
                        {log.event}
                      </span>
                            <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
            )}
          </main>
        </div>
      </div>
  );
}