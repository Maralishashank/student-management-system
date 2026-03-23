package com.shashank.sms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shashank.sms.Entity.Announcement;
import com.shashank.sms.dto.AnnouncementDTO;
import com.shashank.sms.repository.AnnouncementRepository;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository){
        this.announcementRepository = announcementRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Announcement create(@RequestBody Announcement announcement){

        if(announcementRepository.existsByTitle(announcement.getTitle())){
            throw new RuntimeException("Announcement already exists");
        }

        announcement.setCreatedDate(LocalDate.now());

        return announcementRepository.save(announcement);
    }

    @GetMapping
    public List<AnnouncementDTO> getAll(){
        return announcementRepository.findAll()
                .stream()
                .map(a -> new AnnouncementDTO(
                        a.getTitle(),
                        a.getMessage(),
                        a.getCreatedDate()))
                .toList();
    }
}