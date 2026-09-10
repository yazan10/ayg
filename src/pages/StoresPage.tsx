import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Store as StoreIcon, Check, Clock, AlertCircle, Zap, Crown, ShoppingBag, Search, Filter } from 'lucide-react';
import { StarDisplay } from '../components/ui/StarRating';

export const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { stores, products, lang, isStoreActive, adminSettings } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [search, setSearch] = useState('');

  const activeStores = stores.filter(s => isStoreActive(s.id));
  const expiredStores = stores.filter(s => !isStoreActive(s.id));

  const filtered = stores.filter(s => {
    const matchesFilter = filter === 'all' ? true : filter === 'active' ? isStoreActive(s.id) : !isStoreActive(s.id);
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getExpiryText = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store?.subscription?.expiresAt) return lang === 'ar' ? 'غير مفعّل' : 'Not activated';
    const diff = new Date(store.subscription.expiresAt).getTime() - Date.now();
    if (diff <= 0) return lang === 'ar' ? 'منتهي' : 'Expired';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return lang === 'ar' ? `متبقي ${days} يوم` : `${days} days left`;
  };

  return (
    <div>
      <PageHeader
        title={lang === 'ar' ? 'قسم المتاجر' : 'Stores Section'}
        subtitle={lang === 'ar' ? `قسم مستقل — ${activeStores.length} مفعّل من ${stores.length} • التفعيل ${adminSettings.subscriptionPricing.storeActivationILS}₪ شهرياً` : `Separated — ${activeStores.length}/${stores.length} active • ${adminSettings.subscriptionPricing.storeActivationILS} ILS/month`}
        actions={<button onClick={() => navigate('/pricing')} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"><Crown className="w-3.5 h-3.5" />{lang === 'ar' ? 'الأسعار' : 'Pricing'}</button>}
      />

      <div className="max-w-5xl lg:max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Info Banner */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
          <StoreIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-black text-blue-900">قسم المتاجر منفصل تماماً عن الحسابات.</span>
            <span className="text-blue-800"> كل متجر يحتاج تفعيل شهري 30₪ ليكون مرئياً وقابلاً للبيع. المتاجر المنتهية تظهر باهتة ولا تستقبل طلبات.</span>
            <button onClick={() => navigate('/pricing')} className="ms-2 text-blue-700 font-black hover:underline">عرض خطط التفعيل →</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-center">
            <div className="text-xl font-black text-neutral-900">{stores.length}</div>
            <div className="text-xs font-bold text-neutral-600">إجمالي المتاجر</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-xl font-black text-emerald-700">{activeStores.length}</div>
            <div className="text-xs font-bold text-emerald-800">مفعّلة ✓</div>
          </div>
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
            <div className="text-xl font-black text-red-600">{expiredStores.length}</div>
            <div className="text-xs font-bold text-red-700">منتهية / غير مفعّلة</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'ar' ? 'ابحث عن متجر...' : 'Search stores...'} className="w-full ps-10 pe-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm outline-none focus:border-blue-600" />
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${filter === 'all' ? 'bg-white shadow text-black' : 'text-neutral-500'}`}>الكل ({stores.length})</button>
            <button onClick={() => setFilter('active')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${filter === 'active' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-500'}`}>مفعّلة ({activeStores.length})</button>
            <button onClick={() => setFilter('expired')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${filter === 'expired' ? 'bg-red-600 text-white shadow' : 'text-neutral-500'}`}>منتهية ({expiredStores.length})</button>
          </div>
        </div>

        {/* Stores Grid - Separated Section */}
        <div>
          <h3 className="font-black text-sm mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            {filter === 'all' ? 'جميع المتاجر — قسم مستقل' : filter === 'active' ? 'المتاجر المفعّلة فقط' : 'المتاجر المنتهية — تحتاج تفعيل 30₪'}
            <span className="text-xs font-normal text-neutral-500">({filtered.length})</span>
          </h3>

          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-neutral-200">
              <StoreIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">لا توجد متاجر بهذا الفلتر</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(store => {
                const active = isStoreActive(store.id);
                const prods = products.filter(p => p.storeId === store.id);
                return (
                  <div key={store.id} className={`relative bg-white rounded-2xl border-2 overflow-hidden flex flex-col ${active ? 'border-emerald-200 shadow-sm' : 'border-red-200 shadow-sm opacity-85'}`}>
                    {/* Status Ribbon */}
                    <div className={`absolute top-0 inset-x-0 h-1 ${active ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    {/* Header */}
                    <div className="p-4 flex items-start gap-3">
                      <img src={store.avatar} alt={store.name} className={`w-14 h-14 rounded-2xl object-cover border-2 ${active ? 'border-emerald-200' : 'border-red-200 grayscale'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-black text-sm text-black truncate">{lang === 'ar' ? store.name : store.nameEn}</h4>
                          {store.verified && active && <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>}
                          {active ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1"><Check className="w-3 h-3" />مفعّل</span> : <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />منتهي</span>}
                        </div>
                        <p className="text-xs text-neutral-500 font-mono">@{store.username}</p>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{lang === 'ar' ? store.bio : store.bioEn}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <StarDisplay rating={store.rating} size="sm" showValue={true} />
                          <span className="text-neutral-300">•</span>
                          <span className="text-neutral-600">{store.followersCount.toLocaleString()} متابع</span>
                          <span className="text-neutral-300">•</span>
                          <span className="font-bold text-neutral-800">{prods.length} منتج</span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div className={`mx-4 p-2.5 rounded-xl border flex items-center justify-between ${active ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2 text-xs">
                        {active ? <Clock className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                        <span className={`font-bold ${active ? 'text-emerald-800' : 'text-red-800'}`}>{getExpiryText(store.id)}</span>
                        {store.subscription && <span className="text-[11px] text-neutral-500">• {store.subscription.pricePaidILS}₪/شهر</span>}
                      </div>
                      <span className={`text-[11px] font-black px-2 py-1 rounded-full ${active ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                        {active ? 'نشط' : 'يحتاج 30₪'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="p-4 flex gap-2 mt-auto">
                      <button onClick={() => navigate(`/store/${store.id}`)} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${active ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'}`}>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {active ? 'عرض المتجر' : 'عرض (غير مفعّل)'}
                      </button>
                      {!active && (
                        <button onClick={() => navigate('/pricing')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> تفعيل 30₪
                        </button>
                      )}
                    </div>

                    {!active && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">متجر غير مفعّل — 30₪/شهر للتفعيل</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm">
            <span className="font-black">هل تريد فتح متجر جديد؟</span>
            <span className="text-neutral-400 text-xs ms-2">التفعيل 30₪ شهرياً بعد الإنشاء</span>
          </div>
          <button onClick={() => navigate('/create-store')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black">إنشاء متجر جديد +</button>
        </div>
      </div>
    </div>
  );
};
