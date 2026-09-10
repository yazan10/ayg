import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Heart, 
  Share2, 
  ShoppingBag, 
  Phone, 
  Check, 
  Send, 
  Star, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProductModal, 
    setActiveProductModal, 
    stores, 
    setActiveStoreModal, 
    addToCart, 
    likedProducts, 
    toggleLikeProduct, 
    lang, 
    t 
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'sara_k', text: lang === 'ar' ? 'ما شاء الله الجودة ممتازة وثابت جداً!' : 'Super high quality and long lasting!', time: 'منذ يومين' },
    { id: '2', user: 'ahmed_r', text: lang === 'ar' ? 'هل التوصيل متوفر للرياض بنفس اليوم؟' : 'Is same-day delivery available in Riyadh?', time: 'منذ 3 ساعات' }
  ]);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeProductModal) return null;

  const store = stores.find(s => s.id === activeProductModal.storeId);
  const isLiked = likedProducts.includes(activeProductModal.id);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'you',
        text: commentText.trim(),
        time: lang === 'ar' ? 'الآن' : 'Just now'
      }
    ]);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-white sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side (Image Gallery) */}
        <div className="md:w-1/2 bg-neutral-100 flex flex-col justify-between relative select-none">
          <div className="relative aspect-square w-full">
            <img
              src={activeProductModal.images[activeImageIndex] || activeProductModal.images[0]}
              alt={activeProductModal.name}
              className="w-full h-full object-cover"
            />
            {/* Discount Badge */}
            {activeProductModal.originalPrice && (
              <div className="absolute top-3 start-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">
                {Math.round(((activeProductModal.originalPrice - activeProductModal.price) / activeProductModal.originalPrice) * 100)}% {lang === 'ar' ? 'خصم' : 'OFF'}
              </div>
            )}
          </div>

          {/* Multiple Image Thumbnails */}
          {activeProductModal.images.length > 1 && (
            <div className="p-2.5 flex items-center gap-2 overflow-x-auto bg-white border-t border-neutral-200">
              {activeProductModal.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-blue-600 ring-1 ring-blue-600' : 'border-neutral-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side (Details & Checkout Action) */}
        <div className="md:w-1/2 flex flex-col justify-between p-5 overflow-y-auto max-h-[85vh]">
          <div className="space-y-4">
            {/* Header with Store Handle & Close Button */}
            <div className="flex items-center justify-between border-b pb-3">
              <div 
                onClick={() => {
                  if (store) {
                    setActiveProductModal(null);
                    setActiveStoreModal(store);
                  }
                }}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <img
                  src={store?.avatar}
                  alt={store?.name}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div>
                  <p className="text-xs font-bold text-black group-hover:text-blue-600 flex items-center gap-1">
                    <span>{store ? (lang === 'ar' ? store.name : store.nameEn) : 'Store'}</span>
                    {store?.verified && <span className="text-blue-500 text-[10px]">✓</span>}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">@{store?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleLikeProduct(activeProductModal.id)}
                  className="p-1.5 text-neutral-700 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-neutral-700 hover:text-black transition-colors"
                >
                  {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setActiveProductModal(null)}
                  className="p-1.5 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Title & Pricing */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {activeProductModal.category}
              </span>
              <h2 className="text-base font-black text-black leading-snug">
                {lang === 'ar' ? activeProductModal.name : activeProductModal.nameEn}
              </h2>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-black text-blue-700">
                  {activeProductModal.price} {activeProductModal.currency}
                </span>
                {activeProductModal.originalPrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    {activeProductModal.originalPrice} {activeProductModal.currency}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 leading-relaxed">
              {lang === 'ar' ? activeProductModal.description : activeProductModal.descriptionEn}
            </p>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'ar' ? 'ضمان أصلي 100%' : '100% Authentic'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{lang === 'ar' ? 'شحن سريع ومباشر' : 'Fast Courier'}</span>
              </div>
            </div>

            {/* Instagram Style Comments Section */}
            <div className="border-t border-neutral-100 pt-3 space-y-2">
              <h4 className="text-xs font-bold text-black">
                {lang === 'ar' ? 'استفسارات وتقييمات المشترين' : 'Inquiries & Reviews'}
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                {comments.map(c => (
                  <div key={c.id} className="text-xs">
                    <span className="font-bold text-neutral-900 me-1.5 font-mono">@{c.user}</span>
                    <span className="text-neutral-700">{c.text}</span>
                    <span className="text-[10px] text-neutral-400 ms-2">{c.time}</span>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder={t.postProductComment}
                  className="flex-1 text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 text-black"
                />
                <button
                  type="submit"
                  className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="border-t border-neutral-200 pt-4 mt-4 space-y-2">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700">{lang === 'ar' ? 'الكمية' : 'Quantity'}</span>
              <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-200"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-black font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons: Add to Cart & Buy Now */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  addToCart(activeProductModal, quantity);
                  setActiveProductModal(null);
                }}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>{t.addToCart}</span>
              </button>

              <button
                onClick={() => {
                  addToCart(activeProductModal, quantity);
                  setActiveProductModal(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/10 transition-all active:scale-98"
              >
                <span>{t.buyNow}</span>
              </button>
            </div>

            {/* Direct WhatsApp inquiry */}
            {store && (
              <a
                href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  lang === 'ar'
                    ? `مرحباً، أود طلب المنتج: ${activeProductModal.name} (${activeProductModal.price} ${activeProductModal.currency})`
                    : `Hello, I'd like to order: ${activeProductModal.nameEn} (${activeProductModal.price} ${activeProductModal.currency})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'طلب مباشر وسريع عبر الواتساب' : 'Direct Order via WhatsApp'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
