import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MailCheck, Mail, Loader2 } from 'lucide-react';
import { AppPageLoader } from '../components/ui/AppPageLoader';
import '../components/ui/AuthFormCard.css';

export const FinishSignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeLoginLink, isAuthenticated } = useAuth();

  const [email, setEmail] = useState(() => {
    try {
      return searchParams.get('email') || localStorage.getItem('aygram_email_link') || '';
    } catch {
      return searchParams.get('email') || '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [autoTried, setAutoTried] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const triedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const doComplete = async (emailToUse: string) => {
    if (!emailToUse.trim()) {
      setMessage({ type: 'error', text: 'أدخل بريدك لإتمام الدخول' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await completeLoginLink(emailToUse);
    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: `${res.message} — جاري تحويلك...` });
      setTimeout(() => navigate('/', { replace: true }), 800);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  // Auto-complete when the email is known (same device)
  useEffect(() => {
    if (triedRef.current || isAuthenticated) return;
    triedRef.current = true;
    setAutoTried(true);
    if (email.trim()) {
      doComplete(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && autoTried && !message) {
    return <AppPageLoader message="جاري إتمام تسجيل الدخول..." />;
  }

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="brand-header">
          <div className="logo">
            <div className="logo-icon">ay</div>
            <h1>aygram</h1>
          </div>
          <p>إتمام تسجيل الدخول</p>
        </div>

        <form
          className="auth-form-card"
          onSubmit={e => {
            e.preventDefault();
            doComplete(email);
          }}
        >
          <p>
            Almost there,<span>confirm your email to continue</span>
          </p>

          <div className="w-full p-4 bg-blue-50 border-2 border-[#323232] rounded-lg shadow-[3px_3px_#323232] text-center">
            {loading ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            ) : (
              <MailCheck className="w-8 h-8 text-blue-600 mx-auto" />
            )}
            <p className="text-sm font-black text-black mt-2">تأكيد الدخول عبر رابط البريد</p>
          </div>

          {message && (
            <div className={`w-full p-3 rounded-lg text-sm border-2 font-bold ${message.type === 'error' ? 'bg-red-50 text-red-700 border-[#323232] shadow-[3px_3px_#323232]' : 'bg-emerald-50 text-emerald-700 border-[#323232] shadow-[3px_3px_#323232]'}`}>
              <span>{message.text}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666] absolute start-3 top-1/2 -translate-y-1/2" />
              <input type="email" dir="ltr" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" className="form-input ps-9" />
            </div>
            <p className="text-[11px] text-[#666] mt-1">يجب أن يطابق البريد الذي طلبت عليه الرابط</p>
          </div>

          <button type="submit" disabled={loading} className="continue-btn disabled:opacity-50">
            {loading ? 'جاري التأكيد...' : 'تأكيد الدخول'}
          </button>

          <div className="w-full pt-3 border-t-2 border-[#323232] text-center">
            <Link to="/login" className="text-sm font-bold underline hover:text-[#2d8cf0]">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
