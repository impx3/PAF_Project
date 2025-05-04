import api from '../utils/axiosConfig';
import { LearningResource } from '../types/learningPlan';

export const learningResourceService = {
    // Get all resources for a learning plan
    getPlanResources: async (planId: number): Promise<LearningResource[]> => {
        const response = await api.get(`/learning-resources/plans/${planId}`);
        return response.data;
    },

    // Get a specific resource by ID
    getResourceById: async (id: number): Promise<LearningResource> => {
        const response = await api.get(`/learning-resources/${id}`);
        return response.data;
    },

    // Create a new resource
    createResource: async (planId: number, resourceData: Omit<LearningResource, 'id' | 'completed'>): Promise<LearningResource> => {
        const response = await api.post(`/learning-resources/plans/${planId}`, resourceData);
        return response.data;
    },

    // Update an existing resource
    updateResource: async (id: number, resourceData: Partial<LearningResource>): Promise<LearningResource> => {
        const response = await api.put(`/learning-resources/${id}`, resourceData);
        return response.data;
    },

    // Delete a resource
    deleteResource: async (id: number): Promise<void> => {
        await api.delete(`/learning-resources/${id}`);
    }
}; 