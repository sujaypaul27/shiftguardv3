import axios from 'axios';

const BASE_URL = 'https://appsail-50044605574.development.catalystappsail.in';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const ShiftGuardAPI = {
    getEmployees: () => apiClient.get('/employees'),
    getShifts: () => apiClient.get('/shifts'),
    generateSchedule: () => apiClient.post('/schedule/generate'),
    validateAssignment: (employeeId, shiftId) =>
        apiClient.post('/schedule/validate', { employeeId, shiftId })
};
