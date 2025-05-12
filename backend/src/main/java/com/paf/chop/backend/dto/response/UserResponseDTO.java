package com.paf.chop.backend.dto.response;

import com.paf.chop.backend.dto.response.user.PublicUserResponseDTO;
import org.springframework.hateoas.RepresentationModel;
import lombok.Data;

import com.paf.chop.backend.models.User;

import java.util.List;


@Data
public class UserResponseDTO extends RepresentationModel<UserResponseDTO> {

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

    private List<PublicUserResponseDTO> followers;
    private List<PublicUserResponseDTO> following;

    private Integer followerCount;
    private Integer followingCount;
  
    public UserResponseDTO() {
    }

    public UserResponseDTO (User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.isVerified = user.getIsVerified();
        this.coins = user.getCoins();
        this.totalLikes = user.getTotalLikes();
        this.totalPost = user.getTotalPost();
        this.profileImage = user.getProfileImage();
        this.bio = user.getBio();
        this.userRole = user.getUserRole().name();
    }

}
