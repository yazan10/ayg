import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldAlert, KeyRound, X, CheckCircle, Eye, EyeOff, Mail } from 'lucide-react';

export const AdminModal: React.FC = () => {
  const { adminModalOpen, setAdminModalOpen, adminLogin, lang, t } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!adminModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await adminLogin(email, password);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
      }, 500);
    } else {
      setError(res.message);
    }
  };

  const handleClose = () => {
    setAdminModalOpen(false);
    setPassword('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden text-black transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Dark Blue Badge */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {lang === 'ar' ? 'بوابة الإدارة' : 'Admin Gate'}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {lang === 'ar' ? 'دخول المشرفين فقط' : 'Administrators only'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-2">
            <p className="text-sm text-neutral-600">
              {lang === 'ar'
                ? 'سجل الدخول ببريد المشرف الموثق للوصول للوحة التحكم'
                : 'Sign in with the verified admin email to access the dashboard'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-black block">
              {lang === 'ar' ? 'بريد المشرف' : 'Admin Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="admin@mail.com"
                dir="ltr"
                autoFocus
                className="w-full ps-10 pe-4 py-3 text-sm bg-neutral-50 border border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-black rounded-xl font-mono outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-black block">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400">
                <KeyRound className="w-4 h-4 text-blue-600" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                dir="ltr"
                className={`w-full ps-10 pe-10 py-3 text-sm bg-neutral-50 border ${
                  error ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-black'
                } rounded-xl font-mono outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-neutral-400 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            )}
            {success && (
              <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تم التحقق بنجاح! جاري الفتح...' : 'Verified! Opening portal...'}</span>
              </p>
            )}
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-black hover:bg-neutral-100 text-sm font-semibold transition-colors"
            >
              {t.adminCancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              {loading ? '...' : t.adminUnlock}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
