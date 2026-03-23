package com.shashank.sms.dto;

public class AttendanceReportDTO {

    private long totalStudents;
    private long presentToday;
    private long absentToday;

    public AttendanceReportDTO(long totalStudents, long presentToday, long absentToday) {
        this.totalStudents = totalStudents;
        this.presentToday = presentToday;
        this.absentToday = absentToday;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getPresentToday() {
        return presentToday;
    }

    public long getAbsentToday() {
        return absentToday;
    }
}