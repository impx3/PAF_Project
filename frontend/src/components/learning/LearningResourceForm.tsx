import React from 'react';
import { LearningResource } from '../../types/learningPlan';
import { FaTimes } from 'react-icons/fa';

interface LearningResourceFormProps {
    resource?: LearningResource;
    onSubmit: (data: Omit<LearningResource, 'id' | 'completed'>) => void;
    onCancel: () => void;
}

const LearningResourceForm: React.FC<LearningResourceFormProps> = ({ resource, onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState({
        title: resource?.title || '',
        description: resource?.description || '',
        url: resource?.url || '',
        type: resource?.type || 'VIDEO'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {resource ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                            URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <select
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="VIDEO">Video</option>
                            <option value="ARTICLE">Article</option>
                            <option value="COURSE">Course</option>
                            <option value="BOOK">Book</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
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
                        {resource ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LearningResourceForm; 