package com.learngraph.controller;

import com.learngraph.service.SeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class SeedController {

    private final SeedService seedService;

    public SeedController(SeedService seedService) {
        this.seedService = seedService;
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedDatabase() {

        try {
            seedService.seedDatabase();

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "LearnGraph seed data loaded successfully"
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "message", "Failed to seed database",
                            "error", e.getMessage()
                    )
            );
        }
    }
}