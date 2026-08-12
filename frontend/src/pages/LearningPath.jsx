import { useEffect, useState } from "react";
import {
    ArrowDown,
    BookOpen,
    CheckCircle2,
    CircleAlert,
    RefreshCw,
    Target,
} from "lucide-react";

import { getLearningPath } from "../api/learningPathApi";
import { useStudent } from "../context/StudentContext";

export default function LearningPath() {

    const { student } = useStudent();

    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadLearningPath = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getLearningPath(student.id);

            if (response.success) {
                setPaths(response.data || []);
            } else {
                setError(
                    "Unable to generate your learning path."
                );
            }

        } catch (err) {

            console.error("Learning path error:", err);

            setError(
                "Unable to connect to the learning graph. Please make sure the backend is running."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadLearningPath();
    }, [student.id]);


    /*
     * Remove duplicate target skills if the backend ever returns
     * multiple paths for the same target.
     */
    const uniquePaths = paths.filter(
        (path, index, array) =>
            index ===
            array.findIndex(
                (item) =>
                    item.targetSkill === path.targetSkill
            )
    );


    const career =
        uniquePaths.length > 0
            ? uniquePaths[0].career
            : "Target career";


    return (
        <div className="space-y-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-indigo-600">
                        Personalized Learning Path
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Learn in the right order
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                        Follow prerequisite relationships from the skills
                        you already know to the skills required for your
                        target career.
                    </p>

                </div>


                <button
                    onClick={loadLearningPath}
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
                            <CircleAlert size={18} />
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-red-800">
                                Unable to generate learning path
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                CAREER SUMMARY
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Target size={21} />
                        </div>

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Target career
                            </p>

                            <h3 className="mt-1 text-xl font-semibold text-slate-900">
                                {career}
                            </h3>

                        </div>

                    </div>


                    <div className="rounded-lg bg-slate-50 px-4 py-3">

                        <p className="text-xs text-slate-400">
                            Learning paths
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                            {loading
                                ? "—"
                                : uniquePaths.length}
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="space-y-6">

                    <LoadingPathCard />
                    <LoadingPathCard />

                </div>

            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!loading && !error && uniquePaths.length === 0 && (

                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <BookOpen size={25} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                        No learning path found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        We couldn't find a prerequisite chain from the
                        student's current skills to the required career
                        skills.
                    </p>

                </div>

            )}


            {/* =================================================
                LEARNING PATHS
            ================================================= */}

            {!loading && !error && uniquePaths.length > 0 && (

                <div className="space-y-6">

                    {uniquePaths.map((path) => (

                        <LearningPathCard
                            key={path.targetSkill}
                            path={path}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}


// =============================================================
// LEARNING PATH CARD
// =============================================================

function LearningPathCard({ path }) {

    const learningPath =
        path.learningPath || [];

    const courses =
        path.recommendedCourses || [];


    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div className="border-b border-slate-100 p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Target skill
                        </p>

                        <h3 className="mt-1 text-xl font-semibold text-slate-900">
                            {path.targetSkill}
                        </h3>

                    </div>


                    <div className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                        {path.career}
                    </div>

                </div>

            </div>


            {/* =================================================
                PATH
            ================================================= */}

            <div className="p-6 md:p-7">

                <div className="flex items-center gap-2">

                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                        <Target size={17} />
                    </div>

                    <div>

                        <h4 className="text-sm font-semibold text-slate-900">
                            Prerequisite path
                        </h4>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Follow these skills in sequence
                        </p>

                    </div>

                </div>


                {/* =================================================
                    PATH NODES
                ================================================= */}

                <div className="mt-6">

                    {learningPath.length === 0 ? (

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
                            No prerequisite path available.
                        </div>

                    ) : (

                        <div className="flex flex-col">

                            {learningPath.map(
                                (skill, index) => {

                                    const isFirst =
                                        index === 0;

                                    const isLast =
                                        index ===
                                        learningPath.length - 1;

                                    return (
                                        <div
                                            key={`${skill}-${index}`}
                                        >

                                            {/* Node */}

                                            <div
                                                className={`relative flex items-center gap-4 rounded-xl border p-4 ${
                                                    isLast
                                                        ? "border-indigo-200 bg-indigo-50"
                                                        : "border-slate-200 bg-white"
                                                }`}
                                            >

                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                        isLast
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-emerald-50 text-emerald-600"
                                                    }`}
                                                >

                                                    {isLast ? (
                                                        <Target
                                                            size={18}
                                                        />
                                                    ) : (
                                                        <CheckCircle2
                                                            size={18}
                                                        />
                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <p
                                                        className={`text-sm font-semibold ${
                                                            isLast
                                                                ? "text-indigo-900"
                                                                : "text-slate-800"
                                                        }`}
                                                    >
                                                        {skill}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">

                                                        {isFirst
                                                            ? "Starting point"
                                                            : isLast
                                                                ? "Target skill"
                                                                : "Prerequisite"}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Connector */}

                                            {!isLast && (

                                                <div className="flex h-9 items-center justify-center">

                                                    <ArrowDown
                                                        size={17}
                                                        className="text-slate-300"
                                                    />

                                                </div>

                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    RECOMMENDED COURSES
                ================================================= */}

                <div className="mt-8 border-t border-slate-100 pt-6">

                    <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <BookOpen size={17} />
                        </div>

                        <div>

                            <h4 className="text-sm font-semibold text-slate-900">
                                Recommended courses
                            </h4>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Courses connected to the target skill
                            </p>

                        </div>

                    </div>


                    {courses.length > 0 ? (

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">

                            {courses.map((course) => (

                                <div
                                    key={course}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
                                >

                                    <div className="flex items-start gap-3">

                                        <div className="mt-0.5 rounded-lg bg-white p-2 text-indigo-600 shadow-sm">
                                            <BookOpen size={15} />
                                        </div>

                                        <div>

                                            <p className="text-sm font-semibold text-slate-800">
                                                {course}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                                Recommended for{" "}
                                                {path.targetSkill}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="mt-4 rounded-xl bg-slate-50 p-4">

                            <p className="text-sm text-slate-400">
                                No recommended courses available for
                                this skill.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
}


// =============================================================
// LOADING CARD
// =============================================================

function LoadingPathCard() {

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />

            <div className="mt-6 space-y-3">

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

                <div className="mx-auto h-5 w-5 animate-pulse rounded-full bg-slate-100" />

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

                <div className="mx-auto h-5 w-5 animate-pulse rounded-full bg-slate-100" />

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

            </div>

        </div>
    );
}