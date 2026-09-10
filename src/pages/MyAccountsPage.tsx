import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { User, Store as StoreIcon, Plus, LogOut, Settings, Crown, BadgeCheck, LogIn } from 'lucide-react';

export const MyAccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { stores, users, lang } = useStore();

  const myStores = stores.filter(s => s.ownerId === currentUser?.id);
  const myFollowing = users.filter(u => u.isFollowing);

  if (!isAuthenticated || !currentUser) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'قائمة حسابي' : 'My Accounts'} />
        <div className="max-w-lg mx-auto p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-black text-base">{lang === 'ar' ? 'لم تسجل دخولك' : 'Not logged in'}</h3>
          <p className="text-sm text-neutral-500">سجل دخولك لعرض حساباتك</p>
          <button onClick={() => navigate('/login')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold">
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  const tier = (currentUser as any).nationality ? 'gold' : (currentUser as any).verificationTier || 'none';

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'قائمة حسابي' : 'My Accounts'} subtitle={`${myStores.length} متاجر • ${myFollowing.length} متابَع`} />

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Current Account Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover border-3 border-white shadow" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-base truncate">{currentUser.name}</h2>
                {currentUser.verified && <span className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center text-[10px] font-bold">✓</span>}
              </div>
              <p className="text-sm text-blue-100 font-mono">@{currentUser.username}</p>
              <p className="text-xs text-blue-200 truncate">{currentUser.email}</p>
              {(currentUser as any).nationalityNameAr && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full mt-1">
                  {(currentUser as any).nationalityNameAr}
                </span>
              )}
            </div>
            <button onClick={() => navigate('/profile')} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center border border-white/10">
              <div className="font-black text-lg">{myStores.length}</div>
              <div className="text-xs text-blue-100">متاجر</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center border border-white/10">
              <div className="font-black text-lg">{(currentUser as any).followersCount || 0}</div>
              <div className="text-xs text-blue-100">متابعون</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center border border-white/10">
              <div className="font-black text-lg">{myFollowing.length}</div>
              <div className="text-xs text-blue-100">أتابع</div>
            </div>
          </div>
        </div>

        {/* My Stores */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-black text-sm flex items-center gap-2">
              <StoreIcon className="w-4 h-4 text-blue-600" />
              متاجري
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{myStores.length}</span>
            </h3>
            <button onClick={() => navigate('/create-store')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              إنشاء متجر
            </button>
          </div>
          {myStores.length === 0 ? (
            <div className="p-8 text-center">
              <StoreIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-black">لا تملك متاجر بعد</p>
              <p className="text-xs text-neutral-500 mt-1">أنشئ متجرك الأول وابدأ البيع — التفعيل 30₪/شهر</p>
              <button onClick={() => navigate('/create-store')} className="mt-3 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold">إنشاء متجر +</button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {myStores.map(store => (
                <div key={store.id} onClick={() => navigate(`/store/${store.id}`)} className="p-4 flex items-center gap-3 hover:bg-neutral-50 cursor-pointer">
                  <img src={store.avatar} alt={store.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-200" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{store.name}</div>
                    <div className="text-xs text-neutral-500 font-mono">@{store.username} • {store.category}</div>
                  </div>
                  <span className={`text-[11px] px-2 py-1 rounded-full font-bold border ${store.subscription?.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {store.subscription?.isActive ? 'مفعّل' : 'غير مفعّل'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Following */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="font-black text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              أتابع
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{myFollowing.length}</span>
            </h3>
          </div>
          {myFollowing.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">لا تتابع أحداً بعد — استكشف الحسابات</p>
              <button onClick={() => navigate('/accounts')} className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">استكشاف الحسابات</button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              {myFollowing.map(u => (
                <div key={u.id} onClick={() => navigate(`/user/${u.username}`)} className="p-3 flex items-center gap-3 hover:bg-neutral-50 cursor-pointer">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate flex items-center gap-1">
                      {u.name}
                      {u.verificationTier === 'gold' ? <Crown className="w-3 h-3 text-amber-500" /> : u.verificationTier === 'blue' ? <BadgeCheck className="w-3 h-3 text-sky-500" /> : null}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">@{u.username}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-black flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          تسجيل خروج
        </button>
      </div>
    </div>
  );
};
