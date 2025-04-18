package com.paf.chop.backend.services;

import com.paf.chop.backend.configs.UserRole;
import com.paf.chop.backend.dto.request.LoginRequestDTO;
import com.paf.chop.backend.dto.request.RegisterRequestDTO;
import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.ApiResponse;
import com.paf.chop.backend.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserResponseDTO login(LoginRequestDTO loginRequestDTO) {;
        try {
            log.info("login request : {}", loginRequestDTO.getUsername());
            if(loginRequestDTO.getPassword()==null || loginRequestDTO.getUsername()==null){
                log.info("login empty request");
                return null;
            }

            User user = userRepository.findByUsername(loginRequestDTO.getUsername());

            if(user==null){
                log.info("user not found");
                return null;
            }


            if(!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())){
                log.info("password not matched");
                return null;
            }

            String token = jwtUtil.generateToken(user);

            log.info("login successful");
            return getUserResponseDTO(user, token);

        }catch(Exception e) {
            throw new RuntimeException(e);
        }



    }
    public ApiResponse<UserResponseDTO> register(RegisterRequestDTO registerRequestDTO) {
        try{
            if(registerRequestDTO.getUsername() == null
                    || registerRequestDTO.getPassword() == null
                    || registerRequestDTO.getFirstName() == null
                    || registerRequestDTO.getLastName() == null
                    || registerRequestDTO.getEmail() == null) {
                return ApiResponse.error("Missing Fields");
            }
            if (userRepository.isUserExistByUsernameOrEmail(registerRequestDTO.getUsername(), registerRequestDTO.getEmail()) ){
                log.error("Email already exists");
                return ApiResponse.error("User already exists");

            }
            User user = new User();
            user.setUsername(registerRequestDTO.getUsername());

            user.setFirstName(registerRequestDTO.getFirstName());
            user.setLastName(registerRequestDTO.getLastName());
            user.setEmail(registerRequestDTO.getEmail());
            user.setUserRole(UserRole.USER);

            String encodedPassword = passwordEncoder.encode(registerRequestDTO.getPassword());
            user.setPassword(encodedPassword);

            userRepository.save(user);

            log.info("user registered successfully");

            String token = jwtUtil.generateToken(user);
            return ApiResponse.success(getUserResponseDTO(user , token), "User Registered Successfully");

        }catch(Exception e){
            throw new RuntimeException(e);
        }

    }

    private UserResponseDTO getUserResponseDTO(User user, String token) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setUsername(user.getUsername());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setFirstName(user.getFirstName());
        userResponseDTO.setLastName(user.getLastName());
        userResponseDTO.setIsVerified(user.getIsVerified());
        userResponseDTO.setCoins(user.getCoins());
        userResponseDTO.setTotalLikes(user.getTotalLikes());
        userResponseDTO.setTotalPost(user.getTotalPost());
        userResponseDTO.setProfileImage(user.getProfileImage());
        userResponseDTO.setBio(user.getBio());
        userResponseDTO.setUserRole(user.getUserRole().name());
        userResponseDTO.setToken(token);
        return userResponseDTO;
    }
    }
