package com.shashank.sms.controller;

import com.shashank.sms.Entity.Course;
import com.shashank.sms.dto.CourseDTO;
import com.shashank.sms.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository){
        this.courseRepository = courseRepository;
    }

    // CREATE COURSE (ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Course createCourse(@RequestBody Course course){

        if(courseRepository.existsByName(course.getName())){
            throw new RuntimeException("Course already exists");
        }

        return courseRepository.save(course);
    }

    // GET ALL COURSES
    @GetMapping
    public List<CourseDTO> getCourses(){

        return courseRepository.findAll()
                .stream()
                .map(c -> new CourseDTO(
                        c.getId(),
                        c.getName(),
                        c.getInstructor(),
                        c.getCredits(),
                        c.getDepartment()
                ))
                .toList();
    }

    // DELETE COURSE (ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCourse(@PathVariable Long id){

        if(!courseRepository.existsById(id)){
            throw new RuntimeException("Course not found");
        }

        courseRepository.deleteById(id);
    }
    
    
}