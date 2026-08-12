package com.learngraph.repository;

import com.learngraph.dto.GraphExplorerResponse;
import com.learngraph.dto.LearningPathResponse;
import com.learngraph.dto.SkillGapResponse;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Values;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GraphRepository {

    private final Driver driver;

    public GraphRepository(Driver driver) {
        this.driver = driver;
    }

    // =========================================================
    // SKILL GAP
    // =========================================================

    public List<SkillGapResponse> getSkillGap(String studentId) {

        String query = """
                MATCH (student:Student {id: $studentId})
                      -[:TARGETS]->(career:Career)
                      -[:REQUIRES]->(requiredSkill:Skill)

                OPTIONAL MATCH (student)-[:KNOWS]->(knownSkill:Skill)

                WITH student,
                     career,
                     requiredSkill,
                     collect(knownSkill.id) AS knownSkillIds

                RETURN
                    career.name AS career,
                    requiredSkill.id AS skillId,
                    requiredSkill.name AS skill,
                    requiredSkill.id IN knownSkillIds AS alreadyKnown

                ORDER BY alreadyKnown DESC, skill
                """;

        try (var session = driver.session()) {

            return session.run(
                    query,
                    Values.parameters("studentId", studentId)
            ).list(record -> new SkillGapResponse(
                    record.get("career").asString(),
                    record.get("skillId").asString(),
                    record.get("skill").asString(),
                    record.get("alreadyKnown").asBoolean()
            ));
        }
    }


    // =========================================================
    // LEARNING PATH
    // =========================================================

    public List<LearningPathResponse> getLearningPaths(String studentId) {

        String query = """
                MATCH (student:Student {id: $studentId})
                      -[:TARGETS]->(career:Career)
                      -[:REQUIRES]->(target:Skill)

                MATCH (student)-[:KNOWS]->(known:Skill)

                MATCH path =
                      (known)-[:PREREQUISITE_OF*1..5]->(target)

                RETURN
                    career.name AS career,
                    target.name AS targetSkill,
                    [node IN nodes(path) | node.name] AS learningPath,
                    length(path) AS pathLength

                ORDER BY targetSkill, pathLength
                """;

        try (var session = driver.session()) {

            return session.run(
                    query,
                    Values.parameters("studentId", studentId)
            ).list(record -> new LearningPathResponse(
                    record.get("career").asString(),
                    record.get("targetSkill").asString(),
                    record.get("learningPath")
                            .asList(value -> value.asString()),
                    List.of()
            ));
        }
    }


    // =========================================================
    // COURSE → SKILL CONNECTIONS
    // =========================================================

    public List<String> getCourseSkillConnections() {

        String query = """
                MATCH (course:Course)-[:TEACHES]->(skill:Skill)

                RETURN
                    course.name + ' -> ' + skill.name AS connection

                ORDER BY course.name
                """;

        try (var session = driver.session()) {

            return session.run(query)
                    .list(record ->
                            record.get("connection").asString()
                    );
        }
    }


    // =========================================================
    // RECOMMENDED COURSES
    // =========================================================

    public List<String> getRecommendedCourses(String skillName) {

        String query = """
                MATCH (course:Course)-[:TEACHES]->(skill:Skill)

                WHERE skill.name = $skillName

                RETURN course.name AS course

                ORDER BY course.name
                """;

        try (var session = driver.session()) {

            return session.run(
                    query,
                    Values.parameters("skillName", skillName)
            ).list(record ->
                    record.get("course").asString()
            );
        }
    }

    public List<GraphExplorerResponse> getStudentGraph(String studentId) {

        String query = """
            MATCH (student:Student {id: $studentId})-[r]-(connected)
            RETURN
                student.name AS source,
                'Student' AS sourceType,
                type(r) AS relationship,
                connected.name AS target,
                labels(connected)[0] AS targetType
            ORDER BY relationship, target
            """;

        try (var session = driver.session()) {

            return session.run(
                    query,
                    Values.parameters("studentId", studentId)
            ).list(record -> new GraphExplorerResponse(
                    record.get("source").asString(),
                    record.get("sourceType").asString(),
                    record.get("relationship").asString(),
                    record.get("target").asString(),
                    record.get("targetType").asString()
            ));
        }
    }
}