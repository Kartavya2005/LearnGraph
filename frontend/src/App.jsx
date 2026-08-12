import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SkillGap from "./pages/SkillGap";
import LearningPath from "./pages/LearningPath";
import GraphExplorer from "./pages/GraphExplorer";

import { StudentProvider } from "./context/StudentContext";

function App() {
    return (
        <StudentProvider>

            <BrowserRouter>

                <Routes>

                    <Route element={<Layout />}>

                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/skill-gap"
                            element={<SkillGap />}
                        />

                        <Route
                            path="/learning-path"
                            element={<LearningPath />}
                        />

                        <Route
                            path="/graph"
                            element={<GraphExplorer />}
                        />

                    </Route>

                </Routes>

            </BrowserRouter>

        </StudentProvider>
    );
}

export default App;