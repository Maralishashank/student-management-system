package com.shashank.sms.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.shashank.sms.dto.ChangePasswordRequest;
import com.shashank.sms.dto.LoginRequest;
import com.shashank.sms.Entity.User;
import com.shashank.sms.service.AuthService;

// Simplified back to original structure — the new /auth/first-login-change endpoint
// is no longer needed because AuthService.login() now returns a real JWT (with
// firstLogin=true claim) for first-login students, which they can immediately use
// to authenticate the existing /auth/change-password call.

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/test")
    public String test() {
        return "Auth working";
    }

    // Works for both first-login (using the firstLogin JWT) and normal password changes.
    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request,
                                 Authentication authentication) {

        String username = authentication.getName();
        User user = authService.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!authService.checkPassword(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(authService.encodePassword(request.getNewPassword()));
        user.setFirstLogin(false);
        authService.save(user);

        return "Password changed successfully";
    }
}