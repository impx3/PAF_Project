package com.paf.chop.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponseDTO {
    private Long postId;
    private Long createdUserId;
    private String createdUserName;
    private String profileImage;
    private String commentBody;
    private Integer likeCount;
    private LocalDateTime updatedAt;
}
