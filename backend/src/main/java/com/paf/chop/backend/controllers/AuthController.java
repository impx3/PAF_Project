package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.request.LoginRequestDTO;
import com.paf.chop.backend.dto.request.RegisterRequestDTO;
import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.services.AuthService;
import com.paf.chop.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;



    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {

        UserResponseDTO loginResponseDTO = authService.login(loginRequestDTO);

        if(loginResponseDTO == null){
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return  ResponseEntity.status(HttpStatus.OK).body(loginResponseDTO);

    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO) {

        UserResponseDTO requestResponseDTO = authService.register(registerRequestDTO);

        if(requestResponseDTO == null){
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return  ResponseEntity.status(HttpStatus.CREATED).body(requestResponseDTO);

    }

}
