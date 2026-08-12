package com.learngraph.controller;

import com.learngraph.dto.LearningPathResponse;
import com.learngraph.service.SkillGapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-path")
public class LearningPathController {

    private final SkillGapService skillGapService;

    public LearningPathController(SkillGapService skillGapService) {
        this.skillGapService = skillGapService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getLearningPath(
            @PathVariable String studentId
    ) {

        try {

            List<LearningPathResponse> result =
                    skillGapService.getLearningPaths(studentId);

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
                            "Unable to generate learning path"
                    )
            );
        }
    }
}