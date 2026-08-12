package com.learngraph.service;

import org.neo4j.driver.Driver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class SeedService {

    private final Driver driver;

    public SeedService(Driver driver) {
        this.driver = driver;
    }

    public void seedDatabase() throws IOException {

        ClassPathResource resource =
                new ClassPathResource("db/seed.cypher");

        String script = new String(
                resource.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8
        );

        // Remove single-line Cypher comments
        String cleanedScript = script.replaceAll("(?m)//.*$", "");

        String[] statements = cleanedScript.split(";");

        try (var session = driver.session()) {

            for (String statement : statements) {

                String query = statement.trim();

                if (query.isEmpty()) {
                    continue;
                }

                session.run(query).consume();
            }
        }
    }
}