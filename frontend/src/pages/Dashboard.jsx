import { useEffect, useState } from "react";
import {
    ArrowRight,
    BookOpen,
    Target,
    TrendingUp,
    User,
    BriefcaseBusiness,
    CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getSkillGap } from "../api/skillGapApi";
import { useStudent } from "../context/StudentContext";

export default function Dashboard() {

    const navigate = useNavigate();
    const { student } = useStudent();

    const [loading, setLoading] = useState(true);
    const [skillGap, setSkillGap] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getSkillGap(student.id);

                if (response.success) {
                    setSkillGap(response.data || []);
                } else {
                    setError(
                        "Unable to load your learning data."
                    );
                }

            } catch (err) {

                console.error("Dashboard error:", err);

                setError(
                    "Unable to connect to the learning graph. Please make sure the backend is running."
                );

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();

    }, [student.id]);


    // ---------------------------------------------------------
    // CALCULATIONS
    // ---------------------------------------------------------

    const knownSkills = skillGap.filter(
        (skill) => skill.alreadyKnown
    );

    const missingSkills = skillGap.filter(
        (skill) => !skill.alreadyKnown
    );

    const totalSkills = skillGap.length;

    const readiness =
        totalSkills > 0
            ? Math.round(
                (knownSkills.length / totalSkills) * 100
            )
            : 0;

    const career =
        skillGap.length > 0
            ? skillGap[0].career
            : "Target career";


    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------

    return (
        <div className="space-y-8">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div>

                <p className="text-sm font-semibold text-indigo-600">
                    Learning Dashboard
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    Build your path to your career
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                    Understand your current skills, discover what's
                    missing, and follow a personalized learning path
                    powered by graph relationships.
                </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                        <div className="mt-0.5 rounded-lg bg-red-100 p-2 text-red-600">
                            <Target size={18} />
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-red-800">
                                Unable to load dashboard
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>

                        </div>

                    </div>

                </div>
            )}


            {/* =================================================
                PROFILE / CAREER CARD
            ================================================= */}

            <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm">

                <div className="p-6 md:p-8">

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                        {/* Student Information */}

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                    <User size={21} />
                                </div>

                                <div>

                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                        Current student
                                    </p>

                                    <h3 className="mt-1 text-xl font-semibold">
                                        {student.name}
                                    </h3>

                                </div>

                            </div>


                            <div className="mt-7">

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Target career
                                </p>

                                <div className="mt-2 flex items-center gap-2">

                                    <BriefcaseBusiness
                                        size={18}
                                        className="text-indigo-400"
                                    />

                                    <p className="text-lg font-semibold">
                                        {career}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Readiness */}

                        <div className="rounded-2xl bg-white/10 p-5 lg:w-80">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-300">
                                        Skill readiness
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Career requirement coverage
                                    </p>

                                </div>

                                <p className="text-3xl font-bold">
                                    {loading
                                        ? "—"
                                        : `${readiness}%`}
                                </p>

                            </div>


                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                                <div
                                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                    style={{
                                        width: `${readiness}%`,
                                    }}
                                />

                            </div>


                            <p className="mt-3 text-xs text-slate-400">

                                {loading
                                    ? "Analyzing your skills..."
                                    : `${knownSkills.length} of ${totalSkills} required skills known`}

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-3">

                <StatCard
                    icon={Target}
                    label="Required skills"
                    value={loading ? "—" : totalSkills}
                    description="Skills required for your career"
                />

                <StatCard
                    icon={CheckCircle2}
                    label="Skills you know"
                    value={loading ? "—" : knownSkills.length}
                    description="Skills already in your profile"
                />

                <StatCard
                    icon={BookOpen}
                    label="Skills to learn"
                    value={loading ? "—" : missingSkills.length}
                    description="Skills recommended for you"
                />

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div>

                <div className="mb-4">

                    <h3 className="text-lg font-semibold text-slate-900">
                        Continue learning
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Explore your skills and discover what to learn next.
                    </p>

                </div>


                <div className="grid gap-5 md:grid-cols-2">

                    <ActionCard
                        icon={Target}
                        title="Explore your skill gap"
                        description="See which skills you already know and which skills you need to develop for your target career."
                        button="View skill gap"
                        onClick={() => navigate("/skill-gap")}
                    />

                    <ActionCard
                        icon={BookOpen}
                        title="Follow your learning path"
                        description="Follow prerequisite relationships from your existing skills to the skills required for your career."
                        button="View learning path"
                        onClick={() => navigate("/learning-path")}
                    />

                </div>

            </div>


            {/* =================================================
                GRAPH DATABASE INFO
            ================================================= */}

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 md:p-7">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <div className="rounded-lg bg-white p-2 text-indigo-600 shadow-sm">
                                <TrendingUp size={18} />
                            </div>

                            <h3 className="font-semibold text-indigo-950">
                                Powered by connected learning data
                            </h3>

                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-800/70">
                            LearnGraph uses relationships between students,
                            skills, careers, prerequisites, and courses to
                            generate personalized learning paths.
                        </p>

                    </div>


                    <button
                        onClick={() => navigate("/graph")}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
                    >
                        Explore graph
                        <ArrowRight size={16} />
                    </button>

                </div>

            </div>

        </div>
    );
}


// =============================================================
// STAT CARD
// =============================================================

function StatCard({
                      icon: Icon,
                      label,
                      value,
                      description,
                  }) {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon size={20} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                    {value}
                </span>

            </div>

            <p className="mt-4 text-sm font-medium text-slate-800">
                {label}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
                {description}
            </p>

        </div>
    );
}


// =============================================================
// ACTION CARD
// =============================================================

function ActionCard({
                        icon: Icon,
                        title,
                        description,
                        button,
                        onClick,
                    }) {

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon size={20} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
            </p>

            <button
                onClick={onClick}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
                {button}
                <ArrowRight size={16} />
            </button>

        </div>
    );
}