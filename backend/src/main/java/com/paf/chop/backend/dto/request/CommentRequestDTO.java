package com.paf.chop.backend.dto.request;

import lombok.Data;

@Data
public class CommentRequestDTO {
    private Long userId;
    private Long postId;
    private String commentBody;
}
