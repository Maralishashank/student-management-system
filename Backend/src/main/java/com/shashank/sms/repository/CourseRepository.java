package com.shashank.sms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shashank.sms.Entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
	boolean existsByName(String name);
}