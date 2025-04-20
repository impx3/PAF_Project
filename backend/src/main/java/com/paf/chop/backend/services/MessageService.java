package com.paf.chop.backend.services;

import com.paf.chop.backend.models.Message;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.MessageRepository;
import com.paf.chop.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;



import java.util.List;

@Service
public class MessageService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(Long senderId, Long recipientId, String content) {


        User recipient = userRepository.findById(recipientId).orElse(null);
        User sender = userRepository.findById(senderId).orElse(null);

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setSeen(false);

        return messageRepository.save(message);
    }

    public List<Message> getConversation(Long currentUserId, Long recipientId) {

        return messageRepository.findConversation(currentUserId, recipientId);
    }



}
