package com.shashank.sms.dto;

public class CourseDTO {

    private Long id;
    private String name;
    private String instructor;
    private int credits;
    private String department;

    public CourseDTO(Long id, String name, String instructor, int credits, String department) {
        this.id = id;
        this.name = name;
        this.instructor = instructor;
        this.credits = credits;
        this.department = department;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getInstructor() { return instructor; }
    public int getCredits() { return credits; }
    public String getDepartment() { return department; }
}