import { useEffect, useMemo, useState } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Handle,
    Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
    Network,
    RefreshCw,
    User,
    Target,
    CircleDot,
    AlertCircle,
} from "lucide-react";

import { getStudentGraph } from "../api/graphApi";
import { useStudent } from "../context/StudentContext";


// =============================================================
// CUSTOM STUDENT NODE
// =============================================================

function StudentNode({ data }) {

    return (
        <div className="min-w-[190px] rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-5 py-4 text-center shadow-md">

            <Handle
                type="source"
                position={Position.Bottom}
                className="!h-2 !w-2 !border-0 !bg-indigo-500"
            />

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <User size={20} />
            </div>

            <p className="mt-3 text-sm font-semibold text-indigo-950">
                {data.label}
            </p>

            <p className="mt-1 text-xs text-indigo-500">
                Student
            </p>

        </div>
    );
}


// =============================================================
// CUSTOM SKILL NODE
// =============================================================

function SkillNode({ data }) {

    return (
        <div className="min-w-[155px] rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-center shadow-md">

            <Handle
                type="target"
                position={Position.Top}
                className="!h-2 !w-2 !border-0 !bg-emerald-500"
            />

            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CircleDot size={18} />
            </div>

            <p className="mt-3 text-sm font-semibold text-emerald-950">
                {data.label}
            </p>

            <p className="mt-1 text-xs text-emerald-500">
                Skill
            </p>

        </div>
    );
}


// =============================================================
// CUSTOM CAREER NODE
// =============================================================

function CareerNode({ data }) {

    return (
        <div className="min-w-[220px] rounded-2xl border-2 border-purple-200 bg-purple-50 px-5 py-4 text-center shadow-md">

            <Handle
                type="target"
                position={Position.Top}
                className="!h-2 !w-2 !border-0 !bg-purple-500"
            />

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Target size={20} />
            </div>

            <p className="mt-3 text-sm font-semibold text-purple-950">
                {data.label}
            </p>

            <p className="mt-1 text-xs text-purple-500">
                Career
            </p>

        </div>
    );
}


const nodeTypes = {
    student: StudentNode,
    skill: SkillNode,
    career: CareerNode,
};


// =============================================================
// MAIN COMPONENT
// =============================================================

export default function GraphExplorer() {

    const { student } = useStudent();

    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD GRAPH
    // =========================================================

    const loadGraph = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getStudentGraph(student.id);

            if (response.success) {

                setRelationships(
                    response.data || []
                );

            } else {

                setError(
                    "Unable to load graph relationships."
                );

            }

        } catch (err) {

            console.error(
                "Graph explorer error:",
                err
            );

            setError(
                "Unable to connect to the graph database. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadGraph();

    }, [student.id]);


    // =========================================================
    // CREATE REACT FLOW GRAPH
    // =========================================================

    const { nodes, edges } = useMemo(() => {

        if (!relationships.length) {

            return {
                nodes: [],
                edges: [],
            };

        }


        // -----------------------------------------------------
        // Student
        // -----------------------------------------------------

        const studentName =
            relationships[0]?.source ||
            student.name;


        const studentNode = {
            id: "student",
            type: "student",

            position: {
                x: 450,
                y: 40,
            },

            data: {
                label: studentName,
            },
        };


        // -----------------------------------------------------
        // Skills
        // -----------------------------------------------------

        const skillRelationships =
            relationships.filter(
                (item) =>
                    item.relationship === "KNOWS"
            );


        const skillNodes =
            skillRelationships.map(
                (item, index) => {

                    return {
                        id: `skill-${index}`,

                        type: "skill",

                        position: {
                            x:
                                60 +
                                index * 190,

                            y: 300,
                        },

                        data: {
                            label: item.target,
                        },
                    };

                }
            );


        // -----------------------------------------------------
        // Career
        // -----------------------------------------------------

        const careerRelationship =
            relationships.find(
                (item) =>
                    item.relationship ===
                    "TARGETS"
            );


        const careerNodes =
            careerRelationship
                ? [
                    {
                        id: "career",

                        type: "career",

                        position: {
                            x: 420,
                            y: 540,
                        },

                        data: {
                            label:
                            careerRelationship.target,
                        },
                    },
                ]
                : [];


        // -----------------------------------------------------
        // Student → Skills
        // -----------------------------------------------------

        const skillEdges =
            skillRelationships.map(
                (item, index) => {

                    return {
                        id: `knows-${index}`,

                        source: "student",

                        target: `skill-${index}`,

                        label: "KNOWS",

                        type: "smoothstep",

                        animated: true,

                        style: {
                            strokeWidth: 2,
                        },

                        labelStyle: {
                            fontSize: 11,
                            fontWeight: 600,
                        },

                        labelBgStyle: {
                            fill: "white",
                        },
                    };

                }
            );


        // -----------------------------------------------------
        // Student → Career
        // -----------------------------------------------------

        const careerEdges =
            careerRelationship
                ? [
                    {
                        id: "targets-career",

                        source: "student",

                        target: "career",

                        label: "TARGETS",

                        type: "smoothstep",

                        animated: true,

                        style: {
                            strokeWidth: 2,
                        },

                        labelStyle: {
                            fontSize: 11,
                            fontWeight: 600,
                        },

                        labelBgStyle: {
                            fill: "white",
                        },
                    },
                ]
                : [];


        return {

            nodes: [
                studentNode,
                ...skillNodes,
                ...careerNodes,
            ],

            edges: [
                ...skillEdges,
                ...careerEdges,
            ],

        };

    }, [relationships, student.name]);


    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="space-y-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-indigo-600">
                        Graph Explorer
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Explore your learning graph
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                        Explore how your skills and career goal are
                        connected through relationships stored in
                        CognoDB.
                    </p>

                </div>


                <button
                    onClick={loadGraph}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <RefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                        <div className="rounded-lg bg-red-100 p-2 text-red-600">
                            <AlertCircle size={18} />
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-red-800">
                                Graph unavailable
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                GRAPH CARD
            ================================================= */}

            {!error && (

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Graph Header */}

                    <div className="border-b border-slate-100 px-6 py-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Network size={19} />
                                </div>

                                <div>

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Student relationship graph
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Drag nodes, zoom, and explore
                                        relationships.
                                    </p>

                                </div>

                            </div>


                            {/* Legend */}

                            <div className="flex flex-wrap gap-2">

                                <Legend
                                    label="Student"
                                    className="bg-indigo-50 text-indigo-700"
                                />

                                <Legend
                                    label="Skill"
                                    className="bg-emerald-50 text-emerald-700"
                                />

                                <Legend
                                    label="Career"
                                    className="bg-purple-50 text-purple-700"
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        GRAPH CANVAS
                    ================================================= */}

                    <div className="h-[620px]">

                        {loading ? (

                            <div className="flex h-full items-center justify-center">

                                <div className="text-center">

                                    <Network
                                        size={42}
                                        className="mx-auto animate-pulse text-indigo-500"
                                    />

                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                        Loading graph...
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Fetching relationships from CognoDB
                                    </p>

                                </div>

                            </div>

                        ) : nodes.length === 0 ? (

                            <div className="flex h-full items-center justify-center">

                                <div className="text-center">

                                    <Network
                                        size={40}
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                        No graph data found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        This student does not have any
                                        graph relationships yet.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                nodeTypes={nodeTypes}
                                fitView
                                fitViewOptions={{
                                    padding: 0.25,
                                }}
                                attributionPosition="bottom-left"
                            >

                                <Background
                                    gap={20}
                                    size={1}
                                />

                                <Controls />

                                <MiniMap
                                    pannable
                                    zoomable
                                />

                            </ReactFlow>

                        )}

                    </div>

                </div>

            )}


            {/* =================================================
                RELATIONSHIP DETAILS
            ================================================= */}

            {!loading &&
                !error &&
                relationships.length > 0 && (

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 p-6">

                            <div className="flex items-center gap-3">

                                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                    <Network size={18} />
                                </div>

                                <div>

                                    <h3 className="font-semibold text-slate-900">
                                        Graph relationships
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Relationships returned directly
                                        from CognoDB.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="divide-y divide-slate-100">

                            {relationships.map(
                                (relationship, index) => (

                                    <RelationshipRow
                                        key={`${relationship.relationship}-${relationship.target}-${index}`}
                                        relationship={
                                            relationship
                                        }
                                    />

                                )
                            )}

                        </div>

                    </div>

                )}

        </div>
    );
}


// =============================================================
// LEGEND
// =============================================================

function Legend({
                    label,
                    className,
                }) {

    return (
        <div
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            {label}
        </div>
    );
}


// =============================================================
// RELATIONSHIP ROW
// =============================================================

function RelationshipRow({
                             relationship,
                         }) {

    return (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-wrap items-center gap-2">

                <span className="font-medium text-slate-800">
                    {relationship.source}
                </span>

                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                    {relationship.relationship}
                </span>

                <span className="text-slate-400">
                    →
                </span>

                <span className="font-medium text-slate-700">
                    {relationship.target}
                </span>

            </div>


            <div className="text-xs text-slate-400">

                {relationship.sourceType}

                <span className="mx-1">
                    →
                </span>

                {relationship.targetType}

            </div>

        </div>
    );
}