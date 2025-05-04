import React, { useState } from 'react';
import { LearningPlan, LearningPlanFormData } from '../types/learningPlan';
import LearningPlanCard from '../components/learning/LearningPlanCard';
import LearningPlanForm from '../components/learning/LearningPlanForm';
import { dummyLearningPlans } from '../data/dummyLearningPlans';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const LearningPlansDashboard: React.FC = () => {
    const [plans, setPlans] = useState<LearningPlan[]>(dummyLearningPlans);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<LearningPlan | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const handleCreatePlan = (formData: LearningPlanFormData) => {
        const newPlan: LearningPlan = {
            id: plans.length + 1,
            ...formData,
            progressPercentage: 0,
            resources: [],
            completedResources: [],
            owner: {
                id: 1,
                username: 'john_doe',
                email: 'john@example.com'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setPlans([newPlan, ...plans]);
        setShowForm(false);
    };

    const handleUpdatePlan = (formData: LearningPlanFormData) => {
        if (!editingPlan) return;
        
        const updatedPlan: LearningPlan = {
            ...editingPlan,
            ...formData,
            updatedAt: new Date().toISOString()
        };

        setPlans(plans.map(plan => 
            plan.id === editingPlan.id ? updatedPlan : plan
        ));
        setEditingPlan(undefined);
        setShowForm(false);
    };

    const handleDeletePlan = (id: number) => {
        if (window.confirm('Are you sure you want to delete this learning plan?')) {
            setPlans(plans.filter(plan => plan.id !== id));
        }
    };

    const handleEditPlan = (plan: LearningPlan) => {
        setEditingPlan(plan);
        setShowForm(true);
    };

    const filteredPlans = plans.filter(plan => {
        const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            plan.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || plan.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(plans.map(plan => plan.category).filter(Boolean)));

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
            </div>
        </div>
    );
};

export default LearningPlansDashboard; 