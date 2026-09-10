import React from 'react';
import './ChatTransition.css';

interface ChatTransitionProps {
  isVisible: boolean;
}

export const ChatTransition: React.FC<ChatTransitionProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="chat-transition-overlay" role="status" aria-label="Switching chat">
      <div className="center_div">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};
