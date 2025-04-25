package com.paf.chop.backend.dto.request;

import lombok.Data;


@Data
public class RegisterRequestDTO {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;

}
