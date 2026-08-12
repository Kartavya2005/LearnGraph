package com.learngraph.controller;

import com.learngraph.dto.GraphExplorerResponse;
import com.learngraph.repository.GraphRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphExplorerController {

    private final GraphRepository graphRepository;

    public GraphExplorerController(GraphRepository graphRepository) {
        this.graphRepository = graphRepository;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentGraph(
            @PathVariable String studentId
    ) {

        try {

            List<GraphExplorerResponse> data =
                    graphRepository.getStudentGraph(studentId);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "data", data
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "message",
                            "Unable to load graph data"
                    )
            );
        }
    }
}