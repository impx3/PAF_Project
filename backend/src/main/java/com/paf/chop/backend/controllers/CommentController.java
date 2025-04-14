package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.response.CommentResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @PostMapping("/add")
    public ResponseEntity<CommentResponseDTO> addComment(@RequestBody CommentResponseDTO commentResponseDTO ) {
        return null;
    }



}
