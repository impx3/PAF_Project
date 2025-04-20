package com.paf.chop.backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paf.chop.backend.dto.ChatMessageDTO;
import com.paf.chop.backend.models.Message;
import com.paf.chop.backend.services.MessageService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler implements WebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MessageService messageService;

    // Maps userId to WebSocketSession
    private final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(MessageService messageService) {
        this.messageService = messageService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Grab userId from query param like: ws://localhost:8080/ws/chat?userId=1
        String query = session.getUri().getQuery();
        if (query != null && query.startsWith("userId=")) {
            Long userId = Long.parseLong(query.substring("userId=".length()));
            sessions.put(userId, session);
            session.getAttributes().put("userId", userId);
        } else {
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String payload = message.getPayload().toString();
        ChatMessageDTO dto = objectMapper.readValue(payload, ChatMessageDTO.class);
        // Save the message to DB
        Message saved = messageService.sendMessage(dto.getSenderId(), dto.getRecipientId(), dto.getContent());

        // Send message to recipient if online
        WebSocketSession recipientSession = sessions.get(dto.getRecipientId());
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(saved)));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.out.println("Error: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.values().remove(session);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
