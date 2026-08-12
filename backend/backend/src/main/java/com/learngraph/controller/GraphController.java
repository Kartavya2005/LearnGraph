package com.learngraph.controller;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final Driver driver;

    public GraphController(Driver driver) {
        this.driver = driver;
    }

    @GetMapping("/stats")
    public List<String> getStats() {

        String query = """
                MATCH (n)
                RETURN labels(n)[0] AS label, count(n) AS count
                ORDER BY label
                """;

        try (var session = driver.session()) {

            return session.run(query)
                    .list(record ->
                            record.get("label").asString()
                                    + " : "
                                    + record.get("count").asLong()
                    );
        }
    }

    @GetMapping("/course-connections")
    public List<String> getCourseConnections() {

        String query = """
            MATCH (course:Course)-[:TEACHES]->(skill:Skill)
            RETURN course.name + ' -> ' + skill.name AS connection
            ORDER BY course.name
            """;

        try (var session = driver.session()) {

            return session.run(query)
                    .list(record -> record.get("connection").asString());
        }
    }

    @GetMapping("/student-course-path")
    public List<String> getStudentCoursePath() {

        String query = """
            MATCH (student:Student {id: 'student-001'})
                  -[:TARGETS]->(career:Career)
                  -[:REQUIRES]->(skill:Skill)

            MATCH (course:Course)-[:TEACHES]->(skill)

            RETURN DISTINCT
                   career.name + ' -> ' +
                   skill.name + ' -> ' +
                   course.name AS result

            ORDER BY result
            """;

        try (var session = driver.session()) {

            return session.run(query)
                    .list(record -> record.get("result").asString());
        }
    }

    @GetMapping("/student-path")
    public List<String> getStudentPath() {

        String query = """
            MATCH (student:Student {id: 'student-001'})
                  -[:TARGETS]->(career:Career)
                  -[:REQUIRES]->(target:Skill)

            WHERE NOT (student)-[:KNOWS]->(target)

            MATCH (student)-[:KNOWS]->(known:Skill)

            MATCH path =
                  (known)-[:PREREQUISITE_OF*1..5]->(target)

            RETURN DISTINCT
                   target.name AS targetSkill,
                   [node IN nodes(path) | node.name] AS learningPath

            ORDER BY targetSkill
            """;

        try (var session = driver.session()) {

            return session.run(query)
                    .list(record ->
                            record.get("targetSkill").asString()
                                    + " : "
                                    + record.get("learningPath").asList(
                                    value -> value.asString()
                            )
                    );
        }
    }
}