import React from 'react';
import { FiX } from 'react-icons/fi';

const ChatPopup = ({ user, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl border rounded-lg z-50">
      <div className="flex justify-between items-center p-3 border-b bg-blue-100 rounded-t-lg">
        <div>
          <p className="font-semibold">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-gray-600">@{user.username}</p>
        </div>
        <button onClick={onClose}>
          <FiX size={20} className="text-gray-700 hover:text-red-500" />
        </button>
      </div>

      <div className="p-3 h-48 overflow-y-auto text-sm text-gray-800">
      {messages.map(msg => (
        <p key={msg.id} className={`mb-2 p-2 rounded w-fit ${msg.sender === 'me' ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100'}`}>
          {msg.content}
        </p>
      ))}

      </div>

      <div className="p-2 border-t flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded text-sm"
        />
        <button className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">Send</button>
      </div>
    </div>
  );
};

export default ChatPopup;
