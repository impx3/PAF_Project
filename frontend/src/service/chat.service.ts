import api from "@/utils/axiosConfig.ts";

export interface ChatResponse {
  id: number;
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: string;
  seen: boolean;
  delivered: boolean;
}

export const getPreviousMessages = async (
  currentUserId: number,
  recipientId: number,
) => {
  try {
    const response = await api.get(
      `/messages/with/${currentUserId}/and/${recipientId}`,
    );
    return response.data.result as ChatResponse[];
  } catch (error) {
    console.error("Error fetching previous messages:", error);
    return [];
  }
};
