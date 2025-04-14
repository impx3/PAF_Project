package com.paf.chop.backend.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CommentResponseDTO {

    private String profileImage;
    private String username;
    private String commentBody;
    private Integer likeCount;
    private String updatedAt;

}
