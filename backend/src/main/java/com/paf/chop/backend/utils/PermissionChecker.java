package com.paf.chop.backend.utils;

import com.paf.chop.backend.exceptions.ResourceNotFoundException;
import com.paf.chop.backend.models.LearningPlan;
import com.paf.chop.backend.repositories.LearningPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Utility class to check permissions related to learning plans
 */
@Component
@RequiredArgsConstructor
public class PermissionChecker {

    private final LearningPlanRepository learningPlanRepository;

    /**
     * Checks if a user can access a learning plan.
     * A user can access a learning plan if:
     * 1. The user is the owner of the learning plan
     * 2. The learning plan is public
     *
     * @param planId the ID of the learning plan to check
     * @param userId the ID of the user
     * @return true if the user can access the learning plan, false otherwise
     * @throws ResourceNotFoundException if the learning plan doesn't exist
     */
    public boolean canAccessLearningPlan(Long planId, Long userId) {
        LearningPlan learningPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // The user can access the learning plan if they are the owner or if the plan is public
        return isLearningPlanOwner(learningPlan, userId) || Boolean.TRUE.equals(learningPlan.getIsPublic());
    }

    /**
     * Checks if a user is the owner of a learning plan.
     *
     * @param planId the ID of the learning plan to check
     * @param userId the ID of the user
     * @return true if the user is the owner of the learning plan, false otherwise
     * @throws ResourceNotFoundException if the learning plan doesn't exist
     */
    public boolean isLearningPlanOwner(Long planId, Long userId) {
        LearningPlan learningPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        return isLearningPlanOwner(learningPlan, userId);
    }
    
    /**
     * Private helper method to check if a user is the owner of a learning plan.
     *
     * @param learningPlan the learning plan to check
     * @param userId the ID of the user
     * @return true if the user is the owner of the learning plan, false otherwise
     */
    private boolean isLearningPlanOwner(LearningPlan learningPlan, Long userId) {
        return learningPlan.getUser().getId().equals(userId);
    }
}