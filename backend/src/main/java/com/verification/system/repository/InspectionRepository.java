package com.verification.system.repository;

import com.verification.system.model.Inspection;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InspectionRepository
        extends MongoRepository<Inspection, String> {

    List<Inspection> findByInspectorId(
            String inspectorId
    );

    Optional<Inspection> findByApplicationId(
            String applicationId
    );
}