package com.paf.chop.backend.controllers;

import com.paf.chop.backend.models.Message;
import com.paf.chop.backend.services.MessageService;
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
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long currentUserId, @PathVariable Long recipientId) {
        return ResponseEntity.ok(messageService.getConversation(currentUserId, recipientId));
    }
}
