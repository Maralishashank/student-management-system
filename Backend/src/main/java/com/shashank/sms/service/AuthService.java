package com.shashank.sms.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private final AttendanceService attendanceService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AttendanceService attendanceService,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = (BCryptPasswordEncoder) passwordEncoder;
        this.attendanceService = attendanceService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public User register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByUsername(String username){
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword){
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String login(LoginRequest request){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if first login
        if(user.isFirstLogin()){
            throw new RuntimeException("FIRST_LOGIN_CHANGE_PASSWORD");
        }

        attendanceService.markAttendance(user.getUsername());

        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }
    
    public String encodePassword(String password){
        return passwordEncoder.encode(password);
    }

    public User save(User user){
        return userRepository.save(user);
    }
}