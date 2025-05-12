package com.paf.chop.backend.configs;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy.SAME_ORIGIN_ALLOW_POPUPS;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    private final JWTFilter jwtRequestFilter;
    private final FirebaseTokenFilter firebaseTokenFilter;

    @Autowired
    public SecurityConfig(JWTFilter jwtRequestFilter, FirebaseTokenFilter firebaseTokenFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.firebaseTokenFilter = firebaseTokenFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        // allow pop-ups to talk to opener.window.closed()
                        .crossOriginOpenerPolicy(policy -> policy.policy(SAME_ORIGIN_ALLOW_POPUPS))
                )
                .authorizeHttpRequests(auth -> auth
                        // Auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/auth/firebase-login").permitAll()

                        // Posts endpoints
                        .requestMatchers("/api/posts/**").permitAll()

                        // Media endpoints
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/videos/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/videos/upload-video").permitAll()




                        // Comments endpoints
                        .requestMatchers("/api/comments/**").authenticated()

                        // WebSocket/SockJS endpoints
                        .requestMatchers("/ws/**").permitAll()

                        // Learning plan endpoints
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/search").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/learning-plans").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/learning-plans/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/learning-plans/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/me").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/learning-plans/*/resources/*/complete").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/learning-plans/*").authenticated()

                        // Any other request requires authentication
                        .anyRequest().authenticated()

                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
