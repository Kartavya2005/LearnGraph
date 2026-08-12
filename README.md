# LearnGraph

A graph-powered personalized learning application built with **Spring Boot, React, and CognoDB**.

LearnGraph helps students understand the gap between their current skills and the skills required for a target career. It uses graph relationships to identify missing skills, discover prerequisite learning paths, and recommend relevant courses.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Why a Graph Database?](#why-a-graph-database)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Graph Data Model](#graph-data-model)
- [Graph Relationships](#graph-relationships)
- [Sample Graph](#sample-graph)
- [How the Application Works](#how-the-application-works)
- [Important Cypher Queries](#important-cypher-queries)
- [Multi-Hop Graph Traversal](#multi-hop-graph-traversal)
- [Seed Data](#seed-data)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [CognoDB Setup](#cognodb-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Application Screens](#application-screens)
- [Error Handling](#error-handling)
- [Security](#security)
- [Wexa Assignment Requirements](#wexa-assignment-requirements)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Overview

LearnGraph is a personalized learning-path application backed by **CognoDB**, a managed graph database that supports openCypher over the Bolt protocol.

The application models relationships between:

- Students
- Careers
- Skills
- Courses
- Technologies
- Topics

The main purpose is to help a student discover:

> **What do I already know, what am I missing for my target career, and what should I learn first?**

The application uses graph traversal instead of treating each piece of information as an isolated record.

---

## Problem Statement

Students often know some technologies and skills but may not know exactly what they need to learn to reach a particular career.

For example, a student may already know:

```text
Java
SQL
OOP
Git
```

while targeting:

```text
Java Backend Developer
```

The career may require:

```text
Java
SQL
Spring Boot
REST APIs
Hibernate
Docker
Microservices
```

The application identifies the difference between the student's existing skills and the required skills.

It then uses prerequisite relationships to construct a learning path such as:

```
Java
  ↓
Spring Boot
  ↓
REST APIs
  ↓
Docker
```

or:

```
Java
  ↓
Spring Boot
  ↓
REST APIs
  ↓
Docker
  ↓
Microservices
```

## Why a Graph Database?

The important part of LearnGraph is not just the individual data items.

**The important part is the relationships between them.**

A student's learning journey can be represented as:

```
Student
   │
   ├── KNOWS ───────────────> Skill
   │
   └── TARGETS ─────────────> Career
                                  │
                                  └── REQUIRES ─────> Skill
                                                         │
                                                         └── PREREQUISITE_OF
                                                                  │
                                                                  ▼
                                                                Skill
```

Courses are also connected to skills:

```
Course ── TEACHES ──> Skill
```

A relational database could model this using multiple tables and join tables. However, the learning-path problem requires following relationships across multiple entities.

For example:

```
Student
   ↓ TARGETS
Career
   ↓ REQUIRES
Target Skill
   ↑ PREREQUISITE_OF
Previous Skill
   ↑ KNOWS
Student
```

The application needs to answer questions such as:

> Starting from skills the student already knows, which prerequisite chain can reach a skill required by the student's target career?

This is naturally expressed as a graph traversal:

```cypher
(known:Skill)-[:PREREQUISITE_OF*1..5]->(target:Skill)
```

This is where a graph database provides a natural representation of the domain. Instead of reconstructing the relationship network through multiple relational joins, the relationships are directly represented as graph edges.

## Key Features

1.  **Student Dashboard**

    The dashboard provides:
    - Student information
    - Target career
    - Required skill count
    - Known skill count
    - Missing skill count
    - Skill readiness percentage

2.  **Skill Gap Analysis**

    The Skill Gap page compares:
    - Student's known skills
            VS
    - Career-required skills

    Each required skill is marked as:
    - Already known
    - Needs to be learned

3.  **Personalized Learning Path**

    The Learning Path page uses prerequisite relationships to determine a logical order for learning missing skills.

    Example:
    ```
    Java
     ↓
    Spring Boot
     ↓
    REST APIs
     ↓
    Docker
    ```

4.  **Recommended Courses**

    Courses are connected to skills through: `Course ── TEACHES ──> Skill`. The application can therefore recommend courses associated with the target skill.

    Example:
    ```
    Docker
       ↑
    TEACHES
       │
    Docker for Developers
    ```

5.  **Graph Explorer**

    The Graph Explorer provides a visual representation of the student's relationships.

    Example:
    ```
                        Java
                         ↑
                       KNOWS
                         │
                         │
    SQL ◄──── KNOWS ── Student ── TARGETS ──> Java Backend Developer
                         │
                       KNOWS
                         │
                         ▼
                        OOP
    ```

    The frontend uses **React Flow** to make the graph interactive. Users can:
    - Drag nodes
    - Zoom
    - Pan
    - View relationships
    - Explore the graph visually

## Technology Stack

-   **Backend**: Java, Spring Boot, Maven, Neo4j Java Driver, openCypher, CognoDB
-   **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, React Flow, Lucide React
-   **Database**: CognoDB Cloud, Bolt protocol, openCypher

## Architecture

```
┌──────────────────────────────────────┐
│             React Frontend           │
│                                      │
│  Dashboard                           │
│  Skill Gap                           │
│  Learning Path                       │
│  Graph Explorer                      │
└──────────────────┬───────────────────┘
                   │
                   │ HTTP / REST API
                   ▼
┌──────────────────────────────────────┐
│          Spring Boot Backend         │
│                                      │
│  Controllers                         │
│       ↓                              │
│  Services                            │
│       ↓                              │
│  Graph Repository                    │
└──────────────────┬───────────────────┘
                   │
                   │ Neo4j Driver / Bolt
                   ▼
┌──────────────────────────────────────┐
│              CognoDB                 │
│                                      │
│  Student                             │
│  Career                              │
│  Skill                               │
│  Course                              │
│  Technology                          │
│  Topic                               │
└──────────────────────────────────────┘
```

## Graph Data Model

LearnGraph contains the following primary node types.

| Node       | Description                      |
| :--------- | :------------------------------- |
| `Student`  | Represents a learner             |
| `Career`   | Represents a target career       |
| `Skill`    | Represents a required or known skill |
| `Course`   | Represents a learning course     |
| `Technology`| Represents a technology          |
| `Topic`    | Represents a learning topic      |

## Graph Relationships

| Relationship        | Source    | Target  | Description                            |
| :------------------ | :-------- | :------ | :------------------------------------- |
| `KNOWS`             | `Student` | `Skill` | Student already knows the skill        |
| `TARGETS`           | `Student` | `Career`| Student targets the career             |
| `REQUIRES`          | `Career`  | `Skill` | Career requires the skill              |
| `PREREQUISITE_OF`   | `Skill`   | `Skill` | One skill is a prerequisite for another|
| `TEACHES`           | `Course`  | `Skill` | Course teaches the skill               |

## Graph Diagram

```
                         ┌─────────────┐
                         │   Student   │
                         └──────┬──────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                KNOWS                       TARGETS
                  │                           │
                  ▼                           ▼
             ┌─────────┐                ┌──────────┐
             │  Skill  │                │  Career  │
             └────┬────┘                └────┬─────┘
                  │                           │
                  │ PREREQUISITE_OF           │ REQUIRES
                  │                           │
                  ▼                           ▼
             ┌─────────┐                ┌─────────┐
             │  Skill  │                │  Skill  │
             └─────────┘                └────┬────┘
                                              │
                                            TEACHES
                                              │
                                              ▲
                                        ┌─────┴─────┐
                                        │   Course  │
                                        └───────────┘
```

## How the Application Works

The main flow is:

1.  **Student** selects a **Target Career**.
2.  The application finds the **Career Requirements** (skills).
3.  It compares the required skills with the **Student's known skills**.
4.  It identifies the **Skill Gap**.
5.  It traverses **Prerequisite Relationships** to generate a **Learning Path**.
6.  It finds **Courses** that teach the target skills.

## Important Cypher Queries

### Skill Gap Query

The skill-gap query starts from a student, follows their `TARGETS` relationship to a `Career`, and then finds the `REQUIRES` skills for that career. It then checks if the student already `KNOWS` the required skill.

```cypher
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
```

The query is parameterized with `$studentId`.

### Learning Path Query

This query identifies a target skill required by the student's career and searches for prerequisite relationships from skills already known by the student.

```cypher
MATCH (student:Student {id: $studentId})
      -[:TARGETS]->(career:Career)
      -[:REQUIRES]->(target:Skill)

WHERE NOT (student)-[:KNOWS]->(target)

MATCH (student)-[:KNOWS]->(known:Skill)

MATCH path =
      (known)-[:PREREQUISITE_OF*1..5]->(target)

WITH career,
     target,
     path,
     length(path) AS pathLength

ORDER BY target.name, pathLength

WITH career,
     target,
     collect(path)[0] AS bestPath

RETURN
    career.name AS career,
    target.name AS targetSkill,
    [node IN nodes(bestPath) | node.name] AS learningPath

ORDER BY targetSkill
```

### Multi-Hop Graph Traversal

The learning-path query uses a multi-hop traversal `[:PREREQUISITE_OF*1..5]` to follow between one and five prerequisite relationships. This allows the query to find learning chains like:

```
Java → Spring Boot → REST APIs → Docker → Microservices
```

### Course-Skill Query

This query finds courses that `TEACHES` a specific skill.

```cypher
MATCH (course:Course)-[:TEACHES]->(skill:Skill)
WHERE skill.name = $skillName
RETURN course.name AS course
ORDER BY course.name
```

The query is parameterized with `$skillName`.

### Graph Explorer Query

This query retrieves relationships associated with a student for visualization.

```
Student
   │
   ├── KNOWS ──> Skill
   │
   └── TARGETS ──> Career
```

### Parameterized Queries

The backend uses the official Neo4j Java Driver and parameterized queries to prevent Cypher injection.

```java
session.run(
    query,
    Values.parameters(
        "studentId",
        studentId
    )
);
```

## Seed Data

The repository includes seed scripts for loading realistic graph data, including:
- Students
- Careers
- Skills
- Courses
- Technologies
- Topics
- Skill prerequisites
- Career requirements
- Course-to-skill relationships
- Student-to-skill relationships

## Project Structure

```
E:\learngraph
│
├── .gitignore
├── README.md
│
├── backend
│   │
│   ├── backend
│   │   ├── pom.xml
│   │   └── src
│   │       ├── main
│   │       │   ├── java/com/learngraph
│   │       │   │   ├── config
│   │       │   │   ├── controller
│   │       │   │   ├── dto
│   │       │   │   ├── repository
│   │       │   │   └── service
│   │       │   └── resources
│   │       │       ├── application.properties
│   │       │       └── db
│   │       └── test
│   │
│   └── database
│       ├── queries
│       │   ├── graph-explorer.cypher
│       │   ├── learning-path.cypher
│       │   └── skill-gap.cypher
│       ├── schema
│       │   └── constraints.cypher
│       └── seed
│           └── seed.cypher
│
└── frontend
    │
    ├── package.json
    ├── vite.config.js
    └── src
        ├── api
        ├── assets
        ├── components
        ├── context
        └── pages
```

## Environment Variables

### Backend

The backend reads CognoDB connection information from environment variables.

-   `COGNODB_URI`: `bolt+s://<instance-id>.databases.cognodb.cloud`
-   `COGNODB_USERNAME`: `cognodb`
-   `COGNODB_PASSWORD`: `<your-password>`

The Spring Boot configuration uses these variables:

```properties
cognodb.uri=${COGNODB_URI}
cognodb.username=${COGNODB_USERNAME}
cognodb.password=${COGNODB_PASSWORD}
```

### Frontend

Create a `.env` file in the `frontend` directory with:

```
VITE_API_URL=http://localhost:8080/api
```

An example file is provided as `.env.example`.

## CognoDB Setup

1.  **Create a CognoDB account** at [console.cognodb.com/signup](https://console.cognodb.com/signup).
2.  **Create an instance** (e.g., a free `c0` instance).
3.  **Save the credentials**: Bolt URI, Username (`cognodb`), and Password.
4.  **Configure environment variables** for the backend.

## Backend Setup

1.  Navigate to `cd backend/backend`.
2.  Set the CognoDB environment variables.
3.  Start the Spring Boot application:

    -   **Windows**: `.\mvnw.cmd spring-boot:run`
    -   **Linux/macOS**: `./mvnw spring-boot:run`

The backend will run on `http://localhost:8080`.

## Frontend Setup

1.  Navigate to `cd frontend`.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file with `VITE_API_URL=http://localhost:8080/api`.
4.  Start the frontend: `npm run dev`.

## API Endpoints

-   `GET /health`: Health check.
-   `GET /api/skill-gap/{studentId}`: Get skill gap for a student.
-   `GET /api/learning-path/{studentId}`: Get personalized learning path.
-   `GET /api/graph/student/{studentId}`: Get graph data for the explorer.

## Application Screens

### Dashboard
Provides a summary of the student's learning status.
*(Screenshot placeholder)*

### Skill Gap
Displays the difference between known and required skills.
*(Screenshot placeholder)*

### Learning Path
Displays prerequisite chains and recommended courses.
*(Screenshot placeholder)*

### Graph Explorer
Displays the student's graph relationships interactively.
*(Screenshot placeholder)*

## Error Handling

The frontend provides explicit states for:
-   **Loading**: Displays loading indicators.
-   **Empty**: Displays a message when no data is available.
-   **Error**: Displays a user-friendly error message.

## Security

-   Credentials are stored in environment variables.
-   `.env` files are excluded from Git.
-   Cypher queries are parameterized to prevent injection attacks.

## Wexa Assignment Requirements

| Requirement                       | Status                    |
| :-------------------------------- | :------------------------ |
| CognoDB used as database layer    | ✅ Complete               |
| Graph data model                  | ✅ Complete               |
| Labeled nodes                     | ✅ Complete               |
| Typed relationships               | ✅ Complete               |
| Relationship properties/data      | ✅ Complete               |
| Realistic seed data               | ✅ Complete               |
| Seed script included              | ✅ Complete               |
| Multi-hop traversal               | ✅ Complete               |
| Relationally awkward graph query  | ✅ Complete               |
| Parameterized Cypher              | ✅ Complete               |
| Official Neo4j driver             | ✅ Complete               |
| Functional web application        | ✅ Complete               |
| Clean UI                          | ✅ Complete               |
| Loading states                    | ✅ Complete               |
| Empty states                      | ✅ Complete               |
| Error handling                    | ✅ Complete               |
| Environment variables             | ✅ Complete               |
| Clear project structure           | ✅ Complete               |
| README                            | ✅ Complete               |
| Data-model diagram                | ✅ Complete               |
| Hosted demo                       | ⏳ Pending deployment     |
| Screenshots                       | ⏳ Pending final screenshots |
| Screen recording                  | ⏳ Pending                |
| GitHub repository                 | ⏳ Pending final push     |

## Deployment

The production architecture will be:

```
                Internet
                   │
                   ▼
        ┌─────────────────────┐
        │   React Frontend    │
        │    (Hosted Demo)    │
        └──────────┬──────────┘
                   │
                   │ HTTPS
                   ▼
        ┌─────────────────────┐
        │ Spring Boot Backend │
        │     (Hosted API)    │
        └──────────┬──────────┘
                   │
                   │ Bolt
                   ▼
        ┌─────────────────────┐
        │      CognoDB        │
        │   (Cloud Graph DB)  │
        └─────────────────────┘
```

## Future Improvements

-   Student authentication
-   Multiple career goals
-   Skill proficiency levels
-   Course completion tracking
-   AI-generated learning recommendations
-   Skill assessments and progress analytics

## Author

**Kartavya Dongre**
*B.Tech Computer Science & Engineering*
