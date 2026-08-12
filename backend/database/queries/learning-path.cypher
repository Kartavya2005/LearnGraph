MATCH (student:Student {id: $studentId})
      -[:TARGETS]->(career:Career)
      -[:REQUIRES]->(target:Skill)

OPTIONAL MATCH path =
    (known:Skill)-[:PREREQUISITE_OF*1..5]->(target)

WHERE (student)-[:KNOWS]->(known)

RETURN
    career.name AS career,
    target.name AS targetSkill,
    [node IN nodes(path) | node.name] AS learningPath
ORDER BY targetSkill