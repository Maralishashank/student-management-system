package com.shashank.sms.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.shashank.sms.Entity.Subject;
import com.shashank.sms.repository.SubjectRepository;

@RestController
@RequestMapping("/subjects")
public class subjectController {

    private final SubjectRepository subjectRepository;

    public subjectController(SubjectRepository subjectRepository){
        this.subjectRepository = subjectRepository;
    }

    // 🔥 Get subjects by department
    @PreAuthorize("hasAnyRole('ADMIN','STUDENT')")
    @GetMapping("/department/{dept}")
    public List<Subject> getSubjectsByDepartment(@PathVariable String dept){
        return subjectRepository.findByDepartment(dept);
    }

    // Add subject
    @PostMapping
    public Subject addSubject(@RequestBody Subject subject){
        return subjectRepository.save(subject);
    }

    // Get all (optional)
    @GetMapping
    public List<Subject> getAll(){
        return subjectRepository.findAll();
    }
}