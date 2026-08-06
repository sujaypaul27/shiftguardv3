import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MetricsOverview from "./components/MetricsOverview";
import SchedulerGrid from "./components/SchedulerGrid";
import SolverConsole from "./components/SolverConsole";
import WorkforceRoster from "./components/WorkforceRoster";
import AuditLog from "./components/AuditLog";
import AssignModal from "./components/AssignModal";
import Toast, { useToasts } from "./components/Toast";
import { getEmployees, getShifts, generateSchedule, validateAssignment } from "./api/client";
import { DEMO_EMPLOYEES, DEMO_SHIFTS, shiftKey, timeNow, VIOLATION_COPY } from "./lib/constants";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("grid");
  const [collapsed, setCollapsed] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const [connErr, setConnErr] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [unfilled, setUnfilled] = useState([]);
  const [fullyScheduled, setFullyScheduled] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [logs, setLogs] = useState([
    { time: timeNow(), type: "SYSTEM_INIT", msg: "ShiftGuard Slate v4.0 initialized." },
  ]);

  const [modalShift, setModalShift] = useState(null);
  const [assignEmp, setAssignEmp] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationErr, setValidationErr] = useState(null);

  const { toasts, pushToast, removeToast } = useToasts();

  const pushLog = useCallback((type, msg) => {
    setLogs((l) => [{ time: timeNow(), type, msg }, ...l].slice(0, 50));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [emps, shs] = await Promise.all([getEmployees(), getShifts()]);
        setEmployees(emps);
        setShifts(shs.length ? shs : DEMO_SHIFTS);
        setConnErr(false);
        pushLog("DATA_SYNC", "Fetched workforce roster and shift matrix from AppSail.");
      } catch (e) {
        setEmployees(DEMO_EMPLOYEES);
        setShifts(DEMO_SHIFTS);
        setConnErr(true);
        setLiveMode(false);
        pushLog("DATA_SYNC_FALLBACK", "Live AppSail unreachable — showing demo data.");
        pushToast("info", "Couldn't reach AppSail — running in demo mode.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shiftByDaySlot = {};
  shifts.forEach((s) => (shiftByDaySlot[shiftKey(s.day, s.slotType)] = s));

  const empById = {};
  employees.forEach((e) => (empById[e.id] = e));

  const assignmentByShift = {};
  assignments.forEach((a) => (assignmentByShift[a.shiftId] = a));

  const filledCount = Object.keys(assignmentByShift).length;
  const fillRate = shifts.length ? Math.round((filledCount / shifts.length) * 100) : 0;

  async function handleGenerate() {
    setGenerating(true);
    pushLog("SOLVER_RUN", "Generate requested — dispatching to constraint solver.");
    try {
      const result = liveMode ? await generateSchedule() : null;
      if (result) {
        setAssignments(result.assignments || []);
        setUnfilled(result.unfilledShifts || []);
        setFullyScheduled(result.fullyScheduled);
        pushLog("SOLVER_DONE", result.message || "Schedule generated.");
        pushToast("success", result.message || "Schedule generated successfully.");
      } else {
        await new Promise((r) => setTimeout(r, 700));
        const sim = shifts.slice(0, Math.max(4, Math.floor(shifts.length * 0.7))).map((s, i) => ({
          employeeId: employees[i % employees.length].id,
          shiftId: s.id,
        }));
        setAssignments(sim);
        setUnfilled(shifts.filter((s) => !sim.find((a) => a.shiftId === s.id)));
        setFullyScheduled(sim.length === shifts.length);
        pushLog("SOLVER_DONE", "Demo schedule generated (offline mode).");
        pushToast("success", "Demo schedule generated.");
      }
    } catch (e) {
      pushLog("SOLVER_ERROR", `Generate failed: ${e.message}`);
      pushToast("error", `Generate failed: ${e.message}`);
    }
    setGenerating(false);
  }

  function openAssign(shift) {
    setModalShift(shift);
    setAssignEmp("");
    setValidationErr(null);
  }

  async function confirmAssign() {
    if (!assignEmp || !modalShift) return;
    setValidating(true);
    setValidationErr(null);
    try {
      let result;
      if (liveMode) {
        result = await validateAssignment(Number(assignEmp), modalShift.id);
      } else {
        await new Promise((r) => setTimeout(r, 500));
        result = { valid: true, violatedRule: "ok", message: "Assignment is valid." };
      }

      if (result.valid) {
        setAssignments((prev) => [
          ...prev.filter((a) => a.shiftId !== modalShift.id),
          { employeeId: Number(assignEmp), shiftId: modalShift.id },
        ]);
        const empName = empById[assignEmp]?.name || "Employee";
        pushLog("ASSIGN_CONFIRMED", `${empName} -> ${modalShift.day} ${modalShift.slotType}.`);
        pushToast("success", `${empName} assigned to ${modalShift.day} ${modalShift.slotType}.`);
        setModalShift(null);
      } else {
        setValidationErr(result);
        pushLog("ASSIGN_REJECTED", `${result.violatedRule}: ${result.message}`);
        pushToast("error", VIOLATION_COPY[result.violatedRule] || result.message);
      }
    } catch (e) {
      setValidationErr({ violatedRule: "error", message: e.message });
      pushLog("VALIDATE_ERROR", e.message);
      pushToast("error", `Validation failed: ${e.message}`);
    }
    setValidating(false);
  }

  return (
      <div className="sg-root">
        <Sidebar
            page={page}
            setPage={setPage}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            connErr={connErr}
            liveMode={liveMode}
        />
        <main className="sg-main">
          <Navbar connErr={connErr} liveMode={liveMode} setLiveMode={setLiveMode} />
          <div className="sg-content">
            {page === "grid" && (
                <>
                  <MetricsOverview
                      employeeCount={employees.length}
                      shiftCount={shifts.length}
                      filledCount={filledCount}
                      fillRate={fillRate}
                  />
                  <SchedulerGrid
                      shifts={shifts}
                      empById={empById}
                      assignmentByShift={assignmentByShift}
                      generating={generating}
                      onGenerate={handleGenerate}
                      onOpenAssign={openAssign}
                      unfilled={unfilled}
                      fullyScheduled={fullyScheduled}
                  />
                </>
            )}
            {page === "roster" && <WorkforceRoster employees={employees} />}
            {page === "solver" && <SolverConsole />}
            {page === "audit" && <AuditLog logs={logs} />}
          </div>
        </main>

        {modalShift && (
            <AssignModal
                shift={modalShift}
                employees={employees}
                assignEmp={assignEmp}
                setAssignEmp={setAssignEmp}
                validating={validating}
                validationErr={validationErr}
                onClose={() => setModalShift(null)}
                onConfirm={confirmAssign}
            />
        )}

        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
  );
}