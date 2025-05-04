import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LearningResource } from '../types/learningPlan';
import { learningResourceService } from '../services/learningResourceService';
import { learningPlanService } from '../services/learningPlanService';
import LearningResourceCard from '../components/learning/LearningResourceCard';
import LearningResourceForm from '../components/learning/LearningResourceForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { FaPlus, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LearningPlanResources: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [resources, setResources] = useState<LearningResource[]>([]);
    const [planTitle, setPlanTitle] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState<LearningResource | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; resourceId: number | null }>({
        isOpen: false,
        resourceId: null
    });

    useEffect(() => {
        if (planId) {
            fetchResources();
            fetchPlanDetails();
        }
    }, [planId]);

    const fetchResources = async () => {
        try {
            setIsLoading(true);
            const data = await learningResourceService.getPlanResources(Number(planId));
            setResources(data);
        } catch (err) {
            toast.error('Failed to fetch resources');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPlanDetails = async () => {
        try {
            const plan = await learningPlanService.getLearningPlanById(Number(planId));
            setPlanTitle(plan.title);
        } catch (err) {
            toast.error('Failed to fetch plan details');
        }
    };

    const handleCreateResource = async (data: Omit<LearningResource, 'id' | 'completed'>) => {
        try {
            await learningResourceService.createResource(Number(planId), data);
            toast.success('Resource created successfully');
            setShowForm(false);
            fetchResources();
        } catch (err) {
            toast.error('Failed to create resource');
        }
    };

    const handleUpdateResource = async (data: Omit<LearningResource, 'id' | 'completed'>) => {
        if (!editingResource) return;
        try {
            await learningResourceService.updateResource(editingResource.id, data);
            toast.success('Resource updated successfully');
            setShowForm(false);
            setEditingResource(undefined);
            fetchResources();
        } catch (err) {
            toast.error('Failed to update resource');
        }
    };

    const handleDeleteResource = (id: number) => {
        setDeleteModal({ isOpen: true, resourceId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.resourceId) return;
        try {
            await learningResourceService.deleteResource(deleteModal.resourceId);
            toast.success('Resource deleted successfully');
            fetchResources();
        } catch (err) {
            toast.error('Failed to delete resource');
        } finally {
            setDeleteModal({ isOpen: false, resourceId: null });
        }
    };

    const handleToggleComplete = async (id: number, completed: boolean) => {
        try {
            await learningPlanService.updateResourceCompletion(Number(planId), id, completed);
            toast.success(completed ? 'Resource marked as completed' : 'Resource marked as incomplete');
            fetchResources();
        } catch (err) {
            toast.error('Failed to update resource status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/learning-plans')}
                        className="mr-4 text-gray-600 hover:text-gray-800"
                    >
                        <FaArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Resources for {planTitle}
                    </h1>
                </div>

                <div className="mb-8">
                    <button
                        onClick={() => {
                            setEditingResource(undefined);
                            setShowForm(true);
                        }}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" />
                        Add Resource
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8">
                        <LearningResourceForm
                            resource={editingResource}
                            onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingResource(undefined);
                            }}
                        />
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {resources.map(resource => (
                            <LearningResourceCard
                                key={resource.id}
                                resource={resource}
                                onEdit={(resource) => {
                                    setEditingResource(resource);
                                    setShowForm(true);
                                }}
                                onDelete={handleDeleteResource}
                                onToggleComplete={handleToggleComplete}
                            />
                        ))}

                        {resources.length === 0 && !showForm && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No resources found. Add your first resource to get started!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <ConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, resourceId: null })}
                    onConfirm={confirmDelete}
                    title="Delete Resource"
                    message="Are you sure you want to delete this resource? This action cannot be undone."
                    confirmButtonText="Delete"
                    confirmButtonColor="red"
                    icon={<FaExclamationTriangle className="h-6 w-6 text-red-600" />}
                />
            </div>
        </div>
    );
};

export default LearningPlanResources; 