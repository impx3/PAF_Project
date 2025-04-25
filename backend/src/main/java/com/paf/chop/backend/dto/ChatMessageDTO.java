package com.paf.chop.backend.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Long senderId;
    private Long recipientId;
    private String content;
}
