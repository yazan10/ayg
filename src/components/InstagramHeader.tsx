import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../types';
import { CurrencySelectorModal } from './CurrencySelectorModal';
import { 
  ShoppingBag, 
  Globe, 
  Home, 
  Compass, 
  Film,
  Send,
  Heart,
  PlusSquare, 
  PackageCheck,
  Radio,
  Store as StoreIcon,
  Users,
  Crown,
  Search,
} from 'lucide-react';

export const InstagramHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    handleLogoClick, 
    cart, 
    lang, 
    setLang, 
    orders,
    conversations,
    unreadNotificationsCount,
    currency,
    liveStreams,
    adminSettings,
    t,
    currentUser: storeCurrentUser
  } = useStore();
  const { isAuthenticated, currentUser: authUser } = useAuth();
  const currentUser = storeCurrentUser || authUser;

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const currentCur = CURRENCIES[currency] || CURRENCIES.SAR;
  const activeLive = liveStreams.find(s => s.isLive);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-neutral-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all">
      <div className="max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 h-[56px] sm:h-[60px] flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 select-none group focus:outline-none"
            title={lang === 'ar' ? 'aygram (انقر 6 مرات لدخول الإدارة)' : 'aygram (Click 6 times for admin)'}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-base shadow-sm group-active:scale-95 transition-transform">
              ay
            </div>
            <div className="text-start">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-black font-sans block leading-none lowercase">
                aygram
              </span>
              <span className="text-[9px] text-blue-600 font-bold tracking-widest block uppercase mt-0.5">
                {lang === 'ar' ? 'منصة التجارة والتواصل' : 'Social & Commerce'}
              </span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-[320px] mx-2 xl:mx-6">
          <div className="relative w-full group">
            <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن متاجر، منتجات...' : 'Search stores, products...'}
              className="w-full ps-9 pe-4 py-2 bg-neutral-100 hover:bg-white border border-transparent hover:border-neutral-200 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50 rounded-full text-sm outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 lg:gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isActive('/') && location.pathname === '/' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-700 hover:text-black hover:bg-neutral-100'}`}
          >
            <Home className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </button>
          <button
            onClick={() => navigate('/explore')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isActive('/explore') ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-700 hover:text-black hover:bg-neutral-100'}`}
          >
            <Compass className="w-4 h-4" />
            <span>{lang === 'ar' ? 'استكشاف' : 'Explore'}</span>
          </button>
          <button
            onClick={() => navigate('/stores')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isActive('/stores') ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-700 hover:text-black hover:bg-neutral-100'}`}
          >
            <StoreIcon className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المتاجر' : 'Stores'}</span>
          </button>
          <button
            onClick={() => navigate('/accounts')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isActive('/accounts') ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-700 hover:text-black hover:bg-neutral-100'}`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الحسابات' : 'Accounts'}</span>
          </button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-black text-white transition-all active:scale-95 shadow-sm"
          >
            <PlusSquare className="w-4 h-4" />
            <span className="hidden lg:inline">{lang === 'ar' ? 'إنشاء' : 'Create'}</span>
          </button>
          <button
            onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-black transition-all border shrink-0 ${isActive('/profile') && isAuthenticated ? 'bg-neutral-900 text-white border-neutral-900 shadow-md' : isAuthenticated ? 'bg-white text-black border-neutral-200 hover:bg-neutral-50 shadow-sm' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm'}`}
          >
            {isAuthenticated && currentUser ? (
              <>
                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-neutral-200">
                  <img src={currentUser.avatar} alt="حسابي" className="w-full h-full object-cover" />
                </div>
                <span className="hidden xl:inline">{lang === 'ar' ? 'حسابي' : 'My Account'}</span>
              </>
            ) : (
              <span>{lang === 'ar' ? 'دخول' : 'Login'}</span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => navigate('/messages')}
            className="relative p-2 rounded-xl text-black hover:bg-neutral-100 transition-colors hidden md:flex"
            title={lang === 'ar' ? 'الرسائل' : 'Messages'}
          >
            <Send className="w-[18px] h-[18px]" />
            {totalUnreadMessages > 0 && <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-blue-600" />}
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="md:hidden relative p-2 rounded-xl text-black hover:bg-neutral-100 transition-colors"
          >
            <Send className="w-5 h-5 text-black" />
            {totalUnreadMessages > 0 && <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-blue-600" />}
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="relative p-2 rounded-xl text-black hover:bg-neutral-100 transition-colors hidden md:flex"
            title={lang === 'ar' ? 'طلباتي' : 'Orders'}
          >
            <PackageCheck className="w-[18px] h-[18px]" />
            {orders.length > 0 && <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-emerald-500" />}
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl text-black hover:bg-neutral-100 transition-colors"
          >
            <Heart className="w-5 h-5 text-black hover:text-red-500 transition-colors" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {activeLive && (
            <button
              onClick={() => navigate(`/live/${activeLive.id}`)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE</span>
            </button>
          )}

          <button
            onClick={() => navigate('/pricing')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
            title={lang === 'ar' ? 'الأسعار' : 'Pricing'}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{lang === 'ar' ? 'الأسعار' : 'Pricing'}</span>
          </button>

          <button
            onClick={() => setIsCurrencyModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-black hover:bg-neutral-100 rounded-xl transition-colors border border-neutral-200"
            title={currentCur.nameAr}
          >
            <span>{currentCur.flag}</span>
            <span className="font-mono text-[11px] hidden lg:inline">{currency}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors border border-neutral-200 flex items-center gap-1"
            title={lang === 'ar' ? 'English' : 'العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden lg:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-xl text-black hover:bg-neutral-100 transition-colors"
            title={t.cartTitle}
          >
            <ShoppingBag className="w-5 h-5 text-black" />
            {totalCartItems > 0 && (
              <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <CurrencySelectorModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} />
    </header>
  );
};
