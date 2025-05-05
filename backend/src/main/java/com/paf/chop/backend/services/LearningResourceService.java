package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.request.LearningResourceRequestDTO;
import com.paf.chop.backend.dto.response.LearningResourceResponseDTO;
import java.util.List;

public interface LearningResourceService {
    
    /**
     * Creates a new learning resource
     * 
     * @param requestDTO the learning resource details
     * @param planId the ID of the learning plan
     * @param userId the ID of the user creating the resource
     * @return the created learning resource response
     */
    LearningResourceResponseDTO createResource(LearningResourceRequestDTO requestDTO, Long planId, Long userId);
    
    /**
     * Updates an existing learning resource
     * 
     * @param id the ID of the resource to update
     * @param requestDTO the updated resource details
     * @param userId the ID of the user updating the resource
     * @return the updated learning resource response
     */
    LearningResourceResponseDTO updateResource(Long id, LearningResourceRequestDTO requestDTO, Long userId);
    
    /**
     * Deletes a learning resource
     * 
     * @param id the ID of the resource to delete
     * @param userId the ID of the user deleting the resource
     */
    void deleteResource(Long id, Long userId);
    
    /**
     * Gets a learning resource by ID
     * 
     * @param id the ID of the resource to retrieve
     * @param userId the ID of the user requesting the resource
     * @return the learning resource response
     */
    LearningResourceResponseDTO getResourceById(Long id, Long userId);
    
    /**
     * Gets all resources for a learning plan
     * 
     * @param planId the ID of the learning plan
     * @param userId the ID of the user requesting the resources
     * @return list of learning resource responses
     */
    List<LearningResourceResponseDTO> getPlanResources(Long planId, Long userId);
    
    /**
     * Gets all resources for a public learning plan
     * 
     * @param planId the ID of the public learning plan
     * @return list of learning resource responses
     */
    List<LearningResourceResponseDTO> getPublicPlanResources(Long planId);
} 