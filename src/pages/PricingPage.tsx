import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/layout/PageHeader';
import { SUBSCRIPTION_PLANS } from '../types';
import { Check, Crown, Store as StoreIcon, BadgeCheck, Sparkles, ArrowLeft, ShieldCheck, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const { lang, adminSettings, stores, users, currentUser, activateStoreSubscription, purchaseVerification, formatPrice, isStoreActive, getVerificationTier } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pricing = adminSettings.subscriptionPricing;
  const activeStoresCount = stores.filter(s => isStoreActive(s.id)).length;
  const verifiedAccountsCount = users.filter(u => getVerificationTier(u.id) !== 'none').length;

  const handleActivateStore = (storeId: string) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    activateStoreSubscription(storeId);
    setSuccessMsg(lang === 'ar' ? 'تم تفعيل المتجر بنجاح لمدة 30 يوم! 🏪' : 'Store activated for 30 days! 🏪');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleVerify = (tier: 'blue' | 'gold') => {
    if (!isAuthenticated) { navigate('/login'); return; }
    purchaseVerification(currentUser.id, tier);
    setSuccessMsg(tier === 'gold' ? (lang === 'ar' ? 'تم تفعيل العلامة الذهبية المميزة! 👑' : 'Gold badge activated! 👑') : (lang === 'ar' ? 'تم توثيق حسابك بالعلامة الزرقاء! ✓' : 'Blue verification activated! ✓'));
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const currentTier = getVerificationTier(currentUser.id);

  return (
    <div className="admin-font">
      <PageHeader
        title={lang === 'ar' ? 'مركز الاشتراكات والتوثيق' : 'Subscriptions & Verification Center'}
        subtitle={lang === 'ar' ? 'فصل المتاجر عن الحسابات — خطط واضحة بالشيقل' : 'Separated Stores & Accounts — Clear ILS pricing'}
      />

      {successMsg && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
            <div className="text-2xl font-black text-blue-700">{activeStoresCount}</div>
            <div className="text-xs font-bold text-blue-900">{lang === 'ar' ? 'متجر مفعّل' : 'Active Stores'}</div>
            <div className="text-[11px] text-neutral-500">من أصل {stores.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
            <div className="text-2xl font-black text-sky-700">{verifiedAccountsCount}</div>
            <div className="text-xs font-bold text-sky-900">{lang === 'ar' ? 'حساب موثق' : 'Verified Accounts'}</div>
            <div className="text-[11px] text-neutral-500">من أصل {users.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <div className="text-2xl font-black text-amber-600">{users.filter(u => getVerificationTier(u.id) === 'gold').length}</div>
            <div className="text-xs font-bold text-amber-800">{lang === 'ar' ? 'علامة ذهبية' : 'Gold Badges'}</div>
          </div>
        </div>

        {/* Separation Notice */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center"><StoreIcon className="w-5 h-5 text-sky-300" /></div>
            <div>
              <div className="text-sm font-black">فصل كامل: المتاجر ≠ الحسابات</div>
              <div className="text-xs text-neutral-300">المتاجر للبيع والمنتجات — الحسابات للتواصل والتوثيق. كل قسم له اشتراك مستقل.</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/stores')} className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-black">قسم المتاجر 🏪</button>
            <button onClick={() => navigate('/accounts')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black">قسم الحسابات 👥</button>
          </div>
        </div>

        {/* Pricing Cards - 3 Plans */}
        <div>
          <h2 className="text-lg font-black text-black flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {lang === 'ar' ? 'خطط الاشتراك الشهرية (بالشيقل ₪)' : 'Monthly Plans (ILS ₪)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan 1: Store Activation 30₪ */}
            <div className="relative bg-white rounded-3xl border-2 border-blue-200 shadow-lg overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
              <div className="p-6 space-y-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl">🏪</div>
                <div>
                  <h3 className="text-base font-black text-black">تفعيل المتجر</h3>
                  <p className="text-xs text-neutral-500">Store Activation</p>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">تفعيل متجرك للبيع واستقبال الطلبات، عرض المنتجات في الاستكشاف، وربط الواتساب.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-blue-700">{pricing.storeActivationILS}</span>
                  <span className="text-sm font-bold text-blue-700">₪</span>
                  <span className="text-xs text-neutral-500">/ شهر</span>
                  <span className="ms-2 text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">≈ {formatPrice(pricing.storeActivationILS)}</span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>نشر منتجات غير محدود</span></li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>استقبال طلبات + دفع تجريبي</span></li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>ظهور في دليل المتاجر</span></li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>دعم فني أساسي</span></li>
                </ul>
              </div>
              <div className="p-4 bg-neutral-50 border-t">
                <div className="text-[11px] text-neutral-500 mb-2">اختر متجراً لتفعيله:</div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {stores.slice(0, 4).map(s => {
                    const active = isStoreActive(s.id);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200">
                        <div className="flex items-center gap-2">
                          <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-xs font-bold truncate max-w-[90px]">{s.name}</span>
                          {active ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">مفعّل</span> : <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-bold">منتهي</span>}
                        </div>
                        <button onClick={() => handleActivateStore(s.id)} disabled={active} className={`px-3 py-1 rounded-lg text-xs font-bold ${active ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                          {active ? 'مفعّل' : `تفعيل ${pricing.storeActivationILS}₪`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Plan 2: Account Verification 25₪ */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-200 shadow-lg overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 to-blue-400" />
              <div className="p-6 space-y-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center"><BadgeCheck className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-base font-black text-black">توثيق الحساب</h3>
                  <p className="text-xs text-neutral-500">Blue Verification</p>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">علامة التوثيق الزرقاء لحسابك، زيادة الثقة والظهور في البحث والريلز.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-sky-600">{pricing.accountVerificationILS}</span>
                  <span className="text-sm font-bold text-sky-600">₪</span>
                  <span className="text-xs text-neutral-500">/ شهر</span>
                  <span className="ms-2 text-[11px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold">≈ {formatPrice(pricing.accountVerificationILS)}</span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>شارة زرقاء ✓ بجوار الاسم</span></li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>أولوية في التعليقات والرسائل</span></li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /><span>حماية من انتحال الهوية</span></li>
                </ul>
                {currentTier === 'blue' && <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800 text-center">حسابك موثق حالياً ✓</div>}
              </div>
              <div className="p-4 bg-neutral-50 border-t">
                <button
                  onClick={() => handleVerify('blue')}
                  disabled={currentTier === 'blue'}
                  className={`w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${currentTier === 'blue' ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md'}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {currentTier === 'blue' ? 'أنت موثق ✓' : `توثيق الآن ${pricing.accountVerificationILS}₪ / شهر`}
                </button>
                {currentTier === 'gold' && <p className="text-[11px] text-center text-neutral-500 mt-2">لديك العلامة الذهبية — تشمل التوثيق الأزرق</p>}
              </div>
            </div>

            {/* Plan 3: Gold Badge 50₪ */}
            <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden flex flex-col text-white">
              <div className="absolute top-3 end-3 bg-white text-amber-600 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow"><Crown className="w-3.5 h-3.5" /> الأكثر تميزاً</div>
              <div className="p-6 space-y-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow"><Crown className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-base font-black">العلامة الزرقاء الذهبية</h3>
                  <p className="text-xs text-amber-100">Gold Blue Badge — Premium</p>
                  <p className="text-xs text-white mt-2 leading-relaxed opacity-90">الشارة الذهبية المميزة، أولوية قصوى في الاستكشاف، دعم VIP، وظهور مضاعف.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{pricing.goldBadgeILS}</span>
                  <span className="text-sm font-bold">₪</span>
                  <span className="text-xs text-amber-100">/ شهر</span>
                  <span className="ms-2 text-[11px] bg-white text-amber-600 px-2 py-0.5 rounded-full font-black">≈ {formatPrice(pricing.goldBadgeILS)}</span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-white" /><span>شارة ذهبية 👑 + زرقاء ✓</span></li>
                  <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-white" /><span>أولوية قصوى في الخوارزمية</span></li>
                  <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-white" /><span>دعم فني مميز VIP</span></li>
                  <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-white" /><span>ظهور في أعلى البحث</span></li>
                </ul>
                {currentTier === 'gold' && <div className="p-2 rounded-xl bg-white text-amber-700 text-xs font-black text-center">مُفعّل — أنت مميز 👑</div>}
              </div>
              <div className="p-4 bg-white/15 backdrop-blur border-t border-white/20">
                <button
                  onClick={() => handleVerify('gold')}
                  disabled={currentTier === 'gold'}
                  className={`w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 ${currentTier === 'gold' ? 'bg-white/40 text-white cursor-not-allowed' : 'bg-white text-amber-600 hover:bg-amber-50 shadow-md'}`}
                >
                  <Crown className="w-4 h-4" />
                  {currentTier === 'gold' ? 'مُفعّل 👑' : `تفعيل الذهبية ${pricing.goldBadgeILS}₪ / شهر`}
                </button>
                <p className="text-[11px] text-center text-white/80 mt-2">يشمل كل مزايا التوثيق الأزرق + الذهبي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
          <div className="p-5 border-b bg-neutral-50 flex items-center justify-between">
            <h3 className="font-black text-sm">مقارنة المتاجر vs الحسابات</h3>
            <span className="text-xs text-neutral-500">فصل واضح — لا خلط</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2"><StoreIcon className="w-5 h-5 text-blue-600" /><h4 className="font-black text-sm">قسم المتاجر 🏪</h4><span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">30₪/شهر</span></div>
              <p className="text-xs text-neutral-600 leading-relaxed">للبيع وعرض المنتجات، استقبال الطلبات، ربط واتساب، إدارة المخزون، والظهور في دليل المتاجر. بدون تفعيل = المتجر غير مرئي للشراء.</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">{activeStoresCount} مفعّل</span>
                <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-bold border border-red-200">{stores.length - activeStoresCount} منتهي</span>
                <button onClick={() => navigate('/stores')} className="ms-auto text-blue-600 font-bold hover:underline">عرض المتاجر →</button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-sky-600" /><h4 className="font-black text-sm">قسم الحسابات 👥</h4><span className="text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full font-bold">25₪</span><span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">50₪ ذهبية</span></div>
              <p className="text-xs text-neutral-600 leading-relaxed">للأفراد والمبدعين: علامة زرقاء (25₪) للتوثيق، أو ذهبية (50₪) للتميز والأولوية. بدون توثيق = حساب عادي بدون شارة.</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold border border-sky-200">{verifiedAccountsCount} موثق</span>
                <span className="px-2 py-1 rounded-lg bg-neutral-100 text-neutral-600 font-bold">{users.length - verifiedAccountsCount} عادي</span>
                <button onClick={() => navigate('/accounts')} className="ms-auto text-sky-600 font-bold hover:underline">عرض الحسابات →</button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-bold">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
