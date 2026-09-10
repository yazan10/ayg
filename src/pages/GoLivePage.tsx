import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Radio, Camera, Mic, Sparkles } from 'lucide-react';

export const GoLivePage: React.FC = () => {
  const { startLiveStream, currentUser, lang } = useStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(lang === 'ar' ? 'تسوق وتجارة' : 'Shopping & Commerce');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);

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
    const stream = startLiveStream(finalTitle, category);
    navigate(`/live/${stream.id}`);
  };

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'بدء بث مباشر جديد' : 'Start New Live Stream'} subtitle={lang === 'ar' ? 'بث فوري للمتابعين مع استلام الهدايا' : 'Live stream to followers & earn gifts'} />
      <div className="max-w-lg mx-auto bg-white md:rounded-2xl md:border md:border-neutral-200 md:shadow-sm overflow-hidden md:mt-6">
        <div className="relative h-64 bg-neutral-900 flex items-center justify-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800" alt="Camera Preview" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          <div className="absolute top-4 start-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
            <span className="text-xs font-bold text-white">@{currentUser.username}</span>
          </div>
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsCameraActive(!isCameraActive)} className={`p-2.5 rounded-full backdrop-blur-md ${isCameraActive ? 'bg-white/20' : 'bg-red-500/80'}`}><Camera className="w-4 h-4" /></button>
              <button type="button" onClick={() => setIsMicActive(!isMicActive)} className={`p-2.5 rounded-full backdrop-blur-md ${isMicActive ? 'bg-white/20' : 'bg-red-500/80'}`}><Mic className="w-4 h-4" /></button>
            </div>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />HD 1080p جاهز</span>
          </div>
        </div>

        <form onSubmit={handleStart} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-neutral-700 block mb-1.5">{lang === 'ar' ? 'عنوان البث المباشر' : 'Stream Title'}</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={lang === 'ar' ? 'مثال: استعراض المنتجات الحصرية وهدايا المتابعين 🔥' : 'e.g., Exclusive drops & live gifts Q&A 🔥'} className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-blue-600 bg-white" />
          </div>
          <div>
            <label className="text-sm font-bold text-neutral-700 block mb-1.5">{lang === 'ar' ? 'فئة البث' : 'Category'}</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold ${category === cat ? 'bg-blue-600 text-white shadow' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 text-blue-800 text-sm flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" /><span>{lang === 'ar' ? 'الهدايا التي يرسلها المتابعون ستضاف فوراً إلى رصيد محفظتك!' : 'Viewer gifts will be credited to your wallet in real time!'}</span>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2">
            <Radio className="w-5 h-5" /><span>{lang === 'ar' ? 'بدء البث المباشر الآن 🔴' : 'Go Live Now 🔴'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
