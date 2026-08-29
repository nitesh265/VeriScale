package com.verification.system.config;

import com.verification.system.model.User;

import com.verification.system.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initializeAdmin() {

        return args -> {

            if (
                    !userRepository
                            .existsByEmail(
                                    "admin@verification.com"
                            )
            ) {

                User admin =
                        new User();

                admin.setName(
                        "System Administrator"
                );

                admin.setEmail(
                        "admin@verification.com"
                );

                admin.setPassword(
                        passwordEncoder.encode(
                                "Admin@123"
                        )
                );

                admin.setRole(
                        User.Role.ADMIN
                );

                admin.setActive(true);

                userRepository.save(admin);
            }
        };
    }
}