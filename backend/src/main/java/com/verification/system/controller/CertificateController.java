package com.verification.system.controller;

import com.verification.system.model.Certificate;

import com.verification.system.service.CertificateService;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Certificate>> getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Certificate>> getMine(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.getMine(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @PostMapping("/application/{applicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Certificate>
    createForApplication(
            @PathVariable String applicationId
    ) throws Exception {

        return ResponseEntity.ok(
                service.createForApplication(
                        applicationId
                )
        );
    }

    @GetMapping("/verify/{certificateNumber}")
    public ResponseEntity<?> verify(
            @PathVariable String certificateNumber
    ) {

        try {

            Certificate certificate =
                    service.verify(
                            certificateNumber
                    );

            Map<String, Object> result =
                    new HashMap<>();

            result.put(
                    "valid",
                    certificate
                            .getStatus()
                            .equals("ACTIVE")
            );

            result.put(
                    "certificate",
                    certificate
            );

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "valid",
                                    false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<ByteArrayResource>
    downloadPdf(
            @PathVariable String id
    ) throws Exception {

        byte[] pdf =
                service.generatePdf(id);

        ByteArrayResource resource =
                new ByteArrayResource(pdf);

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate.pdf"
                )

                .contentType(
                        MediaType.APPLICATION_PDF
                )

                .contentLength(
                        pdf.length
                )

                .body(resource);
    }
}