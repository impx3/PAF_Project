import React, { useState, useEffect } from 'react';
import { LearningPlan } from '../../types/learningPlan';
import { ResourceType } from '../../types/resourceType';
import { learningPlanService } from '../../services/learningPlanService';
import { learningResourceService } from '../../services/learningResourceService';
import { FaBook, FaSearch, FaTimes } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

interface LearningPlanSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    postTitle: string;
    postContent: string;
    postUrl: string;
}

const LearningPlanSelectionModal: React.FC<LearningPlanSelectionModalProps> = ({
    isOpen,
    onClose,
    postTitle,
    postContent,
    postUrl
}) => {
    const [plans, setPlans] = useState<LearningPlan[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [selectedResourceType, setSelectedResourceType] = useState<ResourceType>(ResourceType.VIDEO);

    // Available resource types (excluding POST as it's not selectable)
    const availableResourceTypes = [
        ResourceType.VIDEO,
        ResourceType.ARTICLE,
        ResourceType.COURSE,
        ResourceType.BOOK,
        ResourceType.OTHER
    ];

    useEffect(() => {
        if (isOpen) {
            fetchUserPlans();
        }
    }, [isOpen]);

    const fetchUserPlans = async () => {
        try {
            setIsLoading(true);
            const data = await learningPlanService.getUserLearningPlans();
            setPlans(data);
        } catch (err) {
            toast.error('Failed to fetch learning plans');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedPlanId) {
            toast.error('Please select a learning plan');
            return;
        }

        try {
            await learningResourceService.createResource(selectedPlanId, {
                title: postTitle,
                description: postContent,
                type: selectedResourceType,
                url: postUrl.startsWith('http') ? postUrl : `http://localhost:3000/post/${postUrl}`
            });
            toast.success('Post saved as a resource successfully');
            onClose();
        } catch (err) {
            console.error('Error saving resource:', err);
            toast.error('Failed to save post as a resource');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

            {/* Modal */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <FaBook className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                    Save to Learning Plan
                                </h3>
                                
                                {/* Resource Type Selection */}
                                <div className="mt-4">
                                    <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700">
                                        Resource Type
                                    </label>
                                    <select
                                        id="resourceType"
                                        value={selectedResourceType}
                                        onChange={(e) => setSelectedResourceType(e.target.value as ResourceType)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        {availableResourceTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0) + type.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Input */}
                                <div className="mt-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search your learning plans..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                {/* Learning Plans List */}
                                <div className="mt-4 max-h-60 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-4">
                                            <LoadingSpinner />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {plans
                                                .filter(plan => 
                                                    plan.title.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map(plan => (
                                                    <div
                                                        key={plan.id}
                                                        className={`p-3 rounded-md cursor-pointer transition-all ${
                                                            selectedPlanId === plan.id
                                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                        }`}
                                                        onClick={() => setSelectedPlanId(plan.id)}
                                                    >
                                                        <h4 className="font-medium text-gray-900">{plan.title}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                                                    </div>
                                                ))
                                            }
                                            {!isLoading && plans.length === 0 && (
                                                <div className="text-center py-4">
                                                    <p className="text-gray-500">No learning plans found</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                            Save to Plan
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPlanSelectionModal; 