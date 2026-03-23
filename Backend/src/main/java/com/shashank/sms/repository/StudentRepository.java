package com.shashank.sms.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shashank.sms.Entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);
    
    List<Student> findByDepartment(String department);
    
    long countByDepartment(String department);
    
    
    
    

}