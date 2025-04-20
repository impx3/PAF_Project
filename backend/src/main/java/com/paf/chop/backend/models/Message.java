package com.paf.chop.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "t_message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id", nullable = false, unique = true)
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false, referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false, referencedColumnName = "id")
    private User recipient;

    private String content;

    private LocalDateTime timestamp;

    private boolean seen;

    @Column(name = "is_delivered")
    private boolean isDelivered = false;

    @PrePersist
    private void prePersist() {
        this.timestamp = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate() {
        this.timestamp = LocalDateTime.now();
    }


}
