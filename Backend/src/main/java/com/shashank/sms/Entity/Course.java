package com.shashank.sms.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String instructor;

    private int credits;

    private String department;   // ADD THIS

    public Long getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getInstructor() { return instructor; }

    public void setInstructor(String instructor) { this.instructor = instructor; }

    public int getCredits() { return credits; }

    public void setCredits(int credits) { this.credits = credits; }

    public String getDepartment() { return department; }

    public void setDepartment(String department) { this.department = department; }
}