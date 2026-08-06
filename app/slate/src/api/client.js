export const API_BASE = "https://appsail-50044605574.development.catalystappsail.in";

export async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
    return res.json();
}

export async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
    return res.json();
}

export const getEmployees = () => apiGet("/employees");
export const getShifts = () => apiGet("/shifts");
export const generateSchedule = () => apiPost("/schedule/generate", null);
export const validateAssignment = (employeeId, shiftId) =>
    apiPost("/schedule/validate", { employeeId, shiftId });