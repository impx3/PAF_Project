package com.paf.chop.backend.dto.response;

import lombok.Data;

@Data
public class VideoResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private Integer likeCount;
    private Boolean isLiked;

}
