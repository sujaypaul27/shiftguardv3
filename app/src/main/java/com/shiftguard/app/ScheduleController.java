package com.shiftguard.app;

import com.shiftguard.app.solver.ScheduleResult;
import com.shiftguard.app.solver.ValidationResult;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping("/generate")
    public ScheduleResult generate(HttpServletRequest request) throws Exception {
        return scheduleService.generateSchedule(request);
    }

    @PostMapping("/validate")
    public Map<String, Object> validate(
            HttpServletRequest request,
            @RequestBody Map<String, Object> body) throws Exception {

        Long employeeId = Long.valueOf(body.get("employeeId").toString());
        Long shiftId = Long.valueOf(body.get("shiftId").toString());

        ValidationResult result = scheduleService.validateAssignment(request, employeeId, shiftId);

        Map<String, Object> response = new HashMap<>();
        response.put("valid", result.isValid());
        response.put("violatedRule", result.getViolatedRule());
        response.put("message", result.getMessage());
        return response;
    }
}