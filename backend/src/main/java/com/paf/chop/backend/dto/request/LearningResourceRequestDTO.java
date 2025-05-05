package com.paf.chop.backend.dto.request;

import com.paf.chop.backend.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningResourceRequestDTO {
    private String title;
    private String description;
    private ResourceType type;
    private String url;
} 