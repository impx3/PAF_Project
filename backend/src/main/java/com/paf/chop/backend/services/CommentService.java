package com.paf.chop.backend.services;


import com.paf.chop.backend.configs.CommentType;
import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.models.*;
import com.paf.chop.backend.repositories.*;
import com.paf.chop.backend.services.impl.LikeService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;


@Service
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final VideoRepository videoRepository;
    private final UserService userService;
    private final LikeService likeService;

    @Autowired
    public CommentService(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository, VideoRepository videoRepository, UserService userService, LikeService likeService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.videoRepository = videoRepository;
        this.userService = userService;
        this.likeService = likeService;
    }

    //add comment
    public ApiResponse<CommentResponseDTO> comment(CommentRequestDTO commentRequestDTO) {
        try{
            log.info("Received request to add comment: {}", commentRequestDTO);

            // Validate request body
            if (commentRequestDTO.getUserId() == null) {
                log.error("User ID is required");
                return ApiResponse.error("User ID is required");
            }

            // Check if comment body is empty
            if(!StringUtils.hasText(commentRequestDTO.getCommentBody())){
                log.error("You cannot enter empty comment");
                return ApiResponse.error("You cannot enter empty comment");
            }

            boolean hasPost = commentRequestDTO.getPostId() != null;
            boolean hasVideo = commentRequestDTO.getVideoId() != null;

            if ((hasPost && hasVideo) || (!hasPost && !hasVideo)) {
                log.error("Comment must be associated with either a post or a video, but not both");
                return ApiResponse.error("Comment must be associated with either a post or a video, but not both");
            }

            // Check if user exists
            User user = userRepository.findById(commentRequestDTO.getUserId()).orElse(null);

            if (user == null) {
                log.error("User not found with ID: {}", commentRequestDTO.getUserId());
                return ApiResponse.error("User not found");
            }

            //send request body data to the database to store
            Comment comment = new Comment();

            //request dto data
            comment.setCommentBody(commentRequestDTO.getCommentBody());
            comment.setUser(user);

            if (hasPost) {
                Post post = postRepository.findById(commentRequestDTO.getPostId()).orElse(null);
                if (post == null) {
                    log.error("Post not found with ID: {}", commentRequestDTO.getPostId());
                    return ApiResponse.error("Post not found");
                }
                //request dto data
                comment.setCommentType(CommentType.POST);
                comment.setPost(post);
            } else {
                Video video = videoRepository.findById(commentRequestDTO.getVideoId()).orElse(null);
                if (video == null) {
                    log.error("Video not found with ID: {}", commentRequestDTO.getVideoId());
                    return ApiResponse.error("Video not found");
                }
                //request dto data
                comment.setCommentType(CommentType.VIDEO);
                comment.setVideo(video);
            }



            Comment savedComment = commentRepository.save(comment);
            log.info("Comment added: {}", savedComment.getCommentBody());
            return ApiResponse.success(getCommentResponseDTO(savedComment), "Comment added successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    //display all comments
    public ApiResponse<List<CommentResponseDTO>> getComments(Long postId, Long videoId) {
        try {
            log.info("Fetching comments for postId: {}, videoId: {}", postId, videoId);

            // Check if both postId and videoId are null or both are provided
            if ((postId != null && videoId != null) || (postId == null && videoId == null)) {
                return ApiResponse.error("Specify either postId or videoId, but not both");
            }

            // Fetch comments based on postId or videoId
            List<Comment> comments;
            if (postId != null) {
                comments = commentRepository.findByPostId(postId);
            } else {
                comments = commentRepository.findByVideoId(videoId);
            }

            // Check if comments are empty
            List<CommentResponseDTO> commentDTOs = comments.stream()
                    .map(this::getCommentResponseDTO)

                    .toList();

            log.info("Comment retrieved: {}", commentDTOs);
            return ApiResponse.success(commentDTOs, "Comments fetched successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //update comment
    public ApiResponse<CommentResponseDTO> updateComment(Long commentId, CommentRequestDTO commentRequestDTO) {

        try {
            log.info("Received request to update comment: {}", commentRequestDTO);
            Long userId = userService.getCurrentUser().getId();
            Comment comment = commentRepository.findById(commentId).orElse(null);

            if(comment == null){
                log.error("updateComment: Comment not found with ID: {}", commentId);
                return ApiResponse.error("Comment not found");
            }

            // Ownership check
            if (!comment.getUser().getId().equals(userId)) {
                log.error("updateComment: Comment user does not belong to the current user");
                return ApiResponse.error("You are not allowed to edit this comment");
            }

            // Null or empty check
            String newBody = commentRequestDTO.getCommentBody();
            if (newBody == null || newBody.isEmpty()) {
                log.error("Comment body is empty");
                return ApiResponse.error("Comment body cannot be empty");
            }

            // Update and save
            comment.setCommentBody(newBody);
            Comment savedComment = commentRepository.save(comment);
            log.info("Comment updated: {}", savedComment);

            return  ApiResponse.success(getCommentResponseDTO(savedComment), "Comment updated successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    //delete comment
    public ApiResponse<CommentResponseDTO> deleteComment(Long commentId) {
        try {
            log.info("Received request to delete comment: {}", commentId);
            // Get the logged-in user
            Long userId = userService.getCurrentUser().getId();

            // Find the comment
            Comment comment = commentRepository.findById(commentId).orElse(null);
            if (comment == null) {
                log.error("deleteComment: Comment not found with ID: {}", commentId);
                return ApiResponse.error("Comment not found");
            }

            // Check ownership
            if (!comment.getUser().getId().equals(userId)) {
                log.error("deleteComment: Comment user does not belong to the current user");
                return ApiResponse.error("You are not allowed to delete this comment");
            }

            // Delete the comment
            commentRepository.delete(comment);
            log.info("Comment deleted: {}", commentId);

            return ApiResponse.success(null,"Comment deleted successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
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
        commentResponseDTO.setIsLiked(likeService.isCommentLiked(comment));

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


}
