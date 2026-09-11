import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Music2, 
  Volume2, 
  VolumeX, 
  ShoppingBag,
  Plus,
  Play,
  Check
} from 'lucide-react';

export const ReelsView: React.FC = () => {
  const navigate = useNavigate();
  const { 
    toggleLikeReel, 
    toggleSaveReel, 
    likedReels, 
    savedReels, 
    toggleFollowUser,
    users,
    stores,
    products,
    lang,
    getFilteredReels,
    reels: rawReels
  } = useStore() as any;
  const reels = getFilteredReels ? getFilteredReels() : rawReels || [];

  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({
    'reel-1': true,
    'reel-2': true,
    'reel-3': true,
    'reel-4': true
  });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoToggle = (reelId: string) => {
    const video = videoRefs.current[reelId];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(prev => ({ ...prev, [reelId]: true }));
    } else {
      video.pause();
      setIsPlaying(prev => ({ ...prev, [reelId]: false }));
    }
  };

  const handleShare = (reelId: string) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(reelId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100dvh-7rem)] md:min-h-[750px] flex flex-col items-center justify-center relative select-none touch-pan-y">
      {/* Reels Feed Container */}
      <div className="w-full h-[calc(100dvh-12rem)] min-h-[480px] max-h-[700px] sm:h-[700px] bg-black rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl border border-neutral-800 flex flex-col">
        {reels.map((reel, idx) => {
          const isCurrent = idx === activeReelIdx;
          if (!isCurrent) return null;

          const isLiked = likedReels.includes(reel.id);
          const isSaved = savedReels.includes(reel.id);
          const matchedStore = stores.find(s => s.username === reel.username || s.id === reel.userId);
          const matchedUser = users.find(u => u.username === reel.username || u.id === reel.userId);
          const isFollowing = matchedUser?.isFollowing || matchedStore?.isFollowing;

          return (
            <div key={reel.id} className="relative w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
              {/* Video Element with Fallback Poster */}
              <video
                ref={el => { videoRefs.current[reel.id] = el; }}
                src={reel.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={() => handleVideoToggle(reel.id)}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Pause overlay icon if paused */}
              {isPlaying[reel.id] === false && (
                <div 
                  onClick={() => handleVideoToggle(reel.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                    <Play className="w-8 h-8 fill-white ms-1" />
                  </div>
                </div>
              )}

              {/* Sound Toggle Floating Button */}
              <button
                onClick={() => setIsMuted(prev => !prev)}
                className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Left/Right Reels Pagination Controls */}
              <div className="absolute top-4 start-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  REELS ({activeReelIdx + 1}/{reels.length})
                </span>
              </div>

              {/* Right Side Interaction Bar (Instagram Action Stack) */}
              <div className="absolute bottom-20 end-3 z-20 flex flex-col items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={() => toggleLikeReel(reel.id)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                    isLiked ? 'bg-red-500/20 text-red-500 scale-110' : 'bg-black/40 text-white hover:bg-black/60'
                  }`}>
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 stroke-red-500' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
                    {reel.likes.toLocaleString()}
                  </span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => navigate(`/comments/${reel.id}`)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all group-active:scale-90">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
                    {reel.commentsCount}
                  </span>
                </button>

                {/* Direct Message / Share Button */}
                <button
                  onClick={() => handleShare(reel.id)}
                  className="flex flex-col items-center group focus:outline-none"
                  title="مشاركة الرابط"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all group-active:scale-90">
                    {copiedLink === reel.id ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
                    {copiedLink === reel.id ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : reel.sharesCount}
                  </span>
                </button>

                {/* Bookmark / Save Button */}
                <button
                  onClick={() => toggleSaveReel(reel.id)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                    isSaved ? 'bg-blue-500/20 text-blue-400' : 'bg-black/40 text-white hover:bg-black/60'
                  }`}>
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-400 stroke-blue-400' : ''}`} />
                  </div>
                </button>

                {/* Audio Disc Vinyl Graphic */}
                <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-white/60 p-0.5 overflow-hidden animate-spin shadow-md" style={{ animationDuration: '4s' }}>
                  <img src={reel.userAvatar} alt="Track" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>

              {/* Bottom Metadata & Creator Section */}
              <div className="absolute bottom-4 inset-x-0 px-4 pe-16 z-10 text-white flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 pb-2">
                {/* Creator Header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500 shadow-sm shrink-0">
                    <img src={reel.userAvatar} alt={reel.userName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-white drop-shadow-md">
                      @{reel.username}
                    </span>
                    {reel.verified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                    )}
                    <button
                      onClick={() => toggleFollowUser(reel.userId)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border ${
                        isFollowing 
                          ? 'bg-white/20 border-white/30 text-white' 
                          : 'bg-blue-600 hover:bg-blue-500 border-blue-600 text-white'
                      }`}
                    >
                      {isFollowing ? (lang === 'ar' ? 'تتابعه' : 'Following') : (lang === 'ar' ? '+ متابعة' : '+ Follow')}
                    </button>
                  </div>
                </div>

                {/* Caption Text & Tags */}
                <p className="text-xs text-neutral-100 line-clamp-2 leading-relaxed drop-shadow-md">
                  {lang === 'ar' ? reel.caption : (reel.captionEn || reel.caption)}
                </p>

                {/* Audio Track marquee */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-300">
                  <Music2 className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  <span className="truncate">{reel.audioTrack}</span>
                </div>

                {/* Quick Shoppable Tag if matched store */}
                {matchedStore && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        const prod = products.find(p => p.storeId === matchedStore.id);
                        if (prod) navigate(`/product/${prod.id}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-[11px] font-bold backdrop-blur-md transition-all shadow-md active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'عرض منتجات هذا الحساب' : 'Shop this Creator'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Previous & Next Reel Buttons on Desktop */}
        <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-30">
          <button
            onClick={() => setActiveReelIdx(prev => Math.max(0, prev - 1))}
            disabled={activeReelIdx === 0}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center pointer-events-auto hover:bg-black/70 disabled:opacity-0 transition-opacity"
            title="السابق"
          >
            ▲
          </button>
          <button
            onClick={() => setActiveReelIdx(prev => Math.min(reels.length - 1, prev + 1))}
            disabled={activeReelIdx === reels.length - 1}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center pointer-events-auto hover:bg-black/70 disabled:opacity-0 transition-opacity"
            title="التالي"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Reel Feed Indicators */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {reels.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveReelIdx(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeReelIdx ? 'w-6 bg-blue-600' : 'w-2 bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
