package com.shashank.sms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shashank.sms.repository.StudentRepository;
import com.shashank.sms.repository.CourseRepository;
import com.shashank.sms.repository.MarksRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DashboardController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final MarksRepository marksRepository;

    public DashboardController(StudentRepository studentRepository,
                               CourseRepository courseRepository,
                               MarksRepository marksRepository){
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.marksRepository = marksRepository;
    }

    @GetMapping("/dashboard/stats")
    public Map<String,Object> getStats(){

        Map<String,Object> stats = new HashMap<>();

        stats.put("students", studentRepository.count());
        stats.put("courses", courseRepository.count());
        stats.put("marks", marksRepository.count());

        return stats;
    }
}