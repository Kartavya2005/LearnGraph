import api from "./axios";

export const getStudentGraph = async (studentId) => {
    const response = await api.get(`/graph/student/${studentId}`);
    return response.data;
};