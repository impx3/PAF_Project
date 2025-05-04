package com.paf.chop.backend.services.impl;

import com.paf.chop.backend.dto.request.LearningPlanRequestDTO;
import com.paf.chop.backend.dto.request.ResourceCompletionDTO;
import com.paf.chop.backend.dto.response.LearningPlanResponseDTO;
import com.paf.chop.backend.dto.response.ResourceResponseDTO;
import com.paf.chop.backend.dto.response.UserBasicInfoDTO;
import com.paf.chop.backend.exceptions.ResourceNotFoundException;
import com.paf.chop.backend.exceptions.UnauthorizedAccessException;
import com.paf.chop.backend.models.LearningPlan;
import com.paf.chop.backend.models.LearningResource;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.LearningPlanRepository;
import com.paf.chop.backend.repositories.LearningResourceRepository;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.services.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningPlanServiceImpl implements LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LearningPlanResponseDTO createLearningPlan(LearningPlanRequestDTO requestDTO, Long userId) {
        // Get the user or throw exception if not found
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Create new learning plan
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setTitle(requestDTO.getTitle());
        learningPlan.setDescription(requestDTO.getDescription());
        learningPlan.setIsPublic(requestDTO.getIsPublic() != null ? requestDTO.getIsPublic() : false);
        learningPlan.setProgressPercentage(0);
        learningPlan.setCompletedResources(new HashSet<>());
        learningPlan.setUser(user);
        learningPlan.setCategory(requestDTO.getCategory());
        learningPlan.setTags(new HashSet<>(requestDTO.getTags() != null ? requestDTO.getTags() : new ArrayList<>()));
        learningPlan.setEstimatedDuration(requestDTO.getEstimatedDuration());

        // Save the learning plan
        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);

        // Convert to response DTO and return
        return convertToResponseDTO(savedPlan);
    }

    @Override
    @Transactional
    public LearningPlanResponseDTO updateLearningPlan(Long id, LearningPlanRequestDTO requestDTO, Long userId) {
        // Get the learning plan or throw exception if not found
        LearningPlan learningPlan = learningPlanRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // Update learning plan fields
        learningPlan.setTitle(requestDTO.getTitle());
        learningPlan.setDescription(requestDTO.getDescription());
        learningPlan.setIsPublic(requestDTO.getIsPublic());
        learningPlan.setCategory(requestDTO.getCategory());
        learningPlan.setTags(new HashSet<>(requestDTO.getTags() != null ? requestDTO.getTags() : new ArrayList<>()));
        learningPlan.setEstimatedDuration(requestDTO.getEstimatedDuration());

        // Save the updated learning plan
        LearningPlan updatedPlan = learningPlanRepository.save(learningPlan);

        // Convert to response DTO and return
        return convertToResponseDTO(updatedPlan);
    }

    @Override
    @Transactional
    public void deleteLearningPlan(Long id, Long userId) {
        // Get the learning plan or throw exception if not found
        LearningPlan learningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // Check if the user is the owner of the learning plan
        if (!learningPlan.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this learning plan");
        }

        // Delete associated resources first
        learningResourceRepository.deleteByLearningPlanId(id);

        // Delete the learning plan
        learningPlanRepository.deleteById(id);
    }

    @Override
    public LearningPlanResponseDTO getLearningPlanById(Long id, Long userId) {
        // Get the learning plan or throw exception if not found
        LearningPlan learningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // Check if the plan is public or if the user is the owner
        if (!learningPlan.getIsPublic() && !learningPlan.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this learning plan");
        }

        // Convert to response DTO and return
        return convertToResponseDTO(learningPlan);
    }

    @Override
    public List<LearningPlanResponseDTO> getUserLearningPlans(Long userId) {
        // Check if the user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        // Get all learning plans for the user
        List<LearningPlan> userPlans = learningPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // Convert to response DTOs and return
        return userPlans.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LearningPlanResponseDTO> getPublicLearningPlans() {
        // Get all public learning plans
        List<LearningPlan> publicPlans = learningPlanRepository.findByIsPublicTrue();

        // Convert to response DTOs and return
        return publicPlans.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LearningPlanResponseDTO updateResourceCompletion(Long planId, ResourceCompletionDTO completionDTO, Long userId) {
        // Get the learning plan or throw exception if not found
        LearningPlan learningPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // Check if the user is the owner of the learning plan
        if (!learningPlan.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You are not authorized to update this learning plan");
        }

        // Verify that the resource exists
        LearningResource resource = learningResourceRepository.findById(completionDTO.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        // Check if the resource belongs to the learning plan
        if (!resource.getLearningPlan().getId().equals(planId)) {
            throw new ResourceNotFoundException("Resource does not belong to this learning plan");
        }

        // Update completed resources set
        Set<Long> completedResources = learningPlan.getCompletedResources();

        if (completionDTO.getCompleted()) {
            completedResources.add(completionDTO.getResourceId());
        } else {
            completedResources.remove(completionDTO.getResourceId());
        }

        learningPlan.setCompletedResources(completedResources);

        // Calculate and update progress
        Integer progress = calculateProgress(planId);
        learningPlan.setProgressPercentage(progress);

        // Save the updated learning plan
        LearningPlan updatedPlan = learningPlanRepository.save(learningPlan);

        // Convert to response DTO and return
        return convertToResponseDTO(updatedPlan);
    }

    @Override
    public Integer calculateProgress(Long planId) {
        // Get the learning plan or throw exception if not found
        LearningPlan learningPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // Get all resources for the learning plan
        List<LearningResource> resources = learningResourceRepository.findByLearningPlanId(planId);

        // If there are no resources, progress is 0
        if (resources.isEmpty()) {
            return 0;
        }

        // Calculate progress percentage
        Set<Long> completedResources = learningPlan.getCompletedResources();
        int totalResources = resources.size();
        int completedCount = completedResources.size();

        return (int) Math.round((double) completedCount / totalResources * 100);
    }

    @Override
    public List<LearningPlanResponseDTO> searchPublicLearningPlans(String keyword) {
        List<LearningPlan> matchingPlans = learningPlanRepository.findByTitleContainingAndIsPublicTrue(keyword);
        return matchingPlans.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to convert LearningPlan entity to LearningPlanResponseDTO
     */
    private LearningPlanResponseDTO convertToResponseDTO(LearningPlan learningPlan) {
        return LearningPlanResponseDTO.builder()
                .id(learningPlan.getId())
                .title(learningPlan.getTitle())
                .description(learningPlan.getDescription())
                .isPublic(learningPlan.getIsPublic())
                .progressPercentage(learningPlan.getProgressPercentage())
                .completedResources(learningPlan.getCompletedResources())
                .owner(convertToUserBasicInfoDTO(learningPlan.getUser()))
                .createdAt(learningPlan.getCreatedAt())
                .updatedAt(learningPlan.getUpdatedAt())
                .category(learningPlan.getCategory())
                .tags(learningPlan.getTags())
                .estimatedDuration(learningPlan.getEstimatedDuration())
                .build();
    }

    private UserBasicInfoDTO convertToUserBasicInfoDTO(User user) {
        return UserBasicInfoDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .build();
    }
}