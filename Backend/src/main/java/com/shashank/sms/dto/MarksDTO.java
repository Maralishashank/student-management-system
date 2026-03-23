package com.shashank.sms.dto;

public class MarksDTO {

    private String subject;
    private int score;
    private int maxScore;

    public MarksDTO(String subject, int score, int maxScore){
        this.subject = subject;
        this.score = score;
        this.maxScore = maxScore;
    }

    public String getSubject() {
        return subject;
    }

    public int getScore() {
        return score;
    }

    public int getMaxScore() {
        return maxScore;
    }
}