package com.shashank.sms.dto;

public class AttendanceSummaryDTO {

    private long present;
    private long absent;
    private double percentage;

    public AttendanceSummaryDTO(long present, long absent, double percentage) {
        this.present = present;
        this.absent = absent;
        this.percentage = percentage;
    }

    public long getPresent() {
        return present;
    }

    public long getAbsent() {
        return absent;
    }

    public double getPercentage() {
        return percentage;
    }
}