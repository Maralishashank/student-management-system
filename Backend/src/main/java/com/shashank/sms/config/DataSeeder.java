package com.shashank.sms.config;

import com.shashank.sms.Entity.User;
import com.shashank.sms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Runs once on every application startup.
// Creates a default admin account only if no admin exists in the database yet.
// This means:
//   - First run on a fresh DB: admin account is created automatically.
//   - Subsequent runs: the existing admin is found, nothing is inserted.
// Testers and deployments get working credentials immediately without any manual
// curl command or public registration endpoint.
//
// Default credentials: admin / admin123
// Change ADMIN_PASSWORD below (or better: move to application.properties) before production.

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean adminExists = userRepository.findByUsername(ADMIN_USERNAME).isPresent();

        if (!adminExists) {
            User admin = new User();
            admin.setUsername(ADMIN_USERNAME);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole("ADMIN");
            admin.setFirstLogin(false);
            userRepository.save(admin);
            System.out.println("[SMS] Default admin created — username: admin, password: admin123");
        } else {
            System.out.println("[SMS] Admin account already exists — skipping seed.");
        }
    }
}