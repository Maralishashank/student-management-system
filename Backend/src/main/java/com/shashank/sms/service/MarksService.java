package com.shashank.sms.service;

import org.springframework.stereotype.Service;

import com.shashank.sms.Entity.Marks;
import com.shashank.sms.repository.MarksRepository;

@Service
public class MarksService {

    private final MarksRepository marksRepository;

    public MarksService(MarksRepository marksRepository){
        this.marksRepository = marksRepository;
    }

    public Marks addMarks(Marks marks){

        if(marks.getScore() > marks.getMaxScore()){
            throw new RuntimeException("Score cannot exceed max score");
        }

        return marksRepository.save(marks);
    }
}