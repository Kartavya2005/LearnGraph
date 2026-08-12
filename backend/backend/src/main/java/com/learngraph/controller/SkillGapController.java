package com.learngraph.controller;

import com.learngraph.dto.SkillGapResponse;
import com.learngraph.service.SkillGapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skill-gap")
public class SkillGapController {

    private final SkillGapService skillGapService;

    public SkillGapController(SkillGapService skillGapService) {
        this.skillGapService = skillGapService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getSkillGap(
            @PathVariable String studentId
    ) {

        try {

            List<SkillGapResponse> result =
                    skillGapService.getSkillGap(studentId);

            if (result.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of(
                                "success", true,
                                "message", "No career skill data found",
                                "data", List.of()
                        )
                );
            }

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "data", result
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "message",
                            "Unable to retrieve skill gap from learning graph"
                    )
            );
        }
    }
}