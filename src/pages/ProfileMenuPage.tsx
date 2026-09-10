import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/layout/PageHeader';
import { CURRENCIES } from '../types';
import { Wallet, Radio, Code2, Coins, Bookmark, ShoppingBag, ShieldCheck, Globe, LogOut, ChevronLeft, ChevronRight, Settings, QrCode, User, LogIn, Trash2, PauseCircle } from 'lucide-react';
import { CurrencySelectorModal } from '../components/CurrencySelectorModal';

export const ProfileMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, setLang, currency, wallet, formatPrice } = useStore();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const isRtl = lang === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'الإعدادات والنشاط' : 'Settings and activity'} subtitle={lang === 'ar' ? 'قائمة الحساب والأدوات' : 'Account menu & tools'} />
      <div className="max-w-lg mx-auto p-3 space-y-1.5">
        {/* User Info Card if authenticated */}
        {isAuthenticated && currentUser ? (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-2xl flex items-center gap-3 mb-2">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-black truncate">{currentUser.name}</div>
              <div className="text-xs text-neutral-500 font-mono">@{currentUser.username}</div>
              <div className="text-xs text-neutral-500 truncate">{currentUser.email}</div>
            </div>
            <button onClick={() => navigate('/profile')} className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100">
              <User className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-2">
            <div className="text-sm font-bold text-amber-800">{lang === 'ar' ? 'لم تسجل دخولك بعد' : 'Not logged in'}</div>
            <div className="text-xs text-amber-700 mt-1">{lang === 'ar' ? 'سجل دخولك للوصول لجميع الميزات' : 'Login to access all features'}</div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => navigate('/login')} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"><LogIn className="w-4 h-4" />{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
              <button onClick={() => navigate('/register')} className="flex-1 py-2 bg-white border border-neutral-300 text-black rounded-xl text-xs font-bold">{lang === 'ar' ? 'إنشاء حساب' : 'Register'}</button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 px-3 uppercase tracking-wider">{lang === 'ar' ? 'الأدوات الاحترافية' : 'Professional Tools'}</span>
          <button onClick={() => navigate('/wallet')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Wallet className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><span className="text-sm font-bold">{lang === 'ar' ? 'الأرباح والمحفظة' : 'Earnings & Wallet'}</span><span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{formatPrice(wallet.balanceSAR)}</span></div><span className="text-xs text-neutral-500">{lang === 'ar' ? 'سحب رصيد الهدايا والمبيعات' : 'Withdraw gifts and sales'}</span></div></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => navigate('/go-live')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><Radio className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><span className="text-sm font-bold">{lang === 'ar' ? 'بدء بث مباشر' : 'Start Live'}</span><span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />LIVE</span></div><span className="text-xs text-neutral-500">{lang === 'ar' ? 'تفاعل فوري مع المتابعين' : 'Live interact & receive gifts'}</span></div></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => navigate('/api')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Code2 className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><span className="text-sm font-bold">{lang === 'ar' ? 'نظام الـ API' : 'REST API System'}</span><span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-mono">v2.5</span></div><span className="text-xs text-neutral-500">{lang === 'ar' ? 'ربط المتاجر واللايف برمجياً' : 'Endpoints for stores & live'}</span></div></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => setIsCurrencyModalOpen(true)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Coins className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><span className="text-sm font-bold">{lang === 'ar' ? 'العملة المعروضة' : 'Display Currency'}</span><span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">{CURRENCIES[currency]?.flag} {currency} ({CURRENCIES[currency]?.symbol})</span></div><span className="text-xs text-neutral-500">SAR, ILS, JOD, USD</span></div></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        <div className="space-y-1 pt-2">
          <span className="text-[11px] font-bold text-neutral-400 px-3 uppercase tracking-wider">{lang === 'ar' ? 'كيفية استخدامك لـ aygram' : 'How you use aygram'}</span>
          <button onClick={() => navigate('/profile/edit')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"><Settings className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"><Bookmark className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'العناصر المحفوظة' : 'Saved'}</span></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => navigate('/orders')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"><ShoppingBag className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'الطلبات والمشتريات' : 'Orders & Purchases'}</span></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => setShowQr(true)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"><QrCode className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'رمز QR ومشاركة الملف' : 'QR Code & Share'}</span></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        <div className="space-y-1 pt-2">
          <span className="text-[11px] font-bold text-neutral-400 px-3 uppercase tracking-wider">{lang === 'ar' ? 'النظام والأمان' : 'System & Security'}</span>
          <button onClick={() => navigate('/settings/account')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 border border-red-100 hover:border-red-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><Settings className="w-5 h-5" /></div><div><span className="text-sm font-bold block text-red-900">{lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}</span><span className="text-xs text-red-600">{lang === 'ar' ? 'تعطيل أو حذف حسابك نهائياً' : 'Deactivate or delete account'}</span></div></div><ChevronIcon className="w-4 h-4 text-red-400" />
          </button>
          <button onClick={() => navigate('/blocked')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div><div><span className="text-sm font-bold block">{lang === 'ar' ? 'الحسابات المحظورة' : 'Blocked Accounts'}</span><span className="text-xs text-neutral-500">{lang === 'ar' ? 'إدارة قائمة الحظر' : 'Manage blocked'}</span></div></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => navigate('/admin')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div><div><span className="text-sm font-bold block">{lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Control Panel'}</span><span className="text-xs text-neutral-500">{lang === 'ar' ? 'كلمة المرور مطابقة لاسم المستخدم' : 'Password matches username'}</span></div></div><ChevronIcon className="w-4 h-4 text-neutral-400" />
          </button>
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 text-start">
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"><Globe className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'اللغة (العربية)' : 'Language (English)'}</span></div><span className="text-xs font-bold text-blue-600">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 text-start border border-transparent">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center"><LogOut className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white text-start">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><LogIn className="w-5 h-5" /></div><span className="text-sm font-bold">{lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}</span>
            </button>
          )}
        </div>
      </div>

      <CurrencySelectorModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} />

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowQr(false)}>
          <div className="bg-white p-6 rounded-2xl max-w-xs w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
            <h4 className="font-bold text-base">{lang === 'ar' ? 'رمز QR لحسابك' : 'Your Profile QR'}</h4>
            <div className="p-4 bg-neutral-100 rounded-xl flex items-center justify-center"><QrCode className="w-32 h-32 text-black" /></div>
            <p className="text-xs text-neutral-500 font-mono">https://aygram.com/@{currentUser?.username || 'ayzan_official'}</p>
            <button onClick={() => setShowQr(false)} className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg">{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
          </div>
        </div>
      )}
    </div>
  );
};
