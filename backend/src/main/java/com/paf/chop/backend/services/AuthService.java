package com.paf.chop.backend.services;

import com.paf.chop.backend.configs.UserRole;
import com.paf.chop.backend.dto.request.LoginRequestDTO;
import com.paf.chop.backend.dto.request.RegisterRequestDTO;
import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtil jwtUtil;

    public UserResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            log.info("login request : {}", loginRequestDTO.getUsername());
            if(loginRequestDTO.getPassword()==null && loginRequestDTO.getUsername()==null){
                log.info("login empty request");
                return null;
            }

            User user = userRepository.findByUsername(loginRequestDTO.getUsername());

            if(user==null){
                log.info("user not found");
                return null;
            }

            if(!loginRequestDTO.getPassword().equals(user.getPassword())){
                return null;
            }

            String token = jwtUtil.generateToken(user);

            log.info("login successful");
            return getUserResponseDTO(user, token);

        }catch(Exception e) {
            throw new RuntimeException(e);
        }



    }
    public UserResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        try{
            if(registerRequestDTO.getUsername() == null
                    && registerRequestDTO.getPassword() == null
                    && registerRequestDTO.getFirstName() == null
                    && registerRequestDTO.getLastName() == null
                    && registerRequestDTO.getEmail() == null) {
                return null;
            }
            User user = new User();
            user.setUsername(registerRequestDTO.getUsername());
            user.setPassword(registerRequestDTO.getPassword());
            user.setFirstName(registerRequestDTO.getFirstName());
            user.setLastName(registerRequestDTO.getLastName());
            user.setEmail(registerRequestDTO.getEmail());
            user.setUserRole(UserRole.USER);
            userRepository.save(user);

            //log.info("user registered successfully");

            String token = jwtUtil.generateToken(user);
            return getUserResponseDTO(user , token);

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
