import { useState } from "react";
import { ChatDialog } from "@/components/chat/chat.tsx";
import { User } from "@/context/AuthContext.tsx";

export const TestProfile = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const user: User = {
    coins: 0,
    email: "",
    following: [],
    username: "",
    id: 2,
    firstName: "John",
    lastName: "Doe",
    profileImage: "https://example.com/image.jpg",
    isVerified: true,
  };

  return (
    <div>
      <button
        onClick={() => setIsChatOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Message User
      </button>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipient={user}
      />
    </div>
  );
};
