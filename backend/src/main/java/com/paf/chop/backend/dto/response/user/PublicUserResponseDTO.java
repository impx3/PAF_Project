package com.paf.chop.backend.dto.response.user;

import com.paf.chop.backend.models.User;
import lombok.Data;

@Data
public class PublicUserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private Integer totalLikes;
    private String firstName;
    private String lastName;
    private String profileImage;

    public PublicUserResponseDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.totalLikes = user.getTotalLikes();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.profileImage = user.getProfileImage();
    }


}
