import { Store, Product, Story, AdminSettings, Reel, Conversation, NotificationItem, UserAccount, Comment, LiveStream, LiveGift, CreatorWallet } from '../types';

export const INITIAL_STORES: Store[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_STORIES: Story[] = [];

export const INITIAL_SETTINGS: AdminSettings = {
  allowNewStores: true,
  paymentGatewaysEnabled: false, // Under development per user prompt
  paymentNotice: 'نظام الدفع الإلكتروني المباشر بجميع البطاقات الائتمانية المحلية والدولية قيد التفعيل والربط البنكي (الميزة قيد العمل). يمكنك إتمام طلبات تجريبية آمنة ومتابعتها فورياً.',
  paymentNoticeEn: 'Direct online payment for local & international credit cards is currently under active banking integration (Feature Under Development). You can place secure test orders now.',
  platformFeePercent: 2.5,
  bannerAnnouncement: '✨ أهلاً بك في aygram - منصة التواصل الاجتماعي المتكاملة والمتاجر الرقمية!',
  bannerAnnouncementEn: '✨ Welcome to aygram - The All-in-One Social Network & Instagram Store Platform!',
  maintenanceMode: false,
  maintenanceMessage: 'المنصة تحت الصيانة حالياً — نعود قريباً',
  maintenanceMessageEn: 'Platform under maintenance — back soon',
  lastSyncTimestamp: new Date().toISOString(),
  realtimeEngineEnabled: true,
  subscriptionPricing: {
    storeActivationILS: 30,
    accountVerificationILS: 25,
    goldBadgeILS: 50,
    currency: 'ILS',
    updatedAt: new Date().toISOString(),
  },
  reelsEnabled: false,
  bannedWords: ['كلمات', 'ممنوعة', 'test'],
  bannedWordsEnabled: true
};

export const INITIAL_USERS: UserAccount[] = [];

export const INITIAL_REELS: Reel[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_COMMENTS: Comment[] = [];

export const LIVE_GIFTS: LiveGift[] = [
  { id: 'gift-1', nameAr: 'وردة بيضاء', nameEn: 'White Rose', icon: '🌹', priceSAR: 5 },
  { id: 'gift-2', nameAr: 'فنجان قهوة مختصة', nameEn: 'Artisan Coffee', icon: '☕', priceSAR: 15 },
  { id: 'gift-3', nameAr: 'ماسة زرقاء لامعة', nameEn: 'Blue Diamond', icon: '💎', priceSAR: 50 },
  { id: 'gift-4', nameAr: 'تاج الفخامة الملكي', nameEn: 'Royal Crown', icon: '👑', priceSAR: 100 },
  { id: 'gift-5', nameAr: 'صاروخ الدعم الذهبي', nameEn: 'Gold Rocket', icon: '🚀', priceSAR: 250 },
  { id: 'gift-6', nameAr: 'كأس التميز الأسطوري', nameEn: 'Champion Trophy', icon: '🏆', priceSAR: 500 }
];

export const EMPTY_GIFTS = LIVE_GIFTS;

export const INITIAL_LIVE_STREAMS: LiveStream[] = [];

export const INITIAL_WALLET: CreatorWallet = {
  balanceSAR: 0.00,
  totalEarnedSAR: 0.00,
  salesEarningsSAR: 0.00,
  liveGiftsEarningsSAR: 0.00,
  pendingPayoutSAR: 0.00,
  transactions: []
};
