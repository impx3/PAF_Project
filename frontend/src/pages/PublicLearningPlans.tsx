import React, { useState, useEffect } from 'react';
import { LearningPlan } from '../types/learningPlan';
import { learningPlanService } from '../services/learningPlanService';
import PublicLearningPlanCard from '../components/learning/PublicLearningPlanCard';
import { FaSearch, FaTimes, FaBook } from 'react-icons/fa';
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

    const handleClear = () => {
        setSearchQuery('');
        fetchPublicPlans();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={fetchPublicPlans}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaBook className="text-4xl text-blue-500 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-900">Public Learning Plans</h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover and explore learning plans shared by the community. Find the perfect plan to enhance your skills.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto mb-10">
                    <div className="relative flex items-center">
                        <div className="relative flex-grow">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search public plans..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plans.map(plan => (
                                <PublicLearningPlanCard
                                    key={plan.id}
                                    plan={plan}
                                />
                            ))}
                        </div>

                        {plans.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg mb-2">
                                    No public learning plans found
                                </p>
                                <p className="text-gray-400">
                                    Try adjusting your search or check back later for new plans
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