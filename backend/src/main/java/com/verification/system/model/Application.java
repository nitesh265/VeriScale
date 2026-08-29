package com.verification.system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "applications")
public class Application {

    @Id
    private String id;

    private String applicationNumber;

    private String applicantId;

    private String instrumentId;

    private String inspectorId;

    private String purpose;

    private String status;

    private String remarks;

    private LocalDateTime submittedAt;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;

    public enum Status {

        SUBMITTED,

        UNDER_REVIEW,

        ASSIGNED,

        INSPECTION_PENDING,

        INSPECTION_COMPLETED,

        APPROVED,

        REJECTED,

        CERTIFICATE_ISSUED
    }
}