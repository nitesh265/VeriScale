package com.verification.system.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "certificates")
public class Certificate {

    @Id
    private String id;

    private String certificateNumber;

    private String applicationId;

    private String applicantId;

    private String instrumentId;

    private String instrumentName;

    private String serialNumber;

    private LocalDate issueDate;

    private LocalDate validUntil;

    private String status;

    private String qrCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        ACTIVE,
        EXPIRED,
        CANCELLED
    }
}