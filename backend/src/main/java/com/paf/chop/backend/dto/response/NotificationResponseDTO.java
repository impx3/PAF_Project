package com.paf.chop.backend.dto.response;

import lombok.Data;

@Data
public class NotificationResponseDTO {
    private Long id;
    private String message;
    private String type;
    private Long userId;
    private Boolean isRead;
    private String createdAt;
}
