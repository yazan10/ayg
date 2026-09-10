import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Send, X, MessageCircle } from 'lucide-react';

export const CommentsModal: React.FC = () => {
  const { 
    activeCommentTarget, 
    setActiveCommentTarget, 
    comments, 
    addComment, 
    toggleLikeComment, 
    currentUser,
    lang 
  } = useStore();

  const [newCommentText, setNewCommentText] = useState('');

  if (!activeCommentTarget) return null;

  const targetComments = comments.filter(c => c.targetId === activeCommentTarget.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(activeCommentTarget.id, newCommentText.trim());
    setNewCommentText('');
  };

  const quickEmojis = ['❤️', '🔥', '😍', '👑', '✨', '👏', '🇸🇦', '☕️'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[80vh] sm:max-h-[650px] overflow-hidden animate-in slide-in-from-bottom duration-200 border border-neutral-200">
        {/* Handle / Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-black">
              {lang === 'ar' ? 'التعليقات' : 'Comments'} ({targetComments.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveCommentTarget(null)}
            className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {targetComments.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-xs">
              {lang === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يعلّق!' : 'No comments yet. Be the first to comment!'}
            </div>
          ) : (
            targetComments.map(comm => (
              <div key={comm.id} className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-2.5 flex-1">
                  <img
                    src={comm.userAvatar}
                    alt={comm.username}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="text-black leading-relaxed">
                      <span className="font-bold me-1.5">@{comm.username}</span>
                      <span className="text-neutral-800">{comm.text}</span>
                    </p>
                    <span className="text-[10px] text-neutral-400 block font-mono">{comm.createdAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleLikeComment(comm.id)}
                  className="flex flex-col items-center p-1 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Heart className={`w-4 h-4 ${comm.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {comm.likes > 0 && (
                    <span className="text-[9px] font-bold text-neutral-500 mt-0.5">{comm.likes}</span>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between overflow-x-auto">
          {quickEmojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setNewCommentText(prev => prev + emoji)}
              className="text-lg hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <input
            type="text"
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder={lang === 'ar' ? `التعليق باسم @${currentUser.username}...` : `Comment as @${currentUser.username}...`}
            className="flex-1 px-4 py-2 bg-neutral-100 text-black rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold disabled:opacity-30 hover:bg-blue-700 transition-colors shrink-0"
          >
            {lang === 'ar' ? 'نشر' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};
