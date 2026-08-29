package com.verification.system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "instruments")
public class Instrument {

    @Id
    private String id;

    private String applicantId;

    private String inspectorId;

    private String instrumentName;

    private String instrumentType;

    private String manufacturer;

    private String modelNumber;

    private String serialNumber;

    private String capacity;

    private String accuracyClass;

    private String location;

    private String address;

    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();
}