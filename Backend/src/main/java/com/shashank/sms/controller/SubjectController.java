package com.shashank.sms.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.shashank.sms.Entity.Subject;
import com.shashank.sms.repository.SubjectRepository;

// FIX 1: Renamed from subjectController to SubjectController (Java class naming convention).
// FIX 2: Added @PreAuthorize("hasRole('ADMIN')") to POST /subjects.
//         Previously it had no access control, so any authenticated user — including students —
//         could create subjects.
@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;

    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @PreAuthorize("hasAnyRole('ADMIN','STUDENT')")
    @GetMapping("/department/{dept}")
    public List<Subject> getSubjectsByDepartment(@PathVariable String dept) {
        return subjectRepository.findByDepartment(dept);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Subject addSubject(@RequestBody Subject subject) {
        return subjectRepository.save(subject);
    }

    @GetMapping
    public List<Subject> getAll() {
        return subjectRepository.findAll();
    }
}