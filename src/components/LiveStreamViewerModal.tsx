import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { LIVE_GIFTS } from '../data/initialData';
import { LiveGift } from '../types';
import { 
  X, 
  Heart, 
  Send, 
  Gift, 
  Users, 
  Share2, 
  Radio, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Plus,
  Coins
} from 'lucide-react';

export const LiveStreamViewerModal: React.FC = () => {
  const { 
    activeLiveStream, 
    isLiveViewerOpen, 
    setIsLiveViewerOpen, 
    sendLiveComment, 
    sendLiveGift, 
    likeLiveStream, 
    formatPrice,
    currentUser,
    lang 
  } = useStore();

  const [commentText, setCommentText] = useState('');
  const [isGiftsOpen, setIsGiftsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; color: string }[]>([]);
  const [recentGiftNotice, setRecentGiftNotice] = useState<string | null>(null);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeLiveStream?.comments]);

  if (!isLiveViewerOpen || !activeLiveStream) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    sendLiveComment(activeLiveStream.id, commentText.trim());
    setCommentText('');
  };

  const handleLike = () => {
    likeLiveStream(activeLiveStream.id);
    const colors = ['#ef4444', '#ec4899', '#f59e0b', '#3b82f6', '#8b5cf6'];
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.floor(Math.random() * 40) - 20,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
  };

  const handleGiftSelect = (gift: LiveGift) => {
    sendLiveGift(activeLiveStream.id, gift);
    setIsGiftsOpen(false);
    setRecentGiftNotice(`${currentUser.name} أرسل ${gift.icon} ${lang === 'ar' ? gift.nameAr : gift.nameEn}`);
    setTimeout(() => {
      setRecentGiftNotice(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div 
        className="relative w-full h-full sm:h-[92vh] sm:max-w-md bg-neutral-950 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={() => setIsGiftsOpen(false)}
      >
        {/* Live Stream Background Video or Imagery */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <video
            src={activeLiveStream.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover opacity-85"
          />
          {/* Subtle gradient overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* Floating Heart Animations */}
        <div className="absolute end-4 bottom-24 pointer-events-none z-30 h-64 w-20 overflow-hidden flex flex-col justify-end items-center">
          {floatingHearts.map((h) => (
            <div
              key={h.id}
              style={{
                transform: `translateX(${h.x}px)`,
                color: h.color
              }}
              className="animate-float-heart text-2xl transition-all select-none"
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Top Floating Notification for Live Gifts */}
        {recentGiftNotice && (
          <div className="absolute top-20 inset-x-4 z-40 animate-bounce">
            <div className="mx-auto max-w-xs bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/30 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="truncate">{recentGiftNotice}</span>
            </div>
          </div>
        )}

        {/* Top Broadcast Bar */}
        <div className="relative z-20 p-4 flex items-center justify-between">
          {/* Creator Profile Badge */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 pe-3 rounded-full border border-white/15">
            <img
              src={activeLiveStream.userAvatar}
              alt={activeLiveStream.userName}
              className="w-9 h-9 rounded-full object-cover border border-white"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white leading-none">
                  {activeLiveStream.userName}
                </span>
                {activeLiveStream.userVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                )}
              </div>
              <span className="text-[10px] text-white/70">
                @{activeLiveStream.username}
              </span>
            </div>
            <button className="ms-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[11px] font-bold shadow-xs">
              {lang === 'ar' ? 'متابعة' : 'Follow'}
            </button>
          </div>

          {/* Viewers & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>LIVE</span>
            </div>

            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/10">
              <Users className="w-3.5 h-3.5" />
              <span>{activeLiveStream.viewerCount.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsLiveViewerOpen(false)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Title Tag */}
        <div className="relative z-10 px-4">
          <div className="bg-black/30 backdrop-blur-md inline-block px-3 py-1 rounded-lg border border-white/10 text-xs text-white/90">
            <span className="text-amber-400 font-bold me-1">#{activeLiveStream.category}</span>
            <span>{activeLiveStream.title}</span>
          </div>
        </div>

        {/* Bottom Section: Chat Comments + Controls */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Comments Stream (Instagram Live Style) */}
          <div className="max-h-52 overflow-y-auto space-y-2 pe-2 scrollbar-none">
            {activeLiveStream.comments.map((comment) => (
              <div 
                key={comment.id}
                className={`flex items-start gap-2 text-xs p-1.5 rounded-xl backdrop-blur-sm ${
                  comment.isGiftNotice 
                    ? 'bg-pink-500/30 border border-pink-400/40 text-pink-200' 
                    : 'bg-black/30 text-white'
                }`}
              >
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/30"
                />
                <div className="leading-tight">
                  <span className="font-bold text-white/80 me-1">
                    @{comment.username}:
                  </span>
                  <span className="text-white">
                    {comment.text}
                  </span>
                </div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Interactive Gifts Drawer Popup */}
          {isGiftsOpen && (
            <div 
              className="p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-white/20 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-pink-400" />
                  {lang === 'ar' ? 'إرسال هدية لدعم البث والمبدع' : 'Send Gift to Support Broadcaster'}
                </span>
                <span className="text-neutral-400 font-mono text-[10px]">
                  {lang === 'ar' ? 'تُحول فورياً لأرباحه' : 'Instant creator payout'}
                </span>
              </div>

              {/* Grid of 6 Live Gifts */}
              <div className="grid grid-cols-3 gap-2">
                {LIVE_GIFTS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGiftSelect(g)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center gap-1 transition-all group hover:scale-105"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">
                      {g.icon}
                    </span>
                    <span className="text-[11px] font-bold text-white">
                      {lang === 'ar' ? g.nameAr : g.nameEn}
                    </span>
                    <span className="text-[10px] font-bold text-pink-400 font-mono">
                      {formatPrice(g.priceSAR)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Chat Input & Action Buttons */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSendComment} className="flex-1 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={lang === 'ar' ? 'أضف تعليقاً في البث...' : 'Add a live comment...'}
                className="w-full bg-transparent text-xs text-white placeholder-white/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-white disabled:opacity-40 hover:text-blue-400 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Gift Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsGiftsOpen(!isGiftsOpen);
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              title={lang === 'ar' ? 'إرسال هدية' : 'Send Gift'}
            >
              <Gift className="w-5 h-5" />
            </button>

            {/* Like Heart Button */}
            <button
              onClick={handleLike}
              className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md text-white hover:text-red-500 flex items-center justify-center border border-white/20 active:scale-125 transition-transform"
              title={lang === 'ar' ? 'إعجاب' : 'Like'}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
