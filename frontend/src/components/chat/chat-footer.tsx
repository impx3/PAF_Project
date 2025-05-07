import { useState, useEffect, useRef } from "react";

type ChatFooterProps = {
  senderId: number;
  recipientId: number;
  onNewMessage: (content: string) => void;
  onMessageSent: (content: string) => void;
};

type ChatMessage = {
  senderId: number;
  recipientId: number;
  content: string;
};

export const ChatFooter = ({
  senderId,
  recipientId,
  onNewMessage,
  onMessageSent,
}: ChatFooterProps) => {
  const [message, setMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/chat?userId=${senderId}`);
    socketRef.current = ws;

    ws.onopen = () => console.log(`🟢 Connected as User ${senderId}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📨 Message from ${data.senderName}: ${data.content}`);
        onNewMessage(data.content);
      } catch (err) {
        console.error("❌ Failed to parse message:", err);
      }
    };

    return () => ws.close();
  }, [senderId, onNewMessage]);

  const handleSend = () => {
    if (!message.trim()) return;

    const chatMessage: ChatMessage = {
      senderId,
      recipientId,
      content: message,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(chatMessage));
      onMessageSent(message);
      setMessage("");
    } else {
      console.error("WebSocket is not open.");
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};
