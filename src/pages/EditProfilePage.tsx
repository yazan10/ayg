import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Check, Link as LinkIcon, User, AtSign, FileText, Tag, Phone, Mail } from 'lucide-react';
import { ImageUpload } from '../components/ui/ImageUpload';

export const EditProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser, lang } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [category, setCategory] = useState(currentUser.category || (lang === 'ar' ? 'منشئ محتوى ومتاجر' : 'Creator & Stores'));
  const [phone, setPhone] = useState((currentUser as any).phone || '+966 50 123 4567');
  const [email, setEmail] = useState((currentUser as any).email || 'yazan@aygram.com');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name: name.trim() || currentUser.name, username: username.trim().replace(/^@/, '') || currentUser.username, bio: bio.trim(), website: website.trim(), avatar, category, phone, email } as any);
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); navigate('/profile'); }, 500);
  };

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'} />
      <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6 bg-white md:rounded-2xl md:border md:border-neutral-200 md:shadow-sm md:mt-6">
        <ImageUpload value={avatar} onChange={setAvatar} label={lang === 'ar' ? 'صورة الملف الشخصي (من الجهاز)' : 'Profile Photo (from device)'} placeholder="اختر صورة البروفايل" previewSize="lg" />

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3">
            <label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-neutral-400" /><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full text-sm font-semibold text-black focus:outline-none bg-transparent" required /></div>
          </div>
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3">
            <label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
            <div className="flex items-center gap-2"><AtSign className="w-4 h-4 text-neutral-400" /><input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full text-sm font-semibold text-black focus:outline-none bg-transparent font-mono" required /></div>
          </div>
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3">
            <label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'السيرة الذاتية' : 'Bio'}</label>
            <div className="flex items-start gap-2 pt-1"><FileText className="w-4 h-4 text-neutral-400 mt-1" /><textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full text-sm text-black focus:outline-none bg-transparent resize-none leading-relaxed" placeholder={lang === 'ar' ? 'اكتب نبذة عنك...' : 'Write something about you...'} /></div>
          </div>
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3">
            <label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'الروابط' : 'Links'}</label>
            <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-neutral-400" /><input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://aygram.com/store" className="w-full text-sm font-medium text-blue-600 focus:outline-none bg-transparent" /></div>
          </div>
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3">
            <label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'الفئة' : 'Category'}</label>
            <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-neutral-400" /><input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full text-sm font-semibold text-black focus:outline-none bg-transparent" /></div>
          </div>
          <div className="pt-2 space-y-3">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{lang === 'ar' ? 'معلومات الاتصال الخاصة' : 'Private Information'}</h3>
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3"><label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-neutral-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full text-sm font-medium text-black focus:outline-none bg-transparent" /></div></div>
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-3"><label className="text-xs font-medium text-neutral-500">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-neutral-400" /><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full text-sm font-medium text-black focus:outline-none bg-transparent font-mono" /></div></div>
          </div>
          <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
            {isSaved ? <><Check className="w-4 h-4" />{lang === 'ar' ? 'تم الحفظ' : 'Saved'}</> : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
};
