package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.response.UserResponseDTO;
import com.paf.chop.backend.dto.response.user.PublicUserResponseDTO;
import com.paf.chop.backend.services.UserService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ─── Get current user full profile (with follower/following lists) ───
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication auth) {
        Long userId = userService.findIdByUsername(auth.getName());
        UserResponseDTO dto = userService.buildFullProfile(userId);
        return ResponseEntity.ok(dto);
    }

    // ─── Get any user’s raw entity (if you still need it) ───
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            UserResponseDTO dto = userService.buildFullProfile(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }


    // ─── Toggle follow/unfollow ───
    @PostMapping("/{currentUserId}/follow/{targetUserId}")
    public ResponseEntity<ApiResponse<String>> toggleFollow(
            @PathVariable Long currentUserId,
            @PathVariable Long targetUserId
    ) {
        String msg = userService.toggleFollowByIds(currentUserId, targetUserId);
        return ResponseEntity.ok(ApiResponse.success(msg, "Followed User Successfully"));
    }

    // ─── List of public profiles following you ───
    @GetMapping("/{id}/followers")
    public ResponseEntity<List<PublicUserResponseDTO>> getFollowers(@PathVariable Long id) {
        List<PublicUserResponseDTO> list = userService.getFollowersDto(id);
        return ResponseEntity.ok(list);
    }

    // ─── List of public profiles you are following ───
    @GetMapping("/{id}/following")
    public ResponseEntity<List<PublicUserResponseDTO>> getFollowing(@PathVariable Long id) {
        List<PublicUserResponseDTO> list = userService.getFollowingDto(id);
        return ResponseEntity.ok(list);
    }

    // ─── Upload profile image ───
    @PostMapping("/upload")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/profilePictures/";
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                throw new IOException("Failed to create upload directory: " + uploadDir);
            }

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destination = new File(uploadDir, filename);
            file.transferTo(destination);

            return ResponseEntity.ok("/uploads/profilePictures/" + filename);

        } catch (IOException e) {
            log.error("Failed to upload profile image", e);
            return ResponseEntity.status(500).body("File upload failed");
        }
    }

    // ─── Update own profile ───
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> updates,
            Authentication auth
    ) {
        Long userId = userService.findIdByUsername(auth.getName());
        System.out.println("Update request received: " + updates);
        userService.updateProfile(userId, updates);
        return ResponseEntity.ok(ApiResponse.success(true,"Profile updated"));
    }

    // ─── Delete own account ───
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(Authentication auth) {
        Long userId = userService.findIdByUsername(auth.getName());
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success(true,"User deleted"));
    }

    // ─── List all users (public DTO) ───
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PublicUserResponseDTO>>> getAllUsers() {
        ApiResponse<List<PublicUserResponseDTO>> resp = userService.getAllUsers();
        return resp.isSuccess()
                ? ResponseEntity.ok(resp)
                : ResponseEntity.badRequest().body(resp);
    }

    @GetMapping("/my-coins")
    public ResponseEntity<ApiResponse<Integer>> getMyCoins() {
        ApiResponse<Integer> resp = userService.getMyCoins();
        return resp.isSuccess()
                ? ResponseEntity.ok(resp)
                : ResponseEntity.badRequest().body(resp);
    }
}
