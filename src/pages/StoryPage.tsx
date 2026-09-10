import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag } from 'lucide-react';

export const StoryPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { stories, products, stores, lang } = useStore();
  const storyIndex = stories.findIndex(s => s.id === storyId);
  const story = storyIndex !== -1 ? stories[storyIndex] : stories[0];
  const actualIndex = storyIndex !== -1 ? storyIndex : 0;

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) return;
    setProgress(0);
    const interval = 50;
    const totalDuration = 5000;
    const step = (interval / totalDuration) * 100;
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (actualIndex < stories.length - 1) {
            navigate(`/story/${stories[actualIndex + 1].id}`, { replace: true });
          } else {
            navigate(-1);
          }
          return 0;
        }
        return prev + step;
      });
    }, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [actualIndex, isPaused, stories, navigate]);

  if (!story) {
    return <div className="p-8 text-center">لا توجد قصص</div>;
  }

  const linkedProduct = story.productId ? products.find(p => p.id === story.productId) : null;

  const handleNext = () => {
    if (actualIndex < stories.length - 1) navigate(`/story/${stories[actualIndex + 1].id}`, { replace: true });
    else navigate(-1);
  };
  const handlePrev = () => {
    if (actualIndex > 0) navigate(`/story/${stories[actualIndex - 1].id}`, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none" onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}>
      <div className="relative w-full h-full sm:max-w-md sm:h-[85vh] sm:rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl flex flex-col justify-between">
        <img src={story.mediaUrl} alt="Story" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/80 pointer-events-none" />

        <div className="relative z-10 p-4 space-y-3">
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-75" style={{ width: idx < actualIndex ? '100%' : idx === actualIndex ? `${progress}%` : '0%' }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div onClick={() => navigate(`/store/${story.storeId}`)} className="flex items-center gap-2.5 cursor-pointer">
              <img src={story.storeAvatar} alt={story.storeName} className="w-9 h-9 rounded-full border border-white/60 object-cover" />
              <div><p className="text-xs font-bold text-white flex items-center gap-1"><span>{story.storeName}</span><span className="text-blue-400">✓</span></p><p className="text-[10px] text-neutral-300">{story.createdAt}</p></div>
            </div>
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="absolute inset-y-16 inset-x-0 flex z-0">
          <div className="w-1/2 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/2 h-full cursor-pointer" onClick={handleNext} />
        </div>

        <div className="relative z-10 p-4 space-y-3">
          <p className="text-sm text-white font-medium drop-shadow-md leading-relaxed">{lang === 'ar' ? story.caption : story.captionEn}</p>
          {linkedProduct && (
            <div onClick={() => navigate(`/product/${linkedProduct.id}`)} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white shadow-lg">
              <div className="flex items-center gap-2.5"><img src={linkedProduct.images[0]} alt={linkedProduct.name} className="w-12 h-12 rounded-xl object-cover" /><div><p className="text-sm font-bold text-neutral-900 truncate max-w-[180px]">{lang === 'ar' ? linkedProduct.name : linkedProduct.nameEn}</p><p className="text-sm font-bold text-blue-700">{linkedProduct.price} {linkedProduct.currency}</p></div></div>
              <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1"><ShoppingBag className="w-4 h-4" />{lang === 'ar' ? 'عرض المنتج' : 'View'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
