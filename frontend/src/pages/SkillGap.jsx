import { useEffect, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    CircleAlert,
    RefreshCw,
    Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getSkillGap } from "../api/skillGapApi";
import { useStudent } from "../context/StudentContext";

export default function SkillGap() {

    const navigate = useNavigate();
    const { student } = useStudent();

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadSkills = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getSkillGap(student.id);

            if (response.success) {
                setSkills(response.data || []);
            } else {
                setError("Unable to load your skill gap.");
            }

        } catch (err) {

            console.error("Skill gap error:", err);

            setError(
                "Unable to connect to the learning graph. Please make sure the backend is running."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadSkills();
    }, [student.id]);


    const knownSkills = skills.filter(
        (skill) => skill.alreadyKnown
    );

    const missingSkills = skills.filter(
        (skill) => !skill.alreadyKnown
    );

    const totalSkills = skills.length;

    const readiness =
        totalSkills > 0
            ? Math.round(
                (knownSkills.length / totalSkills) * 100
            )
            : 0;

    const career =
        skills.length > 0
            ? skills[0].career
            : "Target career";


    return (
        <div className="space-y-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-indigo-600">
                        Skill Gap Analysis
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Understand what to learn next
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                        Compare your current skills with the requirements
                        of your target career and identify the most
                        important skills to develop.
                    </p>

                </div>


                <button
                    onClick={loadSkills}
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
                                Unable to load skill gap
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

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

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

                        <p className="mt-4 text-sm text-slate-500">
                            Learning profile for{" "}
                            <span className="font-medium text-slate-700">
                                {student.name}
                            </span>
                        </p>

                    </div>


                    {/* Readiness */}
                    <div className="lg:w-80">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-700">
                                    Career readiness
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Required skill coverage
                                </p>

                            </div>

                            <p className="text-2xl font-bold text-slate-900">
                                {loading
                                    ? "—"
                                    : `${readiness}%`}
                            </p>

                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                style={{
                                    width: `${readiness}%`,
                                }}
                            />

                        </div>

                        <p className="mt-2 text-xs text-slate-400">
                            {loading
                                ? "Analyzing skills..."
                                : `${knownSkills.length} of ${totalSkills} required skills known`}
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-3">

                <SummaryCard
                    label="Required skills"
                    value={loading ? "—" : totalSkills}
                    description="Skills required for the career"
                />

                <SummaryCard
                    label="Already known"
                    value={loading ? "—" : knownSkills.length}
                    description="Skills in your profile"
                    positive
                />

                <SummaryCard
                    label="Skills to learn"
                    value={loading ? "—" : missingSkills.length}
                    description="Skills you should develop"
                />

            </div>


            {/* =================================================
                SKILL LISTS
            ================================================= */}

            {loading ? (

                <div className="grid gap-6 lg:grid-cols-2">

                    <LoadingSection />
                    <LoadingSection />

                </div>

            ) : (

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Known Skills */}

                    <SkillSection
                        title="Skills you already know"
                        description="Skills already connected to your student profile."
                        skills={knownSkills}
                        known
                    />


                    {/* Missing Skills */}

                    <SkillSection
                        title="Skills to learn"
                        description="Skills required by your target career that are not yet known."
                        skills={missingSkills}
                    />

                </div>

            )}


            {/* =================================================
                LEARNING PATH CTA
            ================================================= */}

            {!loading && missingSkills.length > 0 && (

                <div className="overflow-hidden rounded-2xl bg-indigo-600 text-white">

                    <div className="p-6 md:p-8">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="rounded-lg bg-white/10 p-2">
                                        <Target size={18} />
                                    </div>

                                    <p className="text-sm font-semibold text-indigo-100">
                                        Personalized next step
                                    </p>

                                </div>

                                <h3 className="mt-4 text-xl font-semibold md:text-2xl">
                                    Turn your skill gap into a learning path
                                </h3>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                                    LearnGraph uses prerequisite relationships
                                    to find a path from the skills you already
                                    know to the skills required for your career.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/learning-path")
                                }
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                            >
                                View learning path
                                <ArrowRight size={17} />
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


// =============================================================
// SUMMARY CARD
// =============================================================

function SummaryCard({
                         label,
                         value,
                         description,
                         positive = false,
                     }) {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <p className="text-sm font-medium text-slate-500">
                    {label}
                </p>

                <div
                    className={`h-2.5 w-2.5 rounded-full ${
                        positive
                            ? "bg-emerald-500"
                            : "bg-indigo-500"
                    }`}
                />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                {description}
            </p>

        </div>
    );
}


// =============================================================
// SKILL SECTION
// =============================================================

function SkillSection({
                          title,
                          description,
                          skills,
                          known = false,
                      }) {

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Section Header */}

            <div className="border-b border-slate-100 p-6">

                <div className="flex items-start gap-3">

                    <div
                        className={`rounded-lg p-2 ${
                            known
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                        }`}
                    >

                        {known ? (
                            <CheckCircle2 size={19} />
                        ) : (
                            <CircleAlert size={19} />
                        )}

                    </div>

                    <div>

                        <h3 className="font-semibold text-slate-900">
                            {title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {description}
                        </p>

                    </div>

                </div>

            </div>


            {/* Skills */}

            <div className="p-5">

                {skills.length === 0 ? (

                    <div className="py-8 text-center">

                        <p className="text-sm font-medium text-slate-700">
                            {known
                                ? "No known skills found"
                                : "No skill gaps found"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            {known
                                ? "No skills have been added to this profile."
                                : "This student currently meets all required skills."}
                        </p>

                    </div>

                ) : (

                    <div className="space-y-3">

                        {skills.map((skill) => (

                            <div
                                key={skill.skillId}
                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"
                            >

                                <div className="flex min-w-0 items-center gap-3">

                                    {known ? (

                                        <CheckCircle2
                                            size={18}
                                            className="shrink-0 text-emerald-500"
                                        />

                                    ) : (

                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />

                                    )}

                                    <div className="min-w-0">

                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {skill.skill}
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            {skill.skillId}
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                        known
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}
                                >
                                    {known
                                        ? "Known"
                                        : "Learn"}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
}


// =============================================================
// LOADING SECTION
// =============================================================

function LoadingSection() {

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />

            <div className="mt-6 space-y-3">

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

                <div className="h-14 animate-pulse rounded-xl bg-slate-100" />

            </div>

        </div>
    );
}