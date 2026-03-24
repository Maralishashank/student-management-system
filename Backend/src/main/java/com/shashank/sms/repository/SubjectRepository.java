package com.shashank.sms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shashank.sms.Entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByDepartment(String department); // 🔥 IMPORTANT

}