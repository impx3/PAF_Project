package com.paf.chop.backend.dto.request;

import com.paf.chop.backend.configs.UserRole;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Data
public class RegisterRequestDTO {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;

}
