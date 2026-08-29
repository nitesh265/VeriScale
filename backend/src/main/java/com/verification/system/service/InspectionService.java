package com.verification.system.service;

import com.verification.system.model.Application;
import com.verification.system.model.Inspection;

import com.verification.system.repository.ApplicationRepository;
import com.verification.system.repository.InspectionRepository;
import com.verification.system.repository.InstrumentRepository;
import com.verification.system.model.Instrument;
import com.verification.system.service.CertificateService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InspectionService {

    private final InspectionRepository inspectionRepository;

    private final ApplicationRepository applicationRepository;

        private final InstrumentRepository instrumentRepository;

        private final CertificateService certificateService;

    public Inspection create(
            Inspection inspection,
            String inspectorId
    ) {

        Application application = null;
        if (inspection.getApplicationId() != null && !inspection.getApplicationId().isBlank()) {
            application = applicationRepository.findById(inspection.getApplicationId())
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            if (application.getInspectorId() == null || !application.getInspectorId().equals(inspectorId)) {
                throw new RuntimeException("Application is not assigned to this inspector");
            }

                        if (inspection.getInstrumentId() == null || inspection.getInstrumentId().isBlank()) {
                                inspection.setInstrumentId(application.getInstrumentId());
                        }
        } else {
            Instrument instrument = instrumentRepository.findById(inspection.getInstrumentId())
                    .orElseThrow(() -> new RuntimeException("Instrument not found"));

            if (instrument.getInspectorId() == null || !instrument.getInspectorId().equals(inspectorId)) {
                throw new RuntimeException("Instrument is not assigned to this inspector");
            }
        }

        if (
                inspection.getStandardValue() == null ||
                inspection.getObservedValue() == null
        ) {

            throw new RuntimeException(
                    "Standard and observed values are required"
            );
        }

        double error =
                inspection.getObservedValue()
                        -
                        inspection.getStandardValue();

        inspection.setError(error);

        inspection.setInspectorId(
                inspectorId
        );

        if (inspection.getPassed() == null) {
            inspection.setPassed(Math.abs(error) <= 0.05);
        }

        inspection.setCreatedAt(
                LocalDateTime.now()
        );

        Inspection saved =
                inspectionRepository.save(
                        inspection
                );

        if (application != null) {
            application.setStatus(Application.Status.INSPECTION_COMPLETED.name());
            application.setCompletedAt(LocalDateTime.now());
            applicationRepository.save(application);
        }

        instrumentRepository.findById(inspection.getInstrumentId()).ifPresent(instrument -> {
            instrument.setStatus(inspection.getPassed() ? "VERIFIED" : "REJECTED");
            instrumentRepository.save(instrument);
        });

                if (Boolean.TRUE.equals(inspection.getPassed()) && application == null) {
                        try {
                                certificateService.createForInstrument(inspection.getInstrumentId());
                        } catch (Exception exception) {
                                throw new RuntimeException("Inspection passed, but certificate generation failed", exception);
                        }
                }

        return saved;
    }

    public List<Inspection> getAll() {

        return inspectionRepository.findAll();
    }

    public List<Inspection> getMine(
            String inspectorId
    ) {

        return inspectionRepository
                .findByInspectorId(
                        inspectorId
                );
    }

        public Inspection getById(String id) {
                return inspectionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Inspection not found"));
        }

    public Inspection getByApplication(
            String applicationId
    ) {

        return inspectionRepository
                .findByApplicationId(
                        applicationId
                )
                .orElseThrow(
                        () ->
                        new RuntimeException(
                                "Inspection not found"
                        )
                );
    }
}