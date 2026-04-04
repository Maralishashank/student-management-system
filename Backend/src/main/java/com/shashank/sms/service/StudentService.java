package com.shashank.sms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shashank.sms.dto.StudentDTO;
import com.shashank.sms.exception.ResourceNotFoundException;
import com.shashank.sms.Entity.Student;
import com.shashank.sms.Entity.User;
import com.shashank.sms.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.shashank.sms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    // FIX: Added @Transactional so that if userRepository.save() fails after
    //      studentRepository.save() succeeds, both saves are rolled back together.
    //      Without this, a failure midway left an orphaned Student with no User login account.
    @Transactional
    public StudentDTO addStudent(StudentDTO studentDTO) {

        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setDepartment(studentDTO.getDepartment());

        Student savedStudent = studentRepository.save(student);

        User user = new User();
        user.setUsername(savedStudent.getEmail());
        user.setPassword(passwordEncoder.encode("student123"));
        user.setRole("STUDENT");
        // firstLogin defaults to true in the User entity

        userRepository.save(user);

        StudentDTO dto = new StudentDTO();
        dto.setId(savedStudent.getId());
        dto.setName(savedStudent.getName());
        dto.setEmail(savedStudent.getEmail());
        dto.setDepartment(savedStudent.getDepartment());

        return dto;
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Transactional
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setDepartment(studentDetails.getDepartment());

        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
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

    private StudentDTO convertToDTO(Student student) {
        if (student == null) return null;
        return new StudentDTO(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment()
        );
    }
}