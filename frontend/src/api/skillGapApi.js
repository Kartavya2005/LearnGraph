import api from "./axios";

export const getSkillGap = async (studentId) => {
    const response = await api.get(`/skill-gap/${studentId}`);
    return response.data;
};