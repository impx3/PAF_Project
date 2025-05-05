import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from '../styles/ChatPopup.module.css';

interface User {
  firstName: string;
  lastName: string;
  username: string;
}

interface ChatPopupProps {
  user: User;
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ user, onClose }) => {
  return (
    <div className={styles.chatPopup}>
      <div className={styles.chatHeader}>
        <div>
          <p className={styles.name}>{user.firstName} {user.lastName}</p>
          <p className={styles.username}>@{user.username}</p>
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          <FiX size={20} />
        </button>
      </div>

      <div className={styles.chatBody}>
        {/* messages would go here */}
      </div>

      <div className={styles.chatInputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          className={styles.chatInput}
        />
        <button className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

export default ChatPopup;
