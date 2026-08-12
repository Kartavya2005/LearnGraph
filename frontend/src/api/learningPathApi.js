import api from "./axios";

export const getLearningPath = async (studentId) => {
    const response = await api.get(`/learning-path/${studentId}`);
    return response.data;
};