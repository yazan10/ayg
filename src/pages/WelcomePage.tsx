import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, UserPlus, ShieldCheck, Store, MessageCircle, Crown } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-xl border-b border-neutral-200/70 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-base shadow-sm">
              ay
            </div>
            <span className="text-xl font-black tracking-tighter lowercase">aygram</span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            منصة جديدة
          </span>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center p-4 sm:p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[28px] border border-neutral-200/70 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Top gradient */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

            <div className="p-6 sm:p-8 text-center space-y-6">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-lg mx-auto">
                  ay
                </div>
                <div>
                  <h1 className="text-2xl font-black text-black tracking-tight">
                    مرحبا بك في منصة <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">ايغرام</span>
                  </h1>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    منصة التواصل والمتاجر — تواصل، بيع، وشاهد
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                  <Store className="w-5 h-5 text-blue-600 mx-auto" />
                  <div className="text-[11px] font-black text-blue-900 mt-1">متاجر</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                  <MessageCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                  <div className="text-[11px] font-black text-emerald-800">رسائل</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                  <Crown className="w-5 h-5 text-amber-600 mx-auto" />
                  <div className="text-[11px] font-black text-amber-800">توثيق</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </button>

                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs font-bold text-neutral-400 px-2 bg-white">أم</span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4" />
                  ليس لديك حساب؟ إنشاء حساب
                </button>

                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  بإنشائك حساباً فأنت توافق على <span className="font-bold text-neutral-700">سياسة الخصوصية وشروط المجتمع</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>آمن ومشفر — مدعوم من Firebase</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-neutral-400 mt-4">
            © 2026 aygram — كل الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
};
