import { LearningPlan } from '../types/learningPlan';

const API_BASE_URL = 'http://localhost:8080/api';

export const getPublicLearningPlans = async (): Promise<LearningPlan[]> => {
    const response = await fetch(`${API_BASE_URL}/learning-plans/public`);
    if (!response.ok) {
        throw new Error('Failed to fetch public learning plans');
    }
    return response.json();
};

export const searchPublicLearningPlans = async (keyword: string): Promise<LearningPlan[]> => {
    const response = await fetch(`${API_BASE_URL}/learning-plans/search?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
        throw new Error('Failed to search learning plans');
    }
    return response.json();
}; 