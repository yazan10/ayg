import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Store as StoreIcon, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  Globe, 
  Code2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Film,
  Users,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Crown,
  BadgeCheck,
  Zap,
  Clock,
  Ban,
  Bell,
  Wrench,
  EyeOff,
  Flag,
  UserX,
  MessageSquare,
  UserCheck,
  X
} from 'lucide-react';
import { FirebaseStatus } from './FirebaseStatus';
import { Store, Product, Reel, UserAccount } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    stores, 
    products, 
    orders, 
    reels,
    addReel,
    deleteReel,
    users,
    stories,
    conversations,
    notifications,
    comments,
    adminSettings, 
    updateAdminSettings, 
    logoutAdmin, 
    addStore, 
    updateStore, 
    deleteStore,
    addProduct,
    updateProduct,
    deleteProduct,
    exportVercelSourceCode,
    importBackupData,
    resetToInitialData,
    activateStoreSubscription,
    cancelStoreSubscription,
    isStoreActive,
    purchaseVerification,
    cancelVerification,
    blockedUsers,
    reports,
    banUser,
    unbanUser,
    isUserBanned,
    getDisplayUser,
    bannedWords,
    addBannedWord,
    removeBannedWord,
    sendAdminNotification,
    lang, 
    setLang, 
    t 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'products' | 'reels' | 'users' | 'orders' | 'payments' | 'vercel' | 'subscriptions' | 'notifications' | 'maintenance' | 'bannedwords' | 'reports' | 'banned'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifTitleEn, setNotifTitleEn] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageEn, setNotifMessageEn] = useState('');
  const [bannedWordInput, setBannedWordInput] = useState('');

  // New Reel Form State
  const [showAddReel, setShowAddReel] = useState(false);
  const [newReelData, setNewReelData] = useState({
    userId: stores[0]?.id || 'store-1',
    username: stores[0]?.username || 'oud_elite',
    userAvatar: stores[0]?.avatar || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=100',
    userName: stores[0]?.name || 'نخبة العود الملكي',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43403-large.mp4',
    caption: 'تجربة فاخرة مع تشكيلة العطور الملكية الجديدة في aygram 🌟 #aygram #perfume',
    audioTrack: 'aygram Sound • Trending Audio'
  });

  // New Store Form State
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStoreData, setNewStoreData] = useState({
    name: '',
    nameEn: '',
    username: '',
    category: 'أزياء وموضة',
    categoryEn: 'Fashion & Style',
    bio: '',
    bioEn: '',
    avatar: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    whatsapp: '+966500000000',
    phone: '+966500000000',
    email: 'store@example.com',
    location: 'الرياض، السعودية',
    locationEn: 'Riyadh, Saudi Arabia',
    currency: 'SAR',
    verified: true
  });

  // New Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductData, setNewProductData] = useState({
    storeId: stores[0]?.id || '',
    name: '',
    nameEn: '',
    price: 150,
    originalPrice: 200,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'],
    description: '',
    descriptionEn: '',
    category: 'أزياء وموضة',
    inStock: true,
    stockCount: 25,
    tags: ['جديد', 'عروض']
  });

  const handleCreateStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreData.name.trim() || !newStoreData.username.trim()) return;

    addStore({
      name: newStoreData.name,
      nameEn: newStoreData.nameEn || newStoreData.name,
      username: newStoreData.username.replace('@', '').toLowerCase(),
      category: newStoreData.category,
      categoryEn: newStoreData.categoryEn,
      bio: newStoreData.bio,
      bioEn: newStoreData.bioEn || newStoreData.bio,
      avatar: newStoreData.avatar,
      coverImage: newStoreData.coverImage,
      whatsapp: newStoreData.whatsapp,
      phone: newStoreData.phone,
      email: newStoreData.email,
      location: newStoreData.location,
      locationEn: newStoreData.locationEn,
      currency: newStoreData.currency,
      verified: newStoreData.verified
    });

    setShowAddStore(false);
    setNewStoreData({
      name: '',
      nameEn: '',
      username: '',
      category: 'أزياء وموضة',
      categoryEn: 'Fashion & Style',
      bio: '',
      bioEn: '',
      avatar: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      whatsapp: '+966500000000',
      phone: '+966500000000',
      email: 'store@example.com',
      location: 'الرياض، السعودية',
      locationEn: 'Riyadh, Saudi Arabia',
      currency: 'SAR',
      verified: true
    });
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name.trim() || !newProductData.storeId) return;

    addProduct({
      storeId: newProductData.storeId,
      name: newProductData.name,
      nameEn: newProductData.nameEn || newProductData.name,
      price: Number(newProductData.price),
      originalPrice: Number(newProductData.originalPrice),
      currency: newProductData.currency,
      images: newProductData.images,
      description: newProductData.description,
      descriptionEn: newProductData.descriptionEn || newProductData.description,
      category: newProductData.category,
      inStock: newProductData.inStock,
      stockCount: Number(newProductData.stockCount),
      tags: newProductData.tags
    });

    setShowAddProduct(false);
    setNewProductData({
      storeId: stores[0]?.id || '',
      name: '',
      nameEn: '',
      price: 150,
      originalPrice: 200,
      currency: 'SAR',
      images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'],
      description: '',
      descriptionEn: '',
      category: 'أزياء وموضة',
      inStock: true,
      stockCount: 25,
      tags: ['جديد']
    });
  };

  const handleCreateReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelData.caption.trim() || !newReelData.videoUrl.trim()) return;

    addReel({
      userId: newReelData.userId,
      username: newReelData.username,
      userAvatar: newReelData.userAvatar,
      userName: newReelData.userName,
      verified: true,
      videoUrl: newReelData.videoUrl,
      caption: newReelData.caption,
      captionEn: newReelData.caption,
      audioTrack: newReelData.audioTrack
    });

    setShowAddReel(false);
    setNewReelData({
      userId: stores[0]?.id || 'store-1',
      username: stores[0]?.username || 'oud_elite',
      userAvatar: stores[0]?.avatar || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=100',
      userName: stores[0]?.name || 'نخبة العود الملكي',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43403-large.mp4',
      caption: 'فيديو ريلز جديد على aygram 🔥 #aygram',
      audioTrack: 'aygram Sound • Trending Audio'
    });
  };

  // Generate clean TypeScript data for direct Vercel source code
  const generateVercelSourceCode = () => {
    return `// =========================================================================
// aygram PRODUCTION REPOSITORY SEED DATA (src/data/initialData.ts)
// Generated automatically from aygram Admin Dashboard
// Copy & paste this directly into your Vercel source code (src/data/initialData.ts)
// =========================================================================

import { 
  Store, 
  Product, 
  Story, 
  AdminSettings, 
  UserAccount, 
  Reel, 
  Conversation, 
  NotificationItem, 
  Comment 
} from '../types';

export const INITIAL_USERS: UserAccount[] = ${JSON.stringify(users, null, 2)};

export const INITIAL_STORES: Store[] = ${JSON.stringify(stores, null, 2)};

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const INITIAL_REELS: Reel[] = ${JSON.stringify(reels, null, 2)};

export const INITIAL_STORIES: Story[] = ${JSON.stringify(stories, null, 2)};

export const INITIAL_CONVERSATIONS: Conversation[] = ${JSON.stringify(conversations, null, 2)};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = ${JSON.stringify(notifications, null, 2)};

export const INITIAL_COMMENTS: Comment[] = ${JSON.stringify(comments, null, 2)};

export const INITIAL_SETTINGS: AdminSettings = ${JSON.stringify(adminSettings, null, 2)};
`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateVercelSourceCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadSourceFile = () => {
    const element = document.createElement('a');
    const file = new Blob([generateVercelSourceCode()], { type: 'text/typescript' });
    element.href = URL.createObjectURL(file);
    element.download = 'initialData.ts';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = event => {
        if (typeof event.target?.result === 'string') {
          const ok = importBackupData(event.target.result);
          if (ok) {
            setImportNotice(lang === 'ar' ? 'تم استيراد البيانات وتطبيقها بنجاح!' : 'Data imported successfully!');
          } else {
            setImportNotice(lang === 'ar' ? 'فشل استيراد الملف. تأكد من صحة تنسيق JSON' : 'Failed to import. Invalid JSON.');
          }
          setTimeout(() => setImportNotice(null), 3000);
        }
      };
    }
  };

  const totalSalesRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-black flex flex-col admin-font">
      {/* Top Admin Notice Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-blue-700">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            {lang === 'ar' 
              ? '🔒 أنت الآن في لوحة الإدارة السرية (مخفية بالكامل عن مستخدمي التطبيق العاديين)'
              : '🔒 You are in the Secret Admin Portal (Completely invisible to regular users)'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white font-bold transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.exitAdmin}</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-700 to-sky-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-900/20">
              ay
            </div>
            <div>
              <h1 className="text-xl font-black text-black tracking-tight flex items-center gap-2">
                <span>{lang === 'ar' ? 'لوحة تحكم منصة aygram' : 'aygram Master Control Center'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">
                  Social & Commerce
                </span>
              </h1>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'إدارة المتاجر، المنتجات، الريلز، المستخدمين وتخزين سورس كود فيرسال اللحظي' : 'Stores, Catalog, Reels, Users & Real-time Vercel Source Sync'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{lang === 'ar' ? 'المؤشرات' : 'Overview'}</span>
            </button>

            <button
              onClick={() => setActiveTab('stores')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'stores'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>{t.manageStoresTab}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/60 text-neutral-800">
                {stores.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{t.manageProductsTab}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/60 text-neutral-800">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reels'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>{lang === 'ar' ? 'ريلز وفيديوهات' : 'Reels'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/60 text-neutral-800">
                {reels.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{lang === 'ar' ? 'المستخدمين' : 'Users'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/60 text-neutral-800">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.manageOrdersTab}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/60 text-neutral-800">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{lang === 'ar' ? 'بوابة الدفع (قيد العمل)' : 'Payments (In Dev)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('vercel')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'vercel'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>{lang === 'ar' ? 'تخزين فيرسال اللحظي' : 'Vercel Sync'}</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === 'subscriptions'
                  ? 'bg-amber-500 text-white shadow-sm border-amber-500'
                  : 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الاشتراكات والأسعار ₪' : 'Subscriptions ₪'}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                  : 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إشعارات الإدارة' : 'Notifications'}</span>
              <span className="text-[10px] bg-white/80 text-blue-700 px-1.5 py-0.5 rounded-full">{reports.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('banned')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === 'banned'
                  ? 'bg-red-600 text-white shadow-sm border-red-600'
                  : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الحظر (باند)' : 'Banned'}</span>
              <span className="text-[10px] bg-white/80 text-red-700 px-1.5 py-0.5 rounded-full">{users.filter((u:any) => u.isBanned).length}</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === 'reports'
                  ? 'bg-orange-600 text-white shadow-sm border-orange-600'
                  : 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>{lang === 'ar' ? 'البلاغات' : 'Reports'}</span>
              <span className="text-[10px] bg-white/80 text-orange-700 px-1.5 py-0.5 rounded-full">{reports.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('bannedwords')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === 'bannedwords'
                  ? 'bg-neutral-800 text-white shadow-sm border-neutral-800'
                  : 'text-neutral-700 bg-neutral-100 border-neutral-200 hover:bg-neutral-200'
              }`}
            >
              <Ban className="w-4 h-4" />
              <span>{lang === 'ar' ? 'كلمات ممنوعة' : 'Banned Words'}</span>
              <span className="text-[10px] bg-white/80 text-neutral-700 px-1.5 py-0.5 rounded-full">{bannedWords.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === 'maintenance'
                  ? 'bg-slate-800 text-white shadow-sm border-slate-800'
                  : adminSettings.maintenanceMode ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الصيانة' : 'Maintenance'}</span>
              {adminSettings.maintenanceMode && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{t.activeStores}</p>
                  <p className="text-2xl font-black text-black mt-1">{stores.length}</p>
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>{stores.filter(s => s.verified).length} {lang === 'ar' ? 'موثقة رسمياً' : 'Verified'}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <StoreIcon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{t.totalProducts}</p>
                  <p className="text-2xl font-black text-black mt-1">{products.length}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {products.reduce((acc, p) => acc + p.stockCount, 0)} {lang === 'ar' ? 'قطعة في المخزون' : 'Items in stock'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{t.totalOrders}</p>
                  <p className="text-2xl font-black text-black mt-1">{orders.length}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {orders.filter(o => o.orderStatus === 'processing').length} {lang === 'ar' ? 'قيد التجهيز' : 'Processing'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{t.grossVolume}</p>
                  <p className="text-2xl font-black text-black mt-1">{totalSalesRevenue.toLocaleString()} SAR</p>
                  <p className="text-[11px] text-blue-600 mt-1 font-semibold">
                    {lang === 'ar' ? 'مبيعات الطلبات المسجلة' : 'Recorded Order Volume'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Firebase Status */}
            <FirebaseStatus />

            {/* Reels Toggle - Video uploads */}
            <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${adminSettings.reelsEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${adminSettings.reelsEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-black flex items-center gap-2">
                    {lang === 'ar' ? 'قسم الريلز (الفيديو)' : 'Reels Section (Video)'}
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${adminSettings.reelsEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                      {adminSettings.reelsEnabled ? (lang === 'ar' ? 'مفتوح' : 'Open') : (lang === 'ar' ? 'مغلق' : 'Closed')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    {adminSettings.reelsEnabled
                      ? (lang === 'ar' ? 'رفع الفيديوهات مسموح' : 'Video uploads allowed')
                      : (lang === 'ar' ? 'ممنوع رفع الفيديوهات حالياً — مغلق' : 'Video uploads forbidden — closed')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateAdminSettings({ reelsEnabled: !adminSettings.reelsEnabled })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${adminSettings.reelsEnabled ? 'bg-emerald-600' : 'bg-neutral-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${adminSettings.reelsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Payment Feature Status Card (Highlighted as Requested) */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-black">
                        {lang === 'ar' ? 'نظام الدفع الآمن المتكامل' : 'Secure Payment System'}
                      </h3>
                      <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {lang === 'ar' ? 'الميزة قيد العمل والتطوير ⚙️' : 'Feature Under Development ⚙️'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 mt-1 max-w-2xl leading-relaxed">
                      {lang === 'ar' 
                        ? 'النظام مهيأ لدعم جميع البطاقات الائتمانية المحلية والدولية (مدى Mada، فيزا Visa، ماستركارد Mastercard، أبل باي Apple Pay، وأمريكان إكسبريس). النظام يعمل حالياً بنمط الفحص التجريبي الآمن للتأكد من انسيابية تجربة العميل.'
                        : 'System is architected for all local & global credit cards (Mada, Visa, Mastercard, Apple Pay, Amex). Currently operating in secure Sandbox/Test mode for seamless checkout testing.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
                >
                  {lang === 'ar' ? 'تخصيص بوابة الدفع' : 'Configure Payments'}
                </button>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-black flex items-center gap-2">
                    <StoreIcon className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'ar' ? 'أحدث المتاجر المنضمة' : 'Recent Stores'}</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('stores')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    {lang === 'ar' ? 'عرض الكل' : 'View All'}
                  </button>
                </div>
                <div className="space-y-3">
                  {stores.slice(0, 3).map(store => (
                    <div key={store.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={store.avatar} alt={store.name} className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                        <div>
                          <p className="text-xs font-bold text-black flex items-center gap-1">
                            <span>{lang === 'ar' ? store.name : store.nameEn}</span>
                            {store.verified && <span className="text-blue-500 text-xs">✓</span>}
                          </p>
                          <p className="text-[11px] text-neutral-500">@{store.username} • {lang === 'ar' ? store.category : store.categoryEn}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-neutral-700">
                        {products.filter(p => p.storeId === store.id).length} {lang === 'ar' ? 'منتج' : 'items'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-black flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'ar' ? 'تخزين فيرسال المباشر' : 'Direct Vercel Persistence'}</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('vercel')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    {lang === 'ar' ? 'فتح السورس كود' : 'Open Source'}
                  </button>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {lang === 'ar' 
                    ? 'كافة التعديلات والإضافات التي تجريها تحفظ محلياً وفورياً، ويمكنك بنقرة واحدة نسخ الكود البرمجي الكامل لتحديث مستودع فيرسال (Vercel Repository) مباشرة وبدون أخطاء!'
                    : 'All updates persist instantly. You can copy the unified source data in one click to deploy directly on Vercel with zero database errors.'}
                </p>
                <div className="p-3 bg-neutral-900 text-emerald-400 font-mono text-[11px] rounded-xl flex items-center justify-between">
                  <span>src/data/initialData.ts (Ready)</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-[11px] transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? t.codeCopied : t.copyCode}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STORES MANAGEMENT TAB */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-black">{t.manageStoresTab}</h2>
                <p className="text-xs text-neutral-500">
                  {lang === 'ar' ? 'إنشاء، تعديل، توثيق وحذف متاجر المنصة' : 'Create, verify, and manage all registered stores'}
                </p>
              </div>
              <button
                onClick={() => setShowAddStore(!showAddStore)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة متجر جديد' : 'Add New Store'}</span>
              </button>
            </div>

            {/* Add Store Form */}
            {showAddStore && (
              <form onSubmit={handleCreateStoreSubmit} className="bg-white p-6 rounded-2xl border border-blue-300 shadow-md space-y-4">
                <h3 className="font-bold text-sm text-black border-b pb-2">
                  {lang === 'ar' ? 'بيانات المتجر الجديد' : 'New Store Information'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{t.newStoreName} (عربي)</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: متجر أصايل"
                      value={newStoreData.name}
                      onChange={e => setNewStoreData({ ...newStoreData, name: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">Store Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Asayel Boutique"
                      value={newStoreData.nameEn}
                      onChange={e => setNewStoreData({ ...newStoreData, nameEn: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{t.newStoreUsername}</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="asayel_boutique"
                      value={newStoreData.username}
                      onChange={e => setNewStoreData({ ...newStoreData, username: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{t.newStoreCategory}</label>
                    <select
                      value={newStoreData.category}
                      onChange={e => setNewStoreData({ ...newStoreData, category: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    >
                      <option value="عطور ومستحضرات">عطور ومستحضرات (Perfumes)</option>
                      <option value="أزياء وموضة">أزياء وموضة (Fashion)</option>
                      <option value="أغذية ومشروبات">أغذية ومشروبات (Coffee & Food)</option>
                      <option value="إلكترونيات وهواتف">إلكترونيات وهواتف (Electronics)</option>
                      <option value="هدايا وتحف">هدايا وتحف (Gifts & Crafts)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{t.newStoreAvatar}</label>
                    <input
                      type="url"
                      value={newStoreData.avatar}
                      onChange={e => setNewStoreData({ ...newStoreData, avatar: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{t.newStoreWhatsapp}</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={newStoreData.whatsapp}
                      onChange={e => setNewStoreData({ ...newStoreData, whatsapp: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-xs text-neutral-700">{t.newStoreBio}</label>
                  <textarea
                    rows={2}
                    value={newStoreData.bio}
                    onChange={e => setNewStoreData({ ...newStoreData, bio: e.target.value })}
                    placeholder="وصف مختصر للمتجر..."
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStoreData.verified}
                      onChange={e => setNewStoreData({ ...newStoreData, verified: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600"
                    />
                    <span>{lang === 'ar' ? 'توثيق المتجر فورياً بالشارة الزرقاء' : 'Verify store immediately with badge'}</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStore(false)}
                      className="px-4 py-2 border rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      {t.adminCancel}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      {lang === 'ar' ? 'حفظ وإطلاق المتجر' : 'Launch Store'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Stores List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map(store => {
                const storeProds = products.filter(p => p.storeId === store.id);
                return (
                  <div key={store.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-start gap-3.5">
                      <img src={store.avatar} alt={store.name} className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-black truncate flex items-center gap-1.5">
                            <span>{lang === 'ar' ? store.name : store.nameEn}</span>
                            {store.verified && <span className="text-blue-500 text-xs">✓</span>}
                          </h4>
                          <button
                            onClick={() => updateStore(store.id, { verified: !store.verified })}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                              store.verified 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                : 'bg-neutral-100 text-neutral-500'
                            }`}
                          >
                            {store.verified ? (lang === 'ar' ? 'موثق' : 'Verified') : (lang === 'ar' ? 'غير موثق' : 'Unverified')}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">@{store.username}</p>
                        <p className="text-xs text-neutral-700 mt-2 line-clamp-2 leading-relaxed">
                          {lang === 'ar' ? store.bio : store.bioEn}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4 text-neutral-600 font-medium">
                        <span>{storeProds.length} {lang === 'ar' ? 'منتج' : 'products'}</span>
                        <span>{store.followersCount.toLocaleString()} {lang === 'ar' ? 'متابع' : 'followers'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteStore(store.id)}
                          className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-black">{t.manageProductsTab}</h2>
                <p className="text-xs text-neutral-500">
                  {lang === 'ar' ? 'إدارة كتالوج المنتجات، الأسعار، والمخزون' : 'Catalog, pricing, images, and inventory management'}
                </p>
              </div>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <form onSubmit={handleCreateProductSubmit} className="bg-white p-6 rounded-2xl border border-blue-300 shadow-md space-y-4">
                <h3 className="font-bold text-sm text-black border-b pb-2">
                  {lang === 'ar' ? 'بيانات المنتج الجديد' : 'New Product Details'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'المتجر التابع له' : 'Assign to Store'}</label>
                    <select
                      value={newProductData.storeId}
                      onChange={e => setNewProductData({ ...newProductData, storeId: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>{lang === 'ar' ? s.name : s.nameEn}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'اسم المنتج (عربي)' : 'Product Name (Ar)'}</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عطر عنبر شرقي"
                      value={newProductData.name}
                      onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">Product Name (En)</label>
                    <input
                      type="text"
                      placeholder="e.g. Amber Oriental Perfume"
                      value={newProductData.nameEn}
                      onChange={e => setNewProductData({ ...newProductData, nameEn: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'السعر الحالي (SAR)' : 'Price'}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProductData.price}
                      onChange={e => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'السعر قبل الخصم' : 'Original Price'}</label>
                    <input
                      type="number"
                      min="1"
                      value={newProductData.originalPrice}
                      onChange={e => setNewProductData({ ...newProductData, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'الكمية في المخزون' : 'Stock Quantity'}</label>
                    <input
                      type="number"
                      min="0"
                      value={newProductData.stockCount}
                      onChange={e => setNewProductData({ ...newProductData, stockCount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'رابط صورة المنتج' : 'Image URL'}</label>
                    <input
                      type="url"
                      value={newProductData.images[0]}
                      onChange={e => setNewProductData({ ...newProductData, images: [e.target.value] })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700 text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-xs text-neutral-700">{lang === 'ar' ? 'وصف تفصيلي للمنتج' : 'Description'}</label>
                  <textarea
                    rows={2}
                    value={newProductData.description}
                    onChange={e => setNewProductData({ ...newProductData, description: e.target.value })}
                    placeholder="مواصفات، مميزات، وطريقة الاستخدام..."
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    {t.adminCancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    {lang === 'ar' ? 'إضافة المنتج' : 'Add Product'}
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold">
                    <tr>
                      <th className="p-3.5 text-start">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th className="p-3.5 text-start">{lang === 'ar' ? 'المتجر' : 'Store'}</th>
                      <th className="p-3.5 text-start">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                      <th className="p-3.5 text-start">{lang === 'ar' ? 'المخزون' : 'Stock'}</th>
                      <th className="p-3.5 text-start">{lang === 'ar' ? 'المبيعات' : 'Sales'}</th>
                      <th className="p-3.5 text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map(prod => {
                      const store = stores.find(s => s.id === prod.storeId);
                      return (
                        <tr key={prod.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-bold text-black truncate max-w-xs">{lang === 'ar' ? prod.name : prod.nameEn}</p>
                                <p className="text-[11px] text-neutral-400">{prod.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-neutral-700 font-medium">
                            {store ? (lang === 'ar' ? store.name : store.nameEn) : '-'}
                          </td>
                          <td className="p-3.5 font-bold text-black">
                            {prod.price} {prod.currency}
                            {prod.originalPrice && (
                              <span className="text-[10px] text-neutral-400 line-through ms-1 font-normal">
                                {prod.originalPrice}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.stockCount > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {prod.stockCount} {lang === 'ar' ? 'قطعة' : 'left'}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-neutral-800">
                            {prod.salesCount}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-black">{t.manageOrdersTab}</h2>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'سجل الطلبات الواردة والتحقق من حالة الدفع والتسليم' : 'Track customer checkout orders and delivery stages'}
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h4 className="font-bold text-neutral-700 text-sm">{t.noOrdersYet}</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {lang === 'ar' ? 'قم بإجراء طلب تجريبي من متجر لتظهر بياناته هنا فورياً.' : 'Place a test checkout to see orders appear here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black text-sm">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                            {order.storeName}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {order.paymentStatus === 'test_mode' ? (lang === 'ar' ? 'دفع تجريبي (آمن)' : 'Test Payment') : order.paymentStatus}
                        </span>
                        <span className="text-sm font-black text-black">
                          {order.totalAmount} SAR
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-neutral-500">{lang === 'ar' ? 'بيانات العميل والتوصيل:' : 'Customer Details:'}</p>
                        <p className="font-bold text-black mt-0.5">{order.customerName} - {order.customerPhone}</p>
                        <p className="text-neutral-700">{order.city}، {order.customerAddress}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">{lang === 'ar' ? 'المنتجات المطلوبة:' : 'Items:'}</p>
                        <div className="space-y-1 mt-0.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-neutral-800">
                              <span>• {item.productName} (x{item.quantity})</span>
                              <span className="font-semibold">{item.price * item.quantity} SAR</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS GATEWAY TAB (قيد العمل كما طلب المستخدم) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-black">{t.paymentSystemStatus}</h2>
                <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {t.underDevelopment}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {t.supportedCards}
              </p>
            </div>

            {/* Prominent Under Development Warning Card */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-black">
                  {lang === 'ar' ? 'حالة ميزة الدفع الإلكتروني المباشر' : 'Direct Payment Status'}
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {adminSettings.paymentNotice}
                </p>
              </div>
            </div>

            {/* Gateway Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mada */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-emerald-600 tracking-tight">mada مدى</span>
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                    {lang === 'ar' ? 'قيد الربط البنكي' : 'Integration Ready'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {lang === 'ar' ? 'شبكة المدفوعات الوطنية السعودية لجميع البطاقات البنكية المحلية.' : 'Saudi National Payment Network for debit & salary cards.'}
                </p>
                <div className="pt-2 border-t text-[11px] text-neutral-500 flex justify-between">
                  <span>{lang === 'ar' ? 'رسوم المعاملة' : 'Transaction Fee'}</span>
                  <span className="font-bold text-neutral-800">1.0% + 1 SAR</span>
                </div>
              </div>

              {/* Visa & Mastercard */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-blue-800">VISA</span>
                    <span className="text-lg font-black text-red-600">Mastercard</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                    {lang === 'ar' ? 'قيد العمل' : 'In Progress'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {lang === 'ar' ? 'البطاقات الائتمانية الدولية مع نظام الحماية ثلاثي الأبعاد 3DS.' : 'International credit cards with 3D-Secure 2.0 fraud prevention.'}
                </p>
                <div className="pt-2 border-t text-[11px] text-neutral-500 flex justify-between">
                  <span>{lang === 'ar' ? 'رسوم المعاملة' : 'Transaction Fee'}</span>
                  <span className="font-bold text-neutral-800">2.2% + 1 SAR</span>
                </div>
              </div>

              {/* Apple Pay */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-black"> Apple Pay</span>
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                    {lang === 'ar' ? 'قيد التفعيل' : 'Configuring'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {lang === 'ar' ? 'دفع سريع بنقرة واحدة لأجهزة آبل مع حماية البصمة وتشفير كامل.' : 'One-tap biometric checkout for iPhone & Mac users.'}
                </p>
                <div className="pt-2 border-t text-[11px] text-neutral-500 flex justify-between">
                  <span>{lang === 'ar' ? 'المطابقة' : 'Compatibility'}</span>
                  <span className="font-bold text-neutral-800">iOS & Safari</span>
                </div>
              </div>
            </div>

            {/* Gateway Settings Form */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-black">
                {lang === 'ar' ? 'تخصيص رسالة تنبيه الدفع للعملاء' : 'Customize Payment Notice in Checkout'}
              </h3>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {lang === 'ar' ? 'نص الإشعار (عربي)' : 'Notice Text (Arabic)'}
                </label>
                <textarea
                  rows={2}
                  value={adminSettings.paymentNotice}
                  onChange={e => updateAdminSettings({ paymentNotice: e.target.value })}
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Notice Text (English)
                </label>
                <textarea
                  rows={2}
                  value={adminSettings.paymentNoticeEn}
                  onChange={e => updateAdminSettings({ paymentNoticeEn: e.target.value })}
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* REELS MANAGEMENT TAB */}
        {activeTab === 'reels' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-black">
                  {lang === 'ar' ? 'إدارة فيديوهات الريلز (Reels)' : 'Manage Reels Feed'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {lang === 'ar' ? 'نشر وإدارة فيديوهات الريلز القصيرة وعرض التفاعلات والمشاهدات' : 'Create & curate short video reels, monitor view and like counts'}
                </p>
              </div>

              <button
                onClick={() => setShowAddReel(!showAddReel)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة فيديو ريلز جديد' : 'Add New Reel'}</span>
              </button>
            </div>

            {/* Add Reel Form */}
            {showAddReel && (
              <form onSubmit={handleCreateReelSubmit} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-black flex items-center gap-2">
                  <Film className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'ar' ? 'نشر ريلز جديد' : 'New Video Reel'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'الحساب الناشر' : 'Publisher Store/User'}</label>
                    <select
                      value={newReelData.userId}
                      onChange={e => {
                        const selStore = stores.find(s => s.id === e.target.value);
                        if (selStore) {
                          setNewReelData({
                            ...newReelData,
                            userId: selStore.id,
                            username: selStore.username,
                            userAvatar: selStore.avatar,
                            userName: lang === 'ar' ? selStore.name : selStore.nameEn
                          });
                        }
                      }}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.username} - {lang === 'ar' ? s.name : s.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'المسار الصوتي (Audio Track)' : 'Audio Track'}</label>
                    <input
                      type="text"
                      value={newReelData.audioTrack}
                      onChange={e => setNewReelData({ ...newReelData, audioTrack: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'رابط ملف الفيديو (MP4 direct URL)' : 'Video URL'}</label>
                    <input
                      type="url"
                      required
                      value={newReelData.videoUrl}
                      onChange={e => setNewReelData({ ...newReelData, videoUrl: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700 font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-neutral-700">{lang === 'ar' ? 'الوصف والنصوص والهاشتاقات' : 'Caption & Hashtags'}</label>
                    <textarea
                      rows={3}
                      required
                      value={newReelData.caption}
                      onChange={e => setNewReelData({ ...newReelData, caption: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReel(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
                  >
                    {lang === 'ar' ? 'نشر الريلز فورياً' : 'Publish Reel'}
                  </button>
                </div>
              </form>
            )}

            {/* Reels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reels.map(reel => (
                <div key={reel.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="p-4 flex items-center justify-between border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <img src={reel.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-bold text-black block leading-tight">@{reel.username}</span>
                        <span className="text-[10px] text-neutral-400">{reel.audioTrack}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReel(reel.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2 flex-1">
                    <p className="text-xs text-neutral-700 line-clamp-3 leading-relaxed">
                      {reel.caption}
                    </p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span>❤️ {reel.likes.toLocaleString()}</span>
                      <span>💬 {reel.comments.toLocaleString()}</span>
                      <span>👁️ {reel.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-2.5 border-t border-neutral-100 text-center">
                    <a
                      href={reel.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'معاينة رابط الفيديو' : 'Preview Video Source'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-black">
                {lang === 'ar' ? 'إدارة حسابات المستخدمين وصناع المحتوى' : 'User Accounts & Creators'}
              </h2>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'بيانات الحسابات، التوثيق، والمتابعين في منصة aygram' : 'Profiles, verifications, and followings across aygram'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <table className="w-full text-start text-xs">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                  <tr>
                    <th className="p-3.5 font-bold text-start">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                    <th className="p-3.5 font-bold text-start">{lang === 'ar' ? 'اسم الحساب' : 'Handle'}</th>
                    <th className="p-3.5 font-bold text-start">{lang === 'ar' ? 'المتابعين' : 'Followers'}</th>
                    <th className="p-3.5 font-bold text-start">{lang === 'ar' ? 'التوثيق' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-50/50">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-neutral-200" />
                        <div>
                          <p className="font-bold text-black">{lang === 'ar' ? u.name : u.nameEn}</p>
                          <p className="text-[11px] text-neutral-500 line-clamp-1">{u.bio}</p>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-neutral-700">@{u.username}</td>
                      <td className="p-3.5 font-bold text-neutral-800">{u.followersCount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'موثق رسمياً' : 'Verified'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VERCEL SOURCE CODE TAB (مطلب المستخدم: "وركز ع موضوع التخزين اللحظي في فيرسال") */}
        {activeTab === 'vercel' && (
          <div className="space-y-6">
            {/* Live Instant Sync Header Banner */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                  <h2 className="text-lg font-black tracking-tight">
                    {lang === 'ar' ? 'نظام التخزين اللحظي لسورس كود فيرسال (Vercel Live Source Engine)' : 'Vercel Real-Time Source Sync'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                    Auto-Synced to LocalStorage & Ready for Git
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
                {lang === 'ar'
                  ? 'أي تغيير تقوم به على المتاجر، المنتجات، فيديوهات الريلز، أو إعدادات المنصة يُحفظ لحظياً في الذاكرة المحلية، ويمكنك فوراً تصديره بضغطة زر وتحديث ملف `src/data/initialData.ts` في مستودع GitHub / Vercel ليصبح التخزين دائماً عبر الكود البرمجي المباشر بدون أية قواعد بيانات خارجية.'
                  : 'Every update to stores, products, reels, and settings is persisted in real-time. Export with one click to update `src/data/initialData.ts` in your Vercel/GitHub repo.'}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? t.codeCopied : (lang === 'ar' ? 'نسخ كود initialData.ts بالكامل' : 'Copy Full TypeScript Source')}</span>
                </button>

                <button
                  onClick={handleDownloadSourceFile}
                  className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>{lang === 'ar' ? 'تحميل ملف initialData.ts جاهز' : 'Download initialData.ts'}</span>
                </button>

                <label className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'ar' ? 'استيراد نسخة احتياطية (JSON)' : 'Import Backup'}</span>
                  <input type="file" accept=".json,.ts" onChange={handleImportJson} className="hidden" />
                </label>

                <button
                  onClick={() => {
                    if (confirm(lang === 'ar' ? 'هل أنت متأكد من استعادة البيانات الافتراضية؟' : 'Reset to default data?')) {
                      resetToInitialData();
                    }
                  }}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors ms-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'استعادة البيانات الافتراضية' : 'Reset Data'}</span>
                </button>
              </div>

              {importNotice && (
                <div className="bg-emerald-500/20 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30">
                  {importNotice}
                </div>
              )}
            </div>

            {/* Guide Step-by-Step */}
            <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-black flex items-center gap-2">
                <span>⚡</span>
                <span>{lang === 'ar' ? 'طريقة النشر على Vercel بدون قواعد بيانات (100% Serverless & Static)' : 'How to deploy to Vercel (Zero DB, Zero Errors)'}</span>
              </h4>
              <ol className="text-xs text-neutral-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  {lang === 'ar' 
                    ? 'اضغط زر "تحميل ملف initialData.ts جاهز" أو "نسخ كود initialData.ts بالكامل".' 
                    : 'Click "Download initialData.ts" or "Copy Full TypeScript Source" above.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'استبدل ملف `src/data/initialData.ts` في مشروعك على GitHub ثم ادفعه بـ git commit و git push.'
                    : 'Replace `src/data/initialData.ts` in your project and push to GitHub.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'يقوم فيرسال (Vercel) فوراً بإعادة بناء الموقع خلال ثوانٍ معدودة بكافة التحديثات الجديدة وتصبح دائمة لجميع الزوار مجاناً وبسرعة فائقة!'
                    : 'Vercel will trigger a new deployment in seconds with all latest updates baked into the bundle!'}
                </li>
              </ol>
            </div>

            {/* Code Display */}
            <div className="relative bg-neutral-950 text-neutral-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto max-h-[500px] border border-neutral-800">
              <pre>{generateVercelSourceCode()}</pre>
            </div>
          </div>
        )}

        {/* SUBSCRIPTIONS & PRICING TAB - فصل المتاجر عن الحسابات */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6 admin-font">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 rounded-2xl text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow"><Crown className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-lg font-black">إدارة الاشتراكات والأسعار — فصل المتاجر عن الحسابات</h2>
                  <p className="text-xs text-white/90 mt-1">تحكم كامل بأسعار التفعيل والتوثيق. المتاجر 30₪ / الحسابات 25₪ / الذهبية 50₪ — كلها شهرية بالشيقل.</p>
                </div>
              </div>
            </div>

            {/* Editable Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Store Activation Pricing */}
              <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center"><StoreIcon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-black text-black">تفعيل المتجر</h3>
                    <p className="text-[11px] text-neutral-500">Store Activation • قسم المتاجر وحده</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={adminSettings.subscriptionPricing.storeActivationILS}
                    onChange={e => updateAdminSettings({ subscriptionPricing: { ...adminSettings.subscriptionPricing, storeActivationILS: Number(e.target.value) || 0, updatedAt: new Date().toISOString() } })}
                    className="w-20 p-2 text-xl font-black text-blue-700 bg-blue-50 border border-blue-200 rounded-xl text-center"
                  />
                  <span className="text-sm font-black text-blue-700">₪</span>
                  <span className="text-xs text-neutral-500">/ شهر</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">سعر تفعيل المتجر الواحد شهرياً. المتجر غير المفعّل لا يظهر للشراء.</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">{stores.filter(s => s.subscription?.isActive).length} مفعّل حالياً</span>
                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">{stores.filter(s => !s.subscription?.isActive).length} منتهي</span>
                </div>
              </div>

              {/* Blue Verification Pricing */}
              <div className="bg-white p-5 rounded-2xl border-2 border-sky-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center"><BadgeCheck className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-black text-black">توثيق الحساب</h3>
                    <p className="text-[11px] text-neutral-500">Blue Badge • قسم الحسابات وحده</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={adminSettings.subscriptionPricing.accountVerificationILS}
                    onChange={e => updateAdminSettings({ subscriptionPricing: { ...adminSettings.subscriptionPricing, accountVerificationILS: Number(e.target.value) || 0, updatedAt: new Date().toISOString() } })}
                    className="w-20 p-2 text-xl font-black text-sky-700 bg-sky-50 border border-sky-200 rounded-xl text-center"
                  />
                  <span className="text-sm font-black text-sky-600">₪</span>
                  <span className="text-xs text-neutral-500">/ شهر</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">سعر العلامة الزرقاء للحسابات الشخصية. تمنح ثقة وأولوية.</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">{users.filter(u => u.verification?.tier === 'blue' && u.verification?.isActive).length} موثق أزرق</span>
                </div>
              </div>

              {/* Gold Badge Pricing */}
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-5 rounded-2xl border-2 border-amber-300 shadow-md space-y-3 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow"><Crown className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-black">العلامة الزرقاء الذهبية</h3>
                    <p className="text-[11px] text-amber-100">Gold Badge • مميز</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    min="0"
                    value={adminSettings.subscriptionPricing.goldBadgeILS}
                    onChange={e => updateAdminSettings({ subscriptionPricing: { ...adminSettings.subscriptionPricing, goldBadgeILS: Number(e.target.value) || 0, updatedAt: new Date().toISOString() } })}
                    className="w-20 p-2 text-xl font-black text-amber-700 bg-white border border-amber-200 rounded-xl text-center"
                  />
                  <span className="text-sm font-black">₪</span>
                  <span className="text-xs text-amber-100">/ شهر</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed">الشارة الذهبية المميزة — تشمل الزرقاء + أولوية قصوى + دعم VIP.</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-white text-amber-700 font-bold">{users.filter(u => u.verification?.tier === 'gold' && u.verification?.isActive).length} ذهبي 👑</span>
                </div>
              </div>
            </div>

            {/* Stores Subscription Management - Separate Section */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StoreIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-black text-sm text-blue-900">إدارة اشتراكات المتاجر — قسم منفصل (30₪)</h3>
                </div>
                <span className="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-bold">{stores.length} متجر</span>
              </div>
              <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
                {stores.map(store => {
                  const active = store.subscription?.isActive && store.subscription?.status === 'active' && (!store.subscription.expiresAt || new Date(store.subscription.expiresAt).getTime() > Date.now());
                  return (
                    <div key={store.id} className="p-4 flex items-center justify-between gap-3 hover:bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <img src={store.avatar} alt={store.name} className={`w-10 h-10 rounded-xl object-cover border-2 ${active ? 'border-emerald-300' : 'border-red-200 grayscale'}`} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-black">{store.name}</span>
                            <span className="text-xs text-neutral-500 font-mono">@{store.username}</span>
                            {active ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1"><Check className="w-3 h-3" />مفعّل</span> : <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">منتهي</span>}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {store.subscription?.expiresAt ? `ينتهي: ${new Date(store.subscription.expiresAt).toLocaleDateString('ar-EG')} • ${store.subscription.pricePaidILS}₪` : 'غير مفعّل'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {active ? (
                          <button onClick={() => cancelStoreSubscription(store.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1">
                            <Ban className="w-3.5 h-3.5" />إلغاء
                          </button>
                        ) : (
                          <button onClick={() => activateStoreSubscription(store.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow">
                            <Zap className="w-3.5 h-3.5" />تفعيل {adminSettings.subscriptionPricing.storeActivationILS}₪
                          </button>
                        )}
                        <button onClick={() => { if (confirm('حذف المتجر؟')) deleteStore(store.id); }} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accounts Verification Management - Separate Section */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  <h3 className="font-black text-sm text-sky-900">إدارة توثيق الحسابات — قسم منفصل (25₪ / 50₪)</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded-full font-bold">{users.filter(u => u.verification?.tier === 'blue' && u.verification.isActive).length} أزرق</span>
                  <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-bold">{users.filter(u => u.verification?.tier === 'gold' && u.verification.isActive).length} ذهبي</span>
                </div>
              </div>
              <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
                {users.map(user => {
                  const tier = user.verification?.tier || 'none';
                  const isActive = user.verification?.isActive && (!user.verification.expiresAt || new Date(user.verification.expiresAt).getTime() > Date.now());
                  return (
                    <div key={user.id} className="p-4 flex items-center justify-between gap-3 hover:bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full object-cover border-2 ${tier === 'gold' ? 'border-amber-400' : tier === 'blue' ? 'border-sky-400' : 'border-neutral-200'}`} />
                          {tier === 'gold' && isActive && <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] border-2 border-white">👑</span>}
                          {tier === 'blue' && isActive && <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">✓</span>}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-black">{user.name}</span>
                            <span className="text-xs text-neutral-500 font-mono">@{user.username}</span>
                            {tier === 'gold' && isActive && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-black">ذهبية 50₪</span>}
                            {tier === 'blue' && isActive && <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full font-bold">زرقاء 25₪</span>}
                            {(!isActive || tier === 'none') && <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full font-bold">عادي</span>}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {isActive && user.verification?.expiresAt ? `ينتهي: ${new Date(user.verification.expiresAt).toLocaleDateString('ar-EG')} • ${user.verification.pricePaidILS}₪` : tier !== 'none' && !isActive ? 'منتهي — يحتاج تجديد' : 'غير موثق'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => purchaseVerification(user.id, 'blue')} className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold">زرقاء {adminSettings.subscriptionPricing.accountVerificationILS}₪</button>
                        <button onClick={() => purchaseVerification(user.id, 'gold')} className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"><Crown className="w-3 h-3" />ذهبية {adminSettings.subscriptionPricing.goldBadgeILS}₪</button>
                        {(tier === 'blue' || tier === 'gold') && isActive && (
                          <button onClick={() => cancelVerification(user.id)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="إلغاء التوثيق">
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-black">💡 فصل واضح:</span>
                <span className="text-neutral-300"> المتاجر = للبيع (30₪) • الحسابات = للتوثيق (25₪/50₪) • كل اشتراك شهري مستقل</span>
              </div>
              <button onClick={() => window.open('/pricing', '_blank')} className="px-4 py-2 bg-white text-neutral-900 rounded-xl text-xs font-black">معاينة صفحة الأسعار →</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS FROM ADMIN */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Bell className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-black">إرسال إشعارات من الإدارة</h2>
                  <p className="text-xs text-blue-100">إرسال إشعارات لجميع المستخدمين — تظهر في مركز الإشعارات فوراً</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">العنوان (عربي) *</label>
                  <input type="text" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="مثال: تحديث هام للمنصة" className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Title (English)</label>
                  <input type="text" value={notifTitleEn} onChange={e => setNotifTitleEn(e.target.value)} placeholder="Important update" className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-blue-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">الرسالة (عربي) *</label>
                <textarea rows={3} value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="نص الإشعار الذي سيظهر لجميع المستخدمين..." className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Message (English)</label>
                <textarea rows={2} value={notifMessageEn} onChange={e => setNotifMessageEn(e.target.value)} placeholder="English message..." className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-blue-600" />
              </div>
              <button
                onClick={() => {
                  if (!notifTitle.trim() || !notifMessage.trim()) return;
                  sendAdminNotification(notifTitle, notifTitleEn || notifTitle, notifMessage, notifMessageEn || notifMessage);
                  setNotifTitle(''); setNotifTitleEn(''); setNotifMessage(''); setNotifMessageEn('');
                  alert(lang === 'ar' ? 'تم إرسال الإشعار لجميع المستخدمين!' : 'Notification sent to all users!');
                }}
                disabled={!notifTitle.trim() || !notifMessage.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-black shadow flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                {lang === 'ar' ? 'إرسال الإشعار للجميع' : 'Send to All Users'}
              </button>
              <p className="text-[11px] text-neutral-500 text-center">سيظهر الإشعار في صفحة الإشعارات وعداد القلب في الهيدر</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-4">
              <h4 className="font-black text-sm mb-3">آخر الإشعارات المرسلة</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reports.length === 0 && <p className="text-xs text-neutral-400 text-center py-4">لا توجد إشعارات إدارية بعد</p>}
                {reports.slice(0, 5).map(r => (
                  <div key={r.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
                    <span className="font-bold">{r.targetName}</span> • {r.reason}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BANNED USERS - aygram_user */}
        {activeTab === 'banned' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-2xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><UserX className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-black">الحسابات المحظورة (باند)</h2>
                  <p className="text-xs text-red-100">الحسابات المحظورة تظهر كـ aygram_user بصورة رمادية افتراضية</p>
                </div>
                <span className="ms-auto text-xs bg-white text-red-700 px-3 py-1 rounded-full font-black">{users.filter((u:any) => u.isBanned).length} محظور</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-neutral-100 max-h-[500px] overflow-y-auto">
                {users.map(user => {
                  const isBanned = !!(user as any).isBanned;
                  const display = isBanned ? { name: 'aygram_user', username: 'aygram_user', avatar: 'https://ui-avatars.com/api/?name=aygram+user&background=d1d5db&color=6b7280&size=200&rounded=true&bold=true&format=svg' } : { name: user.name, username: user.username, avatar: user.avatar };
                  return (
                    <div key={user.id} className={`p-4 flex items-center justify-between gap-3 ${isBanned ? 'bg-red-50/50' : 'hover:bg-neutral-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={display.avatar} alt={display.name} className={`w-10 h-10 rounded-full object-cover border-2 ${isBanned ? 'border-red-200 grayscale' : 'border-neutral-200'}`} />
                          {isBanned && <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] border-2 border-white"><Ban className="w-3 h-3" /></span>}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-black ${isBanned ? 'text-neutral-500' : 'text-black'}`}>{display.name}</span>
                            <span className="text-xs text-neutral-500 font-mono">@{display.username}</span>
                            {isBanned ? <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">باند</span> : <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">نشط</span>}
                          </div>
                          <div className="text-xs text-neutral-500">{user.bio?.slice(0, 60) || user.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isBanned ? (
                          <button onClick={() => unbanUser(user.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" />فك الحظر
                          </button>
                        ) : (
                          <button onClick={() => banUser(user.id, 'مخالفة شروط المجتمع')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                            <Ban className="w-3.5 h-3.5" />حظر (باند)
                          </button>
                        )}
                        <button onClick={() => { if(confirm('حذف المستخدم نهائياً؟')) { const idx = users.findIndex(u=>u.id===user.id); if(idx!==-1) { const newUsers = users.filter(u=>u.id!==user.id); localStorage.setItem('aygram_users_v2', JSON.stringify(newUsers)); location.reload(); } } }} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-neutral-900 text-white rounded-xl text-xs leading-relaxed">
              <span className="font-black">طريقة العرض:</span> الحساب المحظور يظهر للجميع كـ <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded">aygram_user</span> مع صورة رمادية افتراضية (شخص رمادي) مثل انستغرام وفيسبوك
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Flag className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-black">البلاغات</h2>
                  <p className="text-xs text-orange-100">جميع أنواع الإبلاغات: إباحي، كفر، انتحال، ابتزاز، تشهير، مواضيع خطيرة، إرهاب، وغيرها</p>
                </div>
                <span className="ms-auto text-xs bg-white text-orange-600 px-3 py-1 rounded-full font-black">{reports.length} بلاغ</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              {reports.length === 0 ? (
                <div className="p-12 text-center">
                  <Flag className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">لا توجد بلاغات حالياً</p>
                  <p className="text-xs text-neutral-400 mt-1">البلاغات من المستخدمين ستظهر هنا مع جميع الأنواع</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
                  {reports.map(report => (
                    <div key={report.id} className="p-4 hover:bg-neutral-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                              report.reason === 'porn' ? 'bg-pink-100 text-pink-700 border-pink-200' :
                              report.reason === 'terrorism' ? 'bg-red-100 text-red-700 border-red-200' :
                              report.reason === 'blasphemy' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                              report.reason === 'impersonation' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {report.reason === 'porn' ? 'إباحي' : report.reason === 'blasphemy' ? 'كفر' : report.reason === 'impersonation' ? 'انتحال' : report.reason === 'extortion' ? 'ابتزاز' : report.reason === 'defamation' ? 'تشهير' : report.reason === 'dangerous' ? 'مواضيع خطيرة' : report.reason === 'terrorism' ? 'إرهاب' : report.reason}
                            </span>
                            <span className="text-xs text-neutral-500">{new Date(report.createdAt).toLocaleDateString('ar-EG')}</span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{report.status}</span>
                          </div>
                          <p className="text-sm font-bold text-black mt-1">
                            {report.reporterUsername} أبلغ عن {report.targetType} <span className="font-mono text-blue-600">@{report.targetUsername || report.targetId}</span>
                          </p>
                          {report.targetName && <p className="text-xs text-neutral-600">{report.targetName}</p>}
                          <p className="text-xs text-neutral-700 mt-1 bg-neutral-50 p-2 rounded-lg border border-neutral-100">{report.description || 'بدون وصف'}</p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              const updated = reports.map(r => r.id === report.id ? { ...r, status: 'resolved' as const } : r);
                              localStorage.setItem('aygram_reports_v2', JSON.stringify(updated));
                              location.reload();
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            حل
                          </button>
                          <button
                            onClick={() => {
                              const updated = reports.filter(r => r.id !== report.id);
                              localStorage.setItem('aygram_reports_v2', JSON.stringify(updated));
                              location.reload();
                            }}
                            className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-black rounded-lg text-xs font-bold"
                          >
                            تجاهل
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BANNED WORDS */}
        {activeTab === 'bannedwords' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 p-6 rounded-2xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Ban className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-black">الكلمات الممنوعة</h2>
                  <p className="text-xs text-neutral-300">التحكم في الكلمات التي يتم فلترتها في المنشورات والتعليقات والرسائل</p>
                </div>
                <label className="ms-auto flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={adminSettings.bannedWordsEnabled} onChange={e => updateAdminSettings({ bannedWordsEnabled: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-xs font-bold">{adminSettings.bannedWordsEnabled ? 'مفعّل' : 'معطّل'}</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bannedWordInput}
                  onChange={e => setBannedWordInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (bannedWordInput.trim()) { addBannedWord(bannedWordInput); setBannedWordInput(''); } } }}
                  placeholder="أضف كلمة ممنوعة..."
                  className="flex-1 px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-red-500"
                />
                <button
                  onClick={() => { if (bannedWordInput.trim()) { addBannedWord(bannedWordInput); setBannedWordInput(''); } }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold"
                >
                  إضافة
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                {bannedWords.length === 0 ? (
                  <span className="text-xs text-neutral-400">لا توجد كلمات ممنوعة — أضف كلمات ليتم فلترتها تلقائياً</span>
                ) : (
                  bannedWords.map(word => (
                    <span key={word} className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">
                      {word}
                      <button onClick={() => removeBannedWord(word)} className="w-4 h-4 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <p className="text-[11px] text-neutral-500">
                عند تفعيلها، سيتم منع نشر أي منشور أو تعليق أو رسالة تحتوي على هذه الكلمات وسيظهر تنبيه للمستخدم.
              </p>
            </div>
          </div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl text-white ${adminSettings.maintenanceMode ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Wrench className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-black">{adminSettings.maintenanceMode ? 'وضع الصيانة مفعّل' : 'وضع الصيانة معطّل'}</h2>
                  <p className="text-xs opacity-90">{adminSettings.maintenanceMode ? 'المنصة مغلقة للزوار — الإدارة فقط يمكنها الدخول' : 'المنصة مفتوحة للجميع بشكل طبيعي'}</p>
                </div>
                <button
                  onClick={() => updateAdminSettings({ maintenanceMode: !adminSettings.maintenanceMode })}
                  className={`ms-auto relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${adminSettings.maintenanceMode ? 'bg-white' : 'bg-white/30'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full transition-transform shadow ${adminSettings.maintenanceMode ? 'translate-x-6 bg-red-600' : 'translate-x-1 bg-white'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
              <div>
                <label className="block text-xs font-bold mb-1">رسالة الصيانة (عربي)</label>
                <input type="text" value={adminSettings.maintenanceMessage} onChange={e => updateAdminSettings({ maintenanceMessage: e.target.value })} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-blue-600" placeholder="المنصة تحت الصيانة..." />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Maintenance Message (English)</label>
                <input type="text" value={adminSettings.maintenanceMessageEn} onChange={e => updateAdminSettings({ maintenanceMessageEn: e.target.value })} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm outline-none focus:border-blue-600" placeholder="Platform under maintenance..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">تفعيل التوثيق</label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-neutral-50 rounded-xl border">
                    <input type="checkbox" checked={adminSettings.allowNewStores} onChange={e => updateAdminSettings({ allowNewStores: e.target.checked })} className="w-4 h-4" />
                    <span className="text-xs font-bold">السماح بإنشاء متاجر جديدة</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">المحرك اللحظي</label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-neutral-50 rounded-xl border">
                    <input type="checkbox" checked={adminSettings.realtimeEngineEnabled} onChange={e => updateAdminSettings({ realtimeEngineEnabled: e.target.checked })} className="w-4 h-4" />
                    <span className="text-xs font-bold">تفعيل المحرك اللحظي</span>
                  </label>
                </div>
              </div>
              {adminSettings.maintenanceMode && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <strong>تنبيه:</strong> عند تفعيل وضع الصيانة، سيرى الزوار شاشة صيانة فقط مع الرسالة أعلاه، بينما تبقى لوحة الإدارة متاحة.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
