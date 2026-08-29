package com.verification.system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    private String password;

    private String phone;

    private Role role;

    private Boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        APPLICANT,
        INSPECTOR,
        ADMIN
    }
}