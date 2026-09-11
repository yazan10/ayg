import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { InstagramHeader } from '../InstagramHeader';
import { InstagramBottomNav } from '../InstagramBottomNav';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { MailWarning, X, Send } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { currentUser, resendVerificationEmail } = useAuth();
  const { lang } = useStore() as any;
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Show only for Firebase-backed accounts with unverified email
  const showVerifyBanner =
    !!currentUser &&
    currentUser.authProvider === 'firebase' &&
    currentUser.emailVerified === false &&
    !dismissed;

  const handleResend = async () => {
    setSending(true);
    const res = await resendVerificationEmail();
    setSending(false);
    setNotice(res.message);
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] text-neutral-900 flex flex-col selection:bg-blue-600 selection:text-white overflow-x-clip">
      <InstagramHeader />
      {showVerifyBanner && (
        <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2.5">
          <div className="max-w-[1280px] mx-auto flex items-center gap-2.5">
            <MailWarning className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="flex-1 text-xs font-bold text-amber-800">
              {notice || (lang === 'ar' ? 'تحقق من بريدك لتفعيل كل المزايا — تفقد صندوق الوارد والرسائل المزعجة' : 'Verify your email to unlock all features — check inbox and spam')}
            </p>
            <button
              onClick={handleResend}
              disabled={sending}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              <Send className="w-3 h-3" />
              {sending ? '...' : (lang === 'ar' ? 'إعادة الإرسال' : 'Resend')}
            </button>
            <button onClick={() => setDismissed(true)} className="p-1 text-amber-500 hover:text-amber-700 shrink-0" aria-label="dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 w-full max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-0 md:px-6 lg:px-8 py-0 md:py-6">
        {/* FIX SCROLL: overflow-hidden on mobile clipped content and trapped touch.
            Use overflow-x-clip only (prevents sideways scroll) + visible vertical. */}
        <div className="w-full bg-white md:bg-transparent min-h-[calc(100dvh-56px)] md:min-h-0 pb-[96px] md:pb-0 overflow-x-clip overflow-y-visible">
          <Outlet />
        </div>
      </div>
      <InstagramBottomNav />
    </div>
  );
};
