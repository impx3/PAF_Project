package com.paf.chop.backend.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.bind.annotation.*;

import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.services.UserService;
import java.io.File;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
  
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }


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
        dto.setToken(null); // Don't expose token

	dto.setFollowerCount(user.getFollowers().size());
	dto.setFollowingCount(user.getFollowing().size());


	// HATEOAS links
        dto.add(linkTo(methodOn(UserController.class).getCurrentUser(authentication)).withSelfRel());
        dto.add(linkTo(methodOn(UserController.class).getFollowers(user.getId())).withRel("followers"));
        dto.add(linkTo(methodOn(UserController.class).getFollowing(user.getId())).withRel("following"));
        dto.add(linkTo(methodOn(UserController.class).updateProfile(null, authentication)).withRel("update-profile"));
        dto.add(linkTo(methodOn(UserController.class).deleteCurrentUser(authentication)).withRel("delete-account"));

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return (user != null) ? ResponseEntity.ok(user) : 	ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/followers")
    public Set<User> getFollowers(@PathVariable Long id) {
        log.info( "Get Followers for user with ID: {}", id);
        return userService.getFollowers(id);
    }

    @GetMapping("/{id}/following")
    public Set<User> getFollowing(@PathVariable Long id) {
        return userService.getFollowing(id);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        try {
            String uploadDir = "uploads/profilePictures/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filepath = uploadDir + filename;

            file.transferTo(new File(filepath));

            return ResponseEntity.ok("/" + filepath.replace("\\", "/"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed");
        }
    }

    @PostMapping("/{targetId}/follow")
    public ResponseEntity<String> follow(@PathVariable Long targetId, Authentication authentication) {
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