package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.request.LearningPlanRequestDTO;
import com.paf.chop.backend.dto.request.ResourceCompletionDTO;
import com.paf.chop.backend.dto.response.LearningPlanResponseDTO;

import java.util.List;

public interface LearningPlanService {
    
    /**
     * Creates a new learning plan for a user
     * 
     * @param requestDTO the learning plan details
     * @param userId the ID of the user creating the plan
     * @return the created learning plan response
     */
    LearningPlanResponseDTO createLearningPlan(LearningPlanRequestDTO requestDTO, Long userId);
    
    /**
     * Updates an existing learning plan
     * 
     * @param id the ID of the learning plan to update
     * @param requestDTO the updated learning plan details
     * @param userId the ID of the user updating the plan
     * @return the updated learning plan response
     */
    LearningPlanResponseDTO updateLearningPlan(Long id, LearningPlanRequestDTO requestDTO, Long userId);
    
    /**
     * Deletes a learning plan
     * 
     * @param id the ID of the learning plan to delete
     * @param userId the ID of the user deleting the plan
     */
    void deleteLearningPlan(Long id, Long userId);
    
    /**
     * Retrieves a learning plan by ID
     * 
     * @param id the ID of the learning plan to retrieve
     * @param userId the ID of the user requesting the plan
     * @return the learning plan response
     */
    LearningPlanResponseDTO getLearningPlanById(Long id, Long userId);
    
    /**
     * Retrieves all learning plans for a user
     * 
     * @param userId the ID of the user
     * @return list of learning plan responses
     */
    List<LearningPlanResponseDTO> getUserLearningPlans(Long userId);
    
    /**
     * Retrieves all public learning plans
     * 
     * @return list of public learning plan responses
     */
    List<LearningPlanResponseDTO> getPublicLearningPlans();
    
    /**
     * Updates the completion status of a resource in a learning plan
     * 
     * @param planId the ID of the learning plan
     * @param completionDTO the resource completion details
     * @param userId the ID of the user updating completion status
     * @return the updated learning plan response
     */
    LearningPlanResponseDTO updateResourceCompletion(Long planId, ResourceCompletionDTO completionDTO, Long userId);
    
    /**
     * Calculates the progress percentage for a learning plan
     * 
     * @param planId the ID of the learning plan
     * @return the progress percentage (0-100)
     */
    Integer calculateProgress(Long planId);

    /**
     * Searches for public learning plans by keyword in title
     * 
     * @param keyword the search keyword
     * @return list of matching public learning plan responses
     */
    List<LearningPlanResponseDTO> searchPublicLearningPlans(String keyword);
}