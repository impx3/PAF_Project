package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.models.Comment;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.CommentRepository;
import com.paf.chop.backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CommentService {

    @Autowired
    CommentRepository commentRepository;
    @Autowired
    UserRepository userRepository;

    public CommentResponseDTO comment(CommentRequestDTO commentRequestDTO) {
        try{
            if(commentRequestDTO.getCommentBody() == null){
                return null;
            }

            User user = userRepository.findByUsername(commentRequestDTO.getUsername());

            //send request body data to the database to store
            Comment comment = new Comment();

            //request dto data
            comment.setCommentBody(commentRequestDTO.getCommentBody());
            comment.setPostId(commentRequestDTO.getPostId());
            comment.setUsername(commentRequestDTO.getUsername());

            Comment savedComment = commentRepository.save(comment);
            String profileImage = user.getProfileImage();

            return getCommentResponseDTO(savedComment,profileImage);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }


    public CommentResponseDTO getCommentResponseDTO(Comment comment,String profileImage) {
        CommentResponseDTO commentResponseDTO = new CommentResponseDTO();
        //response dto data
        commentResponseDTO.setProfileImage(profileImage);
        commentResponseDTO.setUsername(comment.getUsername());
        commentResponseDTO.setCommentBody(comment.getCommentBody());
        commentResponseDTO.setLikeCount(comment.getLikeCount());
        commentResponseDTO.setUpdatedAt(comment.getUpdatedAt());

        return commentResponseDTO;
    }
}
