package com.paf.chop.backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paf.chop.backend.dto.ChatMessageDTO;
import com.paf.chop.backend.dto.response.MessageResponse;
import com.paf.chop.backend.models.Message;
import com.paf.chop.backend.services.MessageService;
import com.paf.chop.backend.services.UserService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class ChatWebSocketHandler implements WebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MessageService messageService;
    private final UserService userService;

    // Maps userId to WebSocketSession
    private final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        log.info("New connection established");

        String query = (session.getUri() != null) ? session.getUri().getQuery() : null;
        if (query != null && query.startsWith("userId=")) {
            Long userId = Long.parseLong(query.substring("userId=".length()));

            if(!userService.isUserExists(userId)) {
                log.error("Chat Attempt failed: User with ID {} does not exist", userId);
                session.close(CloseStatus.BAD_DATA);
                return;
            }

            sessions.put(userId, session);
            session.getAttributes().put("userId", userId);
            log.info("User with ID {} connected", userId);
        } else {
            log.error("Chat Attempt failed: No userId found in query");
            session.close(CloseStatus.BAD_DATA);
        }
    }


    @Override //Ignore the warning
    public void handleMessage( WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String payload = message.getPayload().toString();
        ChatMessageDTO dto = objectMapper.readValue(payload, ChatMessageDTO.class);
        // Save the message to DB
        Message saved = messageService.sendMessage(dto.getSenderId(), dto.getRecipientId(), dto.getContent());

        MessageResponse response = new MessageResponse(saved);

        // Send message to recipient if online
        WebSocketSession recipientSession = sessions.get(dto.getRecipientId());
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
       log.error("WebSocket Transport error: {}", exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket connection closed with status: {}", status.toString());
        sessions.values().remove(session);
    }

    @Override
    public boolean supportsPartialMessages() {
        // Return false to indicate that we do not support partial messages
        // This means that the entire message must be received in one go
        return false;
    }
}
