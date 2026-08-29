package com.verification.system.controller;

import com.verification.system.dto.AuthResponse;
import com.verification.system.dto.LoginRequest;
import com.verification.system.dto.RegisterRequest;
import com.verification.system.dto.UserResponse;
import com.verification.system.model.User;
import com.verification.system.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user = authService.register(request);

        AuthResponse response =
                new AuthResponse(
                        null,
                        convertToUserResponse(user)
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        String token =
                authService.login(request);

        User user =
                authService.getUser(
                        request.getEmail()
                );

        AuthResponse response =
                new AuthResponse(
                        token,
                        convertToUserResponse(user)
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // CURRENT USER
    // =========================
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @RequestParam String email
    ) {

        User user =
                authService.getUser(email);

        return ResponseEntity.ok(
                convertToUserResponse(user)
        );
    }

    // =========================
    // CONVERT USER
    // =========================
    private UserResponse convertToUserResponse(
            User user
    ) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getActive()
        );
    }
}