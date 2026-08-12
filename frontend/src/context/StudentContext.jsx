import { createContext, useContext, useState } from "react";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {

    const [student, setStudent] = useState({
        id: "student-001",
        name: "Aarav Sharma",
        email: "aarav@example.com",
    });

    return (
        <StudentContext.Provider
            value={{
                student,
                setStudent,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
}

export function useStudent() {
    return useContext(StudentContext);
}