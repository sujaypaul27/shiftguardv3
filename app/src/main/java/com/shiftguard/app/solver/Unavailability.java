package com.shiftguard.app.solver;

public class Unavailability {
    private Long id;
    private Long employeeId;
    private Long shiftId;

    public Unavailability() {}

    public Unavailability(Long id, Long employeeId, Long shiftId) {
        this.id = id;
        this.employeeId = employeeId;
        this.shiftId = shiftId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getShiftId() {
        return shiftId;
    }

    public void setShiftId(Long shiftId) {
        this.shiftId = shiftId;
    }
}