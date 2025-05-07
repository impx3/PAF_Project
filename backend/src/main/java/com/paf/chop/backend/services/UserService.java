package com.paf.chop.backend.services;


import com.paf.chop.backend.dto.response.user.PublicUserResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.paf.chop.backend.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    private final  UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public String toggleFollowByEmail(String email, Long targetUserId) {
        User current = userRepository.findByEmail(email);
        User target = userRepository.findById(targetUserId).orElse(null);

        if (current == null || target == null || current.equals(target)) return "Invalid users";

        if (current.getFollowing().contains(target)) {
            current.getFollowing().remove(target);
            target.getFollowers().remove(current);
        } else {
            current.getFollowing().add(target);
            target.getFollowers().add(current);

            // Score logic
            current.setCoins(current.getCoins() + 10);
            if (current.getCoins() >= 100) {
                current.setIsVerified(true);
            }
    }

        userRepository.save(current);
        userRepository.save(target);
        return "Follow/unfollow successful";
    }

    public Set<User> getFollowers(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return (user != null) ? user.getFollowers() : new HashSet<>();
    }

    public Set<User> getFollowing(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return (user != null) ? user.getFollowing() : new HashSet<>();
    }

    public ApiResponse<List<PublicUserResponseDTO>> getAllUsers() {
       try{
           List<User> users = userRepository.findAll();
           if (users.isEmpty()) {
               return  ApiResponse.success(null,"Users not found");
           }

              List<PublicUserResponseDTO> userResponseDTOs = users.stream()
                     .map(PublicUserResponseDTO::new)
                     .toList();
           return ApiResponse.success(userResponseDTOs, "Users found");
       } catch (Exception e) {
              return ApiResponse.error("Error fetching users: " + e.getMessage());
       }
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public boolean isUserExists(Long userId) {
        return userRepository.existsById(userId);
    }
}
