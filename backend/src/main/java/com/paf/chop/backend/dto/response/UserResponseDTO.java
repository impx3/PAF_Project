package com.paf.chop.backend.dto.response;


import lombok.Data;

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
