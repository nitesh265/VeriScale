package com.verification.system.controller;

import com.verification.system.model.Instrument;

import com.verification.system.service.InstrumentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instruments")
@RequiredArgsConstructor
public class InstrumentController {

    private final InstrumentService service;

    @PostMapping
    public ResponseEntity<Instrument> create(
            @RequestBody Instrument instrument,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.create(
                        instrument,
                        authentication.getName()
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Instrument>> getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Instrument>> getMine(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.getMine(
                        authentication.getName()
                )
        );
    }

        @GetMapping("/assigned")
        @PreAuthorize("hasRole('INSPECTOR')")
        public ResponseEntity<List<Instrument>> getAssigned(Authentication authentication) {
                return ResponseEntity.ok(service.getAssigned(authentication.getName()));
        }

    @GetMapping("/{id}")
    public ResponseEntity<Instrument> getById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Instrument> update(
            @PathVariable String id,
            @RequestBody Instrument instrument,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        instrument,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            Authentication authentication
    ) {

        service.delete(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent()
                .build();
    }
}