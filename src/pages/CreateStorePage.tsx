import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Sparkles } from 'lucide-react';
import { ImageUpload } from '../components/ui/ImageUpload';

export const CreateStorePage: React.FC = () => {
  const { addStore, addProduct, lang, t } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [storeName, setStoreName] = useState('');
  const [storeNameEn, setStoreNameEn] = useState('');
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('أزياء وموضة');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80');
  const [whatsapp, setWhatsapp] = useState('+966500000000');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(180);
  const [productImage, setProductImage] = useState('https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80');
  const [productDesc, setProductDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !username.trim()) return;
    const createdStore = addStore({ name: storeName, nameEn: storeNameEn || storeName, username: username.replace('@', '').toLowerCase(), category, categoryEn: category === 'أزياء وموضة' ? 'Fashion' : category, bio, bioEn: bio, avatar, whatsapp, phone: whatsapp, email: `${username}@store.com`, location: lang === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia', locationEn: 'Riyadh, Saudi Arabia', currency: 'SAR', verified: true });
    if (productName.trim()) {
      addProduct({ storeId: createdStore.id, name: productName, nameEn: productName, price: Number(productPrice), currency: 'SAR', images: [productImage], description: productDesc || productName, descriptionEn: productDesc || productName, category, inStock: true, stockCount: 20, tags: ['جديد', 'عرض_خاص'] });
    }
    navigate(`/store/${createdStore.id}`);
  };

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'إطلاق متجرك الإلكتروني' : 'Launch Your Store'} subtitle={lang === 'ar' ? 'تصميم انستغرام مع صفحة دفع مدمجة' : 'Instagram-native storefront'} />
      <div className="max-w-lg mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><Sparkles className="w-6 h-6 text-sky-300" /></div>
          <div><h3 className="font-bold text-base">{lang === 'ar' ? 'إطلاق متجرك في 60 ثانية' : 'Launch Your Store in 60s'}</h3><p className="text-xs text-blue-200">{lang === 'ar' ? 'صفحة انستغرام متطورة جاهزة' : 'Ready for customers'}</p></div>
        </div>
        <form onSubmit={handleCreate} className="p-6 space-y-4 bg-white">
          {step === 1 ? (
            <div className="space-y-4">
              <h4 className="font-bold text-base border-b pb-2">{lang === 'ar' ? '1. هوية المتجر' : '1. Store Identity'}</h4>
              <div><label className="block font-bold mb-1.5 text-sm">{t.newStoreName} *</label><input type="text" required placeholder="مثال: متجر أصايل للعود" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <div><label className="block font-bold mb-1.5 text-sm">{t.newStoreUsername} *</label><input type="text" required dir="ltr" placeholder="asayel_oud" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold mb-1.5 text-sm">{t.newStoreCategory}</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600"><option value="عطور ومستحضرات">عطور ومستحضرات</option><option value="أزياء وموضة">أزياء وموضة</option><option value="أغذية ومشروبات">أغذية ومشروبات</option><option value="إلكترونيات وهواتف">إلكترونيات وهواتف</option></select></div>
                <div><label className="block font-bold mb-1.5 text-sm">{t.newStoreWhatsapp}</label><input type="tel" dir="ltr" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              </div>
              <div><label className="block font-bold mb-1.5 text-sm">{t.newStoreBio}</label><textarea rows={3} placeholder="نبذة مختصرة..." value={bio} onChange={e => setBio(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <ImageUpload value={avatar} onChange={setAvatar} label={lang === 'ar' ? 'شعار المتجر (من الجهاز)' : 'Store Logo (from device)'} placeholder="اختر شعار المتجر" previewSize="md" />
              <div className="pt-2 flex justify-end"><button type="button" onClick={() => setStep(2)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow">{lang === 'ar' ? 'التالي: إضافة أول منتج ←' : 'Next: Add First Item →'}</button></div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-base border-b pb-2 flex items-center justify-between"><span>{lang === 'ar' ? '2. أول منتج في متجرك' : '2. Your First Product'}</span><button type="button" onClick={() => setStep(1)} className="text-blue-600 text-sm font-bold hover:underline">{lang === 'ar' ? '← السابق' : '← Back'}</button></h4>
              <div><label className="block font-bold mb-1.5 text-sm">{lang === 'ar' ? 'اسم المنتج' : 'Product Name'}</label><input type="text" placeholder="مثال: عباية صيفية فاخرة" value={productName} onChange={e => setProductName(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <div><label className="block font-bold mb-1.5 text-sm">{lang === 'ar' ? 'السعر (SAR)' : 'Price'}</label><input type="number" value={productPrice} onChange={e => setProductPrice(Number(e.target.value))} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <ImageUpload value={productImage} onChange={setProductImage} label={lang === 'ar' ? 'صورة المنتج (من الجهاز)' : 'Product Image (from device)'} placeholder="اختر صورة المنتج" />
              <div><label className="block font-bold mb-1.5 text-sm">{lang === 'ar' ? 'وصف المنتج' : 'Description'}</label><textarea rows={2} value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="تفاصيل المنتج..." className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <div className="pt-3 flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border rounded-xl font-bold hover:bg-neutral-100">{lang === 'ar' ? 'السابق' : 'Back'}</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">{t.createMyStoreBtn}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
