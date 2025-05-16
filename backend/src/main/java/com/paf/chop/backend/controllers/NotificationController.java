package com.paf.chop.backend.controllers;

            import com.paf.chop.backend.dto.response.NotificationResponseDTO;
            import com.paf.chop.backend.services.NotificationService;
            import com.paf.chop.backend.utils.ApiResponse;
            import org.springframework.http.HttpStatus;
            import org.springframework.http.ResponseEntity;
            import org.springframework.web.bind.annotation.*;

            import java.util.List;

@RequestMapping("/api/notifications")
            @RestController
            public class NotificationController {

                private final NotificationService notificationService;

                public NotificationController(NotificationService notificationService) {
                    this.notificationService = notificationService;
                }

                @GetMapping("/get/{userId}")
                public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> getNotifications(@PathVariable Long userId) {
                    ApiResponse<List<NotificationResponseDTO>> notificationResponseDTO = notificationService.getNotifications(userId);
                    if (notificationResponseDTO.isSuccess()) {
                        return ResponseEntity.status(HttpStatus.OK).body(notificationResponseDTO);
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(notificationResponseDTO);
                    }
                }

                @PostMapping("/mark-read/{notificationId}")
                public ResponseEntity<ApiResponse<NotificationResponseDTO>> markRead(@PathVariable  Long notificationId) {
                    notificationService.markNotificationAsRead(notificationId);
                    ApiResponse<NotificationResponseDTO> notificationResponseDTO = new ApiResponse<>(true, "Notification marked as read", null);
                    return ResponseEntity.status(HttpStatus.OK).body(notificationResponseDTO);
                }

            }
