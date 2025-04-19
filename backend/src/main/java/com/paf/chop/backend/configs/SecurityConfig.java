package com.paf.chop.backend.configs;

import com.paf.chop.backend.services.MyUserDetailsService;
import com.paf.chop.backend.utils.JWTFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JWTFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Existing permitted endpoints
                        .requestMatchers("/api/auth/*").permitAll()
                        .requestMatchers("/api/posts*").permitAll()
                        .requestMatchers("/api/posts/*").permitAll()
                        .requestMatchers("/images/*").permitAll()
                        .requestMatchers("/videos*").permitAll()
                        .requestMatchers("/videos/*").permitAll()
                        .requestMatchers("/videos/upload-video").permitAll()
                        
                        // New learning plan endpoints - public access
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/search").permitAll()
                        
                        // Learning plan endpoints - authenticated access
                        .requestMatchers(HttpMethod.POST, "/api/learning-plans").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/learning-plans/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/learning-plans/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/learning-plans/*/resources/*/complete").authenticated()
                        
                        // Individual learning plan by ID - authenticated (actual access control in service)
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/*").authenticated()
                        
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        // Add JWT filter before processing UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // Expose the AuthenticationManager as a Bean using AuthenticationConfiguration
        return authenticationConfiguration.getAuthenticationManager();
    }
}