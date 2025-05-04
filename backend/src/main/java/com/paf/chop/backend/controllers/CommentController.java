package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.services.CommentService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> addComment(@RequestBody CommentRequestDTO commentRequestDTO) {
        log.info("Adding comment for post : {}", commentRequestDTO.getPostId());
        ApiResponse<CommentResponseDTO> commentResponseDTO = commentService.comment(commentRequestDTO);

        if (commentResponseDTO.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(commentResponseDTO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(commentResponseDTO);
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<List<CommentResponseDTO>>> getComments(@PathVariable Long postId) {

        ApiResponse<List<CommentResponseDTO>> comments = commentService.getComments(postId);

        if (comments.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(comments);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(comments);
        }
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> updateComment(@PathVariable Long commentId, @RequestBody CommentRequestDTO commentRequestDTO) {
        ApiResponse<CommentResponseDTO> commentResponseDTO = commentService.updateComment(commentId, commentRequestDTO);

        if (commentResponseDTO.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(commentResponseDTO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(commentResponseDTO);
        }
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> deleteComment(@PathVariable Long commentId) {
        ApiResponse<CommentResponseDTO> commentResponseDTO = commentService.deleteComment(commentId);

        if (commentResponseDTO.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(commentResponseDTO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(commentResponseDTO);
        }
    }

    @PostMapping("/like/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDTO>> likeComment(@PathVariable Long commentId) {
        ApiResponse<CommentResponseDTO> commentResponseDTO = commentService.likeComment(commentId);

        if (commentResponseDTO.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(commentResponseDTO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(commentResponseDTO);
        }
    }




}
