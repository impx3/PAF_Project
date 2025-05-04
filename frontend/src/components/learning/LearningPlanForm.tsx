import React, { useState, useEffect } from 'react';
import { LearningPlan, LearningPlanFormData } from '../../types/learningPlan';

interface LearningPlanFormProps {
    plan?: LearningPlan;
    onSubmit: (data: LearningPlanFormData) => void;
    onCancel: () => void;
}

const LearningPlanForm: React.FC<LearningPlanFormProps> = ({ plan, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<LearningPlanFormData>({
        title: '',
        description: '',
        isPublic: false,
        category: '',
        tags: [],
        estimatedDuration: ''
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (plan) {
            setFormData({
                title: plan.title,
                description: plan.description,
                isPublic: plan.isPublic,
                category: plan.category || '',
                tags: plan.tags || [],
                estimatedDuration: plan.estimatedDuration || ''
            });
        }
    }, [plan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">{plan ? 'Edit Learning Plan' : 'Create Learning Plan'}</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        <option value="Programming">Programming</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                    <input
                        type="text"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        placeholder="e.g., 3 months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                        {formData.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Make this plan public</label>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {plan ? 'Update Plan' : 'Create Plan'}
                </button>
            </div>
        </form>
    );
};

export default LearningPlanForm; 