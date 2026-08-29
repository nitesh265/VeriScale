package com.verification.system.service;

import com.verification.system.dto.LoginRequest;
import com.verification.system.dto.RegisterRequest;
import com.verification.system.model.User;
import com.verification.system.repository.UserRepository;
import com.verification.system.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // =========================
    // REGISTER
    // =========================
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Every normal registration is APPLICANT
        user.setRole(User.Role.APPLICANT);

        user.setActive(true);

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        if (!user.getActive()) {
            throw new RuntimeException(
                    "User account is inactive"
            );
        }

        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }

    // =========================
    // GET USER
    // =========================
    public User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }
}