package com.shashank.sms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shashank.sms.Entity.Enrollment;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(Long studentId);

    // FIX: Added duplicate enrollment check.
    //      Without this, a student could click Enroll multiple times on the same course
    //      and create multiple identical enrollment records. EnrollmentController now
    //      calls this before saving.
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}