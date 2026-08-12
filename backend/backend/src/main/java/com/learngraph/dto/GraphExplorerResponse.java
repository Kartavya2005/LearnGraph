package com.learngraph.dto;

public record GraphExplorerResponse(
        String source,
        String sourceType,
        String relationship,
        String target,
        String targetType
) {
}