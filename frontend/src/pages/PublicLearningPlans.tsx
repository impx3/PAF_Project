import React, { useState, useEffect } from 'react';
import { LearningPlan } from '../types/learningPlan';
import { learningPlanService } from '../services/learningPlanService';
import LearningPlanCard from '../components/learning/LearningPlanCard';
import { FaSearch } from 'react-icons/fa';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const PublicLearningPlans: React.FC = () => {
    const [plans, setPlans] = useState<LearningPlan[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPublicPlans();
    }, []);

    const fetchPublicPlans = async () => {
        try {
            setIsLoading(true);
            const data = await learningPlanService.getPublicLearningPlans();
            setPlans(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch public learning plans');
            toast.error('Failed to fetch public learning plans');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            await fetchPublicPlans();
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={fetchPublicPlans}
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
                    <h1 className="text-3xl font-bold text-gray-900">Public Learning Plans</h1>
                </div>

                <div className="mb-6">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search public plans..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <LearningPlanCard
                                    key={plan.id}
                                    plan={plan}
                                    onEdit={() => {}} // Not allowed for public plans
                                    onDelete={() => {}} // Not allowed for public plans
                                    readOnly={true}
                                />
                            ))}
                        </div>

                        {plans.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No public learning plans found.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PublicLearningPlans; 