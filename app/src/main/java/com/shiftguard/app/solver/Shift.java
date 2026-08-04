package com.shiftguard.app.solver;

public class Shift {
    private Long id;
    private String day;
    private String slotType;
    private int minStaff;

    public Shift() {}

    public Shift(Long id, String day, String slotType, int minStaff) {
        this.id = id;
        this.day = day;
        this.slotType = slotType;
        this.minStaff = minStaff;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getSlotType() {
        return slotType;
    }

    public void setSlotType(String slotType) {
        this.slotType = slotType;
    }

    public int getMinStaff() {
        return minStaff;
    }

    public void setMinStaff(int minStaff) {
        this.minStaff = minStaff;
    }
}