import {
    LayoutDashboard,
    Target,
    Route,
    Network,
    GraduationCap,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useStudent } from "../context/StudentContext";
import { getStudents } from "../api/studentApi";

const navigation = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Skill Gap",
        path: "/skill-gap",
        icon: Target,
    },
    {
        name: "Learning Path",
        path: "/learning-path",
        icon: Route,
    },
    {
        name: "Graph Explorer",
        path: "/graph",
        icon: Network,
    },
];

export default function Layout() {

    const { student, setStudent } = useStudent();

    const students = getStudents();

    const handleStudentChange = (event) => {

        const selectedStudent = students.find(
            (item) => item.id === event.target.value
        );

        if (selectedStudent) {
            setStudent(selectedStudent);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            <div className="flex min-h-screen">

                {/* =====================================================
                    DESKTOP SIDEBAR
                ====================================================== */}

                <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">

                    {/* Logo */}
                    <div className="border-b border-slate-200 px-6 py-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <GraduationCap size={22} />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold tracking-tight">
                                    Learn<span className="text-indigo-600">
                                        Graph
                                    </span>
                                </h1>

                                <p className="text-[11px] text-slate-400">
                                    Career learning intelligence
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Student Selector */}
                    <div className="border-b border-slate-200 p-4">

                        <label
                            htmlFor="student"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                        >
                            Current student
                        </label>

                        <select
                            id="student"
                            value={student.id}
                            onChange={handleStudentChange}
                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            {students.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">

                        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Workspace
                        </p>

                        {navigation.map((item) => {

                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`
                                    }
                                >

                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={19}
                                                className={
                                                    isActive
                                                        ? "text-indigo-600"
                                                        : "text-slate-400 group-hover:text-slate-600"
                                                }
                                            />

                                            <span>
                                                {item.name}
                                            </span>
                                        </>
                                    )}

                                </NavLink>
                            );
                        })}

                    </nav>


                    {/* Bottom Information */}
                    <div className="border-t border-slate-200 p-4">

                        <div className="rounded-xl bg-slate-50 p-4">

                            <div className="flex items-center gap-2">

                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                    <Network size={15} />
                                </div>

                                <p className="text-xs font-semibold text-slate-700">
                                    Graph-powered
                                </p>

                            </div>

                            <p className="mt-2 text-[11px] leading-5 text-slate-500">
                                Learning paths are generated from connected
                                skills, careers and prerequisites.
                            </p>

                        </div>

                        <p className="mt-4 text-center text-[10px] text-slate-400">
                            Powered by CognoDB
                        </p>

                    </div>

                </aside>


                {/* =====================================================
                    MAIN CONTENT
                ====================================================== */}

                <main className="min-w-0 flex-1">

                    {/* Mobile Header */}
                    <header className="border-b border-slate-200 bg-white md:hidden">

                        <div className="flex items-center justify-between px-5 py-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                    <GraduationCap size={19} />
                                </div>

                                <h1 className="text-lg font-bold">
                                    Learn<span className="text-indigo-600">
                                        Graph
                                    </span>
                                </h1>

                            </div>

                        </div>


                        {/* Mobile Student Selector */}
                        <div className="border-t border-slate-100 px-5 py-3">

                            <select
                                value={student.id}
                                onChange={handleStudentChange}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
                            >

                                {students.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* Mobile Navigation */}
                        <div className="overflow-x-auto border-t border-slate-100">

                            <nav className="flex min-w-max gap-1 px-4 py-2">

                                {navigation.map((item) => {

                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                                                    isActive
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : "text-slate-500"
                                                }`
                                            }
                                        >
                                            <Icon size={15} />
                                            {item.name}
                                        </NavLink>
                                    );

                                })}

                            </nav>

                        </div>

                    </header>


                    {/* Page Content */}
                    <div className="mx-auto w-full max-w-7xl p-5 md:p-8 lg:p-10">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
}