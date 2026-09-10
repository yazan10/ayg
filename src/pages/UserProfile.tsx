import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ReportModal } from '../components/ui/ReportModal';
import { BlockConfirmModal } from '../components/ui/BlockConfirmModal';
import { StarDisplay } from '../components/ui/StarRating';
import {
  Grid,
  Film,
  Bookmark,
  MessageSquare,
  UserPlus,
  UserMinus,
  Ban,
  Flag,
  Share2,
  MoreHorizontal,
  ShieldCheck,
  Crown,
  BadgeCheck,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import { ReportReason } from '../types';

export const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const {
    users,
    products,
    reels,
    currentUser,
    lang,
    toggleFollowUser,
    blockUser,
    unblockUser,
    isBlocked,
    reportTarget,
    startDirectMessage,
    formatPrice,
  } = useStore();

  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');

  const rawUser = users.find(u => u.username.toLowerCase() === username?.toLowerCase() || u.id === username);
  const isBanned = !!(rawUser as any)?.isBanned;
  const user = rawUser
    ? isBanned
      ? { ...rawUser, name: 'aygram_user', username: 'aygram_user', avatar: 'https://ui-avatars.com/api/?name=aygram+user&background=d1d5db&color=6b7280&size=200&rounded=true&bold=true&format=svg', bio: 'هذا الحساب محظور', bioEn: 'This account is banned' } as any
      : rawUser
    : undefined;

  if (!user) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'المستخدم غير موجود' : 'User not found'} />
        <div className="max-w-lg mx-auto p-8 text-center">
          <p className="text-sm text-neutral-500">{lang === 'ar' ? 'المستخدم غير موجود' : 'User not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">رجوع</button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user.id === currentUser.id;
  const blocked = isBlocked(user.id);
  const userProducts = products.filter(p => {
    const store = p.storeId === user.id;
    return store || products.filter(x => x.storeId.includes(user.id)).length > 0;
  });
  // Fallback: products where store username matches user username or store id
  const filteredProducts = products.filter(p => p.storeId === user.id || users.find(u => u.id === p.storeId)?.username === user.username);
  const userReels = reels.filter(r => r.userId === user.id || r.username === user.username);
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 3);

  const handleFollow = () => {
    toggleFollowUser(user.id);
  };

  const handleMessage = () => {
    if (blocked) return;
    startDirectMessage({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      verified: user.verified,
    });
    navigate('/messages');
  };

  const handleBlockConfirm = () => {
    if (blocked) {
      unblockUser(user.id);
    } else {
      blockUser(user.id);
    }
    setShowBlock(false);
    setShowMore(false);
  };

  const handleReport = (reason: ReportReason, description: string) => {
    reportTarget(user.id, 'user', reason, description, user.name, user.username);
    setShowReport(false);
    setShowMore(false);
  };

  if (blocked) {
    return (
      <div>
        <PageHeader title={`@${user.username}`} subtitle={lang === 'ar' ? 'محظور' : 'Blocked'} />
        <div className="max-w-lg mx-auto p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
            <Ban className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="font-black text-base">@{user.username} — {lang === 'ar' ? 'محظور' : 'Blocked'}</h3>
            <p className="text-sm text-neutral-500 mt-1">{lang === 'ar' ? 'لن ترى منشورات هذا الحساب ولن يتمكن من مراسلتك.' : 'You won\'t see posts from this account.'}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={() => setShowBlock(true)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold">إلغاء الحظر</button>
            <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold">رجوع</button>
          </div>
        </div>
        <BlockConfirmModal isOpen={showBlock} onClose={() => setShowBlock(false)} onConfirm={handleBlockConfirm} isBlocked={true} userName={user.name} username={user.username} avatar={user.avatar} lang={lang} />
      </div>
    );
  }

  const tier = user.verificationTier || 'none';
  const isGold = tier === 'gold' && user.verification?.isActive;
  const isBlue = tier === 'blue' && user.verification?.isActive;

  return (
    <div>
      <PageHeader
        title={`@${user.username}`}
        subtitle={user.name}
        actions={
          <div className="flex items-center gap-1.5">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); }} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowMore(!showMore)} className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        }
      />

      {/* More actions dropdown */}
      {showMore && (
        <div className="max-w-lg mx-auto px-4 pt-2">
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
            <button onClick={() => { setShowMore(false); setShowReport(true); }} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 text-start">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-bold">{lang === 'ar' ? 'الإبلاغ عن الحساب' : 'Report account'}</span>
            </button>
            <button onClick={() => { setShowMore(false); setShowBlock(true); }} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 text-start border-t border-neutral-100">
              <Ban className="w-4 h-4" />
              <span className="text-sm font-bold">{lang === 'ar' ? 'حظر الحساب' : 'Block account'}</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white md:rounded-2xl md:border md:border-neutral-200 md:shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img src={user.avatar} alt={user.name} className={`w-24 h-24 rounded-full object-cover border-4 ${isGold ? 'border-amber-400' : isBlue ? 'border-sky-400' : 'border-neutral-200'}`} />
              {isGold && <span className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white flex items-center justify-center text-xs border-2 border-white">👑</span>}
              {isBlue && !isGold && <span className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">✓</span>}
            </div>
            <div className="flex-1 grid grid-cols-3 text-center">
              <div>
                <div className="font-black text-lg">{displayProducts.length}</div>
                <div className="text-xs text-neutral-500">{lang === 'ar' ? 'منشورات' : 'Posts'}</div>
              </div>
              <div>
                <div className="font-black text-lg">{user.followersCount.toLocaleString()}</div>
                <div className="text-xs text-neutral-500">{lang === 'ar' ? 'متابعون' : 'Followers'}</div>
              </div>
              <div>
                <div className="font-black text-lg">{user.followingCount.toLocaleString()}</div>
                <div className="text-xs text-neutral-500">{lang === 'ar' ? 'يتابع' : 'Following'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-black text-base">{user.name}</h2>
              {isGold && <span className="text-[11px] bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 rounded-full font-black flex items-center gap-1"><Crown className="w-3 h-3" />ذهبية</span>}
              {isBlue && !isGold && <span className="text-[11px] bg-sky-500 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><BadgeCheck className="w-3 h-3" />موثق</span>}
              {user.verified && !isGold && !isBlue && <ShieldCheck className="w-4 h-4 text-blue-500" />}
              <span className="text-xs text-neutral-500 font-mono">@{user.username}</span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{user.bio}</p>
            {user.category && <span className="inline-block text-xs bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-full font-bold">{user.category}</span>}
          </div>

          {/* Actions: Follow / Message / Block */}
          {!isOwnProfile ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleFollow}
                className={`py-2.5 rounded-xl text-sm font-black flex items-center justify-center gap-1.5 border ${user.isFollowing ? 'bg-white border-neutral-200 text-black hover:bg-neutral-50' : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow'}`}
              >
                {user.isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    {lang === 'ar' ? 'إلغاء المتابعة' : 'Unfollow'}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {lang === 'ar' ? 'متابعة' : 'Follow'}
                  </>
                )}
              </button>
              <button
                onClick={handleMessage}
                className="py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-black flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                {lang === 'ar' ? 'رسالة' : 'Message'}
              </button>
              <button
                onClick={() => setShowBlock(true)}
                className="py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-1"
              >
                <Ban className="w-4 h-4" />
                {lang === 'ar' ? 'حظر' : 'Block'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/profile/edit')} className="py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-black">
                {lang === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
              </button>
              <button onClick={() => navigate('/profile')} className="py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold">
                {lang === 'ar' ? 'عرض ملفي' : 'View My Profile'}
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-t border-neutral-200 -mx-5 px-5">
            <button onClick={() => setActiveTab('posts')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black border-t-2 ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-neutral-400'}`}>
              <Grid className="w-4 h-4" />
              {lang === 'ar' ? 'المنشورات' : 'Posts'}
            </button>
            <button onClick={() => setActiveTab('reels')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black border-t-2 ${activeTab === 'reels' ? 'border-black text-black' : 'border-transparent text-neutral-400'}`}>
              <Film className="w-4 h-4" />
              {lang === 'ar' ? 'ريلز' : 'Reels'}
            </button>
            <button onClick={() => setActiveTab('saved')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black border-t-2 ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-neutral-400'}`}>
              <Bookmark className="w-4 h-4" />
              {lang === 'ar' ? 'المحفوظات' : 'Saved'}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-2">
          {activeTab === 'posts' && (
            displayProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {displayProducts.map(p => (
                  <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="aspect-square bg-neutral-100 overflow-hidden cursor-pointer group relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-bold text-xs flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-white" />
                        {p.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Grid className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">لا توجد منشورات بعد</p>
              </div>
            )
          )}

          {activeTab === 'reels' && (
            userReels.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {userReels.map(r => (
                  <div key={r.id} onClick={() => navigate('/reels')} className="aspect-[9/16] bg-black overflow-hidden cursor-pointer relative">
                    <video src={r.videoUrl} muted loop className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 start-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      {r.likes}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Film className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">لا توجد ريلز بعد</p>
              </div>
            )
          )}

          {activeTab === 'saved' && (
            <div className="p-12 text-center">
              <Bookmark className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">{isOwnProfile ? 'منشوراتك المحفوظة' : 'المحفوظات خاصة'}</p>
            </div>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={handleReport}
        targetName={user.name}
        targetUsername={user.username}
        targetAvatar={user.avatar}
        targetType="user"
        lang={lang}
      />

      <BlockConfirmModal
        isOpen={showBlock}
        onClose={() => setShowBlock(false)}
        onConfirm={handleBlockConfirm}
        isBlocked={blocked}
        userName={user.name}
        username={user.username}
        avatar={user.avatar}
        lang={lang}
      />
    </div>
  );
};
