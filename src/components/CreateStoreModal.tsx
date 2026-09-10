import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, Store as StoreIcon, Check, Plus, ShoppingBag } from 'lucide-react';

export const CreateStoreModal: React.FC = () => {
  const { 
    isCreateStoreOpen, 
    setIsCreateStoreOpen, 
    addStore, 
    addProduct,
    setActiveStoreModal, 
    lang, 
    t 
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1);

  // Store fields
  const [storeName, setStoreName] = useState('');
  const [storeNameEn, setStoreNameEn] = useState('');
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('أزياء وموضة');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80');
  const [whatsapp, setWhatsapp] = useState('+966500000000');

  // First product fields
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(180);
  const [productImage, setProductImage] = useState('https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80');
  const [productDesc, setProductDesc] = useState('');

  if (!isCreateStoreOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !username.trim()) return;

    const createdStore = addStore({
      name: storeName,
      nameEn: storeNameEn || storeName,
      username: username.replace('@', '').toLowerCase(),
      category,
      categoryEn: category === 'أزياء وموضة' ? 'Fashion' : category,
      bio,
      bioEn: bio,
      avatar,
      whatsapp,
      phone: whatsapp,
      email: `${username}@store.com`,
      location: lang === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia',
      locationEn: 'Riyadh, Saudi Arabia',
      currency: 'SAR',
      verified: true
    });

    if (productName.trim()) {
      addProduct({
        storeId: createdStore.id,
        name: productName,
        nameEn: productName,
        price: Number(productPrice),
        currency: 'SAR',
        images: [productImage],
        description: productDesc || productName,
        descriptionEn: productDesc || productName,
        category,
        inStock: true,
        stockCount: 20,
        tags: ['جديد', 'عرض_خاص']
      });
    }

    setIsCreateStoreOpen(false);
    setActiveStoreModal(createdStore);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {lang === 'ar' ? 'إطلاق متجرك الإلكتروني في 60 ثانية' : 'Launch Your Store in 60s'}
              </h3>
              <p className="text-xs text-blue-200">
                {lang === 'ar' ? 'تصميم انستغرام المتطور مع صفحة دفع مدمجة' : 'Instagram-native storefront ready for customers'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateStoreOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
          {step === 1 ? (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-black border-b pb-2">
                {lang === 'ar' ? '1. هوية المتجر' : '1. Store Identity'}
              </h4>

              <div>
                <label className="block font-bold mb-1 text-black">{t.newStoreName} *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: متجر أصايل للعود"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-black">{t.newStoreUsername} *</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="asayel_oud"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-black">{t.newStoreCategory}</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                  >
                    <option value="عطور ومستحضرات">عطور ومستحضرات</option>
                    <option value="أزياء وموضة">أزياء وموضة</option>
                    <option value="أغذية ومشروبات">أغذية ومشروبات</option>
                    <option value="إلكترونيات وهواتف">إلكترونيات وهواتف</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-black">{t.newStoreWhatsapp}</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-black">{t.newStoreBio}</label>
                <textarea
                  rows={2}
                  placeholder="نبذة مختصرة تظهر في بروفايل انستغرام..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow transition-colors"
                >
                  {lang === 'ar' ? 'التالي: إضافة أول منتج ←' : 'Next: Add First Item →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-black border-b pb-2 flex items-center justify-between">
                <span>{lang === 'ar' ? '2. أول منتج في متجرك' : '2. Your First Product'}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  {lang === 'ar' ? '← السابق' : '← Back'}
                </button>
              </h4>

              <div>
                <label className="block font-bold mb-1 text-black">{lang === 'ar' ? 'اسم المنتج' : 'Product Name'}</label>
                <input
                  type="text"
                  placeholder="مثال: عباية صيفية فاخرة"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-black">{lang === 'ar' ? 'السعر (SAR)' : 'Price'}</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={e => setProductPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-black">{lang === 'ar' ? 'رابط صورة المنتج' : 'Image URL'}</label>
                  <input
                    type="url"
                    value={productImage}
                    onChange={e => setProductImage(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-[11px] text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-black">{lang === 'ar' ? 'وصف المنتج' : 'Description'}</label>
                <textarea
                  rows={2}
                  value={productDesc}
                  onChange={e => setProductDesc(e.target.value)}
                  placeholder="تفاصيل المنتج ومميزاته..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-black hover:bg-neutral-100"
                >
                  {lang === 'ar' ? 'السابق' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-900/10"
                >
                  {t.createMyStoreBtn}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
