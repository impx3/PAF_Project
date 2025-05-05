import api from '../utils/axiosConfig';
import { LearningPlan, LearningPlanFormData } from '../types/learningPlan';

export const learningPlanService = {
    // Get all learning plans for the current user
    getUserLearningPlans: async (): Promise<LearningPlan[]> => {
        const response = await api.get('/learning-plans/me');
        return response.data;
    },

    // Get all public learning plans
    getPublicLearningPlans: async (): Promise<LearningPlan[]> => {
        const response = await api.get('/learning-plans/public');
        return response.data;
    },

    // Get a specific learning plan by ID
    getLearningPlanById: async (id: number): Promise<LearningPlan> => {
        const response = await api.get(`/learning-plans/${id}`);
        return response.data;
    },

    // Get a public learning plan by ID
    getPublicLearningPlanById: async (id: number): Promise<LearningPlan> => {
        const response = await api.get(`/learning-plans/public/${id}`);
        return response.data;
    },

    // Create a new learning plan
    createLearningPlan: async (planData: LearningPlanFormData): Promise<LearningPlan> => {
        const response = await api.post('/learning-plans', planData);
        return response.data;
    },

    // Update an existing learning plan
    updateLearningPlan: async (id: number, planData: LearningPlanFormData): Promise<LearningPlan> => {
        const response = await api.put(`/learning-plans/${id}`, planData);
        return response.data;
    },

    // Delete a learning plan
    deleteLearningPlan: async (id: number): Promise<void> => {
        await api.delete(`/learning-plans/${id}`);
    },

    // Search public learning plans
    searchPublicLearningPlans: async (keyword: string): Promise<LearningPlan[]> => {
        const response = await api.get(`/learning-plans/search?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    },

    // Mark a resource as completed or not completed
    updateResourceCompletion: async (planId: number, resourceId: number, completed: boolean): Promise<LearningPlan> => {
        const response = await api.post(
            `/learning-plans/${planId}/resources/${resourceId}/complete?completed=${completed}`
        );
        return response.data;
    }
}; 