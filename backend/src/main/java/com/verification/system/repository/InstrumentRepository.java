package com.verification.system.repository;

import com.verification.system.model.Instrument;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InstrumentRepository
        extends MongoRepository<Instrument, String> {

    List<Instrument> findByApplicantId(
            String applicantId
    );

    List<Instrument> findByInspectorId(
            String inspectorId
    );

    boolean existsBySerialNumber(
            String serialNumber
    );
}