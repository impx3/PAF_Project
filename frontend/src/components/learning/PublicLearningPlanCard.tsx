import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningPlan } from '../../types/learningPlan';
import { FaBook, FaLockOpen, FaClock, FaTag, FaUser } from 'react-icons/fa';

interface PublicLearningPlanCardProps {
    plan: LearningPlan;
}

const PublicLearningPlanCard: React.FC<PublicLearningPlanCardProps> = ({ plan }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/learningplans/public/${plan.id}`);
    };

    // Get the number of resources safely
    const resourceCount = plan.resources?.length || 0;

    return (
        <div 
            onClick={handleCardClick}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FaBook className="text-white text-xl mr-3" />
                        <h3 className="text-xl font-semibold text-white truncate">{plan.title}</h3>
                    </div>
                    <FaLockOpen className="text-white" title="Public" />
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{plan.description || 'No description available'}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2 text-blue-500" />
                        <span className="text-sm">{plan.estimatedDuration || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaTag className="mr-2 text-blue-500" />
                        <span className="text-sm">{plan.category || 'Uncategorized'}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Resources</span>
                        <span>{resourceCount} items</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(resourceCount / 10) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Tags */}
                {plan.tags && plan.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {plan.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Creator Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-600">
                        <FaUser className="mr-2 text-blue-500" />
                        <span className="text-sm">{plan.owner?.username || 'Anonymous'}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                        Created {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PublicLearningPlanCard; 