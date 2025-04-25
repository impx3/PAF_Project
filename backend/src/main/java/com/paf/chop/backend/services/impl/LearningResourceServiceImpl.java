package com.paf.chop.backend.services.impl;

import com.paf.chop.backend.dto.request.LearningResourceRequestDTO;
import com.paf.chop.backend.dto.response.LearningResourceResponseDTO;
import com.paf.chop.backend.exceptions.ResourceNotFoundException;
import com.paf.chop.backend.exceptions.UnauthorizedAccessException;
import com.paf.chop.backend.exceptions.ValidationException;
import com.paf.chop.backend.models.LearningPlan;
import com.paf.chop.backend.models.LearningResource;
import com.paf.chop.backend.repositories.LearningPlanRepository;
import com.paf.chop.backend.repositories.LearningResourceRepository;
import com.paf.chop.backend.services.LearningResourceService;
import com.paf.chop.backend.utils.PermissionChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningResourceServiceImpl implements LearningResourceService {

    private final LearningResourceRepository resourceRepository;
    private final LearningPlanRepository planRepository;
    private final PermissionChecker permissionChecker;

    @Override
    @Transactional
    public LearningResourceResponseDTO createResource(LearningResourceRequestDTO requestDTO, Long planId, Long userId) {
        // Basic validation
        validateResourceRequest(requestDTO);

        // Check if the learning plan exists and user has access
        LearningPlan learningPlan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!permissionChecker.isLearningPlanOwner(planId, userId)) {
            throw new UnauthorizedAccessException("You are not authorized to add resources to this learning plan");
        }

        // Create and save the resource
        LearningResource resource = LearningResource.builder()
                .title(requestDTO.getTitle())
                .type(requestDTO.getType())
                .url(requestDTO.getUrl())
                .learningPlan(learningPlan)
                .build();

        LearningResource savedResource = resourceRepository.save(resource);

        // Convert to response DTO
        return convertToResponseDTO(savedResource, learningPlan.getCompletedResources().contains(savedResource.getId()));
    }

    @Override
    @Transactional
    public LearningResourceResponseDTO updateResource(Long id, LearningResourceRequestDTO requestDTO, Long userId) {
        // Basic validation
        validateResourceRequest(requestDTO);

        // Get the resource and check permissions
        LearningResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        if (!permissionChecker.isLearningPlanOwner(resource.getLearningPlan().getId(), userId)) {
            throw new UnauthorizedAccessException("You are not authorized to update this resource");
        }

        // Update the resource
        resource.setTitle(requestDTO.getTitle());
        resource.setType(requestDTO.getType());
        resource.setUrl(requestDTO.getUrl());

        LearningResource updatedResource = resourceRepository.save(resource);

        // Convert to response DTO
        return convertToResponseDTO(updatedResource, 
            resource.getLearningPlan().getCompletedResources().contains(updatedResource.getId()));
    }

    @Override
    @Transactional
    public void deleteResource(Long id, Long userId) {
        // Get the resource and check permissions
        LearningResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        if (!permissionChecker.isLearningPlanOwner(resource.getLearningPlan().getId(), userId)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this resource");
        }

        // Remove from completed resources if present
        LearningPlan plan = resource.getLearningPlan();
        plan.getCompletedResources().remove(resource.getId());
        planRepository.save(plan);

        // Delete the resource
        resourceRepository.deleteById(id);
    }

    @Override
    public LearningResourceResponseDTO getResourceById(Long id, Long userId) {
        // Get the resource
        LearningResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        // Check if user has access to the learning plan
        if (!permissionChecker.canAccessLearningPlan(resource.getLearningPlan().getId(), userId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this resource");
        }

        // Convert to response DTO
        return convertToResponseDTO(resource, 
            resource.getLearningPlan().getCompletedResources().contains(resource.getId()));
    }

    @Override
    public List<LearningResourceResponseDTO> getPlanResources(Long planId, Long userId) {
        // Check if user has access to the learning plan
        if (!permissionChecker.canAccessLearningPlan(planId, userId)) {
            throw new UnauthorizedAccessException("You are not authorized to view these resources");
        }

        // Get the learning plan
        LearningPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        // Get all resources and convert to DTOs
        List<LearningResource> resources = resourceRepository.findByLearningPlanId(planId);
        return resources.stream()
                .map(resource -> convertToResponseDTO(resource, 
                    plan.getCompletedResources().contains(resource.getId())))
                .collect(Collectors.toList());
    }

    /**
     * Helper method to convert LearningResource entity to LearningResourceResponseDTO
     */
    private LearningResourceResponseDTO convertToResponseDTO(LearningResource resource, boolean completed) {
        return LearningResourceResponseDTO.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .type(resource.getType())
                .url(resource.getUrl())
                .completed(completed)
                .learningPlanId(resource.getLearningPlan().getId())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }

    /**
     * Basic validation for resource request
     */
    private void validateResourceRequest(LearningResourceRequestDTO requestDTO) {
        if (!StringUtils.hasText(requestDTO.getTitle())) {
            throw new ValidationException("Title is required");
        }
        if (requestDTO.getType() == null) {
            throw new ValidationException("Resource type is required");
        }
        if (!StringUtils.hasText(requestDTO.getUrl())) {
            throw new ValidationException("URL is required");
        }
        // Basic URL validation
        if (!requestDTO.getUrl().startsWith("http://") && !requestDTO.getUrl().startsWith("https://")) {
            throw new ValidationException("Invalid URL format");
        }
    }
} 