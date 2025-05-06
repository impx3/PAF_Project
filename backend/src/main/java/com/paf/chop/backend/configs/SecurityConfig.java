package com.paf.chop.backend.configs;

import com.paf.chop.backend.services.MyUserDetailsService;
import com.paf.chop.backend.utils.FirebaseTokenFilter;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;


import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JWTFilter jwtRequestFilter;

    @Autowired
    private FirebaseTokenFilter firebaseTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http


            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .cors(withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Auth endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Posts endpoints
                .requestMatchers("/api/posts/**").permitAll()
                .requestMatchers("/api/posts**").authenticated()
                .requestMatchers("/api/posts/**").authenticated()  
                // Media endpoints
                .requestMatchers("/images/**").permitAll()
                .requestMatchers("/videos/**").permitAll()
                                   
                .requestMatchers("/images/*").permitAll()
                .requestMatchers("/videos*").permitAll()  //
                .requestMatchers("/videos/*").permitAll()
                .requestMatchers("/videos/upload-video").permitAll()
                .requestMatchers("/videos*").permitAll()                                   

                // Comments endpoints
                .requestMatchers("/api/comments/**").authenticated()

                // WebSocket/SockJS endpoints
                .requestMatchers("/ws/**").permitAll()

                // Learning Plan endpoints (public)
                .requestMatchers(HttpMethod.GET, "/api/learning-plans/public").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/learning-plans/search").permitAll()

                // Learning Plan endpoints (authenticated)
                .requestMatchers(HttpMethod.POST, "/api/learning-plans").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/learning-plans/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/learning-plans/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/learning-plans/me").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/learning-plans/*/resources/*/complete").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/learning-plans/*").authenticated()

                // Default: all other endpoints require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );


        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // Replace with specific origins in production
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}