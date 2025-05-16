import api from "@/utils/axiosConfig.ts";

interface NotificationResponse {
  id: string;
  message: string;
  type: string;
  userId: number;
  isRead: boolean;
  createdAt: string;
}

export const getNotification = async (userId: number) => {
  try {
    const response = await api.get(`/notifications/get/${userId}`);
    return response.data.result as NotificationResponse[];
  } catch (err) {
    console.error("Failed to fetch notifications", err);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await api.post(`/notifications/mark-read/${notificationId}`);
  } catch (err) {
    console.error("Failed to mark notification as read", err);
  }
};
