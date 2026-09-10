export type Language = 'ar' | 'en';

export interface Comment {
  id: string;
  targetId: string; // post or reel id
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userName: string;
  verified: boolean;
  videoUrl: string;
  caption: string;
  captionEn?: string;
  audioTrack: string;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  tags: string[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  text?: string;
  mediaUrl?: string;
  isAudio?: boolean;
  audioDuration?: string;
  isLiked?: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantUsername: string;
  participantName: string;
  participantAvatar: string;
  participantVerified: boolean;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: DirectMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'order' | 'reel';
  actorUsername: string;
  actorName: string;
  actorAvatar: string;
  actorVerified?: boolean;
  text: string;
  textEn: string;
  targetImage?: string;
  time: string;
  isRead: boolean;
}

export type VerificationTier = 'none' | 'blue' | 'gold';

export interface AccountVerification {
  tier: VerificationTier; // none | blue (25₪) | gold (50₪ blue+gold)
  isActive: boolean;
  expiresAt?: string; // ISO date
  startedAt?: string;
  pricePaidILS: number;
  autoRenew: boolean;
}

export const DEFAULT_BANNED_AVATAR = 'https://ui-avatars.com/api/?name=aygram+user&background=d1d5db&color=6b7280&size=200&rounded=true&bold=true&format=svg';
export const BANNED_USERNAME = 'aygram_user';
export const BANNED_NAME = 'aygram_user';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  nameEn?: string;
  avatar: string;
  bio: string;
  bioEn?: string;
  website?: string;
  verified: boolean; // legacy: true if tier !== 'none' and active
  verification?: AccountVerification;
  verificationTier?: VerificationTier; // shortcut for UI
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isBlocked?: boolean;
  isBlockedByMe?: boolean;
  isBanned?: boolean;
  bannedAt?: string;
  bannedReason?: string;
  category?: string;
  categoryEn?: string;
  isCurrentUser?: boolean;
  accountType?: 'personal' | 'creator' | 'business'; // فصل الحسابات الشخصية عن حسابات الأعمال
}

export interface BlockedUser {
  id: string;
  userId: string; // المحظور
  blockedBy: string; // الحاظر
  username: string;
  name: string;
  avatar: string;
  reason?: string;
  createdAt: string;
}

export type ReportReason = 'spam' | 'abuse' | 'fake' | 'inappropriate' | 'copyright' | 'other' | 'porn' | 'blasphemy' | 'impersonation' | 'extortion' | 'defamation' | 'dangerous' | 'terrorism' | 'harassment';
export type ReportTargetType = 'user' | 'store' | 'product' | 'reel' | 'comment' | 'message';

export interface Report {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetId: string;
  targetUsername?: string;
  targetType: ReportTargetType;
  targetName?: string;
  reason: ReportReason;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  nameEn: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  description: string;
  descriptionEn: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  likes: number;
  salesCount: number;
  isFeatured?: boolean;
  createdAt: string;
  tags: string[];
  comments?: Comment[];
}

export interface StoryHighlight {
  id: string;
  title: string;
  titleEn: string;
  coverImage: string;
}

export interface Story {
  id: string;
  storeId: string;
  storeName: string;
  storeAvatar: string;
  mediaUrl: string;
  caption: string;
  captionEn: string;
  productId?: string;
  createdAt: string;
  isSeen?: boolean;
  likesCount?: number;
}

export type StoreSubscriptionStatus = 'active' | 'expired' | 'pending' | 'inactive';

export interface StoreSubscription {
  status: StoreSubscriptionStatus;
  isActive: boolean;
  expiresAt?: string; // ISO date
  startedAt?: string;
  pricePaidILS: number; // 30₪ monthly
  autoRenew: boolean;
  planId: 'store_monthly';
  lastPaymentAt?: string;
}

export interface Store {
  id: string;
  username: string; // e.g. @nokhba_perfume
  name: string;
  nameEn: string;
  bio: string;
  bioEn: string;
  avatar: string;
  coverImage?: string;
  category: string;
  categoryEn: string;
  verified: boolean;
  followersCount: number;
  rating: number;
  whatsapp: string;
  phone: string;
  email: string;
  website?: string;
  location: string;
  locationEn: string;
  currency: string;
  highlights: StoryHighlight[];
  createdAt: string;
  isFollowing?: boolean;
  // فصل المتاجر: اشتراك المتجر الشهري
  subscription?: StoreSubscription;
  storeType?: 'verified_store' | 'pending_store'; // نوع المتجر
  ownerId?: string; // معرف مالك المتجر (UserAccount.id)
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  paymentMethod: 'credit_card' | 'mada' | 'apple_pay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'test_mode';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface SubscriptionPricing {
  storeActivationILS: number; // سعر تفعيل المتجر شهرياً (30₪)
  accountVerificationILS: number; // توثيق الحساب (علامة زرقاء) شهرياً (25₪)
  goldBadgeILS: number; // العلامة الزرقاء الذهبية شهرياً (50₪)
  currency: 'ILS';
  updatedAt?: string;
}

export interface AdminSettings {
  allowNewStores: boolean;
  paymentGatewaysEnabled: boolean;
  paymentNotice: string;
  paymentNoticeEn: string;
  platformFeePercent: number;
  bannerAnnouncement: string;
  bannerAnnouncementEn: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceMessageEn: string;
  lastSyncTimestamp?: string;
  realtimeEngineEnabled: boolean;
  subscriptionPricing: SubscriptionPricing;
  reelsEnabled: boolean; // إغلاق قسم الريلز — ممنوع رفع الفيديوهات
  bannedWords: string[]; // الكلمات الممنوعة
  bannedWordsEnabled: boolean;
}

export type CurrencyCode = 'SAR' | 'ILS' | 'JOD' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  symbolEn: string;
  nameAr: string;
  nameEn: string;
  rateFromSAR: number; // conversion factor: priceInCurrency = priceInSAR * rateFromSAR
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    symbolEn: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    rateFromSAR: 1,
    flag: '🇸🇦'
  },
  ILS: {
    code: 'ILS',
    symbol: '₪',
    symbolEn: 'ILS',
    nameAr: 'شيقل فلسطيني',
    nameEn: 'Israeli/Palestinian Shekel',
    rateFromSAR: 1.0,
    flag: '🇵🇸'
  },
  JOD: {
    code: 'JOD',
    symbol: 'د.أ',
    symbolEn: 'JOD',
    nameAr: 'دينار أردني',
    nameEn: 'Jordanian Dinar',
    rateFromSAR: 0.189,
    flag: '🇯🇴'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    symbolEn: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    rateFromSAR: 0.267,
    flag: '🇺🇸'
  }
};

export interface LiveComment {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  isGiftNotice?: boolean;
}

export interface LiveGift {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  priceSAR: number;
}

export interface LiveStream {
  id: string;
  userId: string;
  username: string;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  title: string;
  titleEn?: string;
  viewerCount: number;
  likesCount: number;
  videoUrl: string;
  isLive: boolean;
  startedAt: string;
  category: string;
  comments: LiveComment[];
}

export interface WalletTransaction {
  id: string;
  type: 'live_gift' | 'product_sale' | 'withdrawal' | 'bonus';
  title: string;
  titleEn: string;
  amountSAR: number;
  date: string;
  status: 'completed' | 'processing' | 'pending';
  senderUsername?: string;
  note?: string;
}

export interface CreatorWallet {
  balanceSAR: number;
  totalEarnedSAR: number;
  salesEarningsSAR: number;
  liveGiftsEarningsSAR: number;
  pendingPayoutSAR: number;
  transactions: WalletTransaction[];
}

export interface ApiEndpoint {
  id?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title?: string;
  titleEn?: string;
  category?: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  requestExample?: Record<string, unknown>;
  responseExample?: Record<string, unknown>;
  sampleBody?: Record<string, unknown>;
  sampleResponse?: Record<string, unknown>;
}

export const SUBSCRIPTION_PLANS = {
  STORE_ACTIVATION: {
    id: 'store_monthly' as const,
    nameAr: 'تفعيل المتجر',
    nameEn: 'Store Activation',
    priceILS: 30,
    priceSAR: 30,
    interval: 'monthly' as const,
    descriptionAr: 'تفعيل متجرك للبيع واستقبال الطلبات لمدة 30 يوم',
    descriptionEn: 'Activate your store to sell and receive orders for 30 days',
    icon: '🏪',
    color: 'blue',
  },
  ACCOUNT_VERIFICATION: {
    id: 'verification_blue' as const,
    nameAr: 'توثيق الحساب',
    nameEn: 'Account Verification',
    priceILS: 25,
    priceSAR: 25,
    interval: 'monthly' as const,
    descriptionAr: 'علامة التوثيق الزرقاء لحسابك الشخصي',
    descriptionEn: 'Blue verification badge for your personal account',
    icon: '✓',
    color: 'sky',
  },
  GOLD_BADGE: {
    id: 'gold_badge' as const,
    nameAr: 'العلامة الزرقاء الذهبية',
    nameEn: 'Gold Blue Badge',
    priceILS: 50,
    priceSAR: 50,
    interval: 'monthly' as const,
    descriptionAr: 'علامة التوثيق الذهبية المميزة + أولوية الظهور + دعم مميز',
    descriptionEn: 'Premium gold badge + priority + premium support',
    icon: '👑',
    color: 'amber',
  },
};
