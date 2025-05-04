package com.paf.chop.backend.controllers;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.services.UserService;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();

        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setIsVerified(user.getIsVerified());
        dto.setCoins(user.getCoins());
        dto.setTotalLikes(user.getTotalLikes());
        dto.setTotalPost(user.getTotalPost());
        dto.setProfileImage(user.getProfileImage());
        dto.setBio(user.getBio());
        dto.setUserRole(user.getUserRole().name());
        dto.setToken(null); // don't send token again

        return ResponseEntity.ok(dto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return (user != null) ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/followers")
    public Set<User> getFollowers(@PathVariable Long id) {
        return userService.getFollowers(id);
    }

    @GetMapping("/{id}/following")
    public Set<User> getFollowing(@PathVariable Long id) {
        return userService.getFollowing(id);
    }

    @PostMapping("/{targetId}/follow")
    public ResponseEntity<String> follow(
            @PathVariable Long targetId,
            Authentication authentication
    ) {
        String currentUserEmail = authentication.getName();
        String result = userService.toggleFollowByEmail(currentUserEmail, targetId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        if (updates.containsKey("username")) user.setUsername(updates.get("username"));
        if (updates.containsKey("bio")) user.setBio(updates.get("bio"));
        if (updates.containsKey("profileImage")) user.setProfileImage(updates.get("profileImage"));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user != null) {
            userRepository.delete(user);
            return ResponseEntity.ok("User deleted");
        }
        return ResponseEntity.status(404).body("User not found");
    }
}
