package com.paf.chop.backend.utils;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final String FIREBASE_PREFIX = "Firebase ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // ← If there's no "Firebase " prefix, let someone else (e.g. your JWTFilter) handle it:
        if (authHeader == null || !authHeader.startsWith(FIREBASE_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Strip off the "Firebase " and verify the ID token
        String idToken = authHeader.substring(FIREBASE_PREFIX.length());
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance()
                    .verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            // Build an Authentication and set it into the context
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(uid, null, Collections.emptyList());
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // Invalid or expired Firebase ID token
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Continue down the filter chain
        filterChain.doFilter(request, response);
    }
}
