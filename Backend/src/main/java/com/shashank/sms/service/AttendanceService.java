package com.shashank.sms.service;

import org.springframework.stereotype.Service;
import com.shashank.sms.repository.AttendanceRepository;
import com.shashank.sms.Entity.Attendance;
import com.shashank.sms.Entity.Student;
import com.shashank.sms.dto.AttendanceReportDTO;
import com.shashank.sms.dto.AttendanceSummaryDTO;
import com.shashank.sms.repository.StudentRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
            StudentRepository studentRepository) {

this.attendanceRepository = attendanceRepository;
this.studentRepository = studentRepository;
}
    public AttendanceSummaryDTO getAttendanceSummary(Long studentId){

        List<Attendance> records = attendanceRepository.findByStudentId(studentId);

        long present = records.stream()
                .filter(a -> a.getStatus().equals("PRESENT"))
                .count();

        long absent = records.stream()
                .filter(a -> a.getStatus().equals("ABSENT"))
                .count();

        long total = records.size();

        double percentage = total == 0 ? 0 : (present * 100.0) / total;

        return new AttendanceSummaryDTO(present, absent, percentage);
    }
    
    public AttendanceReportDTO getAttendanceReport(LocalDate date){

        long totalStudents = studentRepository.count();

        long presentToday =
        		attendanceRepository.countDistinctStudentsPresentToday(date);

        long absentToday = totalStudents - presentToday;

        return new AttendanceReportDTO(totalStudents, presentToday, absentToday);
    }
    
    public void markAttendance(String email){

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        LocalDate today = LocalDate.now();

        boolean exists = attendanceRepository
                .existsByStudentIdAndDate(student.getId(), today);

        if(!exists){

            Attendance attendance = new Attendance();
            attendance.setStudentId(student.getId());
            attendance.setDate(today);
            attendance.setStatus("PRESENT");

            attendanceRepository.save(attendance);
        }
    }
    
}