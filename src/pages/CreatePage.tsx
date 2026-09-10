import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ShoppingBag, Film, Clock, Sparkles, Music2, Check, Ban, AlertTriangle } from 'lucide-react';
import { ImageUpload } from '../components/ui/ImageUpload';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, addReel, addStory, stores, currentUser, lang } = useStore();
  const [activeType, setActiveType] = useState<'product' | 'reel' | 'story'>('product');
  const [storeId, setStoreId] = useState(stores[0]?.id || 'store-1');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('149');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541643600914-78b084683601?w=800');
  const [category, setCategory] = useState('عطور');
  const [reelCaption, setReelCaption] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelAudioTrack, setReelAudioTrack] = useState('aygram Originals - Trending Sound');
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [storyStoreId, setStoryStoreId] = useState(stores[0]?.id || 'store-1');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === 'product') {
      if (!name) return;
      const p = addProduct({ storeId, name, nameEn: nameEn || name, description, descriptionEn: description, price: parseFloat(price) || 99, category, categoryEn: 'Category', images: [imageUrl], stockCount: 15 });
      setSuccessNotice(true);
      setTimeout(() => navigate(`/product/${p.id}`), 900);
    } else if (activeType === 'reel') {
      if (!reelCaption) return;
      const st = stores.find(s => s.id === storeId);
      const r = addReel({ userId: currentUser.id, username: st ? st.username : currentUser.username, userAvatar: st ? st.avatar : currentUser.avatar, userName: st ? (lang === 'ar' ? st.name : st.nameEn) : currentUser.name, verified: true, videoUrl: reelVideoUrl, caption: reelCaption, captionEn: reelCaption, audioTrack: reelAudioTrack });
      setSuccessNotice(true);
      setTimeout(() => navigate('/reels'), 900);
    } else if (activeType === 'story') {
      const st = stores.find(s => s.id === storyStoreId) || stores[0];
      addStory({ storeId: st.id, storeName: lang === 'ar' ? st.name : st.nameEn, storeAvatar: st.avatar, mediaUrl: storyImageUrl, caption: 'قصة جديدة', captionEn: 'New story', productId: undefined });
      setSuccessNotice(true);
      setTimeout(() => navigate('/'), 900);
    }
  };

  if (successNotice) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'إنشاء محتوى جديد' : 'Create Media'} />
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check className="w-8 h-8" /></div>
          <p className="font-bold text-lg text-neutral-900">{lang === 'ar' ? 'تم النشر بنجاح!' : 'Successfully posted!'}</p>
          <p className="text-sm text-neutral-500">{lang === 'ar' ? 'سيتم توجيهك تلقائياً' : 'Redirecting you...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'إنشاء ونشر محتوى جديد' : 'Create & Post Media'} subtitle={lang === 'ar' ? 'منشور متجر، ريلز، أو قصة' : 'Store post, reel or story'} />
      <div className="max-w-2xl mx-auto">
        <div className="flex border-b border-neutral-200 bg-white sticky top-14 z-10">
          <button type="button" onClick={() => setActiveType('product')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${activeType === 'product' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-neutral-500'}`}><ShoppingBag className="w-4 h-4" />{lang === 'ar' ? 'منشور متجر' : 'Store Post'}</button>
          <button type="button" disabled className="flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 border-transparent text-neutral-400 bg-neutral-50 cursor-not-allowed opacity-60">
            <Ban className="w-4 h-4" />
            {lang === 'ar' ? 'ريلز (مغلق)' : 'Reels (Closed)'}
          </button>
          <button type="button" onClick={() => setActiveType('story')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 ${activeType === 'story' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-neutral-500'}`}><Clock className="w-4 h-4" />{lang === 'ar' ? 'قصة' : 'Story'}</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 bg-white">
          {activeType === 'product' && (
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'المتجر الناشر' : 'Publishing Store'}</label><select value={storeId} onChange={e => setStoreId(e.target.value)} className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm bg-white">{stores.map(s => <option key={s.id} value={s.id}>{lang === 'ar' ? s.name : s.nameEn} (@{s.username})</option>)}</select></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'اسم المنتج بالعربي' : 'Product Name (Ar)'}</label><input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="عطر ليالي الشرق..." className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm" /></div>
                <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'الاسم بالإنجليزي' : 'Name (En)'}</label><input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} placeholder="Eastern Nights" className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'}</label><input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm" /></div>
                <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'التصنيف' : 'Category'}</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="عطور / أزياء" className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm" /></div>
              </div>
              <ImageUpload value={imageUrl} onChange={setImageUrl} label={lang === 'ar' ? 'صورة المنتج (من الجهاز)' : 'Product Image (from device)'} placeholder="اختر صورة المنتج" />
              <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'الوصف' : 'Description'}</label><textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="تفاصيل المنتج..." className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm" /></div>
            </div>
          )}
          {activeType === 'reel' && (
            <div className="space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <Ban className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-red-800">{lang === 'ar' ? 'رفع الفيديوهات مغلق حالياً' : 'Video uploads are closed'}</h4>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    {lang === 'ar' ? 'تم إغلاق قسم الريلز مؤقتاً — ممنوع رفع الفيديوهات حالياً. يمكنك نشر صور المنتجات والقصص فقط. سيُفتح قريباً.' : 'Reels section is temporarily closed — video uploads are disabled. You can post product images and stories only.'}
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'قسم الريلز مغلق — استخدم قسم المنتجات أو القصص' : 'Reels closed — use Products or Stories'}</span>
              </div>
            </div>
          )}
          {activeType === 'story' && (
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-1">{lang === 'ar' ? 'المتجر الناشر للقصة' : 'Store'}</label><select value={storyStoreId} onChange={e => setStoryStoreId(e.target.value)} className="w-full px-3 py-3 border border-neutral-300 rounded-xl text-sm bg-white">{stores.map(s => <option key={s.id} value={s.id}>{lang === 'ar' ? s.name : s.nameEn}</option>)}</select></div>
              <ImageUpload value={storyImageUrl} onChange={setStoryImageUrl} label={lang === 'ar' ? 'صورة القصة (من الجهاز)' : 'Story Image (from device)'} placeholder="اختر صورة القصة" />
            </div>
          )}
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" />{lang === 'ar' ? 'نشر في المنصة فوراً' : 'Publish to aygram Now'}</button>
        </form>
      </div>
    </div>
  );
};
