import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Heart, Send } from 'lucide-react';

export const CommentsPage: React.FC = () => {
  const { targetId } = useParams<{ targetId: string }>();
  const { comments, addComment, toggleLikeComment, currentUser, products, reels, lang } = useStore();
  const [newCommentText, setNewCommentText] = useState('');

  const product = products.find(p => p.id === targetId);
  const reel = reels.find(r => r.id === targetId);
  const title = product ? (lang === 'ar' ? product.name : product.nameEn) : reel ? reel.caption.slice(0, 30) : (lang === 'ar' ? 'التعليقات' : 'Comments');
  const targetComments = comments.filter(c => c.targetId === targetId);
  const quickEmojis = ['❤️', '🔥', '😍', '👑', '✨', '👏', '🇸🇦', '☕️'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !targetId) return;
    addComment(targetId, newCommentText.trim());
    setNewCommentText('');
  };

  return (
    <div className="flex flex-col min-h-[70vh]">
      <PageHeader title={`${lang === 'ar' ? 'التعليقات' : 'Comments'} (${targetComments.length})`} subtitle={title} />

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {targetComments.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-400">{lang === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يعلّق!' : 'No comments yet. Be the first to comment!'}</div>
          ) : (
            targetComments.map(comm => (
              <div key={comm.id} className="flex items-start justify-between gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-start gap-2.5 flex-1">
                  <img src={comm.userAvatar} alt={comm.username} className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0" />
                  <div className="text-sm space-y-0.5">
                    <p className="text-black leading-relaxed">
                      <span className="font-bold me-1.5">@{comm.username}</span>
                      <span className="text-neutral-800">{comm.text}</span>
                    </p>
                    <span className="text-xs text-neutral-400 block font-mono">{comm.createdAt}</span>
                  </div>
                </div>
                <button onClick={() => toggleLikeComment(comm.id)} className="flex flex-col items-center p-1 text-neutral-400 hover:text-red-500 shrink-0">
                  <Heart className={`w-5 h-5 ${comm.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {comm.likes > 0 && <span className="text-[11px] font-bold text-neutral-500 mt-0.5">{comm.likes}</span>}
                </button>
              </div>
            ))
          )}
          {product && (
            <Link to={`/product/${product.id}`} className="block text-center text-xs font-bold text-blue-600 hover:underline pt-2">
              {lang === 'ar' ? '← العودة للمنتج' : '← Back to product'}
            </Link>
          )}
        </div>

        <div className="border-t border-neutral-200 bg-white sticky bottom-0">
          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between overflow-x-auto gap-1">
            {quickEmojis.map(emoji => (
              <button key={emoji} type="button" onClick={() => setNewCommentText(prev => prev + emoji)} className="text-xl hover:scale-125 transition-transform p-1">
                {emoji}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-3 flex items-center gap-2">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0" />
            <input type="text" value={newCommentText} onChange={e => setNewCommentText(e.target.value)} placeholder={lang === 'ar' ? `التعليق باسم @${currentUser.username}...` : `Comment as @${currentUser.username}...`} className="flex-1 px-4 py-3 bg-neutral-100 text-black rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <button type="submit" disabled={!newCommentText.trim()} className="px-5 py-3 bg-blue-600 text-white rounded-full text-sm font-bold disabled:opacity-30 hover:bg-blue-700 shrink-0">
              {lang === 'ar' ? 'نشر' : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
