// src/main/java/com/paf/chop/backend/services/UserService.java
package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.dto.response.user.PublicUserResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Resolve an authenticated email to its User ID.
     */
    public Long findIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email))
                .getId();
    }

    /**
     * Build full profile DTO for /me.
     */
    @Transactional(readOnly = true)
    public UserResponseDTO buildFullProfile(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        UserResponseDTO dto = new UserResponseDTO(u);
        dto.setFollowerCount(u.getFollowers().size());
        dto.setFollowingCount(u.getFollowing().size());

        dto.setFollowers(
                u.getFollowers().stream()
                        .map(PublicUserResponseDTO::new)
                        .collect(Collectors.toList())
        );
        dto.setFollowing(
                u.getFollowing().stream()
                        .map(PublicUserResponseDTO::new)
                        .collect(Collectors.toList())
        );
        return dto;
    }

    /**
     * Toggle follow/unfollow between two user IDs.
     */
    @Transactional
    public String toggleFollowByIds(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            return "Cannot follow yourself";
        }
        User current = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + targetUserId));

        if (current.getFollowing().remove(target)) {
            target.getFollowers().remove(current);
            userRepository.save(current);
            userRepository.save(target);
            return "Unfollowed successfully";
        } else {
            current.getFollowing().add(target);
            target.getFollowers().add(current);
            // optional coin/verification logic
            current.setCoins(current.getCoins() + 10);
            if (current.getCoins() >= 100) current.setIsVerified(true);

            userRepository.save(current);
            userRepository.save(target);
            return "Followed successfully";
        }
    }

    /**
     * Return public DTO list of followers.
     */
    @Transactional(readOnly = true)
    public List<PublicUserResponseDTO> getFollowersDto(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return u.getFollowers().stream()
                .map(PublicUserResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Return public DTO list of following.
     */
    @Transactional(readOnly = true)
    public List<PublicUserResponseDTO> getFollowingDto(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return u.getFollowing().stream()
                .map(PublicUserResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Update profile fields for /me.
     */
    @Transactional
    public void updateProfile(Long userId, Map<String, String> updates) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (updates.containsKey("username"))   u.setUsername(updates.get("username"));
        if (updates.containsKey("bio"))        u.setBio(updates.get("bio"));
        if (updates.containsKey("profileImage")) u.setProfileImage(updates.get("profileImage"));
        u.setUpdatedAt(LocalDateTime.now());

        userRepository.save(u);
    }

    /**
     * Delete a user by ID.
     */
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    /**
     * List all users as public DTOs.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<PublicUserResponseDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<PublicUserResponseDTO> dtos = users.stream()
                .map(PublicUserResponseDTO::new)
                .collect(Collectors.toList());
        return ApiResponse.success(dtos, "Users fetched");
    }

    /**
     * Get raw User entity (if ever needed).
     */
    @Transactional(readOnly = true)
    public java.util.Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }


    public Boolean isUserExists(Long userId) {
        return userRepository.existsById(userId);
    }
}
