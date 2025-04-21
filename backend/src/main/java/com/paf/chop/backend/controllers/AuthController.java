package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.request.LoginRequestDTO;
import com.paf.chop.backend.dto.request.RegisterRequestDTO;
import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.services.AuthService;
import com.paf.chop.backend.utils.ApiResponse;
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
    public ResponseEntity<ApiResponse<UserResponseDTO>> login(@RequestBody LoginRequestDTO loginRequestDTO) {

        UserResponseDTO loginResponseDTO = authService.login(loginRequestDTO);

        if(loginResponseDTO == null){
            ApiResponse<UserResponseDTO> response = new ApiResponse<>(false, "Login fail", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        ApiResponse<UserResponseDTO> response = new ApiResponse<>(true, "Login successfully", loginResponseDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(response);

    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(@RequestBody RegisterRequestDTO registerRequestDTO) {

        ApiResponse<UserResponseDTO> requestResponseDTO = authService.register(registerRequestDTO);

        if(requestResponseDTO.isSuccess()){
            return ResponseEntity.status(HttpStatus.CREATED).body(requestResponseDTO);
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(requestResponseDTO);
        }

    }
}
