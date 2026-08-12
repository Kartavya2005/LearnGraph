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
