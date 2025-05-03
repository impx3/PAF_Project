export interface LearningPlan {
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
    progressPercentage: number;
    resources: LearningResource[];
    completedResources: number[];
    owner: {
        id: number;
        username: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface LearningResource {
    id: number;
    title: string;
    description: string;
    url: string;
    type: string;
    completed: boolean;
} 