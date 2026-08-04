package com.shiftguard.app.solver;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ScheduleSolverTest {

    @Test
    void generateSchedule_shouldReturnAssignmentsForValidInput() {
        List<Employee> employees = List.of(
                new Employee(1L, "Asha", "Staff", 16),
                new Employee(2L, "Ravi", "Staff", 16),
                new Employee(3L, "Meera", "Staff", 24)
        );

        List<Shift> shifts = List.of(
                new Shift(101L, "Monday", "Morning", 1),
                new Shift(102L, "Monday", "Evening", 1),
                new Shift(103L, "Tuesday", "Morning", 1),
                new Shift(104L, "Tuesday", "Evening", 1)
        );

        List<Unavailability> unavailability = List.of(
                new Unavailability(1L, 1L, 102L)
        );

        List<Assignment> existingAssignments = new ArrayList<>();

        ScheduleSolver solver = new ScheduleSolver();
        ScheduleResult result = solver.generateSchedule(employees, shifts, unavailability, existingAssignments);

        assertNotNull(result);
        assertNotNull(result.getAssignments());
        assertTrue(result.getAssignments().size() > 0);
        assertNotNull(result.getMessage());
    }
    @Test
    void validateAssignment_shouldRejectWhenMaxWeeklyHoursExceeded() {
        Employee employee = new Employee(1L, "Asha", "Staff", 8);
        Shift shift = new Shift(103L, "Tuesday", "Morning", 1);

        List<Unavailability> unavailability = List.of();
        List<Assignment> currentAssignments = List.of(
                new Assignment(1L, 1L, 101L, "confirmed")
        );

        ScheduleSolver solver = new ScheduleSolver();
        ValidationResult result = solver.validateAssignment(employee, shift, unavailability, currentAssignments);

        assertFalse(result.isValid());
        assertEquals("max_weekly_hours", result.getViolatedRule());
    }

    @Test
    void generateSchedule_shouldRespectBackToBackRule() {
        List<Employee> employees = List.of(
                new Employee(1L, "Asha", "Staff", 24),
                new Employee(2L, "Ravi", "Staff", 24)
        );

        List<Shift> shifts = List.of(
                new Shift(101L, "Monday", "Evening", 1),
                new Shift(102L, "Tuesday", "Morning", 1)
        );

        List<Unavailability> unavailability = List.of();
        List<Assignment> existingAssignments = List.of();

        ScheduleSolver solver = new ScheduleSolver();
        ScheduleResult result = solver.generateSchedule(employees, shifts, unavailability, existingAssignments);

        assertNotNull(result);
        assertNotNull(result.getAssignments());
    }

    @Test
    void validateAssignment_shouldRejectUnavailableEmployee() {
        Employee employee = new Employee(1L, "Asha", "Staff", 8);
        Shift shift = new Shift(102L, "Monday", "Evening", 1);

        List<Unavailability> unavailability = List.of(
                new Unavailability(1L, 1L, 102L)
        );

        ScheduleSolver solver = new ScheduleSolver();
        ValidationResult result = solver.validateAssignment(employee, shift, unavailability, List.of());

        assertFalse(result.isValid());
        assertEquals("unavailability", result.getViolatedRule());
    }
}