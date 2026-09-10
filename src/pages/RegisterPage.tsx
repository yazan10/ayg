import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, AtSign, Mail, Lock, Check, Eye, EyeOff, AlertTriangle, Globe, Loader2 } from 'lucide-react';
import { AppPageLoader } from '../components/ui/AppPageLoader';
import { TermsModal } from '../components/ui/TermsModal';
import { NationalityPicker } from '../components/ui/NationalityPicker';
import { ImageUpload } from '../components/ui/ImageUpload';
import { Nationality } from '../data/nationalities';
import '../components/ui/AuthFormCard.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, checkUsername, reserveUsername } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; code?: string } | null>(null);

  // Username checker state
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean | null; message: string; needsReservation?: boolean; isShort?: boolean }>({ available: null, message: '' });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);

  // Nationality picker state
  const [selectedNationality, setSelectedNationality] = useState<Nationality | null>(null);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingData, setPendingData] = useState<{ name: string; username: string; email: string; password: string; confirmPassword: string; avatar: string; nationality: string; nationalityNameAr: string } | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // Username live check with debounce
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus({ available: null, message: '' });
      return;
    }
    const normalized = username.trim().toLowerCase().replace(/^@/, '');
    if (normalized.length < 2) {
      setUsernameStatus({ available: false, message: 'قصير جداً — الحد الأدنى 3 أحرف', isShort: true });
      return;
    }
    if (normalized.length === 2) {
      setUsernameStatus({ available: false, message: 'اليوزرات بحرفين محجوزة — قدم طلب حجز', needsReservation: true, isShort: true });
      return;
    }
    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      const res = await checkUsername(normalized);
      setUsernameStatus({ available: res.available, message: res.message, needsReservation: res.needsReservation, isShort: res.isShort });
      setIsCheckingUsername(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const avatarPreview = avatarUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  const handleOAuthClick = (provider: string) => {
    setMessage({ type: 'error', text: `التسجيل عبر ${provider} قريباً — حالياً استخدم البريد` });
  };

  const handleReserve = async () => {
    const normalized = username.trim().toLowerCase().replace(/^@/, '');
    if (normalized.length !== 2) return;
    setIsCheckingUsername(true);
    const res = await reserveUsername(normalized, email || 'pending@aygram.com');
    setIsCheckingUsername(false);
    if (res.success) {
      setReservationSent(true);
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage({ type: 'error', text: 'الرجاء تعبئة جميع الحقول' });
      return;
    }

    const normalized = username.trim().toLowerCase().replace(/^@/, '');
    if (normalized.length < 3) {
      if (normalized.length === 2) {
        setMessage({ type: 'error', text: 'اليوزر من حرفين يتطلب طلب حجز — اضغط "طلب حجز"' });
      } else {
        setMessage({ type: 'error', text: 'اليوزر يجب أن يكون 3 أحرف على الأقل' });
      }
      return;
    }

    if (usernameStatus.available === false) {
      setMessage({ type: 'error', text: usernameStatus.message || 'اليوزر غير متاح' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }

    // If no nationality selected, open picker first (first registration)
    if (!selectedNationality) {
      setShowNationalityPicker(true);
      return;
    }

    // Otherwise show terms
    setPendingData({ name, username, email, password, confirmPassword, avatar: avatarUrl, nationality: selectedNationality.code, nationalityNameAr: selectedNationality.nameAr });
    setShowTermsModal(true);
  };

  const handleNationalitySelect = (n: Nationality) => {
    setSelectedNationality(n);
    setShowNationalityPicker(false);
    // After selecting nationality, immediately show terms if form was pending
    if (name.trim() && username.trim() && email.trim() && password && confirmPassword) {
      setPendingData({ name, username, email, password, confirmPassword, avatar: avatarUrl, nationality: n.code, nationalityNameAr: n.nameAr });
      setTimeout(() => setShowTermsModal(true), 300);
    }
  };

  const handleTermsAccept = async () => {
    if (!pendingData) return;
    setShowTermsModal(false);
    setLoading(true);
    const res = await register({
      name: pendingData.name,
      username: pendingData.username,
      email: pendingData.email,
      password: pendingData.password,
      confirmPassword: pendingData.confirmPassword,
      avatar: pendingData.avatar,
      nationality: pendingData.nationality,
      nationalityNameAr: pendingData.nationalityNameAr,
    });
    setLoading(false);

    if (res.success && res.needOtp) {
      navigate(`/verify-otp?email=${encodeURIComponent(pendingData.email.trim().toLowerCase())}&type=register`);
    } else if (!res.success) {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
    setMessage({ type: 'error', text: 'يجب الموافقة على سياسة الخصوصية وشروط المجتمع لإنشاء الحساب' });
  };

  if (loading) {
    return <AppPageLoader message="جاري إنشاء حسابك..." />;
  }

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="brand-header">
          <div className="logo">
            <div className="logo-icon">ay</div>
            <h1>aygram</h1>
          </div>
          <p>انضم لمجتمع المتاجر والمبدعين</p>
        </div>

        <form className="auth-form-card" onSubmit={handleFormSubmit} style={{ maxHeight: '88vh', overflowY: 'auto' }}>
          <p>
            Welcome,<span>create account to continue</span>
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

          {message && (
            <div className={`w-full p-3 rounded-lg text-sm border-2 font-bold ${message.type === 'error' ? 'bg-red-50 text-red-700 border-[#323232] shadow-[3px_3px_#323232]' : 'bg-emerald-50 text-emerald-700 border-[#323232] shadow-[3px_3px_#323232]'}`}>
              {message.text}
            </div>
          )}

          {/* Profile Picture - From Device Only */}
          <ImageUpload
            value={avatarUrl}
            onChange={setAvatarUrl}
            label="صورة البروفايل (من الجهاز فقط)"
            placeholder="اختر صورة من جهازك"
            previewSize="md"
          />
          <div className="bg-amber-50 border-2 border-[#323232] rounded-lg shadow-[2px_2px_#323232] p-2.5 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-black text-amber-800">تنبيه:</span>
              <span className="text-amber-700"> ممنوع </span>
              <span className="font-bold text-red-700">ذات الأرواح</span>
              <span className="text-amber-700"> أو </span>
              <span className="font-bold text-red-700">الشخصيات المقتبسة</span>
              <span className="text-amber-700"> — الصور تُضغط وتُحفظ في Vercel كرابط.</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">الاسم الكامل *</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="مثال: يزن صلاق" className="form-input" />
          </div>

          {/* Username with live server check */}
          <div className="form-group">
            <label className="form-label flex items-center justify-between">
              <span>اسم المستخدم *</span>
              {isCheckingUsername ? (
                <span className="text-[11px] text-blue-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  فحص...
                </span>
              ) : usernameStatus.message ? (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${usernameStatus.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : usernameStatus.needsReservation ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {usernameStatus.message}
                </span>
              ) : null}
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                dir="ltr"
                required
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                placeholder="ayzan_official"
                className={`form-input font-mono ps-9 pe-9 ${usernameStatus.available === true ? 'border-emerald-500 focus:border-emerald-500' : usernameStatus.available === false ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              <div className="absolute end-3 top-1/2 -translate-y-1/2">
                {isCheckingUsername ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : usernameStatus.available === true ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : usernameStatus.available === false && !usernameStatus.needsReservation ? (
                  <span className="text-red-500 text-xs font-bold">✕</span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-[#666]">إنجليزية صغيرة وأرقام فقط • الحد الأدنى 3 أحرف</p>
              {usernameStatus.needsReservation && (
                <button
                  type="button"
                  onClick={handleReserve}
                  disabled={reservationSent}
                  className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${reservationSent ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'}`}
                >
                  {reservationSent ? 'تم الإرسال ✓' : 'طلب حجز'}
                </button>
              )}
            </div>
            {username && username.replace(/[^a-z0-9_.]/g, '').length === 2 && !reservationSent && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-1">
                اليوزرات بحرفين محجوزة — اضغط <strong>طلب حجز</strong> وسيتم مراجعته خلال 24 ساعة. يمكنك المتابعة بيوزر 3 أحرف الآن.
              </p>
            )}
          </div>

          {/* Email - One box */}
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input type="email" dir="ltr" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@aygram.com" className="form-input ps-9" />
            </div>
            <p className="text-[11px] text-[#666] mt-1">سيصلك رمز تأكيد OTP على هذا البريد</p>
          </div>

          {/* Nationality Selector */}
          <div className="form-group">
            <label className="form-label flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              جنسيتك *
            </label>
            <button
              type="button"
              onClick={() => setShowNationalityPicker(true)}
              className={`w-full flex items-center justify-between px-3 py-3 bg-white border-2 rounded-lg shadow-[3px_3px_#323232] text-sm font-bold transition-all ${selectedNationality ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-[#323232] text-[#323232] hover:bg-neutral-50'}`}
            >
              <span className="flex items-center gap-2">
                {selectedNationality ? (
                  <>
                    <span className="text-lg">{selectedNationality.flag}</span>
                    <span>{selectedNationality.nameAr}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">✓</span>
                  </>
                ) : (
                  <span className="text-[#666]">اختر جنسيتك — 100 جنسية</span>
                )}
              </span>
              <span className="text-xs bg-[#323232] text-white px-2 py-1 rounded-full">اختيار</span>
            </button>
            <p className="text-[11px] text-[#666] mt-1">
              المتاح حالياً: فلسطين، عرب الداخل، إسرائيل، الأردن، مصر، السعودية، سوريا، اليمن، المغرب، روسيا — الباقي قريباً
            </p>
            {selectedNationality && !selectedNationality.allowed && (
              <p className="text-xs text-red-600 mt-1 font-bold">هذه الجنسية غير متاحة للتسجيل حالياً — اختر واحدة من المتاح</p>
            )}
          </div>

          {/* Two password boxes */}
          <div className="form-group">
            <label className="form-label">إنشاء كلمة المرور *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input type={showPassword ? 'text' : 'password'} dir="ltr" required value={password} onChange={e => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" className="form-input ps-9 pe-9" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-black">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input type={showPassword ? 'text' : 'password'} dir="ltr" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="أعد كتابة كلمة المرور" className="form-input ps-9" />
            </div>
            {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-600 mt-1 font-bold">كلمتا المرور غير متطابقتين</p>}
            {confirmPassword && password === confirmPassword && password.length >= 6 && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-bold"><Check className="w-3 h-3" /> متطابق</p>}
          </div>

          <button type="submit" className="continue-btn">
            إنشاء الحساب
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
          </button>

          <div className="w-full pt-3 border-t-2 border-[#323232] text-center">
            <p className="text-sm text-[#323232] font-bold">
              لديك حساب؟{' '}
              <Link to="/login" className="underline hover:text-[#2d8cf0]">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>

      <NationalityPicker
        isOpen={showNationalityPicker}
        onSelect={(n) => {
          setSelectedNationality(n);
          setShowNationalityPicker(false);
        }}
        onClose={() => setShowNationalityPicker(false)}
        selectedCode={selectedNationality?.code}
      />

      <TermsModal
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};
