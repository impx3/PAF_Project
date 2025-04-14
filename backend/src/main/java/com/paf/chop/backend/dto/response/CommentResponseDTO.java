package com.paf.chop.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponseDTO {

    private String profileImage;
    private String username;
    private String commentBody;
    private Integer likeCount;
    private LocalDateTime updatedAt;

}
