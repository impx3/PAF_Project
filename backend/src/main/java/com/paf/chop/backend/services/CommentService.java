package com.paf.chop.backend.services;

import com.paf.chop.backend.configs.Category;
import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.models.Comment;
import com.paf.chop.backend.models.Like;
import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.CommentRepository;
import com.paf.chop.backend.repositories.LikeRepository;
import com.paf.chop.backend.repositories.PostRepository;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository, LikeRepository likeRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
    }

    //add comment
    public ApiResponse<CommentResponseDTO> comment(CommentRequestDTO commentRequestDTO) {
        try{
            log.info("Received request to add comment: {}", commentRequestDTO);

            if(commentRequestDTO.getUserId()== null
                    || commentRequestDTO.getPostId()== null) {
                log.error("All fields are required");
                return ApiResponse.error("All fields are required");
            }
            if(!StringUtils.hasText(commentRequestDTO.getCommentBody())){
                log.error("You cannot enter empty comment");
                return ApiResponse.error("You cannot enter empty comment");
            }

            User user = userRepository.findById(commentRequestDTO.getUserId()).orElse(null);
            Post post = postRepository.findById(commentRequestDTO.getPostId()).orElse(null);

            if(user == null){
                log.error("User not found with ID: {}", commentRequestDTO.getUserId());
                return ApiResponse.error("User not found");
            }
            if(post == null){
                log.error("Post not found with ID: {}", commentRequestDTO.getPostId());
                return ApiResponse.error("Post not found");
            }

            //send request body data to the database to store
            Comment comment = new Comment();

            //request dto data
            comment.setCommentBody(commentRequestDTO.getCommentBody());
            comment.setPost(post);
            comment.setUser(user);

            Comment savedComment = commentRepository.save(comment);
            log.info("Comment added: {}", savedComment.getCommentBody());
            return ApiResponse.success(getCommentResponseDTO(savedComment), "Comment added successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    //display all comments
    public ApiResponse<List<CommentResponseDTO>> getComments(Long postId) {
        try {
            log.info("Received request to retrieve comments for the post: {}", postId);
            List<Comment> comments = commentRepository.findByPostId(postId);

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
            Long userId = getCurrentUser().getId();
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
            Long userId = getCurrentUser().getId();

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

    //like and unlike comment
    public ApiResponse<CommentResponseDTO> likeComment(Long commentId) {
       try{
           log.info("Received request to like/unlike comment: {}", commentId);
           User currentUser = getCurrentUser();
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

               return ApiResponse.success(getCommentResponseDTO(comment), "Comment liked successfully");
           }

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
        commentResponseDTO.setPostId(comment.getPost().getId());
        commentResponseDTO.setCommentBody(comment.getCommentBody());
        commentResponseDTO.setLikeCount(comment.getLikeCount());
        commentResponseDTO.setUpdatedAt(comment.getUpdatedAt());
        commentResponseDTO.setCommentId(comment.getCommentId());
        commentResponseDTO.setIsLiked(isLiked(comment));

        return commentResponseDTO;
    }

    public User getCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(currentUsername);
    }

    public Boolean isLiked(Comment comment) {
        return likeRepository.existsByCommentAndUser( comment,  getCurrentUser());
    }

}
