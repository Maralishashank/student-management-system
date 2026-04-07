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

                // Public — login only. Register is now ADMIN-only so only
                // existing admins can create new admin accounts. The default
                // admin is seeded automatically by DataSeeder on first startup.
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/auth/test").permitAll()

                // SECURITY FIX: /auth/register is now restricted to ADMIN.
                // Previously it was public, meaning any anonymous user could
                // create an admin account. Now only a logged-in admin can
                // create additional admin accounts.
                .requestMatchers("/auth/register").hasRole("ADMIN")

                // /auth/change-password requires a valid token (the first-login
                // short-lived JWT satisfies this).
                .requestMatchers("/auth/change-password").authenticated()

                // /attendance/my must come BEFORE the broad /attendance/** ADMIN rule.
                .requestMatchers("/attendance/my").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers("/attendance/**").hasRole("ADMIN")

                // /students/me must come BEFORE the broad /students/** ADMIN rule.
                .requestMatchers("/students/me").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers("/students/**").hasRole("ADMIN")

                .requestMatchers("/subjects/**").hasAnyRole("ADMIN", "STUDENT")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}