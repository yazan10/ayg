import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Grid, ShoppingBag, Share2, Check, Phone, Globe, Crown, Clock, AlertCircle, Zap } from 'lucide-react';
import { StarDisplay, StarRating } from '../components/ui/StarRating';
import { VerificationBadge } from '../components/ui/VerificationBadge';

export const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { stores, products, addToCart, lang, t, isStoreActive, activateStoreSubscription, adminSettings } = useStore();
  const store = stores.find(s => s.id === storeId);
  const isActive = store ? isStoreActive(store.id) : false;

  const [activeTab, setActiveTab] = useState<'grid' | 'catalog'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [userRating, setUserRating] = useState(0);

  if (!store) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'المتجر غير موجود' : 'Store not found'} />
        <div className="p-8 text-center text-sm text-neutral-500">المتجر غير موجود</div>
      </div>
    );
  }

  const storeProducts = products.filter(p => p.storeId === store.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <PageHeader
        title={`@${store.username}`}
        subtitle={lang === 'ar' ? store.name : store.nameEn}
        actions={
          <>
            <button onClick={handleShare} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700">
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </>
        }
      />

      <div className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto w-full">
        {/* Header Stats & Avatar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full p-[2.5px] story-ring">
              <div className="w-full h-full rounded-full p-[2px] bg-white">
                <img src={store.avatar} alt={store.name} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <span className="block text-base font-black text-neutral-900">{storeProducts.length}</span>
              <span className="text-[11px] text-neutral-500 font-medium">{lang === 'ar' ? 'المنتجات' : 'Products'}</span>
            </div>
            <div>
              <span className="block text-base font-black text-neutral-900">{(store.followersCount + (isFollowing ? 1 : 0)).toLocaleString()}</span>
              <span className="text-[11px] text-neutral-500 font-medium">{lang === 'ar' ? 'المتابعون' : 'Followers'}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <StarDisplay rating={store.rating} size="sm" showValue={true} />
              <span className="text-[11px] text-neutral-500 font-medium">{lang === 'ar' ? 'التقييم' : 'Rating'}</span>
            </div>
          </div>
        </div>

        {/* فصل المتاجر: شارة الاشتراك */}
        <div className={`p-3 rounded-2xl border-2 flex items-center justify-between ${isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
              {isActive ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            </div>
            <div>
              <div className={`text-xs font-black ${isActive ? 'text-emerald-800' : 'text-red-800'}`}>
                {isActive ? (lang === 'ar' ? 'متجر مفعّل ✓' : 'Active Store ✓') : (lang === 'ar' ? 'متجر غير مفعّل' : 'Inactive Store')}
              </div>
              <div className="text-[11px] text-neutral-600">
                {isActive
                  ? store.subscription?.expiresAt
                    ? `${lang === 'ar' ? 'متبقي' : 'Expires in'} ${Math.ceil((new Date(store.subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ${lang === 'ar' ? 'يوم' : 'days'} • ${store.subscription.pricePaidILS}₪/شهر`
                    : 'مفعّل'
                  : `${lang === 'ar' ? 'يحتاج تفعيل' : 'Needs activation'} • ${adminSettings.subscriptionPricing.storeActivationILS}₪/شهر`}
              </div>
            </div>
          </div>
          {!isActive ? (
            <button onClick={() => { activateStoreSubscription(store.id); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow">
              <Zap className="w-3.5 h-3.5" />{lang === 'ar' ? `تفعيل ${adminSettings.subscriptionPricing.storeActivationILS}₪` : `Activate ${adminSettings.subscriptionPricing.storeActivationILS}₪`}
            </button>
          ) : (
            <span className="text-[11px] font-bold bg-white border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1"><Crown className="w-3 h-3" />قسم المتاجر</span>
          )}
        </div>

        {/* Interactive Rating - Design System */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-black">{lang === 'ar' ? 'قيّم هذا المتجر' : 'Rate this store'}</span>
            <span className="text-[11px] text-neutral-500">{lang === 'ar' ? 'اضغط على النجوم للتقييم' : 'Tap stars to rate'}</span>
          </div>
          <StarRating value={userRating} onChange={setUserRating} size="md" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-black flex items-center gap-1.5">
            <span>{lang === 'ar' ? store.name : store.nameEn}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">
              {lang === 'ar' ? store.category : store.categoryEn}
            </span>
            {store.verified && isActive && <VerificationBadge verified={store.verified} size="sm" />}
            {store.verified && !isActive && <span className="opacity-50"><VerificationBadge verified={store.verified} size="sm" /></span>}
          </h3>
          <p className="text-xs text-neutral-700 leading-relaxed">{lang === 'ar' ? store.bio : store.bioEn}</p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-1 flex-wrap">
            <span>📍 {lang === 'ar' ? store.location : store.locationEn}</span>
            {store.website && (
              <a href={store.website} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                <Globe className="w-3 h-3" /><span>{store.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${isFollowing ? 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
          >
            {isFollowing ? (lang === 'ar' ? 'متابع ✓' : 'Following ✓') : (lang === 'ar' ? 'متابعة' : 'Follow')}
          </button>
          <a
            href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lang === 'ar' ? `مرحباً، أود الاستفسار عن منتجات ${store.name}` : `Hello, I'd like to inquire about ${store.nameEn}`)}`}
            target="_blank" rel="noreferrer"
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" /><span>{t.contactWhatsapp}</span>
          </a>
        </div>

        {store.highlights && store.highlights.length > 0 && (
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {store.highlights.map(hl => (
                <div key={hl.id} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-14 h-14 rounded-full p-[2px] border border-neutral-300">
                    <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100">
                      <img src={hl.coverImage} alt={hl.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-600 font-bold truncate max-w-[60px] text-center">{lang === 'ar' ? hl.title : hl.titleEn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-neutral-200 flex items-center justify-around text-neutral-500 pt-2">
          <button onClick={() => setActiveTab('grid')} className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-bold border-b-2 ${activeTab === 'grid' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-black'}`}>
            <Grid className="w-4 h-4" /><span>{lang === 'ar' ? 'الشبكة' : 'Grid'}</span>
          </button>
          <button onClick={() => setActiveTab('catalog')} className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-bold border-b-2 ${activeTab === 'catalog' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-black'}`}>
            <ShoppingBag className="w-4 h-4" /><span>{lang === 'ar' ? 'الكتالوج' : 'Catalog'}</span>
          </button>
        </div>

        {activeTab === 'grid' && (
          <div className="grid grid-cols-3 gap-1 pt-1">
            {storeProducts.map(product => (
              <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="relative aspect-square bg-neutral-100 cursor-pointer overflow-hidden group">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs p-1 text-center">
                  <span>{product.price} {product.currency}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-3 pt-1">
            {storeProducts.map(product => (
              <div key={product.id} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 hover:border-blue-300 transition-colors">
                <div onClick={() => navigate(`/product/${product.id}`)} className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                  <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-lg object-cover border border-neutral-200 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-black truncate">{lang === 'ar' ? product.name : product.nameEn}</h4>
                    <p className="text-xs font-black text-blue-600 mt-0.5">{product.price} {product.currency}</p>
                    <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">{lang === 'ar' ? product.description : product.descriptionEn}</p>
                  </div>
                </div>
                <button onClick={() => addToCart(product, 1)} className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shrink-0 shadow-xs" title={t.addToCart}>
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
