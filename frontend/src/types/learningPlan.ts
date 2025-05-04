import { ResourceType } from './resourceType';

export interface LearningPlan {
    id: number;
    title: string;
    description?: string;
    category?: string;
    estimatedDuration?: string;
    isPublic?: boolean;
    tags?: string[];
    progressPercentage: number;
    createdAt: string;
    updatedAt: string;
    resources: LearningResource[];
    completedResources: number[];
    owner: {
        id: number;
        username: string;
        email: string;
    };
}

export interface LearningResource {
    id: number;
    title: string;
    description: string;
    url: string;
    type: ResourceType;
    completed: boolean;
}

export interface LearningPlanFormData {
    title: string;
    description: string;
    category: string;
    estimatedDuration: string;
    isPublic: boolean;
    tags: string[];
} 