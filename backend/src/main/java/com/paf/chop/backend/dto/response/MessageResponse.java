package com.paf.chop.backend.dto.response;

import com.paf.chop.backend.models.Message;
import lombok.Data;

@Data
public class MessageResponse {

    private Long id;
    private String content;
    private String senderName;
    private String recipientName;
    private boolean seen;
    private boolean delivered;

    public MessageResponse(Message message) {
        this.id = message.getMessageId();
        this.content = message.getContent();
        this.senderName = message.getSender().getFirstName();
        this.recipientName = message.getRecipient().getFirstName();
        this.seen = message.isSeen();
        this.delivered = message.isDelivered();
    }
}
