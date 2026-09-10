import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Plus } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const navigate = useNavigate();
  const { lang, getFilteredStories, liveStreams, stories: rawStories } = useStore() as any;
  const stories = getFilteredStories ? getFilteredStories() : rawStories || [];

  const activeStreams = liveStreams.filter((s: any) => s.isLive);

  return (
    <div className="bg-white border-b border-neutral-200 py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center gap-3.5 overflow-x-auto no-scrollbar scroll-smooth">
        <div onClick={() => navigate('/create-store')} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group">
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-blue-500/60 flex items-center justify-center group-hover:border-blue-600 transition-colors">
            <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-black truncate max-w-[68px] text-center">{lang === 'ar' ? 'متجرك' : 'Your Store'}</span>
        </div>

        {activeStreams.map((stream) => (
          <div key={stream.id} onClick={() => navigate(`/live/${stream.id}`)} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group relative">
            <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 transition-transform group-hover:scale-105 active:scale-95 shadow-md">
              <div className="w-full h-full rounded-full p-[2px] bg-white">
                <img src={stream.userAvatar} alt={stream.userName} className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-max px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-black tracking-wider rounded-full border border-white shadow-xs flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
              </span>
            </div>
            <span className="text-[11px] font-bold text-red-600 truncate max-w-[68px] text-center mt-1">{stream.userName}</span>
          </div>
        ))}

        {stories.map((story) => (
          <div key={story.id} onClick={() => navigate(`/story/${story.id}`)} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group">
            <div className="w-16 h-16 rounded-full p-[2.5px] story-ring transition-transform group-hover:scale-105 active:scale-95 shadow-sm">
              <div className="w-full h-full rounded-full p-[2px] bg-white">
                <img src={story.storeAvatar} alt={story.storeName} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-neutral-800 truncate max-w-[68px] text-center">{story.storeName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
