package com.paf.chop.backend.utils;

import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    /**
     * Gets the current user ID from the security context
     *
     * @return the current user ID
     * @throws IllegalStateException if user is not authenticated or ID cannot be retrieved
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        // Get the username from the authentication
        String username = authentication.getName();

        // Find the user in the database
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalStateException("User not found: " + username);
        }

        return user.getId();
    }
}