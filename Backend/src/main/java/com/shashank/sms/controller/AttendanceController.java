package com.shashank.sms.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.shashank.sms.Entity.Attendance;
import com.shashank.sms.dto.AttendanceReportDTO;
import com.shashank.sms.dto.AttendanceSummaryDTO;
import com.shashank.sms.service.AttendanceService;
import com.shashank.sms.service.StudentService;
import com.shashank.sms.repository.AttendanceRepository;
import com.shashank.sms.repository.StudentRepository;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final StudentService studentService;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceController(AttendanceService attendanceService,
            AttendanceRepository attendanceRepository,
            StudentService studentService,
            StudentRepository studentRepository) {
        this.attendanceService = attendanceService;
        this.attendanceRepository = attendanceRepository;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
    }

    // No @PreAuthorize here — access is controlled at the SecurityConfig level.
    // SecurityConfig now has a specific rule allowing STUDENT on /attendance/my
    // placed BEFORE the broad ADMIN-only /attendance/** rule.
    @GetMapping("/my")
    public AttendanceSummaryDTO getMyAttendance(Authentication authentication) {
        String email = authentication.getName();
        Long studentId = studentService.getStudentByEmail(email).getId();
        return attendanceService.getAttendanceSummary(studentId);
    }

    // FIX: Was calling attendanceRepository.save() directly, bypassing the
    //      duplicate-prevention logic in AttendanceService.markAttendance().
    //      This allowed the same student to be marked multiple times on the same day.
    //      Now delegates to the service which checks existsByStudentIdAndDate first.
    @PostMapping("/mark")
    @PreAuthorize("hasRole('ADMIN')")
    public void markAttendance(@RequestBody Attendance attendance) {
        attendanceService.markAttendanceDirect(attendance);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/report")
    public AttendanceReportDTO getAttendanceReport(
            @RequestParam(required = false) String date) {
        LocalDate reportDate = (date == null) ? LocalDate.now() : LocalDate.parse(date);
        return attendanceService.getAttendanceReport(reportDate);
    }

    @GetMapping("/department-report")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> departmentAttendance() {
        Map<String, Long> map = new HashMap<>();

        List<Long> cseStudents = studentRepository.findByDepartment("CSE")
                .stream().map(s -> s.getId()).toList();
        List<Long> itStudents = studentRepository.findByDepartment("IT")
                .stream().map(s -> s.getId()).toList();
        List<Long> eceStudents = studentRepository.findByDepartment("ECE")
                .stream().map(s -> s.getId()).toList();

        map.put("CSE", attendanceRepository.countByStudentIdInAndStatus(cseStudents, "PRESENT"));
        map.put("IT", attendanceRepository.countByStudentIdInAndStatus(itStudents, "PRESENT"));
        map.put("ECE", attendanceRepository.countByStudentIdInAndStatus(eceStudents, "PRESENT"));

        return map;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}