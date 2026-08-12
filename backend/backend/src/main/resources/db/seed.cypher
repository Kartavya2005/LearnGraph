// ============================================================
// LEARNGRAPH SEED DATA
// ============================================================

// ============================
// STUDENTS
// ============================

MERGE (s1:Student {id: 'student-001'})
SET s1.name = 'Aarav Sharma',
    s1.email = 'aarav@example.com';

MERGE (s2:Student {id: 'student-002'})
SET s2.name = 'Priya Mehta',
    s2.email = 'priya@example.com';

MERGE (s3:Student {id: 'student-003'})
SET s3.name = 'Rahul Verma',
    s3.email = 'rahul@example.com';


// ============================
// CAREERS
// ============================

MERGE (c1:Career {id: 'career-001'})
SET c1.name = 'Java Backend Developer',
    c1.description = 'Build scalable backend applications using Java and Spring.';

MERGE (c2:Career {id: 'career-002'})
SET c2.name = 'Full Stack Developer',
    c2.description = 'Build complete web applications across frontend and backend.';

MERGE (c3:Career {id: 'career-003'})
SET c3.name = 'Data Analyst',
    c3.description = 'Analyze data and create insights for business decisions.';

MERGE (c4:Career {id: 'career-004'})
SET c4.name = 'AI/ML Engineer',
    c4.description = 'Build and deploy machine learning systems.';


// ============================
// SKILLS
// ============================

MERGE (:Skill {id: 'skill-001', name: 'Java'});
MERGE (:Skill {id: 'skill-002', name: 'Python'});
MERGE (:Skill {id: 'skill-003', name: 'SQL'});
MERGE (:Skill {id: 'skill-004', name: 'OOP'});
MERGE (:Skill {id: 'skill-005', name: 'Spring Boot'});
MERGE (:Skill {id: 'skill-006', name: 'REST APIs'});
MERGE (:Skill {id: 'skill-007', name: 'Hibernate'});
MERGE (:Skill {id: 'skill-008', name: 'Docker'});
MERGE (:Skill {id: 'skill-009', name: 'Microservices'});
MERGE (:Skill {id: 'skill-010', name: 'Git'});
MERGE (:Skill {id: 'skill-011', name: 'React'});
MERGE (:Skill {id: 'skill-012', name: 'JavaScript'});
MERGE (:Skill {id: 'skill-013', name: 'Data Analysis'});
MERGE (:Skill {id: 'skill-014', name: 'Pandas'});
MERGE (:Skill {id: 'skill-015', name: 'NumPy'});
MERGE (:Skill {id: 'skill-016', name: 'Machine Learning'});
MERGE (:Skill {id: 'skill-017', name: 'Statistics'});
MERGE (:Skill {id: 'skill-018', name: 'AWS'});


// ============================
// TECHNOLOGIES
// ============================

MERGE (:Technology {id: 'tech-001', name: 'Java'});
MERGE (:Technology {id: 'tech-002', name: 'Spring Boot'});
MERGE (:Technology {id: 'tech-003', name: 'React'});
MERGE (:Technology {id: 'tech-004', name: 'Docker'});
MERGE (:Technology {id: 'tech-005', name: 'AWS'});
MERGE (:Technology {id: 'tech-006', name: 'Python'});
MERGE (:Technology {id: 'tech-007', name: 'Pandas'});
MERGE (:Technology {id: 'tech-008', name: 'NumPy'});


// ============================
// TOPICS
// ============================

MERGE (:Topic {id: 'topic-001', name: 'Backend Development'});
MERGE (:Topic {id: 'topic-002', name: 'REST Architecture'});
MERGE (:Topic {id: 'topic-003', name: 'Database Management'});
MERGE (:Topic {id: 'topic-004', name: 'Cloud Computing'});
MERGE (:Topic {id: 'topic-005', name: 'Data Analysis'});
MERGE (:Topic {id: 'topic-006', name: 'Machine Learning'});


// ============================
// COURSES
// ============================

MERGE (co1:Course {id: 'course-001'})
SET co1.name = 'Java Fundamentals',
    co1.level = 'Beginner';

MERGE (co2:Course {id: 'course-002'})
SET co2.name = 'Spring Boot Masterclass',
    co2.level = 'Intermediate';

MERGE (co3:Course {id: 'course-003'})
SET co3.name = 'Building REST APIs',
    co3.level = 'Intermediate';

MERGE (co4:Course {id: 'course-004'})
SET co4.name = 'Hibernate & JPA',
    co4.level = 'Intermediate';

MERGE (co5:Course {id: 'course-005'})
SET co5.name = 'Docker for Developers',
    co5.level = 'Intermediate';

MERGE (co6:Course {id: 'course-006'})
SET co6.name = 'Microservices Architecture',
    co6.level = 'Advanced';

MERGE (co7:Course {id: 'course-007'})
SET co7.name = 'Python for Data Analysis',
    co7.level = 'Beginner';

MERGE (co8:Course {id: 'course-008'})
SET co8.name = 'Machine Learning Fundamentals',
    co8.level = 'Intermediate';


// ============================================================
// STUDENT → SKILLS
// ============================================================

MATCH (s:Student {id: 'student-001'})
MATCH (java:Skill {id: 'skill-001'})
MATCH (sql:Skill {id: 'skill-003'})
MATCH (oop:Skill {id: 'skill-004'})
MATCH (git:Skill {id: 'skill-010'})
MERGE (s)-[:KNOWS]->(java)
MERGE (s)-[:KNOWS]->(sql)
MERGE (s)-[:KNOWS]->(oop)
MERGE (s)-[:KNOWS]->(git);

MATCH (s:Student {id: 'student-002'})
MATCH (python:Skill {id: 'skill-002'})
MATCH (sql:Skill {id: 'skill-003'})
MATCH (stats:Skill {id: 'skill-017'})
MERGE (s)-[:KNOWS]->(python)
MERGE (s)-[:KNOWS]->(sql)
MERGE (s)-[:KNOWS]->(stats);

MATCH (s:Student {id: 'student-003'})
MATCH (java:Skill {id: 'skill-001'})
MATCH (react:Skill {id: 'skill-011'})
MATCH (js:Skill {id: 'skill-012'})
MATCH (sql:Skill {id: 'skill-003'})
MERGE (s)-[:KNOWS]->(java)
MERGE (s)-[:KNOWS]->(react)
MERGE (s)-[:KNOWS]->(js)
MERGE (s)-[:KNOWS]->(sql);


// ============================================================
// STUDENT → CAREER
// ============================================================

MATCH (s:Student {id: 'student-001'})
MATCH (c:Career {id: 'career-001'})
MERGE (s)-[:TARGETS]->(c);

MATCH (s:Student {id: 'student-002'})
MATCH (c:Career {id: 'career-003'})
MERGE (s)-[:TARGETS]->(c);

MATCH (s:Student {id: 'student-003'})
MATCH (c:Career {id: 'career-002'})
MERGE (s)-[:TARGETS]->(c);


// ============================================================
// CAREER → REQUIRED SKILLS
// ============================================================

MATCH (c:Career {id: 'career-001'})
MATCH (java:Skill {id: 'skill-001'})
MATCH (spring:Skill {id: 'skill-005'})
MATCH (rest:Skill {id: 'skill-006'})
MATCH (hibernate:Skill {id: 'skill-007'})
MATCH (docker:Skill {id: 'skill-008'})
MATCH (micro:Skill {id: 'skill-009'})
MATCH (sql:Skill {id: 'skill-003'})
MERGE (c)-[:REQUIRES]->(java)
MERGE (c)-[:REQUIRES]->(spring)
MERGE (c)-[:REQUIRES]->(rest)
MERGE (c)-[:REQUIRES]->(hibernate)
MERGE (c)-[:REQUIRES]->(docker)
MERGE (c)-[:REQUIRES]->(micro)
MERGE (c)-[:REQUIRES]->(sql);

MATCH (c:Career {id: 'career-002'})
MATCH (java:Skill {id: 'skill-001'})
MATCH (react:Skill {id: 'skill-011'})
MATCH (js:Skill {id: 'skill-012'})
MATCH (spring:Skill {id: 'skill-005'})
MATCH (rest:Skill {id: 'skill-006'})
MATCH (sql:Skill {id: 'skill-003'})
MERGE (c)-[:REQUIRES]->(java)
MERGE (c)-[:REQUIRES]->(react)
MERGE (c)-[:REQUIRES]->(js)
MERGE (c)-[:REQUIRES]->(spring)
MERGE (c)-[:REQUIRES]->(rest)
MERGE (c)-[:REQUIRES]->(sql);

MATCH (c:Career {id: 'career-003'})
MATCH (python:Skill {id: 'skill-002'})
MATCH (sql:Skill {id: 'skill-003'})
MATCH (analysis:Skill {id: 'skill-013'})
MATCH (pandas:Skill {id: 'skill-014'})
MATCH (numpy:Skill {id: 'skill-015'})
MATCH (stats:Skill {id: 'skill-017'})
MERGE (c)-[:REQUIRES]->(python)
MERGE (c)-[:REQUIRES]->(sql)
MERGE (c)-[:REQUIRES]->(analysis)
MERGE (c)-[:REQUIRES]->(pandas)
MERGE (c)-[:REQUIRES]->(numpy)
MERGE (c)-[:REQUIRES]->(stats);

MATCH (c:Career {id: 'career-004'})
MATCH (python:Skill {id: 'skill-002'})
MATCH (numpy:Skill {id: 'skill-015'})
MATCH (pandas:Skill {id: 'skill-014'})
MATCH (ml:Skill {id: 'skill-016'})
MATCH (stats:Skill {id: 'skill-017'})
MERGE (c)-[:REQUIRES]->(python)
MERGE (c)-[:REQUIRES]->(numpy)
MERGE (c)-[:REQUIRES]->(pandas)
MERGE (c)-[:REQUIRES]->(ml)
MERGE (c)-[:REQUIRES]->(stats);


// ============================================================
// SKILL → PREREQUISITE
// ============================================================

MATCH (oop:Skill {id: 'skill-004'})
MATCH (java:Skill {id: 'skill-001'})
MERGE (oop)-[:PREREQUISITE_OF]->(java);

MATCH (java:Skill {id: 'skill-001'})
MATCH (spring:Skill {id: 'skill-005'})
MERGE (java)-[:PREREQUISITE_OF]->(spring);

MATCH (spring:Skill {id: 'skill-005'})
MATCH (rest:Skill {id: 'skill-006'})
MERGE (spring)-[:PREREQUISITE_OF]->(rest);

MATCH (java:Skill {id: 'skill-001'})
MATCH (hibernate:Skill {id: 'skill-007'})
MERGE (java)-[:PREREQUISITE_OF]->(hibernate);

MATCH (rest:Skill {id: 'skill-006'})
MATCH (docker:Skill {id: 'skill-008'})
MERGE (rest)-[:PREREQUISITE_OF]->(docker);

MATCH (docker:Skill {id: 'skill-008'})
MATCH (micro:Skill {id: 'skill-009'})
MERGE (docker)-[:PREREQUISITE_OF]->(micro);

MATCH (sql:Skill {id: 'skill-003'})
MATCH (analysis:Skill {id: 'skill-013'})
MERGE (sql)-[:PREREQUISITE_OF]->(analysis);

MATCH (python:Skill {id: 'skill-002'})
MATCH (pandas:Skill {id: 'skill-014'})
MERGE (python)-[:PREREQUISITE_OF]->(pandas);

MATCH (stats:Skill {id: 'skill-017'})
MATCH (ml:Skill {id: 'skill-016'})
MERGE (stats)-[:PREREQUISITE_OF]->(ml);


// ============================================================
// COURSE → SKILL
// ============================================================

MATCH (co:Course {id: 'course-001'})
MATCH (java:Skill {id: 'skill-001'})
MATCH (oop:Skill {id: 'skill-004'})
MERGE (co)-[:TEACHES]->(java)
MERGE (co)-[:TEACHES]->(oop);

MATCH (co:Course {id: 'course-002'})
MATCH (spring:Skill {id: 'skill-005'})
MERGE (co)-[:TEACHES]->(spring);

MATCH (co:Course {id: 'course-003'})
MATCH (rest:Skill {id: 'skill-006'})
MERGE (co)-[:TEACHES]->(rest);

MATCH (co:Course {id: 'course-004'})
MATCH (hibernate:Skill {id: 'skill-007'})
MERGE (co)-[:TEACHES]->(hibernate);

MATCH (co:Course {id: 'course-005'})
MATCH (docker:Skill {id: 'skill-008'})
MERGE (co)-[:TEACHES]->(docker);

MATCH (co:Course {id: 'course-006'})
MATCH (micro:Skill {id: 'skill-009'})
MERGE (co)-[:TEACHES]->(micro);

MATCH (co:Course {id: 'course-007'})
MATCH (pandas:Skill {id: 'skill-014'})
MATCH (numpy:Skill {id: 'skill-015'})
MERGE (co)-[:TEACHES]->(pandas)
MERGE (co)-[:TEACHES]->(numpy);

MATCH (co:Course {id: 'course-008'})
MATCH (ml:Skill {id: 'skill-016'})
MERGE (co)-[:TEACHES]->(ml);