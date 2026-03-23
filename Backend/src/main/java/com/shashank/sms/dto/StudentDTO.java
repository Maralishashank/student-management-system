package com.shashank.sms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class StudentDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    public StudentDTO() {
    }

    public StudentDTO(Long id, String name, String email, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {   // THIS WAS MISSING
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {   // THIS WAS MISSING
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {   // THIS WAS MISSING
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {   // THIS WAS MISSING
        this.department = department;
    }
}