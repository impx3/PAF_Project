import React, { useState, useEffect } from 'react';
import { LearningPlan, LearningPlanFormData } from '../../types/learningPlan';
import { toast } from 'react-toastify';
import { learningPlanService } from '../../services/learningPlanService';
import { FaTimes } from 'react-icons/fa';

interface UpdateLearningPlanFormProps {
    plan: LearningPlan;
    onSuccess: () => void;
    onCancel: () => void;
}

const UpdateLearningPlanForm: React.FC<UpdateLearningPlanFormProps> = ({ plan, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<LearningPlanFormData>({
        title: plan.title,
        description: plan.description || '',
        category: plan.category || '',
        estimatedDuration: plan.estimatedDuration || '',
        isPublic: plan.isPublic || false,
        tags: plan.tags || []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        setFormData({
            title: plan.title,
            description: plan.description || '',
            category: plan.category || '',
            estimatedDuration: plan.estimatedDuration || '',
            isPublic: plan.isPublic || false,
            tags: plan.tags || []
        });
    }, [plan]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            setIsSubmitting(true);
            await learningPlanService.updateLearningPlan(plan.id, formData);
            toast.success('Learning plan updated successfully');
            onSuccess();
        } catch (err) {
            toast.error('Failed to update learning plan');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Learning Plan</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                            Estimated Duration
                        </label>
                        <input
                            type="text"
                            id="estimatedDuration"
                            name="estimatedDuration"
                            value={formData.estimatedDuration}
                            onChange={handleInputChange}
                            placeholder="e.g., 2 weeks, 3 months"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Add a tag"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <FaTimes className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                            Make this plan public
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {isSubmitting ? 'Updating...' : 'Update Plan'}
                </button>
            </div>
        </form>
    );
};

export default UpdateLearningPlanForm; 