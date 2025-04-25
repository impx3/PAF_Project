package com.paf.chop.backend.repositories;

import com.paf.chop.backend.models.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
   
   List<LearningPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
   
   List<LearningPlan> findByIsPublicTrue();
   
   Optional<LearningPlan> findByIdAndUserId(Long id, Long userId);
   
   List<LearningPlan> findByTitleContainingAndIsPublicTrue(String keyword);
}