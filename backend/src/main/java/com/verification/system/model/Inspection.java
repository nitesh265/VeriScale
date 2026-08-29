package com.verification.system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "inspections")
public class Inspection {

    @Id
    private String id;

    private String applicationId;

    private String inspectorId;

    private String instrumentId;

    private String inspectionDate;

    private Double standardValue;

    private Double observedValue;

    private Double error;

    private String condition;

    private Boolean passed;

    private String remarks;

    private LocalDateTime createdAt = LocalDateTime.now();
}