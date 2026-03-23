package com.shashank.sms.controller;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.shashank.sms.Entity.Student;
import com.shashank.sms.dto.StudentDTO;
import com.shashank.sms.service.StudentService;
import com.shashank.sms.repository.StudentRepository;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;

    public StudentController(StudentService studentService,
            StudentRepository studentRepository) {
this.studentService = studentService;
this.studentRepository = studentRepository;
}

    // ADD STUDENT
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public StudentDTO addStudent(@Valid @RequestBody StudentDTO studentDTO){
        return studentService.addStudent(studentDTO);
    }

    // GET STUDENT BY ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public StudentDTO getStudentById(@PathVariable Long id){

        Student student = studentService.getStudentById(id);

        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setDepartment(student.getDepartment());

        return dto;
    }

    // UPDATE STUDENT
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public StudentDTO updateStudent(@PathVariable Long id,
                                    @Valid @RequestBody StudentDTO studentDTO){

        Student student = new Student();
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        student.setDepartment(studentDTO.getDepartment());

        Student updated = studentService.updateStudent(id, student);

        StudentDTO dto = new StudentDTO();
        dto.setId(updated.getId());
        dto.setName(updated.getName());
        dto.setEmail(updated.getEmail());
        dto.setDepartment(updated.getDepartment());

        return dto;
    }

    // DELETE STUDENT
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id){
        studentService.deleteStudent(id);
    }

    // GET STUDENTS WITH PAGINATION
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/page")
    public Page<StudentDTO> getStudentsWithPagination(
            @RequestParam int page,
            @RequestParam int size) {

        return studentService.getStudentsWithPagination(page, size);
    }

    // GET ALL STUDENTS
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<StudentDTO> getAllStudents(Pageable pageable){

        return studentService.getAllStudents(pageable)
                .map(student -> new StudentDTO(
                        student.getId(),
                        student.getName(),
                        student.getEmail(),
                        student.getDepartment()));
    }

    // STUDENT PROFILE
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/me")
    public StudentDTO getMyProfile(Authentication authentication){

        String email = authentication.getName();

        return studentService.getStudentByEmail(email);
    }
    
    @GetMapping("/department/{dept}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentDTO> getStudentsByDepartment(@PathVariable String dept){

        return studentService.getStudentsByDepartment(dept);

    }
    
    @GetMapping("/department-count")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getDepartmentCounts(){

        Map<String, Long> map = new HashMap<>();

        map.put("CSE", studentRepository.countByDepartment("CSE"));
        map.put("IT", studentRepository.countByDepartment("IT"));
        map.put("ECE", studentRepository.countByDepartment("ECE"));

        return map;
    }
    
    
}