import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PostSkeleton } from './skeletons/PostSkeleton';
import { useSkeletonLoading } from '../hooks/useSkeletonLoading';
import { SuccessToast } from './ui/SuccessMessageCard';
import { ReportModal } from './ui/ReportModal';
import { BlockConfirmModal } from './ui/BlockConfirmModal';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ShoppingBag,
  MoreHorizontal,
  Share2,
  Check,
  UserPlus,
  UserMinus,
  Ban,
  Flag,
  EyeOff,
} from 'lucide-react';
import { Product } from '../types';

export const InstagramFeed: React.FC = () => {
  const navigate = useNavigate();
  const {
    stores,
    likedProducts,
    savedProducts,
    toggleLikeProduct,
    toggleSaveProduct,
    addToCart,
    startDirectMessage,
    toggleFollowUser,
    blockUser,
    isBlocked,
    reportTarget,
    getFilteredProducts,
    users,
    lang,
    t,
  } = useStore();

  const products = getFilteredProducts();
  const isLoading = useSkeletonLoading(1400, [products.length]);
  const [doubleTapId, setDoubleTapId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeMore, setActiveMore] = useState<string | null>(null);
  const [reportTargetData, setReportTargetData] = useState<{ id: string; name: string; username: string; avatar: string; type: 'product' | 'store' } | null>(null);
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string; username: string; avatar: string } | null>(null);

  const handleDoubleTap = (productId: string) => {
    toggleLikeProduct(productId);
    setDoubleTapId(productId);
    setTimeout(() => {
      setDoubleTapId(null);
    }, 800);
  };

  const handleShare = (product: Product) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(product.id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-3 sm:space-y-6 pb-12 sm:pb-16">
        <PostSkeleton count={3} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-3">
          <EyeOff className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-sm font-bold text-black">{lang === 'ar' ? 'لا توجد منشورات' : 'No posts'}</p>
        <p className="text-xs text-neutral-500 mt-1">{lang === 'ar' ? 'قد تكون قمت بحظر بعض الحسابات أو لا يوجد محتوى حالياً.' : 'You may have blocked accounts or no content yet.'}</p>
      </div>
    );
  }

  return (
    <>
      <SuccessToast
        isVisible={showSuccessToast}
        message="تم إرسال رسالتك بنجاح"
        subText="سيتواصل معك المتجر قريباً عبر الرسائل"
        onClose={() => setShowSuccessToast(false)}
      />

      <div className="w-full max-w-xl mx-auto space-y-3 sm:space-y-6 pb-12 sm:pb-16">
        {products.map(product => {
          const store = stores.find(s => s.id === product.storeId);
          const storeOwner = store ? users.find(u => u.id === store.ownerId) : null;
          const targetUserId = storeOwner?.id || store?.id || product.storeId;
          const targetUsername = store?.username || product.storeId;
          const isLiked = likedProducts.includes(product.id);
          const isSaved = savedProducts.includes(product.id);
          const isFollowing = store ? users.find(u => u.id === store.id)?.isFollowing : false;

          return (
            <article key={product.id} className="bg-white pt-3 pb-5 border-y sm:border sm:rounded-2xl border-neutral-200/90 shadow-xs overflow-hidden">
              {/* Post Header: Store info + Follow */}
              <div className="px-4 py-2 flex items-center justify-between">
                <div
                  onClick={() => store && navigate(`/store/${store.id}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full p-[2px] story-ring transition-transform group-hover:scale-105">
                    <div className="w-full h-full rounded-full p-[1.5px] bg-white">
                      <img
                        src={store?.avatar || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=100'}
                        alt={store?.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-black leading-none group-hover:text-blue-600 transition-colors">
                        {store ? (lang === 'ar' ? store.name : store.nameEn) : 'Store'}
                      </span>
                      {store?.verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                      @{store?.username || 'store'} • {store ? (lang === 'ar' ? store.location.split('،')[0] : store.locationEn.split(',')[0]) : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => {
                      if (store && targetUserId) {
                        toggleFollowUser(targetUserId);
                      }
                    }}
                    className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${isFollowing ? 'bg-white border-neutral-200 text-black' : 'bg-blue-600 border-blue-600 text-white'}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-3 h-3" />
                        {lang === 'ar' ? 'إلغاء' : 'Unfollow'}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        {lang === 'ar' ? 'متابعة' : 'Follow'}
                      </>
                    )}
                  </button>
                  <button onClick={() => setActiveMore(activeMore === product.id ? null : product.id)} className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {activeMore === product.id && (
                    <div className="absolute top-8 end-0 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-20">
                      <button
                        onClick={() => {
                          setActiveMore(null);
                          if (store) {
                            toggleFollowUser(targetUserId);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-neutral-50 text-start text-xs font-bold"
                      >
                        {isFollowing ? <UserMinus className="w-4 h-4 text-neutral-600" /> : <UserPlus className="w-4 h-4 text-blue-600" />}
                        {isFollowing ? (lang === 'ar' ? 'إلغاء المتابعة' : 'Unfollow') : (lang === 'ar' ? 'متابعة' : 'Follow')}
                      </button>
                      <button
                        onClick={() => {
                          setActiveMore(null);
                          if (store) {
                            setBlockTarget({ id: targetUserId, name: store.name, username: store.username, avatar: store.avatar });
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 text-red-600 text-start text-xs font-bold border-t border-neutral-100"
                      >
                        <Ban className="w-4 h-4" />
                        {lang === 'ar' ? 'حظر الحساب' : 'Block'}
                      </button>
                      <button
                        onClick={() => {
                          setActiveMore(null);
                          if (store) {
                            setReportTargetData({ id: store.id, name: store.name, username: store.username, avatar: store.avatar, type: 'store' });
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 text-red-600 text-start text-xs font-bold border-t border-neutral-100"
                      >
                        <Flag className="w-4 h-4" />
                        {lang === 'ar' ? 'إبلاغ' : 'Report'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Media Container with Double-Tap Heart */}
              <div
                className="relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer select-none"
                onDoubleClick={() => handleDoubleTap(product.id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                />

                {/* Price Tag Overlay (Instagram Shopping Style) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                  className="absolute bottom-3 start-3 bg-black/85 hover:bg-black text-white px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer z-10"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold">{product.price} {product.currency}</span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-neutral-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Double-Tap Heart Burst Animation */}
                {doubleTapId === product.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in-50 fade-in duration-300">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                      <Heart className="w-16 h-16 fill-red-500 text-red-500 drop-shadow-lg" />
                    </div>
                  </div>
                )}
              </div>

              {/* Post Interaction Bar */}
              <div className="px-4 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Heart / Like Button */}
                  <button
                    onClick={() => toggleLikeProduct(product.id)}
                    className="transition-transform active:scale-125 focus:outline-none"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-black hover:text-neutral-600'
                      }`}
                    />
                  </button>

                  {/* Comment / Ask Button */}
                  <button
                    onClick={() => navigate(`/comments/${product.id}`)}
                    className="text-black hover:text-neutral-600 transition-transform active:scale-110"
                    title="التعليقات"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  {/* Direct Message Seller */}
                  <button
                    onClick={() => {
                      if (store) {
                        if (isBlocked(targetUserId)) return;
                        startDirectMessage({
                          id: store.id,
                          username: store.username,
                          name: lang === 'ar' ? store.name : store.nameEn,
                          avatar: store.avatar,
                          verified: store.verified
                        });
                        setShowSuccessToast(true);
                      }
                    }}
                    className="text-black hover:text-blue-600 transition-transform active:scale-110"
                    title="مراسلة البائع في الخاص"
                  >
                    <Send className="w-6 h-6" />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(product)}
                    className="text-black hover:text-neutral-600 transition-transform active:scale-110 relative"
                    title="مشاركة"
                  >
                    {copiedLink === product.id ? (
                      <Check className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Share2 className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Bookmark / Save */}
                <button
                  onClick={() => toggleSaveProduct(product.id)}
                  className="text-black hover:text-neutral-600 transition-transform active:scale-110"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      isSaved ? 'fill-black text-black' : 'text-black'
                    }`}
                  />
                </button>
              </div>

              {/* Likes Count */}
              <div className="px-4 pt-2">
                <p className="text-xs font-bold text-black">
                  {product.likes.toLocaleString()} {t.likesCount}
                </p>
              </div>

              {/* Caption & Description */}
              <div className="px-4 pt-1 space-y-1">
                <p className="text-xs text-black leading-relaxed">
                  <span
                    onClick={() => store && navigate(`/store/${store.id}`)}
                    className="font-bold text-black me-1.5 cursor-pointer hover:underline"
                  >
                    {store?.username}
                  </span>
                  <span>{lang === 'ar' ? product.name : product.nameEn}</span>
                </p>

                <p className="text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? product.description : product.descriptionEn}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-medium text-blue-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Buy / Add to Cart CTA Bar */}
              <div className="px-4 pt-3 flex gap-2">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.addToCart}</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                  }}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
                >
                  <span>{t.buyNow}</span>
                  <span className="text-[11px] opacity-90 font-mono">({product.price} {product.currency})</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={!!reportTargetData}
        onClose={() => setReportTargetData(null)}
        onSubmit={(reason, desc) => {
          if (reportTargetData) {
            reportTarget(reportTargetData.id, reportTargetData.type as any, reason, desc, reportTargetData.name, reportTargetData.username);
            setReportTargetData(null);
          }
        }}
        targetName={reportTargetData?.name}
        targetUsername={reportTargetData?.username}
        targetAvatar={reportTargetData?.avatar}
        targetType={reportTargetData?.type as any || 'store'}
        lang={lang}
      />

      {/* Block Confirm */}
      <BlockConfirmModal
        isOpen={!!blockTarget}
        onClose={() => setBlockTarget(null)}
        onConfirm={() => {
          if (blockTarget) {
            blockUser(blockTarget.id);
            setBlockTarget(null);
          }
        }}
        isBlocked={blockTarget ? isBlocked(blockTarget.id) : false}
        userName={blockTarget?.name || ''}
        username={blockTarget?.username || ''}
        avatar={blockTarget?.avatar}
        lang={lang}
      />
    </>
  );
};
