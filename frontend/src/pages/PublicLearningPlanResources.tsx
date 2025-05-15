import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LearningResource } from '../types/learningPlan';
import { learningResourceService } from '../services/learningResourceService';
import { FaBook } from 'react-icons/fa';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { ResourceType } from '../types/resourceType';

const PublicLearningPlanResources: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const [resources, setResources] = useState<LearningResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (planId) {
            fetchResources();
        }
    }, [planId]);

    const fetchResources = async () => {
        try {
            setIsLoading(true);
            const resourcesData = await learningResourceService.getPublicPlanResources(Number(planId));
            setResources(resourcesData);
        } catch (err) {
            toast.error('Failed to fetch learning resources');
        } finally {
            setIsLoading(false);
        }
    };

    const getResourceTypeIcon = (type: ResourceType) => {
        switch (type) {
            case ResourceType.VIDEO:
                return '🎥';
            case ResourceType.ARTICLE:
                return '📄';
            case ResourceType.COURSE:
                return '👨‍🏫';
            case ResourceType.BOOK:
                return '📚';
            case ResourceType.POST:
                return '📝';
            default:
                return '📌';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Resources Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Resources</h2>
                    {resources.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 text-lg">No resources available in this learning plan</p>
                        </div>
                    ) : (
                        resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl" role="img" aria-label={resource.type}>
                                            {getResourceTypeIcon(resource.type)}
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {resource.title}
                                            </h3>
                                            <p className="text-gray-500">{resource.type}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        View Resource
                                    </a>
                                </div>
                                {resource.description && (
                                    <p className="mt-4 text-gray-600">{resource.description}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicLearningPlanResources; 