import { LearningPlan } from '../types/learningPlan';

export const dummyLearningPlans: LearningPlan[] = [
    {
        id: 1,
        title: "Web Development Fundamentals",
        description: "A comprehensive plan to learn web development from scratch",
        isPublic: true,
        progressPercentage: 75,
        category: "Programming",
        tags: ["HTML", "CSS", "JavaScript"],
        estimatedDuration: "3 months",
        resources: [
            {
                id: 1,
                title: "HTML Basics",
                description: "Learn the fundamentals of HTML",
                url: "https://example.com/html",
                type: "VIDEO",
                completed: true
            },
            {
                id: 2,
                title: "CSS Styling",
                description: "Master CSS styling techniques",
                url: "https://example.com/css",
                type: "ARTICLE",
                completed: true
            }
        ],
        completedResources: [1, 2],
        owner: {
            id: 1,
            username: "john_doe",
            email: "john@example.com"
        },
        createdAt: "2024-03-15T10:00:00Z",
        updatedAt: "2024-03-15T10:00:00Z"
    },
    {
        id: 2,
        title: "Machine Learning Basics",
        description: "Introduction to machine learning concepts",
        isPublic: false,
        progressPercentage: 30,
        category: "Data Science",
        tags: ["Python", "ML", "AI"],
        estimatedDuration: "6 months",
        resources: [
            {
                id: 3,
                title: "Python for ML",
                description: "Python programming for machine learning",
                url: "https://example.com/python-ml",
                type: "COURSE",
                completed: true
            }
        ],
        completedResources: [3],
        owner: {
            id: 1,
            username: "john_doe",
            email: "john@example.com"
        },
        createdAt: "2024-03-14T15:00:00Z",
        updatedAt: "2024-03-14T15:00:00Z"
    },
    {
        id: 3,
        title: "UI/UX Design Principles",
        description: "Learn modern UI/UX design principles and tools",
        isPublic: true,
        progressPercentage: 0,
        category: "Design",
        tags: ["UI", "UX", "Figma"],
        estimatedDuration: "2 months",
        resources: [],
        completedResources: [],
        owner: {
            id: 1,
            username: "john_doe",
            email: "john@example.com"
        },
        createdAt: "2024-03-13T09:00:00Z",
        updatedAt: "2024-03-13T09:00:00Z"
    }
]; 