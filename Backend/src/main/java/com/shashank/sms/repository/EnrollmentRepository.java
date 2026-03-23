package com.shashank.sms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shashank.sms.Entity.Enrollment;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long>{

    List<Enrollment> findByStudentId(Long studentId);

}