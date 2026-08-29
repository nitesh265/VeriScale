package com.verification.system.repository;

import com.verification.system.model.Certificate;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository
        extends MongoRepository<Certificate, String> {

    Optional<Certificate>
    findByCertificateNumber(
            String certificateNumber
    );

    Optional<Certificate>
    findByApplicationId(
            String applicationId
    );

    List<Certificate>
    findByApplicantId(
            String applicantId
    );

    boolean existsByInstrumentId(
            String instrumentId
    );
}