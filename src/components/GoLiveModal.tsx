import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Radio, X, Camera, Mic, Sparkles, Video, Users } from 'lucide-react';

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoLiveModal: React.FC<GoLiveModalProps> = ({ isOpen, onClose }) => {
  const { startLiveStream, currentUser, lang } = useStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(lang === 'ar' ? 'تسوق وتجارة' : 'Shopping & Commerce');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);

  if (!isOpen) return null;

  const categories = [
    lang === 'ar' ? 'تسوق وتجارة' : 'Shopping & Commerce',
    lang === 'ar' ? 'أزياء وجمال' : 'Fashion & Beauty',
    lang === 'ar' ? 'عطور وبخور' : 'Perfumes & Oud',
    lang === 'ar' ? 'دردشة واستفسارات' : 'Q&A Chat',
    lang === 'ar' ? 'إطلاق منتج جديد' : 'New Product Launch'
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (lang === 'ar' ? `بث مباشر من ${currentUser.name} 🔴` : `Live broadcast from ${currentUser.name} 🔴`);
    startLiveStream(finalTitle, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">
                {lang === 'ar' ? 'بدء بث مباشر جديد' : 'Start New Live Stream'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'بث فوري للمتابعين مع استلام الهدايا' : 'Live stream to followers & earn gifts'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Camera Simulation Screen */}
        <div className="relative h-48 bg-neutral-900 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800"
            alt="Camera Preview"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

          {/* Broadcaster tag */}
          <div className="absolute top-3 start-3 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs font-bold text-white">@{currentUser.username}</span>
          </div>

          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`p-2 rounded-full backdrop-blur-md ${isCameraActive ? 'bg-white/20' : 'bg-red-500/80'}`}
              >
                <Camera className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => setIsMicActive(!isMicActive)}
                className={`p-2 rounded-full backdrop-blur-md ${isMicActive ? 'bg-white/20' : 'bg-red-500/80'}`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              HD 1080p جاهز
            </span>
          </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleStart} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {lang === 'ar' ? 'عنوان البث المباشر' : 'Stream Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: استعراض المنتجات الحصرية وهدايا المتابعين 🔥' : 'e.g., Exclusive drops & live gifts Q&A 🔥'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-black focus:outline-blue-600 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              {lang === 'ar' ? 'فئة البث' : 'Category'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    category === cat 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {lang === 'ar' 
                ? 'الهدايا التي يرسلها المتابعون ستضاف فوراً إلى رصيد محفظتك!' 
                : 'Viewer gifts will be credited to your wallet in real time!'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>{lang === 'ar' ? 'بدء البث المباشر الآن 🔴' : 'Go Live Now 🔴'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
