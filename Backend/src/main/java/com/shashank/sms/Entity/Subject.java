package com.shashank.sms.Entity;

import jakarta.persistence.*;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String department;   // 🔥 ADD THIS

    public Subject() {}

    public Subject(String name, String department){
        this.name = name;
        this.department = department;
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getDepartment() { return department; }

    public void setName(String name) { this.name = name; }

    public void setDepartment(String department) { this.department = department; }
}