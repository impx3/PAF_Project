package com.paf.chop.backend.models;

import com.paf.chop.backend.configs.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    private NotificationType type;

    @Column(name="user_id")
    private Long userId;

    @Column(name="is_read")
    private Boolean isRead = false;


}
