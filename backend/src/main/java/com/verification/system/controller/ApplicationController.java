package com.verification.system.controller;

import com.verification.system.model.Application;

import com.verification.system.service.ApplicationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @PostMapping
    public ResponseEntity<Application> create(
            @RequestBody Application application,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.create(
                        application,
                        authentication.getName()
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','INSPECTOR')")
    public ResponseEntity<List<Application>> getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Application>> getMine(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.getMine(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @GetMapping("/inspector/{inspectorId}")
    @PreAuthorize("hasAnyRole('ADMIN','INSPECTOR')")
    public ResponseEntity<List<Application>>
    getInspectorApplications(
            @PathVariable String inspectorId
    ) {

        return ResponseEntity.ok(
                service.getInspectorApplications(
                        inspectorId
                )
        );
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> assign(
            @PathVariable String id,
            @RequestParam String inspectorId
    ) {

        return ResponseEntity.ok(
                service.assignInspector(
                        id,
                        inspectorId
                )
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','INSPECTOR')")
    public ResponseEntity<Application> status(
            @PathVariable String id,
            @RequestParam String status
    ) {

        return ResponseEntity.ok(
                service.updateStatus(
                        id,
                        status
                )
        );
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> approve(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                service.approve(id)
        );
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> reject(
            @PathVariable String id,
            @RequestParam String remarks
    ) {

        return ResponseEntity.ok(
                service.reject(
                        id,
                        remarks
                )
        );
    }
}