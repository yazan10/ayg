import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CURRENCIES } from '../types';
import { 
  X, 
  Wallet, 
  Radio, 
  Code2, 
  Coins, 
  Bookmark, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Share2,
  Sparkles,
  QrCode
} from 'lucide-react';
import { CurrencySelectorModal } from './CurrencySelectorModal';

interface ProfileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    lang, 
    setLang,
    currency,
    wallet,
    formatPrice,
    setAdminModalOpen,
  } = useStore();

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [showQrNotice, setShowQrNotice] = useState(false);

  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      >
        <div 
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pull handle on mobile */}
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 sm:hidden" />

          {/* Instagram Menu Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-black">
                {lang === 'ar' ? 'الإعدادات والنشاط' : 'Settings and activity'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'قائمة الحساب والأدوات الاحترافية' : 'Account menu & professional tools'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-neutral-100">
            {/* Section 1: Features & Earnings */}
            <div className="space-y-1 pb-2">
              <span className="text-[11px] font-bold text-neutral-400 px-3 uppercase tracking-wider">
                {lang === 'ar' ? 'الأدوات الاحترافية واللايف' : 'Professional Tools & Live'}
              </span>

              {/* Creator Wallet & Earnings */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/wallet');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">
                        {lang === 'ar' ? 'الأرباح والمحفظة' : 'Earnings & Wallet'}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        {formatPrice(wallet.balanceSAR)}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {lang === 'ar' ? 'سحب رصيد الهدايا والمبيعات' : 'Withdraw gifts and sales balance'}
                    </span>
                  </div>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Start Live Stream */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/go-live');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">
                        {lang === 'ar' ? 'بدء بث مباشر' : 'Start Live Stream'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        LIVE
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {lang === 'ar' ? 'تفاعل فوري مع المتابعين واستلام هدايا' : 'Live interact & receive paid gifts'}
                    </span>
                  </div>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Platform REST API System */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/api');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">
                        {lang === 'ar' ? 'نظام الـ API للمطورين' : 'REST API System'}
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-mono">
                        v2.5
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {lang === 'ar' ? 'ربط المتاجر واللايف والعملات برمجياً' : 'Endpoints for stores, live & currencies'}
                    </span>
                  </div>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Currency Selector */}
              <button
                onClick={() => setIsCurrencyModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">
                        {lang === 'ar' ? 'العملة المعروضة' : 'Display Currency'}
                      </span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                        {CURRENCIES[currency]?.flag} {currency} ({CURRENCIES[currency]?.symbol})
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {lang === 'ar' ? 'ريال سعودي، شيقل، دينار أردني، دولار' : 'SAR, ILS, JOD, USD'}
                    </span>
                  </div>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Section 2: Account & Shopping */}
            <div className="space-y-1 pt-2 pb-2">
              <span className="text-[11px] font-bold text-neutral-400 px-3 uppercase tracking-wider">
                {lang === 'ar' ? 'كيفية استخدامك لـ aygram' : 'How you use aygram'}
              </span>

              {/* Edit Profile */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/profile/edit');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-black">
                    {lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                  </span>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Saved */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/profile');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-black">
                    {lang === 'ar' ? 'العناصر المحفوظة' : 'Saved'}
                  </span>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Orders */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/orders');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-black">
                    {lang === 'ar' ? 'الطلبات والمشتريات' : 'Orders & Purchases'}
                  </span>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* QR Code / Share */}
              <button
                onClick={() => setShowQrNotice(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-black">
                    {lang === 'ar' ? 'رمز QR ومشاركة الملف' : 'QR Code & Share Profile'}
                  </span>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Section 3: Admin & Settings */}
            <div className="space-y-1 pt-2">
              <span className="text-[11px] font-bold text-neutral-400 px-3 uppercase tracking-wider">
                {lang === 'ar' ? 'النظام والأمان' : 'System & Security'}
              </span>

              {/* Admin Panel Direct Access */}
              <button
                onClick={() => {
                  onClose();
                  setAdminModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-black block">
                      {lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Control Panel'}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {lang === 'ar' ? 'كلمة المرور مطابقة لاسم المستخدم' : 'Password matches username'}
                    </span>
                  </div>
                </div>
                <ChevronIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-black">
                    {lang === 'ar' ? 'اللغة (العربية)' : 'Language (English)'}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {lang === 'ar' ? 'English' : 'العربية'}
                </span>
              </button>

              {/* Log Out */}
              <button
                onClick={() => {
                  onClose();
                  alert(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-start"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">
                  {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Selector Modal */}
      <CurrencySelectorModal 
        isOpen={isCurrencyModalOpen} 
        onClose={() => setIsCurrencyModalOpen(false)} 
      />

      {/* QR Code Popup */}
      {showQrNotice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowQrNotice(false)}>
          <div className="bg-white p-6 rounded-2xl max-w-xs w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
            <h4 className="font-bold text-base text-black">{lang === 'ar' ? 'رمز QR لحسابك' : 'Your Profile QR'}</h4>
            <div className="p-4 bg-neutral-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-32 h-32 text-black" />
            </div>
            <p className="text-xs text-neutral-500 font-mono">https://aygram.com/@ayzan_official</p>
            <button
              onClick={() => setShowQrNotice(false)}
              className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
