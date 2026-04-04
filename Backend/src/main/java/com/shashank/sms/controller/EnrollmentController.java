package com.shashank.sms.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import com.shashank.sms.Entity.Enrollment;
import com.shashank.sms.repository.EnrollmentRepository;
import com.shashank.sms.service.StudentService;

@RestController
@RequestMapping("/enroll")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentService studentService;

    public EnrollmentController(EnrollmentRepository enrollmentRepository,
                                StudentService studentService) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentService = studentService;
    }

    @PostMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public void enroll(@PathVariable Long courseId, Authentication auth) {

        String email = auth.getName();
        Long studentId = studentService.getStudentByEmail(email).getId();

        // FIX: Added duplicate enrollment check. Previously a student could enroll
        //      in the same course multiple times, creating duplicate records in the
        //      enrollments table. Now throws a clear error if already enrolled.
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        Enrollment e = new Enrollment();
        e.setStudentId(studentId);
        e.setCourseId(courseId);
        enrollmentRepository.save(e);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Enrollment> getMyEnrollments(Authentication auth) {

        String email = auth.getName();
        Long studentId = studentService.getStudentByEmail(email).getId();
        return enrollmentRepository.findByStudentId(studentId);
    }
}