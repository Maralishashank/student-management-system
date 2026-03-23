package com.shashank.sms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shashank.sms.Entity.Attendance;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);
    
    List<Attendance> findByStudentId(Long studentId);
    
    long countByDate(LocalDate date);
    
    @Query("SELECT COUNT(DISTINCT a.studentId) FROM Attendance a WHERE a.date = :date")
    long countDistinctStudentsPresentToday(@Param("date") LocalDate date);
    
    long countByStudentIdInAndStatus(List<Long> studentIds, String status);

    List<Attendance> findByStudentIdIn(List<Long> studentIds);
    

}
