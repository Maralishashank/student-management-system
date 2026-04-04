package com.shashank.sms.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shashank.sms.Entity.User;
import com.shashank.sms.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.shashank.sms.Security.JwtUtil;
import com.shashank.sms.dto.LoginRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // FIX: On first login, return a real JWT that also carries a "firstLogin=true"
        // claim. The frontend detects this claim and redirects to the change-password page.
        // Because the token is a valid JWT, the student can immediately use it to call
        // POST /auth/change-password (which requires authentication).
        // This removes the deadlock where the student had no token to make that call.
        if (user.isFirstLogin() && user.getRole().equals("STUDENT")) {
            return jwtUtil.generateFirstLoginToken(user.getUsername(), user.getRole());
        }

        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}