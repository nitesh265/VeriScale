package com.verification.system.service;

import com.verification.system.model.Application;
import com.verification.system.model.Instrument;

import com.verification.system.repository.ApplicationRepository;
import com.verification.system.repository.InstrumentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    private final InstrumentRepository instrumentRepository;

    public Application create(
            Application application,
            String applicantId
    ) {

        Instrument instrument =
                instrumentRepository
                        .findById(
                                application.getInstrumentId()
                        )
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "Instrument not found"
                                )
                        );

        if (
                !instrument
                        .getApplicantId()
                        .equals(applicantId)
        ) {

            throw new RuntimeException(
                    "This instrument does not belong to you"
            );
        }

        application.setId(null);

        application.setApplicantId(
                applicantId
        );

        application.setApplicationNumber(
                "APP-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        application.setStatus(
                Application.Status.SUBMITTED.name()
        );

        application.setSubmittedAt(
                LocalDateTime.now()
        );

        return applicationRepository.save(
                application
        );
    }

    public List<Application> getAll() {

        return applicationRepository.findAll();
    }

    public List<Application> getMine(
            String applicantId
    ) {

        return applicationRepository
                .findByApplicantId(
                        applicantId
                );
    }

    public List<Application> getInspectorApplications(
            String inspectorId
    ) {

        return applicationRepository
                .findByInspectorId(
                        inspectorId
                );
    }

    public Application getById(
            String id
    ) {

        return applicationRepository
                .findById(id)
                .orElseThrow(
                        () ->
                        new RuntimeException(
                                "Application not found"
                        )
                );
    }

    public Application assignInspector(
            String id,
            String inspectorId
    ) {

        Application application =
                getById(id);

        application.setInspectorId(
                inspectorId
        );

        application.setStatus(
                Application.Status.ASSIGNED.name()
        );

        application.setAssignedAt(
                LocalDateTime.now()
        );

        return applicationRepository.save(
                application
        );
    }

    public Application updateStatus(
            String id,
            String status
    ) {

        Application application =
                getById(id);

        try {

            Application.Status.valueOf(
                    status
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid application status"
            );
        }

        application.setStatus(status);

        return applicationRepository.save(
                application
        );
    }

    public Application approve(
            String id
    ) {

        Application application =
                getById(id);

        application.setStatus(
                Application.Status.APPROVED.name()
        );

        application.setCompletedAt(
                LocalDateTime.now()
        );

        return applicationRepository.save(
                application
        );
    }

    public Application reject(
            String id,
            String remarks
    ) {

        Application application =
                getById(id);

        application.setStatus(
                Application.Status.REJECTED.name()
        );

        application.setRemarks(
                remarks
        );

        application.setCompletedAt(
                LocalDateTime.now()
        );

        return applicationRepository.save(
                application
        );
    }
}