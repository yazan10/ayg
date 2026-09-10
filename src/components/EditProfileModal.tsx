import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Camera, Check, Link as LinkIcon, User, AtSign, FileText, Tag, Phone, Mail } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, lang } = useStore();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [category, setCategory] = useState(currentUser.category || (lang === 'ar' ? 'منشئ محتوى ومتاجر' : 'Creator & Stores'));
  const [phone, setPhone] = useState(currentUser.phone || '+966 50 123 4567');
  const [email, setEmail] = useState(currentUser.email || 'yazan@aygram.com');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: name.trim() || currentUser.name,
      username: username.trim().replace(/^@/, '') || currentUser.username,
      bio: bio.trim(),
      website: website.trim(),
      avatar,
      category,
      phone,
      email
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  const handleAvatarChange = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300'
    ];
    const nextAvatar = avatars[(avatars.indexOf(avatar) + 1) % avatars.length];
    setAvatar(nextAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-lg bg-white sm:rounded-2xl border border-neutral-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Instagram Top Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-200 bg-white sticky top-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-black hover:text-neutral-600 transition-colors"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          
          <h2 className="text-base font-bold text-black">
            {lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
          </h2>

          <button
            type="button"
            onClick={handleSave}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            {isSaved ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-4 h-4" />
                {lang === 'ar' ? 'تم الحفظ' : 'Saved'}
              </span>
            ) : (
              lang === 'ar' ? 'تم' : 'Done'
            )}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
              <div className="w-24 h-24 rounded-full p-0.5 bg-gradient-to-tr from-blue-400 to-blue-600 shadow-md">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAvatarChange}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {lang === 'ar' ? 'تغيير صورة الملف الشخصي' : 'Change profile photo'}
            </button>
          </div>

          {/* Form Fields Styled in Instagram Style */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
              <label className="text-xs font-medium text-neutral-500">
                {lang === 'ar' ? 'الاسم' : 'Name'}
              </label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Your name'}
                  className="w-full text-sm font-semibold text-black focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
              <label className="text-xs font-medium text-neutral-500">
                {lang === 'ar' ? 'اسم المستخدم' : 'Username'}
              </label>
              <div className="flex items-center gap-2">
                <AtSign className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full text-sm font-semibold text-black focus:outline-none bg-transparent font-mono"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
              <label className="text-xs font-medium text-neutral-500">
                {lang === 'ar' ? 'السيرة الذاتية' : 'Bio'}
              </label>
              <div className="flex items-start gap-2 pt-1">
                <FileText className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب نبذة عنك أو عن متجرك...' : 'Write something about you or your store...'}
                  rows={3}
                  className="w-full text-sm text-black focus:outline-none bg-transparent resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Website / Links */}
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
              <label className="text-xs font-medium text-neutral-500">
                {lang === 'ar' ? 'الروابط' : 'Links'}
              </label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://aygram.com/store"
                  className="w-full text-sm font-medium text-blue-600 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
              <label className="text-xs font-medium text-neutral-500">
                {lang === 'ar' ? 'الفئة' : 'Category'}
              </label>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={lang === 'ar' ? 'أزياء، تجارة، تقنية...' : 'Fashion, Commerce, Tech...'}
                  className="w-full text-sm font-semibold text-black focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Private Contact Information Section */}
            <div className="pt-4 space-y-3">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {lang === 'ar' ? 'معلومات الاتصال الخاصة' : 'Private Information'}
              </h3>

              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
                <label className="text-xs font-medium text-neutral-500">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-sm font-medium text-black focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 border-b border-neutral-200 pb-2">
                <label className="text-xs font-medium text-neutral-500">
                  {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    className="w-full text-sm font-medium text-black focus:outline-none bg-transparent font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
              >
                {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
