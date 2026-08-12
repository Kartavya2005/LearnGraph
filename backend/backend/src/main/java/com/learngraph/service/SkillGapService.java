package com.learngraph.service;

import com.learngraph.dto.LearningPathResponse;
import com.learngraph.dto.SkillGapResponse;
import com.learngraph.repository.GraphRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SkillGapService {

    private final GraphRepository graphRepository;

    public SkillGapService(GraphRepository graphRepository) {
        this.graphRepository = graphRepository;
    }

    public List<SkillGapResponse> getSkillGap(String studentId) {
        return graphRepository.getSkillGap(studentId);
    }

    public List<LearningPathResponse> getLearningPaths(String studentId) {

        // Get the student's complete skill-gap information.
        List<SkillGapResponse> skillGap =
                graphRepository.getSkillGap(studentId);

        // Store only missing skills.
        Map<String, Boolean> missingSkills = new LinkedHashMap<>();

        for (SkillGapResponse skill : skillGap) {

            if (!skill.alreadyKnown()) {
                missingSkills.put(skill.skill(), true);
            }
        }

        // Get all possible prerequisite paths.
        List<LearningPathResponse> allPaths =
                graphRepository.getLearningPaths(studentId);

        // Keep the shortest path for each missing target skill.
        Map<String, LearningPathResponse> shortestPaths =
                new LinkedHashMap<>();

        for (LearningPathResponse path : allPaths) {

            String target = path.targetSkill();

            if (!missingSkills.containsKey(target)) {
                continue;
            }

            if (!shortestPaths.containsKey(target)
                    || path.learningPath().size()
                    < shortestPaths.get(target).learningPath().size()) {

                shortestPaths.put(target, path);
            }
        }

        // Add recommended courses.
        return shortestPaths.values()
                .stream()
                .map(path -> new LearningPathResponse(
                        path.career(),
                        path.targetSkill(),
                        path.learningPath(),
                        graphRepository.getRecommendedCourses(
                                path.targetSkill()
                        )
                ))
                .toList();
    }
}