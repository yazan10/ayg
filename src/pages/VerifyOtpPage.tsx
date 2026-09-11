import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { AppPageLoader } from '../components/ui/AppPageLoader';

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation() as { state?: { code?: string } };
  const emailParam = searchParams.get('email') || '';

  const { confirmRegisterCode, requestRegisterCode, getCodeCooldown, isAuthenticated } = useAuth();

  const [email] = useState(emailParam);
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState<string | undefined>(location.state?.code);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(() => (emailParam ? getCodeCooldown(emailParam) : 0));

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (loading) {
    return <AppPageLoader message="جاري تأكيد حسابك..." />;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !code.trim()) {
      setMessage({ type: 'error', text: 'الرجاء إدخال الرمز' });
      return;
    }
    if (code.length !== 6) {
      setMessage({ type: 'error', text: 'الرمز يجب أن يكون 6 أرقام' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await confirmRegisterCode(email, code);
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: `${res.message} — جاري تحويلك...` });
      setTimeout(() => navigate('/', { replace: true }), 1000);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleResend = async () => {
    // Rebuild the original profile from this device's pending registration
    // and request a fresh code (device limits + cooldowns still apply).
    let pending: any = null;
    try {
      const raw = localStorage.getItem('aygram_pending_reg');
      pending = raw ? JSON.parse(raw) : null;
    } catch {}
    if (!pending || pending.email !== email) {
      setMessage({ type: 'error', text: 'انتهت الجلسة — ارجع لصفحة التسجيل وابدأ من جديد' });
      return;
    }
    setResendLoading(true);
    setMessage(null);
    const res = await requestRegisterCode({
      name: pending.name,
      username: pending.username,
      email: pending.email,
      password: pending.password,
      confirmPassword: pending.password,
      avatar: pending.avatar,
      nationality: pending.nationality,
      nationalityNameAr: pending.nationalityNameAr,
    });
    setResendLoading(false);
    if (res.success) {
      setSentCode(res.code);
      setCode('');
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
    setCooldown(getCodeCooldown(email));
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
            <h1 className="text-xl font-black">تأكيد إنشاء الحساب</h1>
            <p className="text-sm text-blue-200 mt-1">أدخل رمز التحقق المحفوظ في حسابك لإتمام التسجيل</p>
          </div>

          <div className="p-6 space-y-4">
            {message && (
              <div className={`p-3 rounded-xl text-sm border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                <div>{message.text}</div>
              </div>
            )}

            {sentCode && (
              <div className="p-4 rounded-2xl bg-neutral-900 text-center space-y-1">
                <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> رمز التحقق الخاص بك (صالح 5 دقائق)
                </p>
                <p className="text-2xl font-black tracking-[0.4em] text-white font-mono" dir="ltr">{sentCode}</p>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input type="email" dir="ltr" disabled value={email} placeholder="example@aygram.com" className="w-full ps-10 pe-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl outline-none text-sm text-neutral-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">رمز التحقق (6 أرقام) *</label>
                <input type="text" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="• • • • • •" dir="ltr" className="w-full px-4 py-4 bg-neutral-50 border-2 border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-center text-xl font-black tracking-[0.5em] font-mono" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-neutral-500">صالح لمدة 5 دقائق • مرتبط بهذا الجهاز • 5 محاولات كحد أقصى</span>
                  <button type="button" onClick={handleResend} disabled={resendLoading || cooldown > 0} className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-1">
                    <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : ''}`} />
                    {cooldown > 0 ? `إعادة الإرسال بعد ${cooldown}s` : 'طلب رمز جديد'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading || code.length !== 6} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-md">
                {loading ? 'جاري التحقق...' : 'تأكيد وإنشاء الحساب'}
              </button>

              <div className="flex items-center justify-between pt-2 text-sm">
                <Link to="/register" className="text-neutral-500 hover:text-black flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>رجوع للتسجيل</span>
                </Link>
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  تسجيل الدخول
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
