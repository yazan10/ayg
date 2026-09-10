import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LIVE_GIFTS } from '../data/initialData';
import { LiveGift } from '../types';
import { Heart, Send, Gift, Users, Radio, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

export const LivePage: React.FC = () => {
  const { liveId } = useParams<{ liveId: string }>();
  const navigate = useNavigate();
  const { liveStreams, sendLiveComment, sendLiveGift, likeLiveStream, formatPrice, currentUser, lang } = useStore();
  const stream = liveStreams.find(s => s.id === liveId);

  const [commentText, setCommentText] = useState('');
  const [isGiftsOpen, setIsGiftsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; color: string }[]>([]);
  const [recentGiftNotice, setRecentGiftNotice] = useState<string | null>(null);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [stream?.comments]);

  if (!stream) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'البث غير موجود' : 'Stream not found'} />
        <div className="p-8 text-center text-sm text-neutral-500">{lang === 'ar' ? 'البث المباشر غير موجود أو انتهى' : 'Live stream not found or ended'}</div>
      </div>
    );
  }

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    sendLiveComment(stream.id, commentText.trim());
    setCommentText('');
  };
  const handleLike = () => {
    likeLiveStream(stream.id);
    const colors = ['#ef4444', '#ec4899', '#f59e0b', '#3b82f6', '#8b5cf6'];
    const newHeart = { id: Date.now() + Math.random(), x: Math.floor(Math.random() * 40) - 20, color: colors[Math.floor(Math.random() * colors.length)] };
    setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
  };
  const handleGiftSelect = (gift: LiveGift) => {
    sendLiveGift(stream.id, gift);
    setIsGiftsOpen(false);
    setRecentGiftNotice(`${currentUser.name} أرسل ${gift.icon} ${lang === 'ar' ? gift.nameAr : gift.nameEn}`);
    setTimeout(() => setRecentGiftNotice(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-[85vh]">
      <PageHeader
        title={`${stream.userName} • LIVE`}
        subtitle={`${stream.viewerCount.toLocaleString()} ${lang === 'ar' ? 'مشاهد' : 'viewers'} • ${stream.likesCount.toLocaleString()} ${lang === 'ar' ? 'إعجاب' : 'likes'}`}
        actions={
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold"><span className="w-2 h-2 rounded-full bg-white animate-pulse" />LIVE</span>
            <button onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
          </div>
        }
      />

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full bg-black relative overflow-hidden md:rounded-2xl md:border md:border-neutral-200 md:my-4 md:shadow-xl" style={{ minHeight: '65vh' }}>
        <div className="absolute inset-0">
          <video src={stream.videoUrl} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />
        </div>

        {recentGiftNotice && (
          <div className="absolute top-4 inset-x-4 z-30">
            <div className="mx-auto max-w-xs bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/30 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" /><span className="truncate">{recentGiftNotice}</span>
            </div>
          </div>
        )}

        <div className="absolute end-4 bottom-28 pointer-events-none z-20 h-48 w-20 overflow-hidden flex flex-col justify-end items-center">
          {floatingHearts.map(h => (
            <div key={h.id} style={{ transform: `translateX(${h.x}px)`, color: h.color }} className="text-2xl select-none animate-bounce">❤️</div>
          ))}
        </div>

        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 pe-3 rounded-full border border-white/15">
            <img src={stream.userAvatar} alt={stream.userName} className="w-9 h-9 rounded-full object-cover border border-white" />
            <div><div className="flex items-center gap-1"><span className="text-xs font-bold text-white leading-none">{stream.userName}</span>{stream.userVerified && <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>}</div><span className="text-[10px] text-white/70">@{stream.username}</span></div>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/10">
            <Users className="w-3.5 h-3.5" /><span>{stream.viewerCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="relative z-10 px-4">
          <div className="bg-black/30 backdrop-blur-md inline-block px-3 py-1 rounded-lg border border-white/10 text-xs text-white/90">
            <span className="text-amber-400 font-bold me-1">#{stream.category}</span><span>{stream.title}</span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="relative z-10 p-4 space-y-3">
          <div className="max-h-52 overflow-y-auto space-y-2 pe-1">
            {stream.comments.map(comment => (
              <div key={comment.id} className={`flex items-start gap-2 text-xs p-2 rounded-xl backdrop-blur-sm ${comment.isGiftNotice ? 'bg-pink-500/30 border border-pink-400/40 text-pink-200' : 'bg-black/30 text-white'}`}>
                <img src={comment.userAvatar} alt={comment.username} className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/30" />
                <div className="leading-tight"><span className="font-bold text-white/80 me-1">@{comment.username}:</span><span className="text-white">{comment.text}</span></div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {isGiftsOpen && (
            <div className="p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-white/20 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs"><span className="font-bold text-white flex items-center gap-1.5"><Gift className="w-4 h-4 text-pink-400" />{lang === 'ar' ? 'إرسال هدية لدعم البث' : 'Send Gift'}</span><button onClick={() => setIsGiftsOpen(false)} className="text-neutral-400"><X className="w-4 h-4" /></button></div>
              <div className="grid grid-cols-3 gap-2">
                {LIVE_GIFTS.map(g => (
                  <button key={g.id} onClick={() => handleGiftSelect(g)} className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center gap-1">
                    <span className="text-2xl">{g.icon}</span><span className="text-[11px] font-bold text-white">{lang === 'ar' ? g.nameAr : g.nameEn}</span><span className="text-[10px] font-bold text-pink-400 font-mono">{formatPrice(g.priceSAR)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <form onSubmit={handleSendComment} className="flex-1 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/20">
              <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={lang === 'ar' ? 'أضف تعليقاً في البث...' : 'Add a live comment...'} className="w-full bg-transparent text-sm text-white placeholder-white/60 focus:outline-none" />
              <button type="submit" disabled={!commentText.trim()} className="text-white disabled:opacity-40"><Send className="w-4 h-4" /></button>
            </form>
            <button onClick={() => setIsGiftsOpen(!isGiftsOpen)} className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg"><Gift className="w-5 h-5" /></button>
            <button onClick={handleLike} className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md text-white hover:text-red-400 flex items-center justify-center border border-white/20"><Heart className="w-5 h-5 fill-current" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
