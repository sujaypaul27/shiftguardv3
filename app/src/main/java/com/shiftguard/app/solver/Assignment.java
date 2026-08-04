package com.shiftguard.app.solver;

public class Assignment {
    private Long id;
    private Long employeeId;
    private Long shiftId;
    private String status;

    public Assignment() {}

    public Assignment(Long id, Long employeeId, Long shiftId, String status) {
        this.id = id;
        this.employeeId = employeeId;
        this.shiftId = shiftId;
        this.status = status;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}