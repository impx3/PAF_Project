package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.request.LearningPlanRequestDTO;
import com.paf.chop.backend.dto.request.ResourceCompletionDTO;
import com.paf.chop.backend.dto.response.LearningPlanResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.services.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@RequiredArgsConstructor
public class LearningPlanController {

    private final LearningPlanService learningPlanService;
    private final UserRepository userRepository;

    /**
     * Create a new learning plan
     */
    @PostMapping
    public ResponseEntity<LearningPlanResponseDTO> createLearningPlan(
            @RequestBody LearningPlanRequestDTO requestDTO) {
        Long userId = getCurrentUserId();
        LearningPlanResponseDTO responseDTO = learningPlanService.createLearningPlan(requestDTO, userId);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    /**
     * Update an existing learning plan
     */
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanResponseDTO> updateLearningPlan(
            @PathVariable Long id,
            @RequestBody LearningPlanRequestDTO requestDTO) {
        Long userId = getCurrentUserId();
        LearningPlanResponseDTO responseDTO = learningPlanService.updateLearningPlan(id, requestDTO, userId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Delete a learning plan
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        learningPlanService.deleteLearningPlan(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get a learning plan by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanResponseDTO> getLearningPlanById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        LearningPlanResponseDTO responseDTO = learningPlanService.getLearningPlanById(id, userId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Get all learning plans for the current user
     */
    @GetMapping("/me")
    public ResponseEntity<List<LearningPlanResponseDTO>> getCurrentUserLearningPlans() {
        Long userId = getCurrentUserId();
        List<LearningPlanResponseDTO> responseDTOs = learningPlanService.getUserLearningPlans(userId);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Get all public learning plans
     */
    @GetMapping("/public")
    public ResponseEntity<List<LearningPlanResponseDTO>> getPublicLearningPlans() {
        List<LearningPlanResponseDTO> responseDTOs = learningPlanService.getPublicLearningPlans();
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Mark a resource as completed or not completed
     */
    @PostMapping("/{id}/resources/{resourceId}/complete")
    public ResponseEntity<LearningPlanResponseDTO> markResourceCompletion(
            @PathVariable Long id,
            @PathVariable Long resourceId,
            @RequestParam(defaultValue = "true") Boolean completed) {
        Long userId = getCurrentUserId();

        ResourceCompletionDTO completionDTO = new ResourceCompletionDTO();
        completionDTO.setResourceId(resourceId);
        completionDTO.setCompleted(completed);

        LearningPlanResponseDTO responseDTO = learningPlanService.updateResourceCompletion(id, completionDTO, userId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Search public learning plans by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<LearningPlanResponseDTO>> searchPublicLearningPlans(
            @RequestParam String keyword) {
        List<LearningPlanResponseDTO> responseDTOs = learningPlanService.searchPublicLearningPlans(keyword);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Helper method to get the current user ID from the security context
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        // Get username from the authentication object
        String username = authentication.getName();

        // Look up the user from the database using the username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalStateException("User not found: " + username);
        }

        return user.getId();
    }
}