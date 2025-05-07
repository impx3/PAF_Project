import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext.tsx";
import { ChatResponse, getPreviousMessages } from "@/service/chat.service.ts";
import { ChatFooter } from "@/components/chat/chat-footer.tsx";
import { X, Minus, MessageSquare } from "lucide-react";
import { PublicUser } from "@/pages/UserList.tsx";

type ChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  recipient: PublicUser;
};

export const ChatDialog = ({ isOpen, onClose, recipient }: ChatDialogProps) => {
  const [messages, setMessages] = useState<ChatResponse[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadMessages = async () => {
      const history = await getPreviousMessages(
        currentUser?.id as number,
        recipient?.id,
      );
      setMessages(history);
    };
    if (isOpen) loadMessages();
  }, [recipient?.id, currentUser?.id, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {!isMinimized ? (
        <div className="w-full max-w-md rounded-lg shadow-xl bg-white border">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={recipient?.profileImage} />
                <AvatarFallback>{recipient?.firstName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm">
                  {recipient?.firstName}
                </h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <Minus className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="h-[400px] flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <ScrollArea className="h-full p-4 bg-gray-50">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderName === currentUser?.firstName
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.senderName === currentUser?.firstName
                            ? "bg-blue-500 text-white"
                            : "bg-white border"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-[10px] mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            <ChatFooter
              senderId={currentUser?.id as number}
              recipientId={recipient.id}
              onNewMessage={(content) => {
                // Handle received messages
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    senderName: recipient?.firstName,
                    recipientName: currentUser?.firstName || "",
                    content,
                    timestamp: new Date().toISOString(),
                    seen: false,
                    delivered: false,
                  },
                ]);
              }}
              onMessageSent={(content) => {
                // Optimistic update for sent messages
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    senderName: currentUser?.firstName || "",
                    recipientName: recipient?.firstName,
                    content,
                    timestamp: new Date().toISOString(),
                    seen: false,
                    delivered: false,
                  },
                ]);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMinimized(false)}
              className="hover:bg-gray-100 p-2 rounded-full"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
