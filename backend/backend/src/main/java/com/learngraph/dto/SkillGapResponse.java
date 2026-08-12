package com.learngraph.dto;

public record SkillGapResponse(
        String career,
        String skillId,
        String skill,
        boolean alreadyKnown
) {
}