package com.learngraph.dto;

import java.util.List;

public record LearningPathResponse(
        String career,
        String targetSkill,
        List<String> learningPath,
        List<String> recommendedCourses
) {
}