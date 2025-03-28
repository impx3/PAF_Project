package com.paf.chop.backend.models;

import com.paf.chop.backend.configs.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "t_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false , name = "first_name")
    private String firstName;

    @Column(nullable = false , name = "last_name")
    private String lastName;

    @Column(nullable = false , name = "is_verified")
    private Boolean isVerified = false;

    private Integer coins = 0;

    @Column(name = "total_likes")
    private Integer totalLikes = 0;

    @Column(name = "total_post")
    private Integer totalPost = 0;

    @Column(name = "profile_image")
    private String profileImage;

    private String bio;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole = UserRole.USER;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }







}
