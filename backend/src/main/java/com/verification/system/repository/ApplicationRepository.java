package com.verification.system.repository;

import com.verification.system.model.Application;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository
        extends MongoRepository<Application, String> {

    List<Application> findByApplicantId(
            String applicantId
    );

    List<Application> findByInspectorId(
            String inspectorId
    );

    Optional<Application> findByApplicationNumber(
            String applicationNumber
    );
}