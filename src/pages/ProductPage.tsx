import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Heart, Share2, ShoppingBag, Phone, Check, Send, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { StarRating, StarDisplay } from '../components/ui/StarRating';

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, stores, addToCart, likedProducts, toggleLikeProduct, addComment, comments, currentUser, toggleLikeComment, lang, t } = useStore();
  const product = products.find(p => p.id === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [productRating, setProductRating] = useState(4);

  if (!product) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'} />
        <div className="p-8 text-center text-sm text-neutral-500">{lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</div>
      </div>
    );
  }

  const store = stores.find(s => s.id === product.storeId);
  const isLiked = likedProducts.includes(product.id);
  const productComments = comments.filter(c => c.targetId === product.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(product.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title={lang === 'ar' ? product.name : product.nameEn}
        subtitle={`${product.price} ${product.currency}`}
        actions={
          <>
            <button onClick={() => toggleLikeProduct(product.id)} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700">
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700">
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
          </>
        }
      />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 p-0 md:p-6">
        {/* Gallery */}
        <div className="bg-neutral-100 flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden bg-white md:rounded-2xl border border-neutral-200">
            <img src={product.images[activeImageIndex] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            {product.originalPrice && (
              <div className="absolute top-3 start-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% {lang === 'ar' ? 'خصم' : 'OFF'}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="p-2.5 flex items-center gap-2 overflow-x-auto bg-white border-t border-neutral-200 md:rounded-xl md:mt-3">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${activeImageIndex === idx ? 'border-blue-600 ring-1 ring-blue-600' : 'border-neutral-200 opacity-60'}`}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col p-5 space-y-4 bg-white md:rounded-2xl md:border md:border-neutral-200 md:shadow-sm">
          <div onClick={() => store && navigate(`/store/${store.id}`)} className="flex items-center gap-2.5 cursor-pointer group border-b pb-3">
            <img src={store?.avatar} alt={store?.name} className="w-10 h-10 rounded-full object-cover border" />
            <div className="flex-1">
              <p className="text-sm font-bold text-black group-hover:text-blue-600 flex items-center gap-1">
                <span>{store ? (lang === 'ar' ? store.name : store.nameEn) : 'Store'}</span>
                {store?.verified && <span className="text-blue-500 text-xs">✓</span>}
              </p>
              <p className="text-xs text-neutral-500 font-mono">@{store?.username}</p>
            </div>
            <span className="text-xs font-bold text-blue-600">{t.viewStore}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{product.category}</span>
            <h2 className="text-lg font-black text-black leading-snug">{lang === 'ar' ? product.name : product.nameEn}</h2>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-blue-700">{product.price} {product.currency}</span>
              {product.originalPrice && <span className="text-sm text-neutral-400 line-through">{product.originalPrice} {product.currency}</span>}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <StarDisplay rating={productRating} size="sm" showValue={true} />
              <span>•</span>
              <span>{product.salesCount} {lang === 'ar' ? 'مبيعات' : 'sales'}</span>
              <span>•</span>
              <span className={product.inStock ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{product.inStock ? t.inStock : t.outOfStock}</span>
              <span>•</span>
              <span className="flex items-center gap-1">{product.likes} {t.likesCount}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-black text-amber-800">{lang === 'ar' ? 'قيّم المنتج' : 'Rate this product'}</span>
              <StarRating value={productRating} onChange={setProductRating} size="sm" />
            </div>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">{lang === 'ar' ? product.description : product.descriptionEn}</p>

          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /><span>{lang === 'ar' ? 'ضمان أصلي 100%' : '100% Authentic'}</span></div>
            <div className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-blue-600" /><span>{lang === 'ar' ? 'شحن سريع ومباشر' : 'Fast Courier'}</span></div>
          </div>

          {/* Comments */}
          <div className="border-t border-neutral-100 pt-4 space-y-3">
            <Link to={`/comments/${product.id}`} className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-black flex items-center gap-2"><MessageCircle className="w-4 h-4 text-blue-600" />{lang === 'ar' ? 'التعليقات' : 'Comments'} ({productComments.length})</h4>
              <span className="text-xs text-blue-600 font-bold">{lang === 'ar' ? 'عرض الكل' : 'View all'}</span>
            </Link>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {productComments.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-start justify-between gap-2 text-xs bg-neutral-50 p-2 rounded-xl">
                  <div className="flex gap-2 flex-1">
                    <img src={c.userAvatar} alt={c.username} className="w-7 h-7 rounded-full object-cover border" />
                    <div>
                      <p className="text-black"><span className="font-bold me-1">@{c.username}</span><span className="text-neutral-700">{c.text}</span></p>
                      <span className="text-[10px] text-neutral-400">{c.createdAt}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleLikeComment(c.id)} className="p-1 text-neutral-400 hover:text-red-500"><Heart className={`w-4 h-4 ${c.isLiked ? 'fill-red-500 text-red-500' : ''}`} /></button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border shrink-0" />
              <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t.postProductComment} className="flex-1 text-sm p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-600 text-black" />
              <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"><Send className="w-4 h-4" /></button>
            </form>
          </div>

          {/* Actions */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-700">{lang === 'ar' ? 'الكمية' : 'Quantity'}</span>
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1.5 text-sm font-bold hover:bg-neutral-200">-</button>
                <span className="px-4 py-1.5 text-sm font-bold text-black font-mono">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1.5 text-sm font-bold hover:bg-neutral-200">+</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => addToCart(product, quantity)} className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-xl text-sm font-bold flex items-center justify-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-blue-600" /><span>{t.addToCart}</span>
              </button>
              <button onClick={() => { addToCart(product, quantity); navigate('/cart'); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md">
                {t.buyNow}
              </button>
            </div>
            {store && (
              <a href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lang === 'ar' ? `مرحباً، أود طلب المنتج: ${product.name} (${product.price} ${product.currency})` : `Hello, I'd like to order: ${product.nameEn} (${product.price} ${product.currency})`)}`} target="_blank" rel="noreferrer" className="w-full py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1.5">
                <Phone className="w-4 h-4" /><span>{lang === 'ar' ? 'طلب مباشر عبر الواتساب' : 'Direct Order via WhatsApp'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
