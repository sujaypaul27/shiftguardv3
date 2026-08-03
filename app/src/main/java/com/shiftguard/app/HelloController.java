package com.shiftguard.app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Hello from Spring Boot!";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Spring Boot app is working!";
    }
}

//Phase 1 Completed Data Seeding