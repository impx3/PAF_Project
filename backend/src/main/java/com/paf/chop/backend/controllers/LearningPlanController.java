package com.paf.chop.backend.controllers;

import com.paf.chop.backend.models.LearningPlan;
import com.paf.chop.backend.services.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    // 1. Create a new learning plan
    @PostMapping
    public LearningPlan createLearningPlan(@RequestBody LearningPlan plan) {
        return learningPlanService.createLearningPlan(plan);
    }

    // 2. Get all learning plans by a user
    @GetMapping("/user/{userId}")
    public List<LearningPlan> getUserPlans(@PathVariable String userId) {
        return learningPlanService.getPlansByUser(userId);
    }

    // 3. Get all public learning plans
    @GetMapping("/public")
    public List<LearningPlan> getPublicPlans() {
        return learningPlanService.getAllPublicPlans();
    }

    // 4. Get a single plan by ID
    @GetMapping("/{id}")
    public LearningPlan getPlanById(@PathVariable Long id) {
        return learningPlanService.getPlanById(id);
    }

    // 5. Update a learning plan
    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable Long id, @RequestBody LearningPlan updatedPlan) {
        return learningPlanService.updateLearningPlan(id, updatedPlan);
    }

    // 6. Delete a learning plan
    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
    }

    // 7. Mark a resource as completed
    @PostMapping("/{id}/complete-resource")
    public LearningPlan completeResource(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String resourceUrl = body.get("resourceUrl");
        return learningPlanService.markResourceCompleted(id, resourceUrl);
    }

    // 8. Toggle public/private visibility
    @PatchMapping("/{id}/toggle-public")
    public LearningPlan togglePlanVisibility(@PathVariable Long id) {
        return learningPlanService.togglePlanVisibility(id);
    }
}
