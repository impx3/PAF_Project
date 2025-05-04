import React from 'react';
import { LearningResource } from '../../types/learningPlan';
import { FaVideo, FaNewspaper, FaBook, FaGraduationCap, FaLink, FaCheck, FaPencilAlt, FaTrash } from 'react-icons/fa';

interface LearningResourceCardProps {
    resource: LearningResource;
    onEdit: (resource: LearningResource) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number, completed: boolean) => void;
}

const LearningResourceCard: React.FC<LearningResourceCardProps> = ({
    resource,
    onEdit,
    onDelete,
    onToggleComplete
}) => {
    const getTypeIcon = () => {
        switch (resource.type) {
            case 'VIDEO':
                return <FaVideo className="text-blue-500" />;
            case 'ARTICLE':
                return <FaNewspaper className="text-green-500" />;
            case 'COURSE':
                return <FaGraduationCap className="text-purple-500" />;
            case 'BOOK':
                return <FaBook className="text-yellow-500" />;
            default:
                return <FaLink className="text-gray-500" />;
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${resource.completed ? 'border-l-4 border-green-500' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                        {getTypeIcon()}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{resource.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onToggleComplete(resource.id, !resource.completed)}
                        className={`p-2 rounded-full ${
                            resource.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600'
                        } hover:bg-opacity-80`}
                        title={resource.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                        <FaCheck />
                    </button>
                    <button
                        onClick={() => onEdit(resource)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="Edit resource"
                    >
                        <FaPencilAlt />
                    </button>
                    <button
                        onClick={() => onDelete(resource.id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        title="Delete resource"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 mb-4">{resource.description}</p>

            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
                <FaLink className="mr-2" />
                Visit Resource
            </a>
        </div>
    );
};

export default LearningResourceCard; 