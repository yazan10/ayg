import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AppPageLoader } from '../components/ui/AppPageLoader';
import '../components/ui/AuthFormCard.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp, loginWithOtp, loginWithPassword, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; code?: string } | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleOAuthClick = (provider: string) => {
    setMessage({ type: 'info', text: `تسجيل الدخول عبر ${provider} قريباً — حالياً استخدم البريد ورمز OTP` });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'الرجاء إدخال البريد الإلكتروني' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await sendOtp(email, 'login');
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: res.message, code: res.code });
      setStep('otp');
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setMessage({ type: 'error', text: 'الرجاء إدخال رمز التحقق' });
      return;
    }
    setLoading(true);
    const res = await loginWithOtp(email, otp);
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => navigate('/'), 600);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'الرجاء تعبئة البريد وكلمة المرور' });
      return;
    }
    setLoading(true);
    const res = await loginWithPassword(email, password);
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => navigate('/'), 600);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  if (loading) {
    return <AppPageLoader message="جاري تسجيل الدخول..." />;
  }

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="brand-header">
          <div className="logo">
            <div className="logo-icon">ay</div>
            <h1>aygram</h1>
          </div>
          <p>منصة التواصل الاجتماعي والمتاجر المتكاملة</p>
        </div>

        <form className="auth-form-card" onSubmit={mode === 'otp' ? (step === 'email' ? handleSendOtp : handleVerifyOtp) : handlePasswordLogin}>
          <p>
            Welcome,<span>sign in to continue</span>
          </p>

          <button type="button" className="oauthButton" onClick={() => handleOAuthClick('Google')}>
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              <path d="M1 1h22v22H1z" fill="none"></path>
            </svg>
            Continue with Google
          </button>

          <button type="button" className="oauthButton" onClick={() => handleOAuthClick('Apple')}>
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 8.22c.87-1.98 2.52-3.34 4.56-3.4 1.32-.02 2.57.89 3.38.89.81 0 2.34-1.1 3.94-.94 1.59.15 3.1 1.07 3.96 2.07-3.65 2.06-2.73 6.96.54 8.33-.22.64-.4 1.28-.68 1.96zM12.5 4.5c-.87-1.07-1.5-2.56-1.33-4 1.25.05 2.77.83 3.65 1.9.8.97 1.5 2.52 1.32 4-1.39.1-2.77-.7-3.64-1.9z"></path>
            </svg>
            Continue with Apple
          </button>

          <div className="separator">
            <div></div>
            <span>OR</span>
            <div></div>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-[#323232] p-1 rounded-lg w-full gap-1">
            <button type="button" onClick={() => { setMode('otp'); setStep('email'); setMessage(null); }} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'otp' ? 'bg-white text-[#323232] shadow' : 'text-white/70'}`}>OTP</button>
            <button type="button" onClick={() => { setMode('password'); setMessage(null); }} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'password' ? 'bg-white text-[#323232] shadow' : 'text-white/70'}`}>Password</button>
          </div>

          {message && (
            <div className={`w-full p-3 rounded-lg text-sm border-2 flex items-start gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-[#323232] shadow-[3px_3px_#323232]' : message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-[#323232] shadow-[3px_3px_#323232]' : 'bg-blue-50 text-blue-700 border-[#323232] shadow-[3px_3px_#323232]'}`}>
              <span>{message.type === 'error' ? '⚠️' : '✅'}</span>
              <div className="flex-1">
                <span className="font-bold">{message.text}</span>
                {message.code && (
                  <div className="mt-2 p-2 bg-white rounded border-2 border-[#323232] text-center">
                    <span className="text-xs text-emerald-600 block font-bold">✓ تم إرسال الرمز إلى بريدك عبر Firebase</span>
                    <span className="text-[11px] text-neutral-500 block mt-1">تفقد بريدك (وصندوق الرسائل المزعجة) — صالح لـ 5 دقائق</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'otp' ? (
            step === 'email' ? (
              <>
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني *</label>
                  <input type="email" placeholder="Email" name="email" dir="ltr" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
                  <p className="text-[11px] text-[#666] mt-1">سنرسل لك رمز 6 أرقام صالح لـ 5 دقائق</p>
                </div>

                <button type="submit" className="continue-btn">
                  Continue
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                </button>

                <p className="text-xs text-center text-[#666] font-mono">
                  Demo: yazan@aygram.com • sarah@aygram.com
                </p>
              </>
            ) : (
              <>
                <div className="w-full p-3 bg-white border-2 border-[#323232] rounded-lg shadow-[3px_3px_#323232] text-center">
                  <p className="text-xs text-[#666]">تم الإرسال إلى</p>
                  <p className="text-sm font-bold font-mono text-[#323232]" dir="ltr">{email}</p>
                  <button type="button" onClick={() => setStep('email')} className="text-xs text-[#2d8cf0] font-bold hover:underline mt-1">تغيير البريد</button>
                </div>

                <div className="form-group">
                  <label className="form-label">رمز التحقق (OTP) *</label>
                  <input type="text" inputMode="numeric" maxLength={6} autoFocus value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••••" dir="ltr" className="form-input text-center text-xl tracking-[0.4em] font-black" />
                </div>

                <button type="submit" disabled={otp.length !== 6} className="continue-btn disabled:opacity-50">
                  تأكيد الدخول
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                </button>

                <button type="button" onClick={handleSendOtp} className="w-full text-sm font-bold text-[#323232] hover:underline">إعادة إرسال الرمز</button>
              </>
            )
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">البريد أو اسم المستخدم *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input type="text" dir="ltr" required value={email} onChange={e => setEmail(e.target.value)} placeholder="yazan@aygram.com" className="form-input ps-9" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input type={showPassword ? 'text' : 'password'} dir="ltr" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="form-input ps-9 pe-9" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-black">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-end mt-1.5">
                  <Link to="/reset-password" className="text-xs font-bold text-[#2d8cf0] hover:underline">
                    هل نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>

              <button type="submit" className="continue-btn">
                <Lock className="w-4 h-4" />
                دخول
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
              </button>

              <p className="text-xs text-center text-[#666]">Demo: yazan@aygram.com / yaz@#5Y</p>
            </>
          )}

          <div className="w-full pt-3 border-t-2 border-[#323232] text-center">
            <p className="text-sm text-[#323232] font-bold">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="underline hover:text-[#2d8cf0]">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
