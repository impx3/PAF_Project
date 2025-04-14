package com.paf.chop.backend.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CommentRequestDTO {
    private String comment;
    private String commentBody;
}
