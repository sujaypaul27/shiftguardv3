package com.shiftguard.app;

import com.shiftguard.app.solver.Assignment;
import com.shiftguard.app.solver.Employee;
import com.shiftguard.app.solver.ScheduleResult;
import com.shiftguard.app.solver.ScheduleSolver;
import com.shiftguard.app.solver.Shift;
import com.shiftguard.app.solver.Unavailability;
import com.shiftguard.app.solver.ValidationResult;
import com.zc.auth.CatalystSDK;
import com.zc.component.object.ZCObject;
import com.zc.component.object.ZCRowObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScheduleService {

    // TODO: Replace these with your actual Catalyst Data Store table IDs.
    private static final Long EMPLOYEE_TABLE_ID = 60819000000018632L;
    private static final Long SHIFT_TABLE_ID = 60819000000018997L;
    private static final Long UNAVAILABILITY_TABLE_ID = 60819000000034362L;
    private static final Long ASSIGNMENTS_TABLE_ID = 60819000000034725L;

    private final ScheduleSolver scheduleSolver = new ScheduleSolver();

    public ScheduleResult generateSchedule(HttpServletRequest request) throws Exception {
        initCatalyst(request);

        List<Employee> employees = fetchEmployeesFromDataStore();
        List<Shift> shifts = fetchShiftsFromDataStore();
        List<Unavailability> unavailability = fetchUnavailabilityFromDataStore();
        List<Assignment> assignments = fetchAssignmentsFromDataStore();

        return scheduleSolver.generateSchedule(employees, shifts, unavailability, assignments);
    }

    public ValidationResult validateAssignment(HttpServletRequest request, Long employeeId, Long shiftId) throws Exception {
        initCatalyst(request);

        List<Employee> employees = fetchEmployeesFromDataStore();
        List<Shift> shifts = fetchShiftsFromDataStore();
        List<Unavailability> unavailability = fetchUnavailabilityFromDataStore();
        List<Assignment> assignments = fetchAssignmentsFromDataStore();

        Employee employee = employees.stream()
                .filter(e -> e.getId() != null && e.getId().equals(employeeId))
                .findFirst()
                .orElse(null);

        Shift shift = shifts.stream()
                .filter(s -> s.getId() != null && s.getId().equals(shiftId))
                .findFirst()
                .orElse(null);

        if (employee == null) {
            return new ValidationResult(false, "employee_not_found", "Employee not found");
        }

        if (shift == null) {
            return new ValidationResult(false, "shift_not_found", "Shift not found");
        }

        return scheduleSolver.validateAssignment(employee, shift, unavailability, assignments);
    }

    private void initCatalyst(HttpServletRequest request) {
        CatalystSDK.init(new AuthProviderImpl(request));
    }

    private List<Employee> fetchEmployeesFromDataStore() throws Exception {
        List<Employee> result = new ArrayList<>();
        ZCObject obj = ZCObject.getInstance();
        var table = obj.getTable(EMPLOYEE_TABLE_ID);
        var pagedResp = table.getPagedRows(null, 100);

        for (ZCRowObject row : pagedResp.getRows()) {
            Employee emp = new Employee();
            emp.setId(asLong(row.get("ROWID")));
            emp.setName(asString(row.get("name")));
            emp.setRole(asString(row.get("role")));
            emp.setMaxWeeklyHours(asInt(row.get("max_weekly_hours")));
            result.add(emp);
        }
        return result;
    }

    private List<Shift> fetchShiftsFromDataStore() throws Exception {
        List<Shift> result = new ArrayList<>();
        ZCObject obj = ZCObject.getInstance();
        var table = obj.getTable(SHIFT_TABLE_ID);
        var pagedResp = table.getPagedRows(null, 100);

        for (ZCRowObject row : pagedResp.getRows()) {
            Shift shift = new Shift();
            shift.setId(asLong(row.get("ROWID")));
            shift.setDay(asString(row.get("day")));
            shift.setSlotType(asString(row.get("slot_type")));
            shift.setMinStaff(asInt(row.get("min_staff")));
            result.add(shift);
        }
        return result;
    }

    private List<Unavailability> fetchUnavailabilityFromDataStore() throws Exception {
        List<Unavailability> result = new ArrayList<>();
        ZCObject obj = ZCObject.getInstance();
        var table = obj.getTable(UNAVAILABILITY_TABLE_ID);
        var pagedResp = table.getPagedRows(null, 100);

        for (ZCRowObject row : pagedResp.getRows()) {
            Unavailability u = new Unavailability();
            u.setId(asLong(row.get("ROWID")));
            u.setEmployeeId(asLong(row.get("employee_id")));
            u.setShiftId(asLong(row.get("shift_id")));
            result.add(u);
        }
        return result;
    }

    private List<Assignment> fetchAssignmentsFromDataStore() throws Exception {
        List<Assignment> result = new ArrayList<>();
        ZCObject obj = ZCObject.getInstance();
        var table = obj.getTable(ASSIGNMENTS_TABLE_ID);
        var pagedResp = table.getPagedRows(null, 100);

        for (ZCRowObject row : pagedResp.getRows()) {
            Assignment a = new Assignment();
            a.setId(asLong(row.get("ROWID")));
            a.setEmployeeId(asLong(row.get("employee_id")));
            a.setShiftId(asLong(row.get("shift_id")));
            a.setStatus(asString(row.get("status")));
            result.add(a);
        }
        return result;
    }

    private Long asLong(Object value) {
        if (value == null) return null;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof Double) return ((Double) value).longValue();
        return Long.valueOf(value.toString());
    }

    private int asInt(Object value) {
        if (value == null) return 0;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Long) return ((Long) value).intValue();
        if (value instanceof Double) return ((Double) value).intValue();
        return Integer.parseInt(value.toString());
    }

    private String asString(Object value) {
        return value == null ? null : value.toString();
    }
}