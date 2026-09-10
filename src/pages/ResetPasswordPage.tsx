import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
import { AppPageLoader } from '../components/ui/AppPageLoader';
import '../components/ui/AuthFormCard.css';

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setMessage({ type: 'error', text: 'الرجاء إدخال بريد إلكتروني صحيح' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
      setMessage({ type: 'success', text: `تم إرسال رابط إعادة التعيين إلى ${email} — تفقد بريدك (وصندوق الرسائل المزعجة)` });
    } catch (err: any) {
      let text = 'حدث خطأ أثناء الإرسال';
      if (err?.message) text = err.message;
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AppPageLoader message="جاري إرسال رابط التعيين..." />;
  }

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="brand-header">
          <div className="logo">
            <div className="logo-icon">ay</div>
            <h1>aygram</h1>
          </div>
          <p>استعادة كلمة المرور</p>
        </div>

        <form className="auth-form-card" onSubmit={handleSubmit}>
          <p>
            Reset,<span>recover your password</span>
          </p>

          <div className="w-full bg-amber-50 border-2 border-[#323232] rounded-lg shadow-[3px_3px_#323232] p-3 flex items-start gap-2">
            <KeyRound className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs leading-relaxed">
              <span className="font-black text-amber-800">أمان:</span>
              <span className="text-amber-700"> سيصلك رابط آمن على </span>
              <span className="font-mono font-bold text-amber-900">{email}</span>
              <span className="text-amber-700"> صالح لـ 60 دقيقة.</span>
            </div>
          </div>

          {message && (
            <div className={`w-full p-3 rounded-lg text-sm border-2 font-bold flex items-start gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-[#323232] shadow-[3px_3px_#323232]' : 'bg-emerald-50 text-emerald-700 border-[#323232] shadow-[3px_3px_#323232]'}`}>
              {message.type === 'error' ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> : <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {sent ? (
            <div className="w-full bg-white border-2 border-[#323232] rounded-lg shadow-[3px_3px_#323232] p-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-black text-black">تم الإرسال!</p>
                <p className="text-xs text-neutral-600 mt-1">
                  إذا كان البريد مسجلاً، ستصلك رسالة خلال دقائق. اضغط الرابط لإنشاء كلمة سر جديدة.
                </p>
                <p className="text-[11px] font-mono text-neutral-500 mt-2 break-all">{email}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/login" className="flex-1 py-2.5 bg-[#323232] text-white rounded-lg text-sm font-bold text-center shadow-[3px_3px_#323232] border-2 border-[#323232]">
                  العودة للدخول
                </Link>
                <button type="button" onClick={() => { setSent(false); setMessage(null); }} className="flex-1 py-2.5 bg-white border-2 border-[#323232] rounded-lg text-sm font-bold shadow-[2px_2px_#323232]">
                  إرسال مرة أخرى
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    dir="ltr"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@aygram.com"
                    className="form-input ps-9"
                  />
                </div>
                <p className="text-[11px] text-[#666] mt-1">سنرسل رابط إعادة تعيين إلى بريدك الإلكتروني</p>
              </div>

              <button type="submit" className="continue-btn">
                إرسال رابط التعيين
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
              </button>
            </>
          )}

          <div className="w-full pt-3 border-t-2 border-[#323232] text-center">
            <p className="text-sm text-[#323232] font-bold">
              تذكرت كلمتك؟{' '}
              <Link to="/login" className="underline hover:text-[#2d8cf0]">
                تسجيل الدخول
              </Link>
              <span className="mx-2">•</span>
              <Link to="/register" className="underline hover:text-[#2d8cf0]">
                إنشاء حساب
              </Link>
            </p>
          </div>
        </form>

        <p className="text-[11px] text-center text-[#666] mt-4">
          © 2026 aygram — كل الحقوق محفوظة
        </p>
      </div>
    </div>
  );
};
