package com.shiftguard.app;

import com.zc.auth.CatalystSDK;
import com.zc.component.object.ZCObject;
import com.zc.component.object.ZCRowObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EmployeeController {

    @GetMapping("/employees")
    public List<Map<String, Object>> getEmployees(HttpServletRequest request) throws Exception {
        CatalystSDK.init(new AuthProviderImpl(request));

        List<Map<String, Object>> result = new ArrayList<>();
        ZCObject obj = ZCObject.getInstance();
        var table = obj.getTable(60819000000018632L);

        var pagedResp = table.getPagedRows(null, 100);
        for (ZCRowObject row : pagedResp.getRows()) {
            Map<String, Object> emp = new HashMap<>();
            emp.put("id", row.get("ROWID"));
            emp.put("name", row.get("name"));
            emp.put("role", row.get("role"));
            emp.put("max_weekly_hours", row.get("max_weekly_hours"));
            result.add(emp);
        }
        return result;
    }
}