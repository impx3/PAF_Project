package com.paf.chop.backend.dto.response;

import com.paf.chop.backend.configs.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Data
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Boolean isVerified;
    private Integer coins;
    private Integer totalLikes;
    private Integer totalPost;
    private String profileImage;
    private String bio;
    private String userRole;
    private String token;

}
