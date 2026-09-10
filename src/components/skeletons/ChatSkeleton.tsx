import React from 'react';
import './SkeletonBase.css';

interface ChatSkeletonProps {
  count?: number;
}

export const ChatSkeleton: React.FC<ChatSkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-loader skeleton-chat">
          <div className="chat-avatar"></div>
          <div className="chat-lines">
            <div className="chat-line-short"></div>
            <div className="chat-line-long"></div>
          </div>
          <div className="chat-time"></div>
        </div>
      ))}
    </>
  );
};

export const ChatMessageSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 p-4">
      {/* Received messages */}
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-[#cacaca] flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-10 w-3/4 bg-[#cacaca] rounded-2xl"></div>
          <div className="h-3 w-16 bg-[#cacaca] rounded"></div>
        </div>
      </div>
      {/* Sent messages */}
      <div className="flex gap-2 justify-end">
        <div className="flex-1 flex flex-col items-end space-y-2">
          <div className="h-10 w-2/3 bg-[#cacaca] rounded-2xl"></div>
          <div className="h-3 w-16 bg-[#cacaca] rounded"></div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-[#cacaca] flex-shrink-0"></div>
        <div className="h-12 w-1/2 bg-[#cacaca] rounded-2xl"></div>
      </div>
    </div>
  );
};
