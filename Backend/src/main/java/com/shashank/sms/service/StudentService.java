package com.shashank.sms.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shashank.sms.dto.StudentDTO;
import com.shashank.sms.exception.ResourceNotFoundException;
import com.shashank.sms.Entity.Student;
import com.shashank.sms.Entity.User;
import com.shashank.sms.repository.StudentRepository;
import com.shashank.sms.repository.UserRepository;
import com.shashank.sms.repository.AttendanceRepository;
import com.shashank.sms.repository.EnrollmentRepository;
import com.shashank.sms.repository.MarksRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class StudentService {

    private final StudentRepository    studentRepository;
    private final UserRepository       userRepository;
    private final PasswordEncoder      passwordEncoder;
    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MarksRepository      marksRepository;

    public StudentService(StudentRepository studentRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AttendanceRepository attendanceRepository,
                          EnrollmentRepository enrollmentRepository,
                          MarksRepository marksRepository) {
        this.studentRepository    = studentRepository;
        this.userRepository       = userRepository;
        this.passwordEncoder      = passwordEncoder;
        this.attendanceRepository = attendanceRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.marksRepository      = marksRepository;
    }

    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    @Transactional
    public StudentDTO addStudent(StudentDTO studentDTO) {

        String email = studentDTO.getEmail().trim().toLowerCase();

        // Explicit duplicate checks BEFORE any DB save.
        // Previously the Student saved first, then the User save failed with
        // DataIntegrityViolationException, leaving an orphaned Student row.
        if (studentRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("A student with email '" + email + "' already exists.");
        }
        if (userRepository.findByUsername(email).isPresent()) {
            throw new RuntimeException("A login account for '" + email + "' already exists.");
        }

        Student student = new Student();
        student.setName(studentDTO.getName().trim());
        student.setEmail(email);
        student.setDepartment(studentDTO.getDepartment());

        Student saved = studentRepository.save(student);

        User user = new User();
        user.setUsername(saved.getEmail());
        user.setPassword(passwordEncoder.encode("student123"));
        user.setRole("STUDENT");
        userRepository.save(user);

        return convertToDTO(saved);
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        String oldEmail = student.getEmail();
        String newEmail = studentDTO.getEmail().trim().toLowerCase();

        // Check new email is not already taken by a DIFFERENT student or user.
        if (!oldEmail.equals(newEmail)) {
            if (studentRepository.findByEmail(newEmail).isPresent()) {
                throw new RuntimeException("Email '" + newEmail + "' is already in use by another student.");
            }
            if (userRepository.findByUsername(newEmail).isPresent()) {
                throw new RuntimeException("A login account for '" + newEmail + "' already exists.");
            }
        }

        student.setName(studentDTO.getName().trim());
        student.setEmail(newEmail);
        student.setDepartment(studentDTO.getDepartment());
        studentRepository.save(student);

        // Keep the User login username in sync when email changes.
        if (!oldEmail.equals(newEmail)) {
            userRepository.findByUsername(oldEmail).ifPresent(user -> {
                user.setUsername(newEmail);
                userRepository.save(user);
            });
        }

        return convertToDTO(student);
    }

    @Transactional
    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Clean up all related records so no orphaned data remains.
        attendanceRepository.deleteByStudentId(id);
        marksRepository.deleteByStudentId(id);
        enrollmentRepository.deleteByStudentId(id);

        // Delete the linked User login account so the email can be reused later.
        userRepository.findByUsername(student.getEmail())
                .ifPresent(userRepository::delete);

        studentRepository.delete(student);
    }

    public Page<StudentDTO> getStudentsWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentRepository.findAll(pageable).map(this::convertToDTO);
    }

    public StudentDTO getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return convertToDTO(student);
    }

    public List<StudentDTO> getStudentsByDepartment(String dept) {
        return studentRepository.findByDepartment(dept)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public StudentDTO convertToDTO(Student student) {
        if (student == null) return null;
        return new StudentDTO(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment()
        );
    }
}