// package com.verification.system.dto;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;

// import lombok.Data;

// @Data
// public class RegisterRequest {

//     @NotBlank
//     private String name;

//     @Email
//     @NotBlank
//     private String email;

//     @NotBlank
//     private String password;

//     private String phone;
// }
package com.verification.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String role;
}