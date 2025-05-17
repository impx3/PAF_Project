package com.paf.chop.backend.services.impl;

import com.paf.chop.backend.enums.Category;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.dto.response.PostDTO;
import com.paf.chop.backend.dto.response.VideoResponseDTO;
import com.paf.chop.backend.enums.CoinType;
import com.paf.chop.backend.enums.NotificationType;
import com.paf.chop.backend.models.*;
import com.paf.chop.backend.repositories.CommentRepository;
import com.paf.chop.backend.repositories.LikeRepository;

import com.paf.chop.backend.repositories.PostRepository;
import com.paf.chop.backend.repositories.VideoRepository;
import com.paf.chop.backend.services.NotificationService;
import com.paf.chop.backend.services.UserService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final VideoRepository videoRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;


    @Autowired
    public LikeService(LikeRepository likeRepository, CommentRepository commentRepository, UserService userService, VideoRepository videoRepository, PostRepository postRepository, NotificationService notificationService) {
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.videoRepository = videoRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }


    public Boolean isCommentLiked(Comment comment) {
        return likeRepository.existsByCommentAndUser( comment,  userService.getCurrentUser());
    }

    public Boolean isVideoLiked(Video video) {
        return likeRepository.existsByVideoAndUser(video,  userService.getCurrentUser());
    }

    public Boolean isPostLiked(Post post) {
        return likeRepository.existsByPostAndUser( post,  userService.getCurrentUser());
    }

    //like and unlike comment
    public ApiResponse<CommentResponseDTO> likeComment(Long commentId) {
        try{
            log.info("Received request to like/unlike comment: {}", commentId);
            User currentUser = userService.getCurrentUser();
            Comment comment = commentRepository.findById(commentId).orElse(null);

            if (comment == null) {
                log.error("likeComment: Comment not found with ID: {}", commentId);
                return ApiResponse.error("Comment not found");
            }
            // Check if user already liked the comment
            Optional<Like> existingLike = likeRepository.findByUserAndComment(currentUser, comment);

            if (existingLike.isPresent()) {

                // User already liked the comment, so remove the like
                likeRepository.delete(existingLike.get());
                comment.setLikeCount(comment.getLikeCount() - 1);
                commentRepository.save(comment);
                log.info("Comment unliked: {}", commentId);

                return ApiResponse.success(getCommentResponseDTO(comment), "Comment unliked successfully");

            } else {

                // User has not liked the comment yet, so add a new like
                Like newLike = new Like();
                newLike.setUser(currentUser);
                newLike.setComment(comment);
                newLike.setCategory(Category.COMMENT);
                likeRepository.save(newLike);
                comment.setLikeCount(comment.getLikeCount() + 1);
                commentRepository.save(comment);
                log.info("Comment liked: {}", commentId);

                notificationService.createNotification(
                        "Your comment has been liked by " + currentUser.getUsername(),
                        NotificationType.LIKE,
                        comment.getUser().getId()
                );

                userService.addUserCoins(comment.getUser().getId(), CoinType.LIKE);

                return ApiResponse.success(getCommentResponseDTO(comment), "Comment liked successfully");
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //video like
    public ApiResponse<VideoResponseDTO> likeVideo(Long videoId) {
        try{
            log.info("Received request to like video with ID: {}", videoId);
            User currentUser = userService.getCurrentUser();
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

    //like post
    public ApiResponse<PostDTO> likePost(Long postId) {
        try{
            log.info("Like post {}", postId);
            User currentUser = userService.getCurrentUser();
            Post post = postRepository.findById(postId).orElse(null);

            if (post == null) {
                log.info("Post not found");
                return ApiResponse.error("Post not found");
            }
            // Check if user already liked the comment
            Optional<Like> existingLike = likeRepository.findByUserAndPost(currentUser, post);

            if (existingLike.isPresent()) {
                // User already liked the comment, so remove the like
                likeRepository.delete(existingLike.get());
                post.setLikeCount(post.getLikeCount() - 1);
                postRepository.save(post);
                log.info("Post unliked {}", postId);

                return ApiResponse.success(getPostResponseDTO(post), "Post unliked successfully");

            } else {

                // User has not liked the comment yet, so add a new like
                Like newLike = new Like();
                newLike.setUser(currentUser);
                newLike.setPost(post);
                newLike.setCategory(Category.POST);
                likeRepository.save(newLike);
                post.setLikeCount(post.getLikeCount() + 1);
                postRepository.save(post);
                log.info("Post liked {}", postId);

                notificationService.createNotification(
                      "Your post has been liked by " + currentUser.getUsername(),
                        NotificationType.LIKE,
                        post.getUser().getId()
                );

                userService.addUserCoins(post.getUser().getId(), CoinType.LIKE);

                return ApiResponse.success(getPostResponseDTO(post), "Post liked successfully");
            }

        } catch (Exception e) {
            return ApiResponse.error("Error liking post: " + e.getMessage());
        }
    }


    public CommentResponseDTO getCommentResponseDTO(Comment comment) {
        CommentResponseDTO commentResponseDTO = new CommentResponseDTO();
        //response dto data
        commentResponseDTO.setProfileImage(comment.getUser().getProfileImage() == null ? "" : comment.getUser().getProfileImage());
        commentResponseDTO.setCreatedUserId(comment.getUser().getId());
        commentResponseDTO.setCreatedUserName(comment.getUser().getUsername());
        commentResponseDTO.setCommentBody(comment.getCommentBody());
        commentResponseDTO.setLikeCount(comment.getLikeCount());
        commentResponseDTO.setUpdatedAt(comment.getUpdatedAt());
        commentResponseDTO.setCommentId(comment.getCommentId());
        commentResponseDTO.setIsLiked(isCommentLiked(comment));

        if (comment.getPost() != null) {
            //response dto data
            commentResponseDTO.setPostId(comment.getPost().getId());
        }

        if (comment.getVideo() != null) {
            //response dto data
            commentResponseDTO.setVideoId(comment.getVideo().getId());
        }

        return commentResponseDTO;
    }

    public VideoResponseDTO getVideoResponseDTO(Video video) {
        VideoResponseDTO videoResponseDTO = new VideoResponseDTO();
        //response dto data
        videoResponseDTO.setId(video.getId());
        videoResponseDTO.setTitle(video.getTitle());
        videoResponseDTO.setDescription(video.getDescription());
        videoResponseDTO.setVideoUrl(video.getVideoUrl());
        videoResponseDTO.setLikeCount(video.getLikeCount());
        videoResponseDTO.setIsLiked(isVideoLiked(video));

        return videoResponseDTO;
    }

    public PostDTO getPostResponseDTO(Post post) {
        PostDTO postResponseDTO = new PostDTO();
        //response dto data
        postResponseDTO.setId(post.getId());
        postResponseDTO.setTitle(post.getTitle());
        postResponseDTO.setContent(post.getContent());
        postResponseDTO.setLikeCount(post.getLikeCount());
        postResponseDTO.setIsLiked(isPostLiked(post));

        return postResponseDTO;
    }







}
