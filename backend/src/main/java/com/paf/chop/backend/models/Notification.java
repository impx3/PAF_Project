package com.paf.chop.backend.models;

import com.paf.chop.backend.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "t_notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "notification_id")
    private Long notificationId;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name="user_id")
    private Long userId;

    @Column(name="is_read")
    private Boolean isRead = false;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }



}
