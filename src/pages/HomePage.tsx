import React from 'react';
import { StoriesBar } from '../components/StoriesBar';
import { InstagramFeed } from '../components/InstagramFeed';
import { useStore } from '../context/StoreContext';
import { Store as StoreIcon, Sparkles, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { stores, lang, setActiveTab } = useStore();
  const navigate = useNavigate();

  return (
    <div>
      {/* Mobile */}
      <div className="md:hidden">
        <StoriesBar />
        <InstagramFeed />
      </div>

      {/* Desktop */}
      <div className="hidden md:block p-4">
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm mb-6">
          <StoriesBar />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <main className="lg:col-span-8 space-y-6 w-full max-w-2xl mx-auto lg:max-w-none">
            <InstagramFeed />
          </main>
          <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-black flex items-center gap-2">
                  <StoreIcon className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'ar' ? 'دليل المتاجر الموثقة' : 'Verified Stores'}</span>
                </h3>
                <button onClick={() => navigate('/create')} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {stores.map(store => (
                  <div key={store.id} onClick={() => navigate(`/store/${store.id}`)} className="p-2.5 rounded-xl bg-neutral-50 hover:bg-blue-50/60 border border-neutral-200/80 hover:border-blue-300 transition-all flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <img src={store.avatar} alt={store.name} className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                      <div>
                        <h4 className="text-xs font-bold text-black group-hover:text-blue-600 flex items-center gap-1">
                          <span>{lang === 'ar' ? store.name : store.nameEn}</span>{store.verified && <span className="text-blue-500 text-[10px]">✓</span>}
                        </h4>
                        <span className="text-[10px] text-neutral-500 font-mono">@{store.username}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 rtl:rotate-180 transition-transform" />
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800 text-white p-4 rounded-xl shadow-md space-y-2">
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-300" /><h4 className="text-xs font-bold">{lang === 'ar' ? 'منصة aygram للتجارة والتواصل' : 'aygram Social Commerce'}</h4></div>
                <p className="text-[11px] text-blue-100 leading-relaxed">{lang === 'ar' ? 'شارك ريلز، انشر منتجاتك، وتواصل مع زبائنك عبر الرسائل المباشرة فورياً.' : 'Share reels, publish products, and chat with buyers in real-time.'}</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => navigate('/create')} className="flex-1 py-2 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-lg text-xs">{lang === 'ar' ? '+ نشر جديد' : '+ Create'}</button>
                  <button onClick={() => navigate('/create-store')} className="py-2 px-3 bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white font-bold rounded-lg text-xs">{lang === 'ar' ? 'متجر' : 'Store'}</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
