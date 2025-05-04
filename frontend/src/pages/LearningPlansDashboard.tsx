import React, { useState, useEffect } from 'react';
import { LearningPlan, LearningPlanFormData } from '../types/learningPlan';
import LearningPlanCard from '../components/learning/LearningPlanCard';
import LearningPlanForm from '../components/learning/LearningPlanForm';
import { learningPlanService } from '../services/learningPlanService';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LearningPlansDashboard: React.FC = () => {
    const [plans, setPlans] = useState<LearningPlan[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<LearningPlan | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLearningPlans();
    }, []);

    const fetchLearningPlans = async () => {
        try {
            setIsLoading(true);
            const data = await learningPlanService.getUserLearningPlans();
            setPlans(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch learning plans. Please try again later.');
            toast.error('Failed to fetch learning plans');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlan = async (formData: LearningPlanFormData) => {
        try {
            const newPlan = await learningPlanService.createLearningPlan(formData);
            setPlans([newPlan, ...plans]);
            setShowForm(false);
            toast.success('Learning plan created successfully');
        } catch (err) {
            toast.error('Failed to create learning plan');
        }
    };

    const handleUpdatePlan = async (formData: LearningPlanFormData) => {
        if (!editingPlan) return;
        
        try {
            const updatedPlan = await learningPlanService.updateLearningPlan(editingPlan.id, formData);
            setPlans(plans.map(plan => 
                plan.id === editingPlan.id ? updatedPlan : plan
            ));
            setEditingPlan(undefined);
            setShowForm(false);
            toast.success('Learning plan updated successfully');
        } catch (err) {
            toast.error('Failed to update learning plan');
        }
    };

    const handleDeletePlan = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this learning plan?')) {
            try {
                await learningPlanService.deleteLearningPlan(id);
                setPlans(plans.filter(plan => plan.id !== id));
                toast.success('Learning plan deleted successfully');
            } catch (err) {
                toast.error('Failed to delete learning plan');
            }
        }
    };

    const handleEditPlan = (plan: LearningPlan) => {
        setEditingPlan(plan);
        setShowForm(true);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            await fetchLearningPlans();
            return;
        }

        try {
            setIsLoading(true);
            const results = await learningPlanService.searchPublicLearningPlans(searchQuery);
            setPlans(results);
            setError(null);
        } catch (err) {
            setError('Failed to search learning plans');
            toast.error('Failed to search learning plans');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPlans = plans.filter(plan => {
        const matchesCategory = !selectedCategory || plan.category === selectedCategory;
        return matchesCategory;
    });

    const categories = Array.from(new Set(plans.map(plan => plan.category).filter(Boolean)));

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={fetchLearningPlans}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Learning Plans</h1>
                    <button
                        onClick={() => {
                            setEditingPlan(undefined);
                            setShowForm(true);
                        }}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" />
                        Create Plan
                    </button>
                </div>

                {showForm ? (
                    <div className="mb-8">
                        <LearningPlanForm
                            plan={editingPlan}
                            onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingPlan(undefined);
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search plans..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="w-48">
                                <div className="relative">
                                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPlans.map(plan => (
                                        <LearningPlanCard
                                            key={plan.id}
                                            plan={plan}
                                            onEdit={handleEditPlan}
                                            onDelete={handleDeletePlan}
                                        />
                                    ))}
                                </div>

                                {filteredPlans.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">
                                            No learning plans found. Create one to get started!
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LearningPlansDashboard; 