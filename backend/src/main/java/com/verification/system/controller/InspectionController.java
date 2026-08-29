package com.verification.system.controller;

import com.verification.system.model.Inspection;

import com.verification.system.service.InspectionService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspections")
@RequiredArgsConstructor
public class InspectionController {

    private final InspectionService service;

    @PostMapping
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<Inspection> create(
            @RequestBody Inspection inspection,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.create(
                        inspection,
                        authentication.getName()
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','INSPECTOR')")
    public ResponseEntity<List<Inspection>> getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<List<Inspection>> getMine(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.getMine(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Inspection>
    getByApplication(
            @PathVariable String applicationId
    ) {

        return ResponseEntity.ok(
                service.getByApplication(
                        applicationId
                )
        );
    }

        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN','INSPECTOR')")
        public ResponseEntity<Inspection> getById(@PathVariable String id) {
                return ResponseEntity.ok(service.getById(id));
        }
}