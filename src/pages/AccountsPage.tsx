import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Users, BadgeCheck, Crown, Search, Filter, Star, ShieldCheck, Zap, Check, AlertCircle } from 'lucide-react';
import { VerificationTier } from '../types';
import { AccountSkeleton } from '../components/skeletons/AccountSkeleton';
import { useSkeletonLoading } from '../hooks/useSkeletonLoading';

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, lang, getVerificationTier, adminSettings } = useStore();
  const [filter, setFilter] = useState<'all' | VerificationTier>('all');
  const [search, setSearch] = useState('');
  const isLoading = useSkeletonLoading(1300, [users.length, filter]);

  const verifiedBlue = users.filter(u => getVerificationTier(u.id) === 'blue').length;
  const verifiedGold = users.filter(u => getVerificationTier(u.id) === 'gold').length;
  const unverified = users.filter(u => getVerificationTier(u.id) === 'none').length;

  const filtered = users.filter(u => {
    const tier = getVerificationTier(u.id);
    const matchesFilter = filter === 'all' ? true : tier === filter;
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTierBadge = (tier: VerificationTier) => {
    if (tier === 'gold') return <span className="inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 rounded-full shadow"><Crown className="w-3 h-3" />ذهبية 👑</span>;
    if (tier === 'blue') return <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-sky-500 text-white px-2 py-0.5 rounded-full"><BadgeCheck className="w-3 h-3" />زرقاء ✓</span>;
    return <span className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-bold">عادي</span>;
  };

  const getTierPrice = (tier: VerificationTier) => {
    if (tier === 'gold') return `${adminSettings.subscriptionPricing.goldBadgeILS}₪`;
    if (tier === 'blue') return `${adminSettings.subscriptionPricing.accountVerificationILS}₪`;
    return 'مجاني';
  };

  return (
    <div>
      <PageHeader
        title={lang === 'ar' ? 'قسم الحسابات' : 'Accounts Section'}
        subtitle={lang === 'ar' ? `قسم مستقل — ${verifiedBlue + verifiedGold} موثق من ${users.length} • التوثيق ${adminSettings.subscriptionPricing.accountVerificationILS}₪ والذهبية ${adminSettings.subscriptionPricing.goldBadgeILS}₪` : `Separated — ${verifiedBlue + verifiedGold}/${users.length} verified`}
        actions={<button onClick={() => navigate('/pricing')} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold"><ShieldCheck className="w-3.5 h-3.5" />{lang === 'ar' ? 'توثيق حسابي' : 'Verify Me'}</button>}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3">
          <Users className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-black text-sky-900">قسم الحسابات منفصل عن المتاجر.</span>
            <span className="text-sky-800"> الحسابات للأشخاص والمبدعين: توثيق أزرق 25₪/شهر أو ذهبية 50₪/شهر. المتاجر لها تفعيل مختلف (30₪).</span>
            <button onClick={() => navigate('/pricing')} className="ms-2 text-sky-700 font-black hover:underline">مقارنة الخطط →</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white border border-neutral-200 text-center">
            <div className="text-lg font-black">{users.length}</div>
            <div className="text-[11px] font-bold text-neutral-600">إجمالي الحسابات</div>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-center">
            <div className="text-lg font-black text-sky-700">{verifiedBlue}</div>
            <div className="text-[11px] font-bold text-sky-800">شارة زرقاء ✓</div>
            <div className="text-[10px] text-neutral-500">25₪</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-lg font-black text-amber-600">{verifiedGold}</div>
            <div className="text-[11px] font-bold text-amber-800">شارة ذهبية 👑</div>
            <div className="text-[10px] text-neutral-500">50₪</div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
            <div className="text-lg font-black text-neutral-600">{unverified}</div>
            <div className="text-[11px] font-bold text-neutral-600">عادي</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'ar' ? 'ابحث عن حساب...' : 'Search accounts...'} className="w-full ps-10 pe-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm outline-none focus:border-sky-500" />
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${filter === 'all' ? 'bg-white shadow text-black' : 'text-neutral-500'}`}>الكل ({users.length})</button>
            <button onClick={() => setFilter('gold')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${filter === 'gold' ? 'bg-amber-500 text-white shadow' : 'text-neutral-500'}`}>ذهبية ({verifiedGold})</button>
            <button onClick={() => setFilter('blue')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${filter === 'blue' ? 'bg-sky-500 text-white shadow' : 'text-neutral-500'}`}>زرقاء ({verifiedBlue})</button>
            <button onClick={() => setFilter('none')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${filter === 'none' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500'}`}>عادي ({unverified})</button>
          </div>
        </div>

        <div>
          <h3 className="font-black text-sm mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            {filter === 'all' ? 'جميع الحسابات — قسم مستقل' : filter === 'gold' ? 'الحسابات الذهبية 👑 — 50₪/شهر' : filter === 'blue' ? 'الحسابات الزرقاء ✓ — 25₪/شهر' : 'الحسابات العادية — بدون اشتراك'}
            <span className="text-xs font-normal text-neutral-500">({filtered.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <AccountSkeleton count={6} variant="card" />
            ) : (
              filtered.map(user => {
              const tier = getVerificationTier(user.id);
              const isGold = tier === 'gold';
              const isBlue = tier === 'blue';
              return (
                <div key={user.id} className={`relative bg-white rounded-2xl border-2 overflow-hidden p-4 flex flex-col gap-3 ${isGold ? 'border-amber-300 shadow-md' : isBlue ? 'border-sky-200 shadow-sm' : 'border-neutral-200'}`}>
                  {isGold && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />}
                  {isBlue && !isGold && <div className="absolute top-0 inset-x-0 h-1 bg-sky-500" />}

                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img src={user.avatar} alt={user.name} className={`w-14 h-14 rounded-full object-cover border-2 ${isGold ? 'border-amber-400' : isBlue ? 'border-sky-400' : 'border-neutral-200'}`} />
                      {isGold && <span className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white flex items-center justify-center text-xs shadow border-2 border-white">👑</span>}
                      {isBlue && !isGold && <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-black text-sm truncate">{user.name}</h4>
                        {getTierBadge(tier)}
                      </div>
                      <p className="text-xs text-neutral-500 font-mono">@{user.username}</p>
                      <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{user.bio}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{user.followersCount.toLocaleString()}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-600">{user.postsCount} منشور</span>
                    <span className="ms-auto text-[11px] font-bold px-2 py-1 rounded-full border ${isGold ? 'bg-amber-50 text-amber-700 border-amber-200' : isBlue ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-neutral-50 text-neutral-600 border-neutral-200'}">
                      {getTierPrice(tier)}/شهر
                    </span>
                  </div>

                  {/* Verification Status */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${isGold ? 'bg-amber-50 border-amber-200' : isBlue ? 'bg-sky-50 border-sky-200' : 'bg-neutral-50 border-neutral-200'}`}>
                    <div className="flex items-center gap-1.5 text-xs">
                      {isGold ? <Crown className="w-4 h-4 text-amber-600" /> : isBlue ? <BadgeCheck className="w-4 h-4 text-sky-600" /> : <AlertCircle className="w-4 h-4 text-neutral-400" />}
                      <span className={`font-bold ${isGold ? 'text-amber-800' : isBlue ? 'text-sky-800' : 'text-neutral-600'}`}>
                        {isGold ? 'موثق ذهبي مميز' : isBlue ? 'موثق بعلامة زرقاء' : 'غير موثق'}
                      </span>
                    </div>
                    {user.verification?.expiresAt && (isGold || isBlue) && (
                      <span className="text-[11px] text-neutral-500">
                        {new Date(user.verification.expiresAt).getTime() > Date.now() ? `متبقي ${Math.ceil((new Date(user.verification.expiresAt).getTime() - Date.now())/(1000*60*60*24))} يوم` : 'منتهي'}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/user/${user.username}`)} className="flex-1 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold">عرض الملف</button>
                    {!isGold && !isBlue && (
                      <button onClick={() => navigate('/pricing')} className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black">توثيق 25₪/50₪</button>
                    )}
                    {isBlue && !isGold && (
                      <button onClick={() => navigate('/pricing')} className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1"><Crown className="w-3.5 h-3.5" />ترقية ذهبية</button>
                    )}
                    {isGold && (
                      <span className="flex-1 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1"><Star className="w-3.5 h-3.5" />مميز 👑</span>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm">
            <span className="font-black">تريد توثيق حسابك؟</span>
            <span className="text-sky-100 text-xs ms-2">زرقاء 25₪ أو ذهبية 50₪ شهرياً</span>
          </div>
          <button onClick={() => navigate('/pricing')} className="px-5 py-2.5 bg-white text-sky-700 rounded-xl text-sm font-black">اختيار الخطة →</button>
        </div>
      </div>
    </div>
  );
};
