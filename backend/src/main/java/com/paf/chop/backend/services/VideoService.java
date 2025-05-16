package com.paf.chop.backend.services;

import java.util.List;
import java.util.Optional;

import com.paf.chop.backend.configs.Category;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.dto.response.PostDTO;
import com.paf.chop.backend.dto.response.VideoResponseDTO;
import com.paf.chop.backend.models.*;
import com.paf.chop.backend.repositories.CommentRepository;
import com.paf.chop.backend.repositories.LikeRepository;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.services.impl.LikeService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.paf.chop.backend.repositories.VideoRepository;

@Slf4j
@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final LikeService likeService;

    @Autowired
    public VideoService(VideoRepository videoRepository, LikeService likeService) {
        this.videoRepository = videoRepository;
        this.likeService = likeService;
    }

    public Video saveVideo(Video video) {
        return videoRepository.save(video);
    }

    public Optional<Video> getVideoById(Long id) {
        return videoRepository.findById(id);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }

    public List<VideoResponseDTO> getAllVideoResponses() {
        try{
            List<Video> videos =  videoRepository.findAll();

            return videos.stream()
                    .map(video -> new VideoResponseDTO(video.getId(), video.getTitle(), video.getDescription(), video.getVideoUrl(), video.getLikeCount(), likeService.isVideoLiked(video)))
                    .toList();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }





}
