package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.request.LearningResourceRequestDTO;
import com.paf.chop.backend.dto.response.LearningResourceResponseDTO;
import com.paf.chop.backend.services.LearningResourceService;
import com.paf.chop.backend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-resources")
@RequiredArgsConstructor
public class LearningResourceController {

    private final LearningResourceService learningResourceService;
    private final SecurityUtils securityUtils;

    @PostMapping("/plans/{planId}")
    public ResponseEntity<LearningResourceResponseDTO> createResource(
            @PathVariable Long planId,
            @RequestBody LearningResourceRequestDTO requestDTO) {
        Long userId = securityUtils.getCurrentUserId();
        LearningResourceResponseDTO responseDTO = learningResourceService.createResource(requestDTO, planId, userId);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @RequestBody LearningResourceRequestDTO requestDTO) {
        Long userId = securityUtils.getCurrentUserId();
        LearningResourceResponseDTO responseDTO = learningResourceService.updateResource(id, requestDTO, userId);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        learningResourceService.deleteResource(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningResourceResponseDTO> getResourceById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        LearningResourceResponseDTO responseDTO = learningResourceService.getResourceById(id, userId);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/plans/{planId}")
    public ResponseEntity<List<LearningResourceResponseDTO>> getPlanResources(@PathVariable Long planId) {
        Long userId = securityUtils.getCurrentUserId();
        List<LearningResourceResponseDTO> responseDTOs = learningResourceService.getPlanResources(planId, userId);
        return ResponseEntity.ok(responseDTOs);
    }
} 