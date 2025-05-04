import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningPlan } from '../../types/learningPlan';
import { FaEdit, FaTrash, FaLock, FaLockOpen, FaClock, FaTag } from 'react-icons/fa';

interface LearningPlanCardProps {
    plan: LearningPlan;
    onEdit: (plan: LearningPlan) => void;
    onDelete: (id: number) => void;
    readOnly?: boolean;
}

const LearningPlanCard: React.FC<LearningPlanCardProps> = ({ plan, onEdit, onDelete, readOnly = false }) => {
    const navigate = useNavigate();

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on action buttons
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        // Use different routes for public and private plans
        const route = plan.isPublic && readOnly 
            ? `/learningplans/public/${plan.id}`
            : `/learning-plans/${plan.id}/resources`;
        navigate(route);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(plan);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(plan.id);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{plan.title}</h3>
                <div className="flex items-center space-x-2">
                    {plan.isPublic ? (
                        <FaLockOpen className="text-green-500" title="Public" />
                    ) : (
                        <FaLock className="text-gray-500" title="Private" />
                    )}
                    {!readOnly && (
                        <>
                            <button
                                onClick={handleEditClick}
                                className="text-blue-500 hover:text-blue-600"
                                title="Edit"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="text-red-500 hover:text-red-600"
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <p className="text-gray-600 mb-4">{plan.description}</p>
            
            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-gray-500">
                    <FaClock className="mr-2" />
                    <span>{plan.estimatedDuration}</span>
                </div>
                <div className="flex items-center text-gray-500">
                    <FaTag className="mr-2" />
                    <span>{plan.category}</span>
                </div>
            </div>
            
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{plan.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${plan.progressPercentage}%` }}
                    />
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {plan.tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default LearningPlanCard; 