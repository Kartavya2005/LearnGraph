// Graph Explorer
// Returns the direct relationships connected to a student.

MATCH (student:Student {id: $studentId})-[relationship]->(target)

RETURN
    student.name AS source,
    'Student' AS sourceType,
    type(relationship) AS relationship,
    target.name AS target,
    labels(target)[0] AS targetType

ORDER BY relationship, target