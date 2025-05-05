package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.response.ConversationResponseDTO;
import com.paf.chop.backend.models.Message;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.MessageRepository;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class MessageService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(UserRepository userRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(Long senderId, Long recipientId, String content) {

        User recipient = userRepository.findById(recipientId).orElse(null);
        User sender = userRepository.findById(senderId).orElse(null);

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setSeen(false);
        message.setDelivered(true);

        return messageRepository.save(message);
    }

    public ApiResponse<List<ConversationResponseDTO>> getConversation(Long currentUserId, Long recipientId) {

        try{
            log.info("Attempting to retrieve conversation between user {} and user {}", currentUserId, recipientId);
            if(currentUserId == null || recipientId == null) {
                log.error("Recipient ID or Current User ID cannot be null");
                ApiResponse.error("Recipient ID or Current User ID cannot be null");
            }

            List<Message> messageList = messageRepository.findConversation(currentUserId, recipientId);

            if (messageList != null && !messageList.isEmpty()) {

                return  ApiResponse.success(messageList.stream()
                        .map(message -> {
                            ConversationResponseDTO response = new ConversationResponseDTO();
                            response.setId(message.getMessageId());
                            response.setSenderName(message.getSender().getFirstName());
                            response.setRecipientName(message.getRecipient().getFirstName());
                            response.setContent(message.getContent());
                            response.setSeen(message.isSeen());
                            response.setDelivered( message.isDelivered());
                            response.setTimestamp(message.getTimestamp().toString());

                            if(message.isDelivered() && !message.isSeen()){
                                message.setSeen(true);
                                messageRepository.save(message);
                            }

                            return response;
                        })
                        .toList() , "Conversation retrieved successfully");

            }

            log.info("Conversation retrieved successfully");
            return  ApiResponse.success(new ArrayList<>(), "No messages found for this conversation");
        } catch (Exception e) {
            log.error("Error retrieving conversation: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }


    public void setMessageSeen(Long messageId) {
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message != null) {
            message.setSeen(true);
            messageRepository.save(message);
        }
    }

    public void setMessageDelivered(Long messageId) {
        Message message = messageRepository.findById(messageId).orElse(null);
        if (message != null) {
            message.setDelivered(true);
            messageRepository.save(message);
        }
    }
}
