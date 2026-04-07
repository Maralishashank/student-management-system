package com.shashank.sms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shashank.sms.Entity.Marks;

public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSubject(Long studentId, String subject);

    // Used when deleting a student — removes all their marks first
    void deleteByStudentId(Long studentId);
}