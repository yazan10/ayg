import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Grid, Film, Bookmark, Plus, Menu, Radio, Wallet, Code2, ChevronDown, Heart, ShoppingBag, Share2, Link as LinkIcon } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, products, reels, savedProducts, wallet, formatPrice, lang } = useStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');

  const userProducts = products.filter(p => p.storeId === 'store-1' || p.storeId === currentUser.id);
  const userReels = reels.filter(r => r.userId === currentUser.id || r.username === currentUser.username);
  const savedProductItems = products.filter(p => savedProducts.includes(p.id));

  return (
    <div className="w-full max-w-4xl mx-auto bg-white md:rounded-2xl md:border md:border-neutral-200 md:shadow-sm p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base sm:text-lg font-bold text-black tracking-tight flex items-center gap-1">@{currentUser.username}</h2>
          {currentUser.verified && <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">✓</span>}
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/go-live')} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold border border-red-200">
            <Radio className="w-3.5 h-3.5 animate-pulse" /><span className="text-[11px] font-bold">LIVE</span>
          </button>
          <button onClick={() => navigate('/create')} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-black"><Plus className="w-5 h-5 stroke-[2.2]" /></button>
          <button onClick={() => navigate('/profile/menu')} className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-black border border-neutral-200 shadow-sm"><Menu className="w-5 h-5 stroke-[2.2]" /></button>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-10">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-sky-400 via-blue-600 to-blue-900 shadow-md cursor-pointer" onClick={() => navigate('/profile/edit')}>
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-full border-2 border-white" />
          </div>
          <button onClick={() => navigate('/create')} className="absolute bottom-0 end-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700"><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /></button>
        </div>
        <div className="flex-1 flex items-center justify-around text-center">
          <div><span className="font-bold text-black block text-base sm:text-lg">{currentUser.postsCount}</span><span className="text-xs text-neutral-600 font-medium">{lang === 'ar' ? 'منشورات' : 'Posts'}</span></div>
          <div><span className="font-bold text-black block text-base sm:text-lg">{currentUser.followersCount.toLocaleString()}</span><span className="text-xs text-neutral-600 font-medium">{lang === 'ar' ? 'متابعين' : 'Followers'}</span></div>
          <div><span className="font-bold text-black block text-base sm:text-lg">{currentUser.followingCount}</span><span className="text-xs text-neutral-600 font-medium">{lang === 'ar' ? 'أتابع' : 'Following'}</span></div>
        </div>
      </div>

      <div className="space-y-1.5 text-start">
        <h3 className="text-sm font-bold text-black">{currentUser.name}</h3>
        {currentUser.category && <span className="inline-block text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">{currentUser.category}</span>}
        <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line">{currentUser.bio}</p>
        {currentUser.website && <a href={currentUser.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-mono font-bold"><LinkIcon className="w-3 h-3" /><span>{currentUser.website.replace('https://', '')}</span></a>}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button onClick={() => navigate('/profile/edit')} className="py-2 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold text-center shadow-sm">{lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</button>
        <button onClick={() => { navigator.clipboard?.writeText(`https://aygram.com/@${currentUser.username}`); alert(lang === 'ar' ? 'تم نسخ رابط ملفك الشخصي بنجاح!' : 'Profile link copied!'); }} className="py-2 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold text-center shadow-sm">{lang === 'ar' ? 'مشاركة الملف الشخصي' : 'Share Profile'}</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => navigate('/wallet')} className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"><Wallet className="w-3.5 h-3.5 text-emerald-600" /><span className="truncate">{lang === 'ar' ? 'الأرباح' : 'Earnings'}</span><span className="text-[10px] font-mono font-bold text-emerald-700 bg-white/80 px-1 py-0.2 rounded">{formatPrice(wallet.balanceSAR)}</span></button>
        <button onClick={() => navigate('/go-live')} className="py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"><Radio className="w-3.5 h-3.5 text-red-600" /><span className="truncate">{lang === 'ar' ? 'بث مباشر' : 'Go Live'}</span></button>
        <button onClick={() => navigate('/api')} className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"><Code2 className="w-3.5 h-3.5 text-blue-600" /><span className="truncate">{lang === 'ar' ? 'نظام API' : 'REST API'}</span></button>
      </div>

      <div className="pt-2 border-t border-neutral-100 flex items-center gap-4 overflow-x-auto pb-2">
        <div onClick={() => navigate('/create')} className="flex flex-col items-center gap-1 cursor-pointer shrink-0"><div className="w-14 h-14 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center hover:border-blue-600"><Plus className="w-5 h-5 text-neutral-400" /></div><span className="text-[10px] text-neutral-500">{lang === 'ar' ? 'جديد' : 'New'}</span></div>
        <div className="flex flex-col items-center gap-1 shrink-0"><div className="w-14 h-14 rounded-full p-0.5 border border-neutral-300"><img src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=120" alt="Highlights" className="w-full h-full object-cover rounded-full" /></div><span className="text-[10px] text-neutral-700 font-bold">{lang === 'ar' ? 'عطوري' : 'Perfumes'}</span></div>
        <div className="flex flex-col items-center gap-1 shrink-0"><div className="w-14 h-14 rounded-full p-0.5 border border-neutral-300"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120" alt="Highlights" className="w-full h-full object-cover rounded-full" /></div><span className="text-[10px] text-neutral-700 font-bold">{lang === 'ar' ? 'طلبات' : 'Orders'}</span></div>
      </div>

      <div className="border-t border-neutral-200 flex justify-around">
        <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 py-3 border-t-2 text-xs font-bold ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'}`}><Grid className="w-4 h-4" /><span className="hidden sm:inline">{lang === 'ar' ? 'المنشورات' : 'Posts'}</span></button>
        <button onClick={() => setActiveTab('reels')} className={`flex items-center gap-2 py-3 border-t-2 text-xs font-bold ${activeTab === 'reels' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'}`}><Film className="w-4 h-4" /><span className="hidden sm:inline">{lang === 'ar' ? 'ريلز' : 'Reels'}</span></button>
        <button onClick={() => setActiveTab('saved')} className={`flex items-center gap-2 py-3 border-t-2 text-xs font-bold ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'}`}><Bookmark className="w-4 h-4" /><span className="hidden sm:inline">{lang === 'ar' ? 'المحفوظات' : 'Saved'}</span></button>
      </div>

      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {activeTab === 'posts' && userProducts.map(prod => (
          <div key={prod.id} onClick={() => navigate(`/product/${prod.id}`)} className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 group cursor-pointer">
            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs"><span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" />{prod.likes}</span><span className="flex items-center gap-1"><ShoppingBag className="w-4 h-4" />{formatPrice(prod.price)}</span></div>
          </div>
        ))}
        {activeTab === 'reels' && userReels.map(reel => (
          <div key={reel.id} className="relative aspect-[9/16] overflow-hidden rounded-lg bg-neutral-900 group cursor-pointer">
            <video src={reel.videoUrl} muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-2 text-white"><span className="self-end text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded"><Film className="w-3 h-3 inline me-0.5" />Reel</span><span className="text-[11px] font-bold flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-white" />{reel.likes}</span></div>
          </div>
        ))}
        {activeTab === 'saved' && savedProductItems.map(prod => (
          <div key={prod.id} onClick={() => navigate(`/product/${prod.id}`)} className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 group cursor-pointer">
            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute top-2 end-2 bg-black/60 text-blue-400 p-1 rounded-full"><Bookmark className="w-3.5 h-3.5 fill-blue-400" /></div>
          </div>
        ))}
      </div>
    </div>
  );
};
