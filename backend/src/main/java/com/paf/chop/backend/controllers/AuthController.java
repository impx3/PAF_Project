package com.paf.chop.backend.controllers;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.paf.chop.backend.dto.request.LoginRequestDTO;
import com.paf.chop.backend.dto.request.RegisterRequestDTO;
import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.services.AuthService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
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

    @PostMapping("/firebase-login")
    public ResponseEntity<ApiResponse<UserResponseDTO>> firebaseLogin(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, "Missing or invalid token", null));
            }

            String idToken = authorizationHeader.substring(7);
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String firebaseUid = decodedToken.getUid();

            UserResponseDTO user = authService.handleFirebaseLogin(firebaseUid);

            return ResponseEntity.ok(new ApiResponse<>(true, "Firebase login successful", user));

        } catch (FirebaseAuthException e) {
            log.error("Firebase token verification failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Token verify error: " + e.getMessage(), null));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(false, "Invalid Firebase token", null));
        }
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
