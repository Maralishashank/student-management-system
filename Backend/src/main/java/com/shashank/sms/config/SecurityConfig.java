package com.shashank.sms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.shashank.sms.Security.JwtFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // Public endpoints — login and register only.
                // All /auth/** routes are also passed through by JwtFilter directly,
                // so no token is needed for any /auth/ call at the filter level.
                // We still list change-password as authenticated here so Spring Security
                // enforces it has a valid Authentication object (populated by JwtFilter
                // from the first-login token).
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/auth/register").permitAll()
                .requestMatchers("/auth/test").permitAll()
                .requestMatchers("/auth/change-password").authenticated()

                // FIX: /attendance/my must come BEFORE the broad /attendance/** ADMIN rule.
                // Spring Security matches rules in order — the first match wins.
                .requestMatchers("/attendance/my").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers("/attendance/**").hasRole("ADMIN")

                // FIX: /students/me must come BEFORE the broad /students/** ADMIN rule.
                .requestMatchers("/students/me").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers("/students/**").hasRole("ADMIN")

                .requestMatchers("/subjects/**").hasAnyRole("ADMIN", "STUDENT")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}