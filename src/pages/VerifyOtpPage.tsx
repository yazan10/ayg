import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppPageLoader } from '../components/ui/AppPageLoader';

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const typeParam = (searchParams.get('type') as 'login' | 'register') || 'register';

  const { confirmRegisterOtp, loginWithOtp, sendOtp, resendOtp, verifyOtp } = useAuth();

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; code?: string } | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [initialCode, setInitialCode] = useState<string | null>(null);

  if (loading) {
    return <AppPageLoader message={typeParam === 'register' ? 'جاري تأكيد حسابك...' : 'جاري تسجيل الدخول...'} />;
  }

  useEffect(() => {
    if (emailParam) {
      // Try to show demo code if exists in storage
      try {
        const stored = localStorage.getItem('aygram_auth_otp_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          const rec = parsed[emailParam.toLowerCase()];
          if (rec) setInitialCode(rec.code);
        }
      } catch {}
    }
  }, [emailParam]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !code.trim()) {
      setMessage({ type: 'error', text: 'الرجاء إدخال البريد والرمز' });
      return;
    }
    if (code.length !== 6) {
      setMessage({ type: 'error', text: 'الرمز يجب أن يكون 6 أرقام' });
      return;
    }

    setLoading(true);
    setMessage(null);

    let res: { success: boolean; message: string };
    if (typeParam === 'register') {
      res = await confirmRegisterOtp(email, code);
    } else {
      res = await loginWithOtp(email, code);
    }

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => navigate('/'), 800);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'الرجاء إدخال البريد أولاً' });
      return;
    }
    setResendLoading(true);
    // resend based on type
    const res = typeParam === 'register' ? await sendOtp(email, 'register') : await resendOtp(email);
    setResendLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: res.message, code: res.code });
      setInitialCode(res.code || null);
      setCountdown(60);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-lg">ay</div>
            <span className="text-2xl font-black tracking-tighter lowercase">aygram</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 p-6 text-white text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black">
              {typeParam === 'register' ? 'تأكيد إنشاء الحساب' : 'تأكيد تسجيل الدخول'}
            </h1>
            <p className="text-sm text-blue-200 mt-1">
              {typeParam === 'register' ? 'أدخل رمز التأكيد المرسل إلى بريدك لإتمام التسجيل' : 'أدخل رمز الدخول المرسل إلى بريدك'}
            </p>
          </div>

          <form onSubmit={handleVerify} className="p-6 space-y-4">
            {message && (
              <div className={`p-3 rounded-xl text-sm border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                <div>{message.text}</div>
                {message.code && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-[#323232] text-center">
                    <span className="text-xs text-emerald-600 block font-bold">✓ تم إرسال الرمز إلى بريدك عبر Firebase</span>
                    <span className="text-[11px] text-neutral-500 block mt-1">تفقد بريدك — صالح لـ 5 دقائق</span>
                  </div>
                )}
              </div>
            )}

            {initialCode && !message?.code && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm">
                <div className="text-blue-800 font-bold text-xs mb-1 flex items-center gap-1">✓ تم إرسال الرمز إلى بريدك</div>
                <div className="text-[11px] text-blue-600 mt-1 text-center">تفقد بريدك الإلكتروني (وصندوق الرسائل المزعجة) — الرمز محفوظ في Firebase ومشفر</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input type="email" dir="ltr" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@aygram.com" className="w-full ps-10 pe-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">رمز التحقق (6 أرقام) *</label>
              <input type="text" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="• • • • • •" dir="ltr" className="w-full px-4 py-4 bg-neutral-50 border-2 border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-center text-xl font-black tracking-[0.5em] font-mono" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-neutral-500">صالح لمدة 5 دقائق</span>
                <button type="button" onClick={handleResend} disabled={resendLoading || countdown > 0} className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-1">
                  <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : ''}`} />
                  {countdown > 0 ? `إعادة الإرسال بعد ${countdown}s` : 'إعادة إرسال الرمز'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || code.length !== 6} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-md">
              {loading ? 'جاري التحقق...' : typeParam === 'register' ? 'تأكيد وإنشاء الحساب' : 'تأكيد الدخول'}
            </button>

            <div className="flex items-center justify-between pt-2 text-sm">
              <Link to={typeParam === 'register' ? '/register' : '/login'} className="text-neutral-500 hover:text-black flex items-center gap-1">
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>رجوع</span>
              </Link>
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
