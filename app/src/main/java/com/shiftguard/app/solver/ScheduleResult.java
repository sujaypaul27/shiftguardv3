package com.shiftguard.app.solver;

import java.util.ArrayList;
import java.util.List;

public class ScheduleResult {
    private List<Assignment> assignments = new ArrayList<>();
    private List<Shift> unfilledShifts = new ArrayList<>();
    private boolean fullyScheduled;
    private String message;

    public ScheduleResult() {}

    public List<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }

    public List<Shift> getUnfilledShifts() {
        return unfilledShifts;
    }

    public void setUnfilledShifts(List<Shift> unfilledShifts) {
        this.unfilledShifts = unfilledShifts;
    }

    public boolean isFullyScheduled() {
        return fullyScheduled;
    }

    public void setFullyScheduled(boolean fullyScheduled) {
        this.fullyScheduled = fullyScheduled;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}