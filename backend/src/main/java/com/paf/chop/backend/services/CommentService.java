package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.models.Comment;
import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.CommentRepository;
import com.paf.chop.backend.repositories.PostRepository;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

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

    public ApiResponse<List<CommentResponseDTO>> getComments(Long postId) {
        try {
            List<Comment> comments = commentRepository.findByPostId(postId);

            List<CommentResponseDTO> commentDTOs = comments.stream()
                    .map(this::getCommentResponseDTO)
                    .toList();

            if (commentDTOs.isEmpty()) {
                return ApiResponse.success(Collections.emptyList(), "No comments yet");
            }

            return ApiResponse.success(commentDTOs, "Comments fetched successfully");

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


}
