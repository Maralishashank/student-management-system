package com.shashank.sms.controller;

import java.util.List;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.shashank.sms.service.StudentService;

import com.shashank.sms.Entity.Marks;
import com.shashank.sms.dto.MarksDTO;
import com.shashank.sms.repository.MarksRepository;


@RestController
@RequestMapping("/marks")
public class MarksController {

    private final MarksRepository marksRepository;
    private final StudentService studentService;

    public MarksController(MarksRepository marksRepository,
            StudentService studentService){
this.marksRepository = marksRepository;
this.studentService = studentService;
}

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MarksDTO addMarks(@RequestBody Marks marks) {

        if(marksRepository.existsByStudentIdAndSubject(
                marks.getStudentId(), marks.getSubject())){
            throw new RuntimeException("Marks for this subject already exist");
        }

        if(marks.getScore() > marks.getMaxScore()){
            throw new RuntimeException("Score cannot exceed max score");
        }

        if(marks.getScore() < 0){
            throw new RuntimeException("Score cannot be negative");
        }

        Marks saved = marksRepository.save(marks);

        return new MarksDTO(
                saved.getSubject(),
                saved.getScore(),
                saved.getMaxScore());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my")
    public List<MarksDTO> getMyMarks(Authentication authentication){

        String email = authentication.getName();

        Long studentId = studentService
                .getStudentByEmail(email)
                .getId();

        return marksRepository.findByStudentId(studentId)
                .stream()
                .map(m -> new MarksDTO(
                        m.getSubject(),
                        m.getScore(),
                        m.getMaxScore()))
                .toList();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Marks> getAllMarks(){

        return marksRepository.findAll();

    }
}
