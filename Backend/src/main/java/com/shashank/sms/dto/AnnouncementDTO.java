package com.shashank.sms.dto;

import java.time.LocalDate;

public class AnnouncementDTO {

    private String title;
    private String message;
    private LocalDate createdDate;

    public AnnouncementDTO(String title, String message, LocalDate createdDate) {
        this.title = title;
        this.message = message;
        this.createdDate = createdDate;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }
}