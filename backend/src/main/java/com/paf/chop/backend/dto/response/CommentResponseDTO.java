package com.paf.chop.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponseDTO {
    private Long postId;
    private Long videoId;
    private Long commentId;
    private Long createdUserId;
    private String createdUserName;
    private String profileImage;
    private String commentBody;
    private Integer likeCount;
    private Boolean isLiked;
    private LocalDateTime updatedAt;
}
