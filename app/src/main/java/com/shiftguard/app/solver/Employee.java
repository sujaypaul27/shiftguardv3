package com.shiftguard.app.solver;

public class Employee {
    private Long id;
    private String name;
    private String role;
    private int maxWeeklyHours;

    public Employee() {}

    public Employee(Long id, String name, String role, int maxWeeklyHours) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.maxWeeklyHours = maxWeeklyHours;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getMaxWeeklyHours() {
        return maxWeeklyHours;
    }

    public void setMaxWeeklyHours(int maxWeeklyHours) {
        this.maxWeeklyHours = maxWeeklyHours;
    }
}