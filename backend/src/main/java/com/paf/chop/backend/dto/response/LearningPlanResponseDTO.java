package com.paf.chop.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanResponseDTO {
   
   private Long id;
   private String title;
   private String description;
   private Boolean isPublic;
   private Integer progressPercentage;
   private List<ResourceResponseDTO> resources;
   private Set<Long> completedResources;
   private UserBasicInfoDTO owner;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
}