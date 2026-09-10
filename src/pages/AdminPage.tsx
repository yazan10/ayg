import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ShieldAlert, KeyRound, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { AdminDashboard } from '../components/AdminDashboard';

export const AdminPage: React.FC = () => {
  const { isAdmin, verifyAdminPassword, lang, t } = useStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setSuccess(true);
      setError(false);
      setTimeout(() => { setSuccess(false); setPassword(''); }, 500);
    } else {
      setError(true);
    }
  };

  if (isAdmin) {
    return (
      <div className="admin-font">
        <PageHeader title={lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'} subtitle={lang === 'ar' ? 'التحكم الشامل للمنصة — خط Tajawal + Cairo الحصري' : 'Full platform control — Exclusive Tajawal + Cairo'} backTo="/" />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="admin-font">
      <PageHeader title={lang === 'ar' ? 'بوابة الإدارة السرية' : 'Secret Admin Gate'} subtitle={lang === 'ar' ? 'تم تفعيل الدخول عبر 6 ضغطات' : 'Activated via 6-clicks trigger'} />
      <div className="max-w-md mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center"><ShieldAlert className="w-7 h-7 text-white" /></div>
            <div><h3 className="font-bold text-lg">{lang === 'ar' ? 'بوابة الإدارة السرية' : 'Secret Admin Gate'}</h3><p className="text-xs text-blue-200 mt-1">{lang === 'ar' ? 'أدخل مفتاح التحقق للوصول للوحة التحكم' : 'Enter secret key to access dashboard'}</p></div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold block">{lang === 'ar' ? 'كلمة مرور المشرف' : 'Admin Key Code'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400"><KeyRound className="w-4 h-4 text-blue-600" /></div>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(false); }} placeholder="ayzan_official أو yaz@#5Y" dir="ltr" autoFocus className={`w-full ps-10 pe-10 py-3 text-sm bg-neutral-50 border ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'} rounded-xl font-mono outline-none`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center pe-3 text-neutral-400"><div>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</div></button>
              </div>
              {error && <p className="text-xs text-red-600 font-medium flex items-center gap-1"><span>⚠️</span><span>{t.adminWrongPassword}</span></p>}
              {success && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /><span>{lang === 'ar' ? 'تم التحقق بنجاح! جاري الفتح...' : 'Verified! Opening...'}</span></p>}
              <p className="text-[11px] text-neutral-500 leading-relaxed">{lang === 'ar' ? 'تلميح: كلمة المرور هي نفس اسم المستخدم (ayzan_official) أو yaz@#5Y أو admin' : 'Hint: password equals username (ayzan_official) or yaz@#5Y or admin'}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-sm font-semibold">{t.adminCancel}</button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md">{t.adminUnlock}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
