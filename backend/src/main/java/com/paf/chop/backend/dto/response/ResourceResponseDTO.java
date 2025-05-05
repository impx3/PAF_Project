package com.paf.chop.backend.dto.response;

import com.paf.chop.backend.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponseDTO {
   
   private Long id;
   private String title;
   private ResourceType type;
   private String url;
   private Boolean completed;
   private LocalDateTime createdAt;
}