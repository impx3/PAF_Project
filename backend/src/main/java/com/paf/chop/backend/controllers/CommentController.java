package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/add")
    public ResponseEntity<CommentResponseDTO> addComment(@RequestBody CommentRequestDTO commentRequestDTO ) {
        CommentResponseDTO commentResponseDTO = commentService.comment(commentRequestDTO);

        if(commentResponseDTO == null){
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return  ResponseEntity.status(HttpStatus.CREATED).body(commentResponseDTO);

    }

}
