package com.paf.chop.backend.services;

import com.paf.chop.backend.enums.NotificationType;
import com.paf.chop.backend.dto.response.NotificationResponseDTO;
import com.paf.chop.backend.models.Notification;
import com.paf.chop.backend.repositories.NotificationRepository;
import com.paf.chop.backend.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(String message, NotificationType type, Long userId) {

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setType(type);
        notification.setUserId(userId);
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }

    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    public ApiResponse<List<NotificationResponseDTO>> getNotifications(Long userId){
        ApiResponse<NotificationResponseDTO> response = new ApiResponse<>();
        try {
            List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
            List<NotificationResponseDTO> notificationResponseDTOs = notifications.stream()
                    .map(notification -> {
                        NotificationResponseDTO dto = new NotificationResponseDTO();
                        dto.setId(notification.getNotificationId());
                        dto.setMessage(notification.getMessage());
                        dto.setType(notification.getType().getType());
                        dto.setUserId(notification.getUserId());
                        dto.setIsRead(notification.getIsRead());
                        dto.setCreatedAt(notification.getCreatedAt().toString());
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ApiResponse.success( notificationResponseDTOs , "Notifications Fetched Successfully");
        } catch (Exception e) {

            log.error(e.getMessage());
            return ApiResponse.error( "Error fetching notifications: " + e.getMessage());
        }
    }
}
