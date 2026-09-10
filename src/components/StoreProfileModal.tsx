import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Grid, 
  ShoppingBag, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Check, 
  Star, 
  Phone, 
  Globe, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { Store, Product } from '../types';

export const StoreProfileModal: React.FC = () => {
  const { 
    activeStoreModal, 
    setActiveStoreModal, 
    products, 
    setActiveProductModal, 
    addToCart,
    lang, 
    t 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'grid' | 'catalog' | 'info'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeStoreModal) return null;

  const storeProducts = products.filter(p => p.storeId === activeStoreModal.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Username & Close */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-neutral-900">
              @{activeStoreModal.username}
            </span>
            {activeStoreModal.verified && (
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Share"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setActiveStoreModal(null)}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Header Stats & Avatar */}
          <div className="flex items-center justify-between gap-4">
            {/* Avatar with Story Ring */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full p-[2.5px] story-ring">
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <img
                    src={activeStoreModal.avatar}
                    alt={activeStoreModal.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 3 Stats Columns (Instagram layout) */}
            <div className="flex-1 flex items-center justify-around text-center">
              <div>
                <span className="block text-base font-black text-neutral-900">
                  {storeProducts.length}
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {lang === 'ar' ? 'المنتجات' : 'Products'}
                </span>
              </div>

              <div>
                <span className="block text-base font-black text-neutral-900">
                  {(activeStoreModal.followersCount + (isFollowing ? 1 : 0)).toLocaleString()}
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {lang === 'ar' ? 'المتابعون' : 'Followers'}
                </span>
              </div>

              <div>
                <span className="block text-base font-black text-neutral-900 flex items-center justify-center gap-0.5">
                  <span>{activeStoreModal.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {lang === 'ar' ? 'التقييم' : 'Rating'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-black flex items-center gap-1.5">
              <span>{lang === 'ar' ? activeStoreModal.name : activeStoreModal.nameEn}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">
                {lang === 'ar' ? activeStoreModal.category : activeStoreModal.categoryEn}
              </span>
            </h3>

            <p className="text-xs text-neutral-700 leading-relaxed">
              {lang === 'ar' ? activeStoreModal.bio : activeStoreModal.bioEn}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-1">
              <span>📍 {lang === 'ar' ? activeStoreModal.location : activeStoreModal.locationEn}</span>
              {activeStoreModal.website && (
                <a
                  href={activeStoreModal.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                >
                  <Globe className="w-3 h-3" />
                  <span>{activeStoreModal.website.replace('https://', '')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons: Follow & WhatsApp */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                isFollowing
                  ? 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              {isFollowing ? (lang === 'ar' ? 'متابع ✓' : 'Following ✓') : (lang === 'ar' ? 'متابعة' : 'Follow')}
            </button>

            <a
              href={`https://wa.me/${activeStoreModal.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                lang === 'ar' ? `مرحباً، أود الاستفسار عن منتجات ${activeStoreModal.name}` : `Hello, I'd like to inquire about ${activeStoreModal.nameEn}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.contactWhatsapp}</span>
            </a>
          </div>

          {/* Instagram Story Highlights */}
          {activeStoreModal.highlights && activeStoreModal.highlights.length > 0 && (
            <div className="pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                {activeStoreModal.highlights.map(hl => (
                  <div key={hl.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                    <div className="w-14 h-14 rounded-full p-[2px] border border-neutral-300 group-hover:border-blue-600 transition-colors">
                      <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100">
                        <img src={hl.coverImage} alt={hl.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-600 font-bold truncate max-w-[60px] text-center">
                      {lang === 'ar' ? hl.title : hl.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Switcher (Grid vs Catalog vs Info) */}
          <div className="border-t border-neutral-200 flex items-center justify-around text-neutral-500 pt-2">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'grid' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-black'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الشبكة' : 'Grid'}</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'catalog' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-black'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الكتالوج' : 'Catalog'}</span>
            </button>
          </div>

          {/* TAB 1: 3-Column Instagram Product Grid */}
          {activeTab === 'grid' && (
            <div className="grid grid-cols-3 gap-1 pt-1">
              {storeProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => setActiveProductModal(product)}
                  className="relative aspect-square bg-neutral-100 cursor-pointer overflow-hidden group select-none"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Price Tag badge on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs p-1 text-center">
                    <span>{product.price} {product.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Detailed Catalog Cards */}
          {activeTab === 'catalog' && (
            <div className="space-y-3 pt-1">
              {storeProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                >
                  <div 
                    onClick={() => setActiveProductModal(product)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">
                        {lang === 'ar' ? product.name : product.nameEn}
                      </h4>
                      <p className="text-xs font-black text-blue-600 mt-0.5">
                        {product.price} {product.currency}
                      </p>
                      <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                        {lang === 'ar' ? product.description : product.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-transform active:scale-95 shrink-0 shadow-xs"
                    title={t.addToCart}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
