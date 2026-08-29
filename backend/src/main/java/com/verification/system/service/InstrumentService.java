package com.verification.system.service;

import com.verification.system.model.Instrument;
import com.verification.system.repository.InstrumentRepository;
import com.verification.system.repository.CertificateRepository;
import com.verification.system.repository.UserRepository;
import com.verification.system.model.User;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class InstrumentService {

    private final InstrumentRepository repository;

        private final CertificateRepository certificateRepository;

        private final UserRepository userRepository;

    public Instrument create(
            Instrument instrument,
            String applicantId
    ) {

        if (
                repository.existsBySerialNumber(
                        instrument.getSerialNumber()
                )
        ) {

            throw new RuntimeException(
                    "Instrument serial number already exists"
            );
        }

        instrument.setId(null);

        instrument.setApplicantId(
                applicantId
        );

        instrument.setStatus(
                "PENDING"
        );

        return repository.save(
                instrument
        );
    }

    public List<Instrument> getMine(
            String applicantId
    ) {

        return repository.findByApplicantId(
                applicantId
        );
    }

    public List<Instrument> getAll() {

        return repository.findAll();
    }

        public List<Instrument> getAssigned(String inspectorId) {
                return repository.findByInspectorId(inspectorId);
        }

        public Instrument assignInspector(String id, String inspectorId) {
                if (id == null || id.isBlank() || inspectorId == null || inspectorId.isBlank()) {
                        throw new RuntimeException("Instrument and inspector are required");
                }

                String normalizedInspectorId = URLDecoder.decode(
                        inspectorId.trim(),
                        StandardCharsets.UTF_8
                );

                Instrument instrument = getById(id);

                User inspector = userRepository.findByEmail(normalizedInspectorId)
                        .orElseGet(() -> userRepository.findById(normalizedInspectorId).orElse(null));

                if (inspector == null) {
                    throw new RuntimeException("Inspector not found");
                }

                if (inspector.getRole() != User.Role.INSPECTOR || !Boolean.TRUE.equals(inspector.getActive())) {
                        throw new RuntimeException("Selected user is not an active inspector");
                }

                if (certificateRepository.existsByInstrumentId(id)) {
                        throw new RuntimeException("This instrument already has a certificate and cannot be reassigned");
                }

                instrument.setInspectorId(inspector.getEmail());
                instrument.setStatus("ASSIGNED");
                return repository.save(instrument);
        }

    public Instrument getById(
            String id
    ) {

        return repository.findById(id)
                .orElseThrow(
                        () ->
                        new RuntimeException(
                                "Instrument not found"
                        )
                );
    }

    public Instrument update(
            String id,
            Instrument updated,
            String userId
    ) {

        Instrument instrument =
                getById(id);

        if (
                !instrument
                        .getApplicantId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "You cannot update this instrument"
            );
        }

                if (certificateRepository.existsByInstrumentId(id)) {
                        throw new RuntimeException(
                                        "This instrument cannot be edited after certificate generation"
                        );
                }

        instrument.setInstrumentName(
                updated.getInstrumentName()
        );

        instrument.setInstrumentType(
                updated.getInstrumentType()
        );

        instrument.setManufacturer(
                updated.getManufacturer()
        );

        instrument.setModelNumber(
                updated.getModelNumber()
        );

        instrument.setCapacity(
                updated.getCapacity()
        );

        instrument.setAccuracyClass(
                updated.getAccuracyClass()
        );

        instrument.setLocation(
                updated.getLocation()
        );

        instrument.setAddress(
                updated.getAddress()
        );

        return repository.save(
                instrument
        );
    }

    public void delete(
            String id,
            String userId
    ) {

        Instrument instrument =
                getById(id);

        if (
                !instrument
                        .getApplicantId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "You cannot delete this instrument"
            );
        }

        repository.deleteById(id);
    }
}