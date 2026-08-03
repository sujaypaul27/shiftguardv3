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
public class ShiftController {

    @GetMapping("/shifts")
    public List<Map<String, Object>> getShifts(HttpServletRequest request) throws Exception {
        CatalystSDK.init(new AuthProviderImpl(request));

        List<Map<String, Object>> result = new ArrayList<>();
        ZCObject obj = ZCObject.getInstance();
        var table = obj.getTable(60819000000018997L);

        var pagedResp = table.getPagedRows(null, 100);
        for (ZCRowObject row : pagedResp.getRows()) {
            Map<String, Object> shift = new HashMap<>();
            shift.put("id", row.get("ROWID"));
            shift.put("day", row.get("day"));
            shift.put("slot_type", row.get("slot_type"));
            shift.put("min_staff", row.get("min_staff"));
            result.add(shift);
        }
        return result;
    }
}