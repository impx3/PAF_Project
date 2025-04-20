package com.paf.chop.backend.dto.response;

import lombok.Data;

@Data
public class ConversationResponseDTO {
    private Long id;
    private String senderName;
    private String recipientName;
    private String content;
    private String timestamp;
    private boolean seen;
    private boolean delivered;
}
