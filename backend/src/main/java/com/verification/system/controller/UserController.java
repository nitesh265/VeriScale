package com.verification.system.controller;

import com.verification.system.model.User;
import com.verification.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/applicants")
    public ResponseEntity<List<User>> getApplicants() {

        List<User> applicants =
                userRepository.findByRole(User.Role.APPLICANT);

        return ResponseEntity.ok(applicants);
    }
}