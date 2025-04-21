package com.paf.chop.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paf.chop.backend.models.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
}
