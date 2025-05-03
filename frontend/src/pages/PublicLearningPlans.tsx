import { useState, useEffect } from 'react';
import { LearningPlan } from '../types/learningPlan';
import { getPublicLearningPlans, searchPublicLearningPlans } from '../services/learningPlanService';
import { Search, BookOpen, User, Calendar, Clock, X } from 'lucide-react';

const PublicLearningPlans = () => {
    const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLearningPlans();
    }, []);

    const fetchLearningPlans = async () => {
        try {
            setIsLoading(true);
            const plans = await getPublicLearningPlans();
            setLearningPlans(plans);
            setError(null);
        } catch (err) {
            setError('Failed to load learning plans. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchLearningPlans();
            return;
        }

        try {
            setIsLoading(true);
            const plans = await searchPublicLearningPlans(searchQuery);
            setLearningPlans(plans);
            setError(null);
        } catch (err) {
            setError('Failed to search learning plans. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        fetchLearningPlans();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Public Learning Plans
                    </h1>
                    <p className="text-xl text-gray-600">
                        Discover and learn from shared knowledge
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative flex items-center">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search learning plans..."
                                className="w-full px-4 py-3 pl-12 pr-20 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            
                            {/* Clear Button */}
                            {searchQuery && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                    title="Clear search"
                                >
                                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </button>
                            )}
                        </div>
                        
                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="ml-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-center text-red-600 mb-8">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    /* Learning Plans Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {learningPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {plan.title}
                                        </h2>
                                        <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                                            {plan.progressPercentage}% Complete
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {plan.description}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-500">
                                            <User className="w-5 h-5 mr-2" />
                                            <span>{plan.owner.username}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <BookOpen className="w-5 h-5 mr-2" />
                                            <span>{plan.resources.length} Resources</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <Calendar className="w-5 h-5 mr-2" />
                                            <span>Created {formatDate(plan.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="w-5 h-5 mr-2" />
                                            <span>Updated {formatDate(plan.updatedAt)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${plan.progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!isLoading && learningPlans.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-xl">No learning plans found</p>
                        <p className="mt-2">Try adjusting your search query</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicLearningPlans; 