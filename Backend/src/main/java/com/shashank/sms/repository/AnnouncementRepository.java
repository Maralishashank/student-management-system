package com.shashank.sms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shashank.sms.Entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
	boolean existsByTitle(String title);

}