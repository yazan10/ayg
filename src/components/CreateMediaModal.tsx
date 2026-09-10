import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Image as ImageIcon, 
  Film, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  Music2, 
  Tag, 
  Check 
} from 'lucide-react';

export const CreateMediaModal: React.FC = () => {
  const { 
    isCreateMediaOpen, 
    setIsCreateMediaOpen, 
    addProduct, 
    addReel, 
    addStory, 
    stores, 
    currentUser,
    lang 
  } = useStore();

  const [activeType, setActiveType] = useState<'product' | 'reel' | 'story'>('product');

  // Product post form state
  const [storeId, setStoreId] = useState(stores[0]?.id || 'store-1');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('149');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541643600914-78b084683601?w=800');
  const [category, setCategory] = useState('عطور');

  // Reel post form state
  const [reelCaption, setReelCaption] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4');
  const [reelAudioTrack, setReelAudioTrack] = useState('aygram Originals - Trending Sound');

  // Story form state
  const [storyImageUrl, setStoryImageUrl] = useState('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600');
  const [storyStoreId, setStoryStoreId] = useState(stores[0]?.id || 'store-1');

  const [successNotice, setSuccessNotice] = useState(false);

  if (!isCreateMediaOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'product') {
      if (!name) return;
      addProduct({
        storeId,
        name,
        nameEn: nameEn || name,
        description,
        descriptionEn: description,
        price: parseFloat(price) || 99,
        category,
        categoryEn: 'Category',
        images: [imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'],
        stockCount: 15
      });
    } else if (activeType === 'reel') {
      if (!reelCaption) return;
      const st = stores.find(s => s.id === storeId);
      addReel({
        userId: currentUser.id,
        username: st ? st.username : currentUser.username,
        userAvatar: st ? st.avatar : currentUser.avatar,
        userName: st ? (lang === 'ar' ? st.name : st.nameEn) : currentUser.name,
        verified: true,
        videoUrl: reelVideoUrl,
        caption: reelCaption,
        captionEn: reelCaption,
        audioTrack: reelAudioTrack
      });
    } else if (activeType === 'story') {
      const st = stores.find(s => s.id === storyStoreId) || stores[0];
      addStory({
        storeId: st.id,
        storeName: lang === 'ar' ? st.name : st.nameEn,
        storeAvatar: st.avatar,
        mediaUrl: storyImageUrl,
        mediaType: 'image'
      });
    }

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setIsCreateMediaOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-black">
              {lang === 'ar' ? 'إنشاء ونشر محتوى جديد' : 'Create & Post Media'}
            </h3>
          </div>
          <button
            onClick={() => setIsCreateMediaOpen(false)}
            className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Switcher Tabs */}
        <div className="flex border-b border-neutral-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveType('product')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeType === 'product' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'ar' ? 'منشور متجر' : 'Store Post'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('reel')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeType === 'reel' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>{lang === 'ar' ? 'فيديو ريلز' : 'Reels Video'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('story')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeType === 'story' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{lang === 'ar' ? 'قصة Story' : '24h Story'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {successNotice ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-neutral-900">
                {lang === 'ar' ? 'تم النشر بنجاح وحفظه في aygram!' : 'Successfully posted and saved to aygram!'}
              </p>
            </div>
          ) : (
            <>
              {/* Product Post Tab */}
              {activeType === 'product' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'المتجر الناشر' : 'Publishing Store'}
                    </label>
                    <select
                      value={storeId}
                      onChange={e => setStoreId(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs bg-white focus:ring-1 focus:ring-blue-600"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>
                          {lang === 'ar' ? s.name : s.nameEn} (@{s.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {lang === 'ar' ? 'اسم المنتج بالعربي' : 'Product Name (Ar)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="عطر ليالي الشرق..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {lang === 'ar' ? 'الاسم بالإنجليزي' : 'Product Name (En)'}
                      </label>
                      <input
                        type="text"
                        value={nameEn}
                        onChange={e => setNameEn(e.target.value)}
                        placeholder="Eastern Nights Perfume"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {lang === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {lang === 'ar' ? 'التصنيف' : 'Category'}
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        placeholder="عطور / أزياء / إلكترونيات"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'رابط صورة المنتج' : 'Product Image URL'}
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'الوصف ومميزات العرض' : 'Description'}
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="تفاصيل المنتج وتوصيله السريع..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Reel Video Tab */}
              {activeType === 'reel' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'المتجر أو الحساب' : 'Account'}
                    </label>
                    <select
                      value={storeId}
                      onChange={e => setStoreId(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs bg-white"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>
                          {lang === 'ar' ? s.name : s.nameEn} (@{s.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'رابط الفيديو MP4' : 'Video URL (MP4)'}
                    </label>
                    <input
                      type="url"
                      required
                      value={reelVideoUrl}
                      onChange={e => setReelVideoUrl(e.target.value)}
                      placeholder="https://assets.mixkit.co/..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'النص والهاشتاغات (Caption)' : 'Caption & Hashtags'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reelCaption}
                      onChange={e => setReelCaption(e.target.value)}
                      placeholder="شاهد أناقة المنتجات الجديدة 🔥 #aygram #style"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'اسم المقطع الصوتي الموسيقي' : 'Audio Track'}
                    </label>
                    <div className="relative">
                      <Music2 className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={reelAudioTrack}
                        onChange={e => setReelAudioTrack(e.target.value)}
                        className="w-full ps-9 pe-3 py-2 border border-neutral-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Story Tab */}
              {activeType === 'story' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'المتجر الناشر للقصة' : 'Store'}
                    </label>
                    <select
                      value={storyStoreId}
                      onChange={e => setStoryStoreId(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs bg-white"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>
                          {lang === 'ar' ? s.name : s.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {lang === 'ar' ? 'رابط صورة القصة' : 'Story Image URL'}
                    </label>
                    <input
                      type="url"
                      required
                      value={storyImageUrl}
                      onChange={e => setStoryImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="w-32 h-44 mx-auto rounded-xl overflow-hidden border-2 border-blue-600 shadow-md">
                    <img src={storyImageUrl} alt="Story Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? 'نشر في المنصة فوراً' : 'Publish to aygram Now'}</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
