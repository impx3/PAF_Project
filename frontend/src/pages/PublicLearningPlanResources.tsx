import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LearningPlan, LearningResource } from '../types/learningPlan';
import { learningPlanService } from '../services/learningPlanService';
import { learningResourceService } from '../services/learningResourceService';
import { FaBook, FaLock, FaLockOpen, FaClock, FaTag } from 'react-icons/fa';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { ResourceType } from '../types/resourceType';

const PublicLearningPlanResources: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const [plan, setPlan] = useState<LearningPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (planId) {
            fetchPlanDetails();
        }
    }, [planId]);

    const fetchPlanDetails = async () => {
        try {
            setIsLoading(true);
            const data = await learningPlanService.getPublicLearningPlanById(Number(planId));
            setPlan(data);
        } catch (err) {
            toast.error('Failed to fetch learning plan details');
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

    if (!plan) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <FaBook className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Learning Plan Not Found</h2>
                        <p className="text-gray-500">This learning plan might have been removed or made private.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FaBook className="text-3xl text-blue-500 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                                <FaClock className="mr-2" />
                                <span>{plan.estimatedDuration}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <FaTag className="mr-2" />
                                <span>{plan.category}</span>
                            </div>
                            {plan.isPublic ? (
                                <div className="flex items-center text-green-500">
                                    <FaLockOpen className="mr-2" />
                                    <span>Public</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-gray-500">
                                    <FaLock className="mr-2" />
                                    <span>Private</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg">{plan.description}</p>
                    {plan.tags && plan.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {plan.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resources Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Resources</h2>
                    {plan.resources.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 text-lg">No resources available in this learning plan</p>
                        </div>
                    ) : (
                        plan.resources.map((resource, index) => (
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