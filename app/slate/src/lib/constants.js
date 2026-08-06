export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const SLOTS = ["Morning", "Evening"];

export const VIOLATION_COPY = {
    unavailability: "Employee marked unavailable for this shift.",
    max_weekly_hours: "Would exceed the employee's weekly hour limit.",
    back_to_back: "Closing shift cannot be followed by next-day opening shift.",
    employee_not_found: "No matching employee record.",
    shift_not_found: "No matching shift record.",
    ok: "Assignment is valid.",
};

export const DEMO_EMPLOYEES = [
    { id: 1, name: "Alice Johnson", role: "Cashier", maxWeeklyHours: 40 },
    { id: 2, name: "Bob Smith", role: "Cashier", maxWeeklyHours: 35 },
    { id: 3, name: "Carla Diaz", role: "Supervisor", maxWeeklyHours: 40 },
    { id: 4, name: "David Lee", role: "Stock Clerk", maxWeeklyHours: 30 },
    { id: 5, name: "Emma Brown", role: "Cashier", maxWeeklyHours: 25 },
    { id: 6, name: "Farhan Ali", role: "Stock Clerk", maxWeeklyHours: 40 },
];
export const DEMO_SHIFTS = DAYS.flatMap((day, di) =>
    SLOTS.map((slot, si) => ({ id: 101 + di * 2 + si, day, slotType: slot, minStaff: 1 }))
);

export function initials(name = "") {
    return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
export function shiftKey(day, slot) {
    return `${day}::${slot}`;
}
export function timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}