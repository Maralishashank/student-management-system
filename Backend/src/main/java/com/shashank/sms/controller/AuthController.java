package com.shashank.sms.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.shashank.sms.Security.JwtUtil;
import com.shashank.sms.dto.ChangePasswordRequest;
import com.shashank.sms.dto.LoginRequest;
import com.shashank.sms.Entity.User;
import com.shashank.sms.service.AttendanceService;
import com.shashank.sms.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AttendanceService attendanceService;

    public AuthController(AuthService authService,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            AttendanceService attendanceService) {

this.authService = authService;
this.jwtUtil = jwtUtil;
this.authenticationManager = authenticationManager;
this.attendanceService = attendanceService;
}

    // Register new user
    @PostMapping("/register")
    public User register(@RequestBody User user){
        return authService.register(user);
    }

    // Test endpoint
    @GetMapping("/test")
    public String test(){
        return "Auth working";
    }

    // Login and generate JWT
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        User user = authService.findByUsername(request.getUsername());

        if(user.getRole().equals("STUDENT")){
            attendanceService.markAttendance(user.getUsername());
        }
        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }
    
    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request,
                                 Authentication authentication){

        String username = authentication.getName();

        User user = authService.findByUsername(username);

        if(!authService.checkPassword(request.getOldPassword(), user.getPassword())){
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(authService.encodePassword(request.getNewPassword()));
        user.setFirstLogin(false);

        authService.save(user);

        return "Password changed successfully";
    }
}