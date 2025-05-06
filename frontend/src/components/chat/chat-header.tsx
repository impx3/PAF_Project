import { Minus, X } from "lucide-react";

type User = {
  id: number;
  username: string;
  profileImage?: string;
};

type ChatHeaderProps = {
  recipientId: User;
};

export const ChatHeader = ({ recipientId }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-white shadow">
      <div className="flex items-center space-x-2">
        <img
          src={recipientId.profileImage || "/default-avatar.png"}
          alt={recipientId.username}
          className="h-10 w-10 min-w-[2.5rem] rounded-full object-cover border-2 border-black"
        />
        <span className="px-2 py-1 text-xs font-medium text-white bg-gray-400 rounded-full">
          {recipientId.username}
        </span>
      </div>
      <div className="flex space-x-2">
        <Minus className="cursor-pointer hover:text-gray-600" />
        <X className="cursor-pointer hover:text-red-600" />
      </div>
    </div>
  );
};
