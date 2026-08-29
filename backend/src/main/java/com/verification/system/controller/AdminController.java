package com.verification.system.controller;

import com.verification.system.model.User;
import com.verification.system.model.Application;
import com.verification.system.model.Certificate;
import com.verification.system.model.Instrument;

import com.verification.system.repository.UserRepository;
import com.verification.system.repository.ApplicationRepository;
import com.verification.system.repository.CertificateRepository;
import com.verification.system.repository.InstrumentRepository;
import com.verification.system.service.InstrumentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    private final InstrumentRepository instrumentRepository;

        private final InstrumentService instrumentService;

    private final ApplicationRepository applicationRepository;

    private final CertificateRepository certificateRepository;

    private final PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {

        Map<String, Object> data =
                new HashMap<>();

        data.put(
                "totalUsers",
                userRepository.count()
        );

        data.put(
                "totalApplicants",
                userRepository
                        .findByRole(
                                User.Role.APPLICANT
                        )
                        .size()
        );

        data.put(
                "totalInspectors",
                userRepository
                        .findByRole(
                                User.Role.INSPECTOR
                        )
                        .size()
        );

        data.put(
                "totalInstruments",
                instrumentRepository.count()
        );

        data.put(
                "totalApplications",
                applicationRepository.count()
        );

        data.put(
                "totalCertificates",
                certificateRepository.count()
        );

        return ResponseEntity.ok(data);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> users() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }

        @PostMapping("/users")
        public ResponseEntity<User> createUser(@RequestBody User request) {
                if (request.getEmail() == null || request.getEmail().isBlank()
                                || request.getPassword() == null || request.getPassword().isBlank()) {
                        throw new RuntimeException("Email and password are required");
                }

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                User user = new User();
                user.setName(request.getName());
                user.setEmail(request.getEmail());
                user.setPhone(request.getPhone());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole(User.Role.APPLICANT);
                user.setActive(true);

                return ResponseEntity.ok(userRepository.save(user));
        }

        @PostMapping("/applicants")
        public ResponseEntity<User> createApplicant(@RequestBody User request) {
                return createUser(request);
        }

    @GetMapping("/inspectors")
    public ResponseEntity<List<User>>
    inspectors() {

        return ResponseEntity.ok(
                userRepository.findByRole(
                        User.Role.INSPECTOR
                )
        );
    }

    @PostMapping("/inspectors")
    public ResponseEntity<User>
    createInspector(
            @RequestBody User request
    ) {

        if (
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User inspector =
                new User();

        inspector.setName(
                request.getName()
        );

        inspector.setEmail(
                request.getEmail()
        );

        inspector.setPhone(
                request.getPhone()
        );

        inspector.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        inspector.setRole(
                User.Role.INSPECTOR
        );

        inspector.setActive(true);

        return ResponseEntity.ok(
                userRepository.save(
                        inspector
                )
        );
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User>
    updateRole(
            @PathVariable String id,
            @RequestParam User.Role role
    ) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        user.setRole(role);

        return ResponseEntity.ok(
                userRepository.save(user)
        );
    }

    @PutMapping("/users/{id}/active")
    public ResponseEntity<User>
    updateActive(
            @PathVariable String id,
            @RequestParam boolean active
    ) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        user.setActive(active);

        return ResponseEntity.ok(
                userRepository.save(user)
        );
    }

    @GetMapping("/instruments")
    public ResponseEntity<List<Instrument>>
    instruments() {

        return ResponseEntity.ok(
                instrumentRepository.findAll()
        );
    }

    @PutMapping("/instruments/{id}/assign")
        @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Instrument> assignInstrument(
            @PathVariable String id,
            @RequestParam String inspectorId
    ) {
        return ResponseEntity.ok(
                instrumentService.assignInspector(id, inspectorId)
        );
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>>
    applications() {

        return ResponseEntity.ok(
                applicationRepository.findAll()
        );
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<Certificate>>
    certificates() {

        return ResponseEntity.ok(
                certificateRepository.findAll()
        );
    }

    @GetMapping("/reports")
    public ResponseEntity<?> reports() {

                List<Instrument> instruments = instrumentRepository.findAll();
                long verified = instruments.stream().filter(instrument -> "VERIFIED".equalsIgnoreCase(instrument.getStatus())).count();
                long rejected = instruments.stream().filter(instrument -> "REJECTED".equalsIgnoreCase(instrument.getStatus())).count();
                long assigned = instruments.stream().filter(instrument -> "ASSIGNED".equalsIgnoreCase(instrument.getStatus())).count();
                long pending = instruments.stream().filter(instrument -> "PENDING".equalsIgnoreCase(instrument.getStatus())).count();

        Map<String, Object> report =
                new HashMap<>();

        report.put(
                "users",
                userRepository.count()
        );

        report.put(
                "instruments",
                instrumentRepository.count()
        );

        report.put(
                "applications",
                applicationRepository.count()
        );

        report.put(
                "certificates",
                certificateRepository.count()
        );

        report.put("verified", verified);
        report.put("rejected", rejected);
        report.put("assigned", assigned);
        report.put("pending", pending);
                report.put("generatedOn", LocalDate.now().toString());

                DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
                Map<String, Long> monthly = new LinkedHashMap<>();
                instruments.forEach(instrument -> {
                        if (instrument.getCreatedAt() != null) {
                                String month = instrument.getCreatedAt().format(monthFormatter);
                                monthly.put(month, monthly.getOrDefault(month, 0L) + 1);
                        }
                });
                report.put("monthlyInstruments", monthly);

        return ResponseEntity.ok(report);
    }
}