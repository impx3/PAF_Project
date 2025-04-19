package com.paf.chop.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanRequestDTO {
   
   private String title;
   
   private String description;
   
   private Boolean isPublic;
   
   private List<Long> resourceIds;
}