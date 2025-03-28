package com.paf.chop.backend.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class LoginRequestDTO {
    private String username;
    private String password;
}
