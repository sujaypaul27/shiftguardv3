package com.shiftguard.app.solver;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

public class ScheduleSolver {

    private static final int SHIFT_HOURS = 8;
    private static final int MAX_BACKTRACK_LIMIT = 100;

    public ScheduleResult generateSchedule(
            List<Employee> employees,
            List<Shift> shifts,
            List<Unavailability> unavailabilityList,
            List<Assignment> existingAssignments) {

        ScheduleResult result = new ScheduleResult();

        Map<Long, Employee> employeeMap = employees.stream()
                .collect(Collectors.toMap(Employee::getId, e -> e));

        Map<Long, Shift> shiftMap = shifts.stream()
                .collect(Collectors.toMap(Shift::getId, s -> s));

        Set<String> unavailablePairs = new HashSet<>();
        for (Unavailability u : unavailabilityList) {
            unavailablePairs.add(u.getEmployeeId() + ":" + u.getShiftId());
        }

        Map<Long, Integer> assignedHours = new HashMap<>();
        Map<Long, List<Long>> employeeShiftHistory = new HashMap<>();

        for (Employee employee : employees) {
            assignedHours.put(employee.getId(), 0);
            employeeShiftHistory.put(employee.getId(), new ArrayList<>());
        }

        List<Shift> sortedShifts = new ArrayList<>(shifts);
        sortedShifts.sort(this::compareShifts);

        List<Assignment> generatedAssignments = new ArrayList<>();
        List<Shift> unfilledShifts = new ArrayList<>();

        int backtrackCount = 0;

        for (Shift shift : sortedShifts) {
            int filledForShift = 0;
            int requiredStaff = Math.max(1, shift.getMinStaff());

            while (filledForShift < requiredStaff) {
                Optional<Employee> selected = findBestCandidate(
                        employees,
                        shift,
                        unavailablePairs,
                        assignedHours,
                        employeeShiftHistory,
                        shiftMap,
                        generatedAssignments
                );

                if (selected.isPresent()) {
                    Employee employee = selected.get();

                    if (canAssign(employee, shift, unavailablePairs, assignedHours, employeeShiftHistory, shiftMap, generatedAssignments)) {
                        Assignment assignment = new Assignment();
                        assignment.setEmployeeId(employee.getId());
                        assignment.setShiftId(shift.getId());
                        assignment.setStatus("confirmed");

                        generatedAssignments.add(assignment);
                        assignedHours.put(employee.getId(), assignedHours.get(employee.getId()) + SHIFT_HOURS);
                        employeeShiftHistory.get(employee.getId()).add(shift.getId());

                        filledForShift++;
                    } else {
                        backtrackCount++;
                        if (backtrackCount > MAX_BACKTRACK_LIMIT) {
                            unfilledShifts.add(shift);
                            break;
                        }
                        if (!tryBacktrack(generatedAssignments, assignedHours, employeeShiftHistory, shiftMap, unavailablePairs, employees)) {
                            unfilledShifts.add(shift);
                            break;
                        }
                    }
                } else {
                    unfilledShifts.add(shift);
                    break;
                }
            }
        }

        result.setAssignments(generatedAssignments);
        result.setUnfilledShifts(unfilledShifts);
        result.setFullyScheduled(unfilledShifts.isEmpty());
        result.setMessage(unfilledShifts.isEmpty()
                ? "Schedule generated successfully."
                : "Partial schedule generated. Some shifts could not be filled.");

        return result;
    }

    private Optional<Employee> findBestCandidate(
            List<Employee> employees,
            Shift shift,
            Set<String> unavailablePairs,
            Map<Long, Integer> assignedHours,
            Map<Long, List<Long>> employeeShiftHistory,
            Map<Long, Shift> shiftMap,
            List<Assignment> generatedAssignments) {

        return employees.stream()
                .filter(employee -> canAssign(employee, shift, unavailablePairs, assignedHours, employeeShiftHistory, shiftMap, generatedAssignments))
                .sorted(Comparator.comparingInt((Employee e) -> assignedHours.getOrDefault(e.getId(), 0))
                        .thenComparing(Employee::getId))
                .findFirst();
    }

    private boolean canAssign(
            Employee employee,
            Shift shift,
            Set<String> unavailablePairs,
            Map<Long, Integer> assignedHours,
            Map<Long, List<Long>> employeeShiftHistory,
            Map<Long, Shift> shiftMap,
            List<Assignment> generatedAssignments) {

        if (employee == null || shift == null) {
            return false;
        }

        long employeeId = employee.getId();
        long shiftId = shift.getId();

        if (unavailablePairs.contains(employeeId + ":" + shiftId)) {
            return false;
        }

        int currentHours = assignedHours.getOrDefault(employeeId, 0);
        if (currentHours + SHIFT_HOURS > employee.getMaxWeeklyHours()) {
            return false;
        }

        if (violatesBackToBackRule(employeeId, shift, employeeShiftHistory, shiftMap)) {
            return false;
        }

        return true;
    }

    private boolean violatesBackToBackRule(
            Long employeeId,
            Shift currentShift,
            Map<Long, List<Long>> employeeShiftHistory,
            Map<Long, Shift> shiftMap) {

        List<Long> history = employeeShiftHistory.getOrDefault(employeeId, Collections.emptyList());
        for (Long previousShiftId : history) {
            Shift previousShift = shiftMap.get(previousShiftId);
            if (previousShift == null) continue;

            if (isClosingShift(previousShift) && isOpeningShift(currentShift)) {
                if (isNextDay(previousShift.getDay(), currentShift.getDay())) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean isOpeningShift(Shift shift) {
        return shift != null && "Morning".equalsIgnoreCase(shift.getSlotType());
    }

    private boolean isClosingShift(Shift shift) {
        return shift != null && "Evening".equalsIgnoreCase(shift.getSlotType());
    }

    private boolean isNextDay(String previousDay, String currentDay) {
        try {
            DayOfWeek prev = DayOfWeek.valueOf(previousDay.toUpperCase());
            DayOfWeek curr = DayOfWeek.valueOf(currentDay.toUpperCase());
            return prev.plus(1) == curr;
        } catch (Exception e) {
            return false;
        }
    }

    private int compareShifts(Shift a, Shift b) {
        return Integer.compare(getShiftOrder(a), getShiftOrder(b));
    }

    private int getShiftOrder(Shift shift) {
        if (shift == null || shift.getDay() == null || shift.getSlotType() == null) {
            return Integer.MAX_VALUE;
        }

        int dayOrder = switch (shift.getDay().toLowerCase()) {
            case "monday" -> 1;
            case "tuesday" -> 2;
            case "wednesday" -> 3;
            case "thursday" -> 4;
            case "friday" -> 5;
            case "saturday" -> 6;
            case "sunday" -> 7;
            default -> 99;
        };

        int slotOrder = "Morning".equalsIgnoreCase(shift.getSlotType()) ? 1 : 2;
        return dayOrder * 10 + slotOrder;
    }

    private boolean tryBacktrack(
            List<Assignment> generatedAssignments,
            Map<Long, Integer> assignedHours,
            Map<Long, List<Long>> employeeShiftHistory,
            Map<Long, Shift> shiftMap,
            Set<String> unavailablePairs,
            List<Employee> employees) {

        if (generatedAssignments.isEmpty()) {
            return false;
        }

        Assignment last = generatedAssignments.remove(generatedAssignments.size() - 1);
        if (last == null) {
            return false;
        }

        Long employeeId = last.getEmployeeId();
        Long shiftId = last.getShiftId();

        assignedHours.put(employeeId, Math.max(0, assignedHours.getOrDefault(employeeId, 0) - SHIFT_HOURS));
        employeeShiftHistory.getOrDefault(employeeId, new ArrayList<>()).remove(shiftId);

        Shift removedShift = shiftMap.get(shiftId);
        if (removedShift == null) {
            return false;
        }

        return employees.stream()
                .filter(e -> !Objects.equals(e.getId(), employeeId))
                .anyMatch(e -> canAssign(e, removedShift, unavailablePairs, assignedHours, employeeShiftHistory, shiftMap, generatedAssignments));
    }

    public ValidationResult validateAssignment(
            Employee employee,
            Shift shift,
            List<Unavailability> unavailabilityList,
            List<Assignment> currentAssignments) {

        Set<String> unavailablePairs = new HashSet<>();
        for (Unavailability u : unavailabilityList) {
            unavailablePairs.add(u.getEmployeeId() + ":" + u.getShiftId());
        }

        Map<Long, Integer> assignedHours = new HashMap<>();
        Map<Long, List<Long>> employeeShiftHistory = new HashMap<>();

        if (currentAssignments != null) {
            for (Assignment assignment : currentAssignments) {
                assignedHours.put(assignment.getEmployeeId(),
                        assignedHours.getOrDefault(assignment.getEmployeeId(), 0) + SHIFT_HOURS);
                employeeShiftHistory.computeIfAbsent(assignment.getEmployeeId(), k -> new ArrayList<>())
                        .add(assignment.getShiftId());
            }
        }

        if (unavailablePairs.contains(employee.getId() + ":" + shift.getId())) {
            return new ValidationResult(false, "unavailability", "Employee is unavailable for this shift");
        }

        if (assignedHours.getOrDefault(employee.getId(), 0) + SHIFT_HOURS > employee.getMaxWeeklyHours()) {
            return new ValidationResult(false, "max_weekly_hours", "Employee would exceed weekly hour limit");
        }

        return new ValidationResult(true, "ok", "Assignment is valid");
    }
}