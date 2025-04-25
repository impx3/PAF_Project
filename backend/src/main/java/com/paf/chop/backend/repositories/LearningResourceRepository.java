package com.paf.chop.backend.repositories;

import com.paf.chop.backend.models.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
   
   List<LearningResource> findByLearningPlanId(Long learningPlanId);
   
   void deleteByLearningPlanId(Long learningPlanId);
}