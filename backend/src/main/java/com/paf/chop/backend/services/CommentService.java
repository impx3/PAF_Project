package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.request.CommentRequestDTO;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CommentService {

    public CommentResponseDTO comment(CommentRequestDTO commentRequestDTO) {
        try{
            if(commentRequestDTO.getCommentBody() == null){

            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return new CommentResponseDTO();
    }
}
