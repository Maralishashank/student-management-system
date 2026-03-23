package com.shashank.sms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

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
    public Page<Student> getAllStudents(Pageable pageable){
        return studentRepository.findAll(pageable);
    }

    // ADD STUDENT
    public StudentDTO addStudent(StudentDTO studentDTO) {

        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setDepartment(studentDTO.getDepartment());

        Student savedStudent = studentRepository.save(student);

        // Create login account for student
        User user = new User();
        user.setUsername(savedStudent.getEmail());
        user.setPassword(passwordEncoder.encode("student123"));
        user.setRole("STUDENT");

        userRepository.save(user);

        StudentDTO dto = new StudentDTO();
        dto.setId(savedStudent.getId());
        dto.setName(savedStudent.getName());
        dto.setEmail(savedStudent.getEmail());
        dto.setDepartment(savedStudent.getDepartment());

        return dto;
    }

    // GET ALL STUDENTS
    public List<StudentDTO> getAllStudents(){
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // GET STUDENT BY ID
    public Student getStudentById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    // UPDATE STUDENT
    public Student updateStudent(Long id, Student studentDetails) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setDepartment(studentDetails.getDepartment());

        return studentRepository.save(student);
    }
    // DELETE STUDENT
    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        studentRepository.delete(student);
    }

    // ENTITY → DTO
    private StudentDTO convertToDTO(Student student){
        if(student == null) return null;

        return new StudentDTO(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment()
        );
    }

    // DTO → ENTITY
    private Student convertToEntity(StudentDTO dto){
        Student student = new Student();
        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setDepartment(dto.getDepartment());
        return student;
    }
    public Page<StudentDTO> getStudentsWithPagination(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Student> students = studentRepository.findAll(pageable);

        return students.map(this::convertToDTO);
    }
    public StudentDTO getStudentByEmail(String email){

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return convertToDTO(student);
    }
    
    public List<StudentDTO> getStudentsByDepartment(String dept){

        return studentRepository.findByDepartment(dept)
                .stream()
                .map(s -> new StudentDTO(
                        s.getId(),
                        s.getName(),
                        s.getEmail(),
                        s.getDepartment()
                ))
                .toList();

    }
}