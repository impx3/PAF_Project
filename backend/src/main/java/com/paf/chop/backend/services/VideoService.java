package com.paf.chop.backend.services;

import java.util.List;
import java.util.Optional;

import com.paf.chop.backend.configs.Category;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.dto.response.VideoResponseDTO;
import com.paf.chop.backend.models.Comment;
import com.paf.chop.backend.models.Like;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.CommentRepository;
import com.paf.chop.backend.repositories.LikeRepository;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.paf.chop.backend.models.Video;
import com.paf.chop.backend.repositories.VideoRepository;

@Slf4j
@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    @Autowired
    public VideoService(VideoRepository videoRepository, LikeRepository likeRepository, UserRepository userRepository) {
        this.videoRepository = videoRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
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

    //video like
    public ApiResponse<VideoResponseDTO> likeVideo(Long videoId) {
        try{
            log.info("Received request to like video with ID: {}", videoId);
            User currentUser = getCurrentUser();
            Video video = videoRepository.findById(videoId).orElse(null);

            if (video == null) {
                log.error("likeVideo: Video not found with ID: {}", videoId);
                return ApiResponse.error("Video not found");
            }
            // Check if user already liked the comment
            Optional<Like> existingLike = likeRepository.findByUserAndVideo(currentUser, video);

            if (existingLike.isPresent()) {

                // User already liked the comment, so remove the like
                likeRepository.delete(existingLike.get());
                video.setLikeCount(video.getLikeCount() - 1);
                videoRepository.save(video);
                log.info("Video unliked: {}", videoId);

                return ApiResponse.success(getVideoResponseDTO(video), "Video unliked successfully");

            } else {

                // User has not liked the comment yet, so add a new like
                Like newLike = new Like();
                newLike.setUser(currentUser);
                newLike.setVideo(video);
                newLike.setCategory(Category.VIDEO);
                likeRepository.save(newLike);
                video.setLikeCount(video.getLikeCount() + 1);
                videoRepository.save(video);
                log.info("Video liked: {}", videoId);

                return ApiResponse.success(getVideoResponseDTO(video), "Video liked successfully");
            }

        } catch (Exception e) {
            log.error("Error liking video: {}", e.getMessage());
            return ApiResponse.error("Error liking video: " + e.getMessage());
        }
    }

    public VideoResponseDTO getVideoResponseDTO(Video video) {
        VideoResponseDTO videoResponseDTO = new VideoResponseDTO();
        //response dto data
        videoResponseDTO.setId(video.getId());
        videoResponseDTO.setTitle(video.getTitle());
        videoResponseDTO.setDescription(video.getDescription());
        videoResponseDTO.setVideoUrl(video.getVideoUrl());
        videoResponseDTO.setLikeCount(video.getLikeCount());
        videoResponseDTO.setIsLiked(isLiked(video));

        return videoResponseDTO;
    }

    public User getCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(currentUsername);
    }

    public Boolean isLiked(Video video) {
        return likeRepository.existsByVideoAndUser(video,  getCurrentUser());
    }
}
