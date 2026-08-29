package com.verification.system.dto;

import com.verification.system.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private String id;

    private String name;

    private String email;

    private String phone;

    private User.Role role;

    private Boolean active;
}