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
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    //add comment
    public CommentResponseDTO comment(CommentRequestDTO commentRequestDTO) {
        try{
            if(commentRequestDTO.getCommentBody() == null){
                return null;
            }

            User user = userRepository.findById(commentRequestDTO.getUserId()).orElse(null);
            Post post = postRepository.findById(commentRequestDTO.getPostId()).orElse(null);

            if(user == null || post == null){
                return null;
            }

            //send request body data to the database to store
            Comment comment = new Comment();

            //request dto data
            comment.setCommentBody(commentRequestDTO.getCommentBody());
            comment.setPost(post);
            comment.setUser(user);

            Comment savedComment = commentRepository.save(comment);
            return getCommentResponseDTO(savedComment);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    //display all comments
    public ApiResponse<List<CommentResponseDTO>> getComments(Long postId) {
        try {
            List<Comment> comments = commentRepository.findByPostId(postId);

            List<CommentResponseDTO> commentDTOs = comments.stream()
                    .map(this::getCommentResponseDTO)
                    .toList();

            return ApiResponse.success(commentDTOs, "Comments fetched successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //update comment
    public ApiResponse<CommentResponseDTO> updateComment(Long commentId, CommentRequestDTO commentRequestDTO) {

        try {
            Long userId = getCurrentUser().getId();
            Comment comment = commentRepository.findById(commentId).orElse(null);

            if(comment == null){
                return ApiResponse.error("Comment not found");
            }

            // Ownership check
            if (!comment.getUser().getId().equals(userId)) {
                return ApiResponse.error("You are not allowed to edit this comment");
            }

            // Null or empty check
            String newBody = commentRequestDTO.getCommentBody();
            if (newBody == null || newBody.isEmpty()) {
                return ApiResponse.error("Comment body cannot be empty");
            }

            // Update and save
            comment.setCommentBody(newBody);
            Comment savedComment = commentRepository.save(comment);

            return  ApiResponse.success(getCommentResponseDTO(savedComment), "Comment updated successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    //delete comment
    public ApiResponse<CommentResponseDTO> deleteComment(Long commentId) {
        try {
            // Get the logged-in user
            Long userId = getCurrentUser().getId();

            // Find the comment
            Comment comment = commentRepository.findById(commentId).orElse(null);
            if (comment == null) {
                return ApiResponse.error("Comment not found");
            }

            // Check ownership
            if (!comment.getUser().getId().equals(userId)) {
                return ApiResponse.error("You are not allowed to delete this comment");
            }

            // Delete the comment
            commentRepository.delete(comment);

            return ApiResponse.success(null,"Comment deleted successfully");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //like and unlike comment
    public ApiResponse<CommentResponseDTO> likeComment(Long commentId) {
       try{
           User currentUser = getCurrentUser();
           Comment comment = commentRepository.findById(commentId).orElse(null);
           if (comment == null) {
               return ApiResponse.error("Comment not found");
           }
           // Check if user already liked the comment
           Optional<Like> existingLike = likeRepository.findByUserAndComment(currentUser, comment);

           if (existingLike.isPresent()) {
                // User already liked the comment, so remove the like
                likeRepository.delete(existingLike.get());
                comment.setLikeCount(comment.getLikeCount() - 1);
                commentRepository.save(comment);
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

        return commentResponseDTO;
    }

    public User getCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(currentUsername);
    }

}
