package com.paf.chop.backend.dto.request;

import lombok.Data;

@Data
public class CommentRequestDTO {
    private String username;
    private long postId;
    private String commentBody;
}
