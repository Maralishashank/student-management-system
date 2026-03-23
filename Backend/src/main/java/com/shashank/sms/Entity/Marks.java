package com.shashank.sms.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
@Table(uniqueConstraints =
@UniqueConstraint(columnNames = {"studentId", "subject"}))
public class Marks {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private String subject;

    @Min(0)
    private int score;

    @Min(1)
    private int maxScore;

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }
}