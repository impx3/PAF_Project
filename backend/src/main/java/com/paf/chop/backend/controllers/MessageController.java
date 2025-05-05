package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.response.ConversationResponseDTO;
import com.paf.chop.backend.models.Message;
import com.paf.chop.backend.services.MessageService;
import com.paf.chop.backend.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/with/{currentUserId}/and/{recipientId}")
    public ResponseEntity<ApiResponse<List<ConversationResponseDTO>>> getConversation(@PathVariable Long currentUserId, @PathVariable Long recipientId) {
         if(messageService.getConversation(currentUserId, recipientId).isSuccess()){
            return ResponseEntity.ok(messageService.getConversation(currentUserId, recipientId));
         }else{
            return ResponseEntity.badRequest().body(messageService.getConversation(currentUserId, recipientId));
         }
    }
}
