import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { 
  Store, 
  Product, 
  Story, 
  Order, 
  CartItem, 
  Language, 
  AdminSettings, 
  Reel, 
  Conversation, 
  NotificationItem, 
  UserAccount, 
  Comment,
  CurrencyCode,
  CURRENCIES,
  LiveStream,
  LiveGift,
  CreatorWallet,
  WalletTransaction,
  VerificationTier,
  StoreSubscriptionStatus,
  SUBSCRIPTION_PLANS,
  BlockedUser,
  Report,
  ReportReason,
  ReportTargetType
} from '../types';
import { syncStoresToFirestore, syncProductsToFirestore, syncUsersToFirestore } from '../lib/firestoreSync';
import { 
  INITIAL_STORES, 
  INITIAL_PRODUCTS, 
  INITIAL_STORIES, 
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_REELS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMMENTS,
  INITIAL_LIVE_STREAMS,
  INITIAL_WALLET,
  LIVE_GIFTS
} from '../data/initialData';
import { translations } from '../data/translations';

interface StoreContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amountSAR: number, overrideCurrency?: CurrencyCode) => string;
  t: typeof translations['ar'];
  viewMode: 'mobile' | 'desktop';
  setViewMode: (mode: 'mobile' | 'desktop') => void;
  activeTab: 'home' | 'explore' | 'reels' | 'messages' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'reels' | 'messages' | 'orders' | 'profile') => void;
  stores: Store[];
  products: Product[];
  stories: Story[];
  orders: Order[];
  cart: CartItem[];
  reels: Reel[];
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  users: UserAccount[];
  currentUser: UserAccount | null;
  updateCurrentUser: (updated: Partial<UserAccount>) => void;
  comments: Comment[];
  likedProducts: string[];
  savedProducts: string[];
  likedReels: string[];
  savedReels: string[];
  isAdmin: boolean;
  adminModalOpen: boolean;
  adminSettings: AdminSettings;
  setAdminModalOpen: (open: boolean) => void;
  handleLogoClick: () => void;
  verifyAdminPassword: (password: string) => boolean;
  logoutAdmin: () => void;
  addStore: (newStore: Omit<Store, 'id' | 'createdAt' | 'highlights' | 'rating' | 'followersCount'>) => Store;
  updateStore: (id: string, updated: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  addProduct: (newProd: Omit<Product, 'id' | 'createdAt' | 'likes' | 'salesCount'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReel: (newReel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'commentsCount' | 'sharesCount' | 'viewsCount'>) => Reel;
  deleteReel: (reelId: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt'>) => void;
  sendMessage: (conversationId: string, text: string) => void;
  toggleLikeMessage: (conversationId: string, messageId: string) => void;
  startDirectMessage: (participant: { id: string; username: string; name: string; avatar: string; verified: boolean }) => void;
  addComment: (targetId: string, text: string) => void;
  toggleLikeComment: (commentId: string) => void;
  toggleFollowUser: (userId: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    city: string;
    paymentMethod: 'credit_card' | 'mada' | 'apple_pay' | 'cod';
  }) => Order;
  toggleLikeProduct: (productId: string) => void;
  toggleSaveProduct: (productId: string) => void;
  activeStoreModal: Store | null;
  setActiveStoreModal: (store: Store | null) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  activeCommentTarget: { id: string; title: string; type: 'product' | 'reel' } | null;
  setActiveCommentTarget: (target: { id: string; title: string; type: 'product' | 'reel' } | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCreateStoreOpen: boolean;
  setIsCreateStoreOpen: (open: boolean) => void;
  isCreateMediaOpen: boolean;
  setIsCreateMediaOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  isLiveViewerOpen: boolean;
  setIsLiveViewerOpen: (open: boolean) => void;
  isGoLiveModalOpen: boolean;
  setIsGoLiveModalOpen: (open: boolean) => void;
  isWalletOpen: boolean;
  setIsWalletOpen: (open: boolean) => void;
  isApiExplorerOpen: boolean;
  setIsApiExplorerOpen: (open: boolean) => void;
  liveStreams: LiveStream[];
  activeLiveStream: LiveStream | null;
  setActiveLiveStream: (stream: LiveStream | null) => void;
  startLiveStream: (title: string, category: string) => LiveStream;
  endLiveStream: (streamId: string) => void;
  sendLiveComment: (streamId: string, text: string) => void;
  sendLiveGift: (streamId: string, gift: LiveGift) => void;
  likeLiveStream: (streamId: string) => void;
  wallet: CreatorWallet;
  withdrawEarnings: (amountSAR: number, method: string, note?: string) => boolean;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  exportVercelSourceCode: () => string;
  importBackupData: (jsonString: string) => boolean;
  resetToInitialData: () => void;
  // فصل المتاجر عن الحسابات + الاشتراكات
  activateStoreSubscription: (storeId: string) => boolean;
  renewStoreSubscription: (storeId: string) => boolean;
  cancelStoreSubscription: (storeId: string) => void;
  isStoreActive: (storeId: string) => boolean;
  purchaseVerification: (userId: string, tier: VerificationTier) => boolean;
  cancelVerification: (userId: string) => void;
  isAccountVerified: (userId: string) => boolean;
  getVerificationTier: (userId: string) => VerificationTier;
  // الحظر والإبلاغ والمتابعة
  blockedUsers: BlockedUser[];
  reports: Report[];
  blockUser: (userId: string) => boolean;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;
  banUser: (userId: string, reason?: string) => void;
  unbanUser: (userId: string) => void;
  isUserBanned: (userId: string) => boolean;
  getDisplayUser: (user: UserAccount) => { name: string; username: string; avatar: string; isBanned: boolean };
  getDisplayStore: (store: Store) => { name: string; username: string; avatar: string; isBanned: boolean };
  reportTarget: (targetId: string, targetType: ReportTargetType, reason: ReportReason, description: string, targetName?: string, targetUsername?: string) => Report;
  getFilteredProducts: () => Product[];
  getFilteredStories: () => Story[];
  getFilteredReels: () => Reel[];
  getFilteredConversations: () => Conversation[];
  // الإدارة - تحكم كامل
  bannedWords: string[];
  addBannedWord: (word: string) => void;
  removeBannedWord: (word: string) => void;
  sendAdminNotification: (title: string, titleEn: string, message: string, messageEn: string) => void;
  containsBannedWord: (text: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STORES: 'aygram_stores_v2',
  PRODUCTS: 'aygram_products_v2',
  REELS: 'aygram_reels_v2',
  CONVERSATIONS: 'aygram_conversations_v2',
  NOTIFICATIONS: 'aygram_notifications_v2',
  USERS: 'aygram_users_v2',
  COMMENTS: 'aygram_comments_v2',
  STORIES: 'aygram_stories_v2',
  ORDERS: 'aygram_orders_v2',
  SETTINGS: 'aygram_settings_v2',
  LANG: 'aygram_lang_v2',
  CURRENCY: 'aygram_currency_v2',
  LIVE_STREAMS: 'aygram_live_streams_v2',
  WALLET: 'aygram_wallet_v2',
  LIKED_PRODS: 'aygram_liked_prods_v2',
  SAVED_PRODS: 'aygram_saved_prods_v2',
  LIKED_REELS: 'aygram_liked_reels_v2',
  SAVED_REELS: 'aygram_saved_reels_v2',
  CART: 'aygram_cart_v2',
  BLOCKED: 'aygram_blocked_v2',
  REPORTS: 'aygram_reports_v2'
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG) || localStorage.getItem('matjari_lang_v1');
    return (saved === 'en' ? 'en' : 'ar') as Language;
  });

  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'reels' | 'messages' | 'orders' | 'profile'>('home');

  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORES) || localStorage.getItem('matjari_stores_v1');
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch {
      return INITIAL_STORES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS) || localStorage.getItem('matjari_products_v1');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REELS);
      return saved ? JSON.parse(saved) : INITIAL_REELS;
    } catch {
      return INITIAL_REELS;
    }
  });

  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
      return saved ? JSON.parse(saved) : INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      const baseUsers: UserAccount[] = saved ? JSON.parse(saved) : INITIAL_USERS;
      // Merge Auth users if exist (aygram_auth_users_v1)
      try {
        const authUsersRaw = localStorage.getItem('aygram_auth_users_v1');
        if (authUsersRaw) {
          const authUsers = JSON.parse(authUsersRaw);
          // Convert AuthUser to UserAccount and merge
          const converted: UserAccount[] = authUsers.map((a: any) => ({
            id: a.id,
            username: a.username,
            name: a.name,
            nameEn: a.name,
            avatar: a.avatar,
            bio: a.bio || `حساب ${a.name} على aygram`,
            bioEn: a.bio || `${a.name} on aygram`,
            verified: a.verified,
            followersCount: a.followersCount || 0,
            followingCount: a.followingCount || 0,
            postsCount: a.postsCount || 0,
            category: a.category || 'عضو aygram',
            isCurrentUser: false,
            email: a.email,
          }));
          // Merge without duplicates
          const existingIds = new Set(baseUsers.map(u => u.id));
          const existingUsernames = new Set(baseUsers.map(u => u.username));
          for (const cu of converted) {
            if (!existingIds.has(cu.id) && !existingUsernames.has(cu.username)) {
              baseUsers.push(cu);
            }
          }
        }
      } catch {}
      return baseUsers;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync Auth session to determine currentUser
  const getAuthSessionUser = (): UserAccount | null => {
    try {
      const raw = localStorage.getItem('aygram_auth_session_v1');
      if (!raw) return null;
      const authUser = JSON.parse(raw);
      // Find matching UserAccount in users or convert
      const found = users.find(u => u.username === authUser.username || u.id === authUser.id);
      if (found) return { ...found, isCurrentUser: true };
      // Convert authUser to UserAccount if not found in users list
      return {
        id: authUser.id,
        username: authUser.username,
        name: authUser.name,
        nameEn: authUser.name,
        avatar: authUser.avatar,
        bio: `حساب ${authUser.name} على aygram`,
        bioEn: `${authUser.name} on aygram`,
        verified: authUser.verified,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        category: 'عضو aygram',
        isCurrentUser: true,
        email: authUser.email,
      } as UserAccount;
    } catch {
      return null;
    }
  };

  const authSessionUser = getAuthSessionUser();
  const currentUser = authSessionUser || users.find(u => u.isCurrentUser) || INITIAL_USERS[0] || null;

  // Force rerender when auth changes (same-tab)
  const [, setAuthTick] = useState(0);
  useEffect(() => {
    const handler = () => setAuthTick(v => v + 1);
    window.addEventListener('storage', handler);
    window.addEventListener('aygram_auth_change', handler as EventListener);
    const iv = setInterval(handler, 1200);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('aygram_auth_change', handler as EventListener);
      clearInterval(iv);
    };
  }, []);

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS) || localStorage.getItem('matjari_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('matjari_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedProducts, setLikedProducts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED_PRODS) || localStorage.getItem('matjari_liked_v1');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  const [savedProducts, setSavedProducts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PRODS) || localStorage.getItem('matjari_saved_v1');
      return saved ? JSON.parse(saved) : ['prod-2'];
    } catch {
      return ['prod-2'];
    }
  });

  const [likedReels, setLikedReels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED_REELS);
      return saved ? JSON.parse(saved) : ['reel-1', 'reel-4'];
    } catch {
      return ['reel-1', 'reel-4'];
    }
  });

  const [savedReels, setSavedReels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_REELS);
      return saved ? JSON.parse(saved) : ['reel-1', 'reel-3'];
    } catch {
      return ['reel-1', 'reel-3'];
    }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS) || localStorage.getItem('matjari_settings_v1');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Admin secret state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // Modals state
  const [activeStoreModal, setActiveStoreModal] = useState<Store | null>(null);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeCommentTarget, setActiveCommentTarget] = useState<{ id: string; title: string; type: 'product' | 'reel' } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [isCreateMediaOpen, setIsCreateMediaOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLiveViewerOpen, setIsLiveViewerOpen] = useState(false);
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isApiExplorerOpen, setIsApiExplorerOpen] = useState(false);

  // Currency State (SAR, ILS, JOD, USD)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return (saved && CURRENCIES[saved as CurrencyCode] ? saved : 'SAR') as CurrencyCode;
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  const formatPrice = (amountSAR: number, overrideCurrency?: CurrencyCode): string => {
    const cur = overrideCurrency || currency;
    const config = CURRENCIES[cur] || CURRENCIES.SAR;
    const converted = amountSAR * config.rateFromSAR;
    const formattedNum = cur === 'JOD' || cur === 'USD'
      ? converted.toFixed(2)
      : Math.round(converted).toLocaleString();
    if (lang === 'ar') {
      return `${formattedNum} ${config.symbol}`;
    }
    return `${config.symbolEn} ${formattedNum}`;
  };

  // Live Streams State
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIVE_STREAMS);
      return saved ? JSON.parse(saved) : INITIAL_LIVE_STREAMS;
    } catch {
      return INITIAL_LIVE_STREAMS;
    }
  });
  const [activeLiveStream, setActiveLiveStream] = useState<LiveStream | null>(null);

  // Creator Wallet & Earnings State
  const [wallet, setWallet] = useState<CreatorWallet>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WALLET);
      return saved ? JSON.parse(saved) : INITIAL_WALLET;
    } catch {
      return INITIAL_WALLET;
    }
  });

  // Language handler
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Real-time synchronization to localStorage & multi-tab sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED_PRODS, JSON.stringify(likedProducts));
  }, [likedProducts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_PRODS, JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED_REELS, JSON.stringify(likedReels));
  }, [likedReels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_REELS, JSON.stringify(savedReels));
  }, [savedReels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIVE_STREAMS, JSON.stringify(liveStreams));
  }, [liveStreams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  // Firebase Firestore sync (real-time cloud backup)
  useEffect(() => {
    const t = setTimeout(() => { syncStoresToFirestore(stores); }, 1500);
    return () => clearTimeout(t);
  }, [stores]);

  useEffect(() => {
    const t = setTimeout(() => { syncProductsToFirestore(products); }, 1500);
    return () => clearTimeout(t);
  }, [products]);

  useEffect(() => {
    const t = setTimeout(() => { syncUsersToFirestore(users); }, 1500);
    return () => clearTimeout(t);
  }, [users]);

  // Listen to external window storage events for real-time multi-tab sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === STORAGE_KEYS.STORES && e.newValue) setStores(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) setProducts(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.REELS && e.newValue) setReels(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.CONVERSATIONS && e.newValue) setConversations(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.NOTIFICATIONS && e.newValue) setNotifications(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.ORDERS && e.newValue) setOrders(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.COMMENTS && e.newValue) setComments(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.LIVE_STREAMS && e.newValue) setLiveStreams(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.WALLET && e.newValue) setWallet(JSON.parse(e.newValue));
      } catch (err) {
        console.error('Storage sync error:', err);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Handle 6 clicks secret trigger on logo
  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // Window of 3.5 seconds to do 6 clicks
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3500);

    if (clickCountRef.current >= 6) {
      clickCountRef.current = 0;
      setAdminModalOpen(true);
      // New routing: navigate to dedicated admin page instead of modal
      try {
        window.location.href = '/admin';
      } catch {}
      try { window.dispatchEvent(new CustomEvent('aygram_navigate_admin')); } catch {}
    }
  };

  // Verify secret password: User requested "خلي الادمن بنفس نص اليوزر"
  // So entering the username itself (or with @, or master passwords) unlocks Admin!
  const verifyAdminPassword = (password: string): boolean => {
    const trimmed = password.trim().toLowerCase();
    const currentHandle = currentUser.username.toLowerCase();
    if (
      trimmed === currentHandle ||
      trimmed === `@${currentHandle}` ||
      trimmed === 'ayzan_official' ||
      trimmed === '@ayzan_official' ||
      trimmed === 'yaz@#5y' ||
      trimmed === 'admin'
    ) {
      setIsAdmin(true);
      setAdminModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Update current user profile
  const updateCurrentUser = (updated: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updated } : u));
  };

  // Live Stream Operations
  const startLiveStream = (title: string, category: string): LiveStream => {
    const newStream: LiveStream = {
      id: `live-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userVerified: currentUser.verified,
      title,
      category,
      viewerCount: 1,
      likesCount: 0,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isLive: true,
      startedAt: 'الآن',
      comments: [
        {
          id: `lc-${Date.now()}`,
          streamId: `live-${Date.now()}`,
          userId: 'u-sys',
          username: 'aygram_live',
          userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
          text: lang === 'ar' ? 'بدأ البث المباشر الآن! رحبوا بالمتابعين 🚀' : 'Live stream started! Welcome viewers 🚀',
          createdAt: 'الآن'
        }
      ]
    };
    setLiveStreams(prev => [newStream, ...prev]);
    setActiveLiveStream(newStream);
    setIsLiveViewerOpen(true);
    return newStream;
  };

  const endLiveStream = (streamId: string) => {
    setLiveStreams(prev => prev.map(s => s.id === streamId ? { ...s, isLive: false } : s));
    if (activeLiveStream?.id === streamId) {
      setActiveLiveStream(null);
      setIsLiveViewerOpen(false);
    }
  };

  const sendLiveComment = (streamId: string, text: string) => {
    const newComment = {
      id: `lc-${Date.now()}`,
      streamId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text,
      createdAt: 'الآن'
    };
    setLiveStreams(prev => prev.map(s => {
      if (s.id === streamId) {
        return {
          ...s,
          comments: [...s.comments, newComment]
        };
      }
      return s;
    }));
    if (activeLiveStream?.id === streamId) {
      setActiveLiveStream(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
    }
  };

  const sendLiveGift = (streamId: string, gift: LiveGift) => {
    // 1. Add comment notice in stream
    const giftComment = {
      id: `lc-gift-${Date.now()}`,
      streamId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: `${lang === 'ar' ? 'أرسل هدية' : 'Sent a gift'} ${gift.icon} ${lang === 'ar' ? gift.nameAr : gift.nameEn}!`,
      createdAt: 'الآن',
      isGiftNotice: true
    };
    setLiveStreams(prev => prev.map(s => {
      if (s.id === streamId) {
        return {
          ...s,
          likesCount: s.likesCount + 150,
          comments: [...s.comments, giftComment]
        };
      }
      return s;
    }));
    if (activeLiveStream?.id === streamId) {
      setActiveLiveStream(prev => prev ? { 
        ...prev, 
        likesCount: prev.likesCount + 150,
        comments: [...prev.comments, giftComment] 
      } : null);
    }

    // 2. Add to Creator's Wallet Earnings
    const newTx: WalletTransaction = {
      id: `tx-g-${Date.now()}`,
      type: 'live_gift',
      title: `${lang === 'ar' ? 'هدية بث حي' : 'Live Gift'}: ${gift.nameAr} ${gift.icon}`,
      titleEn: `Live Gift: ${gift.nameEn} ${gift.icon}`,
      amountSAR: gift.priceSAR,
      date: 'الآن',
      status: 'completed',
      senderUsername: currentUser.username
    };
    setWallet(prev => ({
      ...prev,
      balanceSAR: prev.balanceSAR + gift.priceSAR,
      totalEarnedSAR: prev.totalEarnedSAR + gift.priceSAR,
      liveGiftsEarningsSAR: prev.liveGiftsEarningsSAR + gift.priceSAR,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const likeLiveStream = (streamId: string) => {
    setLiveStreams(prev => prev.map(s => s.id === streamId ? { ...s, likesCount: s.likesCount + 1 } : s));
    if (activeLiveStream?.id === streamId) {
      setActiveLiveStream(prev => prev ? { ...prev, likesCount: prev.likesCount + 1 } : null);
    }
  };

  const withdrawEarnings = (amountSAR: number, method: string, note?: string): boolean => {
    if (amountSAR <= 0 || amountSAR > wallet.balanceSAR) return false;
    const newTx: WalletTransaction = {
      id: `tx-w-${Date.now()}`,
      type: 'withdrawal',
      title: `${lang === 'ar' ? 'طلب سحب أرباح' : 'Withdrawal Request'} (${method})`,
      titleEn: `Withdrawal (${method})`,
      amountSAR: -amountSAR,
      date: 'الآن',
      status: 'processing',
      note
    };
    setWallet(prev => ({
      ...prev,
      balanceSAR: prev.balanceSAR - amountSAR,
      transactions: [newTx, ...prev.transactions]
    }));
    return true;
  };

  // Store actions
  const addStore = (newStoreData: Omit<Store, 'id' | 'createdAt' | 'highlights' | 'rating' | 'followersCount'>): Store => {
    const newStore: Store = {
      ...newStoreData,
      id: `store-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      followersCount: 1,
      rating: 5.0,
      highlights: [
        {
          id: `h-${Date.now()}-1`,
          title: 'العروض',
          titleEn: 'Offers',
          coverImage: newStoreData.avatar
        }
      ]
    };
    setStores(prev => [newStore, ...prev]);
    return newStore;
  };

  const updateStore = (id: string, updated: Partial<Store>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    setProducts(prev => prev.filter(p => p.storeId !== id));
  };

  // Product actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'likes' | 'salesCount'>): Product => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      salesCount: 0
    };
    setProducts(prev => [newProd, ...prev]);

    // Also add to feed activity notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'order',
      actorUsername: currentUser.username,
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      text: `تم نشر عنصر جديد بنجاح: ${newProd.name}`,
      textEn: `New product item posted: ${newProd.nameEn || newProd.name}`,
      targetImage: newProd.images[0],
      time: 'الآن',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newProd;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Reel actions
  const addReel = (newReelData: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'commentsCount' | 'sharesCount' | 'viewsCount'>): Reel => {
    const newReel: Reel = {
      ...newReelData,
      id: `reel-${Date.now()}`,
      likes: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      createdAt: 'الآن',
      isLiked: false,
      isSaved: false
    };
    setReels(prev => [newReel, ...prev]);
    return newReel;
  };

  const deleteReel = (reelId: string) => {
    setReels(prev => prev.filter(r => r.id !== reelId));
  };

  const toggleLikeReel = (reelId: string) => {
    const isLiked = likedReels.includes(reelId);
    if (isLiked) {
      setLikedReels(prev => prev.filter(id => id !== reelId));
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, likes: Math.max(0, r.likes - 1), isLiked: false } : r));
    } else {
      setLikedReels(prev => [...prev, reelId]);
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, likes: r.likes + 1, isLiked: true } : r));
    }
  };

  const toggleSaveReel = (reelId: string) => {
    const isSaved = savedReels.includes(reelId);
    if (isSaved) {
      setSavedReels(prev => prev.filter(id => id !== reelId));
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, isSaved: false } : r));
    } else {
      setSavedReels(prev => [...prev, reelId]);
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, isSaved: true } : r));
    }
  };

  // Story actions
  const addStory = (storyData: Omit<Story, 'id' | 'createdAt'>) => {
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      createdAt: 'الآن',
      isSeen: false
    };
    setStories(prev => [newStory, ...prev]);
  };

  // Direct Messaging actions
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const nowTime = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      text: text.trim(),
      timestamp: nowTime
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: text.trim(),
          lastMessageTime: nowTime,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  const toggleLikeMessage = (conversationId: string, messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(m => m.id === messageId ? { ...m, isLiked: !m.isLiked } : m)
        };
      }
      return conv;
    }));
  };

  const startDirectMessage = (participant: { id: string; username: string; name: string; avatar: string; verified: boolean }) => {
    const existing = conversations.find(c => c.participantId === participant.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participantId: participant.id,
        participantUsername: participant.username,
        participantName: participant.name,
        participantAvatar: participant.avatar,
        participantVerified: participant.verified,
        isOnline: true,
        unreadCount: 0,
        lastMessage: 'بدء محادثة جديدة',
        lastMessageTime: 'الآن',
        messages: [
          {
            id: `msg-${Date.now()}-welcome`,
            senderId: participant.id,
            senderUsername: participant.username,
            text: `مرحباً بك في aygram! تواصل معنا وسنرد عليك فوراً.`,
            timestamp: 'الآن'
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    }
    setActiveTab('messages');
  };

  // Comment actions
  const addComment = (targetId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      targetId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'الآن',
      likes: 0,
      isLiked: false
    };
    setComments(prev => [newComment, ...prev]);

    // Update comment counter on target product or reel
    setProducts(prev => prev.map(p => {
      if (p.id === targetId) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    }));
    setReels(prev => prev.map(r => {
      if (r.id === targetId) {
        return { ...r, commentsCount: r.commentsCount + 1 };
      }
      return r;
    }));
  };

  const toggleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    }));
  };

  // Follow actions
  const toggleFollowUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isFollowing = !u.isFollowing;
        return {
          ...u,
          isFollowing,
          followersCount: isFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
        };
      }
      return u;
    }));

    setStores(prev => prev.map(s => {
      if (s.id === userId || s.username === userId) {
        const isFollowing = !s.isFollowing;
        return {
          ...s,
          isFollowing,
          followersCount: isFollowing ? s.followersCount + 1 : Math.max(0, s.followersCount - 1)
        };
      }
      return s;
    }));
  };

  // Notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order placement
  const placeOrder = (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    city: string;
    paymentMethod: 'credit_card' | 'mada' | 'apple_pay' | 'cod';
  }) => {
    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const firstStoreId = cart[0]?.product.storeId || 'store-1';
    const storeObj = stores.find(s => s.id === firstStoreId);

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `AYG-${Math.floor(100000 + Math.random() * 900000)}`,
      storeId: firstStoreId,
      storeName: storeObj ? (lang === 'ar' ? storeObj.name : storeObj.nameEn) : 'aygram Store',
      customerName: orderInfo.customerName,
      customerPhone: orderInfo.customerPhone,
      customerAddress: orderInfo.customerAddress,
      city: orderInfo.city,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: lang === 'ar' ? item.product.name : item.product.nameEn,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0]
      })),
      totalAmount,
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: 'test_mode',
      orderStatus: 'processing',
      createdAt: new Date().toISOString()
    };

    // Update sales count and stock for products
    cart.forEach(item => {
      updateProduct(item.product.id, {
        salesCount: (item.product.salesCount || 0) + item.quantity,
        stockCount: Math.max(0, item.product.stockCount - item.quantity)
      });
    });

    setOrders(prev => [newOrder, ...prev]);

    // Add notification for the user
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'order',
        actorUsername: 'aygram_system',
        actorName: 'نظام aygram',
        actorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        text: `تم تأكيد طلبك رقم ${newOrder.orderNumber} بمبلغ ${totalAmount} ريال`,
        textEn: `Order confirmed ${newOrder.orderNumber} for ${totalAmount} SAR`,
        time: 'الآن',
        isRead: false
      },
      ...prev
    ]);

    clearCart();
    return newOrder;
  };

  // Likes & Saves
  const toggleLikeProduct = (productId: string) => {
    const isLiked = likedProducts.includes(productId);
    if (isLiked) {
      setLikedProducts(prev => prev.filter(id => id !== productId));
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, likes: Math.max(0, p.likes - 1) } : p));
    } else {
      setLikedProducts(prev => [...prev, productId]);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ 
      ...prev, 
      ...newSettings,
      lastSyncTimestamp: new Date().toISOString()
    }));
  };

  // Vercel source code exporter
  const exportVercelSourceCode = (): string => {
    const payload = {
      stores,
      products,
      reels,
      stories,
      conversations,
      notifications,
      users,
      comments,
      settings: {
        ...adminSettings,
        lastSyncTimestamp: new Date().toISOString()
      }
    };
    return JSON.stringify(payload, null, 2);
  };

  const importBackupData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.stores) setStores(parsed.stores);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.reels) setReels(parsed.reels);
      if (parsed.stories) setStories(parsed.stories);
      if (parsed.conversations) setConversations(parsed.conversations);
      if (parsed.notifications) setNotifications(parsed.notifications);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.comments) setComments(parsed.comments);
      if (parsed.settings) setAdminSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToInitialData = () => {
    setStores(INITIAL_STORES);
    setProducts(INITIAL_PRODUCTS);
    setReels(INITIAL_REELS);
    setStories(INITIAL_STORIES);
    setConversations(INITIAL_CONVERSATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUsers(INITIAL_USERS);
    setComments(INITIAL_COMMENTS);
    setAdminSettings(INITIAL_SETTINGS);
  };

  // ===== فصل المتاجر عن الحسابات: اشتراكات المتاجر =====
  const isStoreActive = (storeId: string): boolean => {
    const store = stores.find(s => s.id === storeId);
    if (!store?.subscription) return false;
    if (!store.subscription.isActive) return false;
    if (store.subscription.status !== 'active') return false;
    if (store.subscription.expiresAt) {
      return new Date(store.subscription.expiresAt).getTime() > Date.now();
    }
    return true;
  };

  const activateStoreSubscription = (storeId: string): boolean => {
    const priceILS = adminSettings.subscriptionPricing.storeActivationILS;
    // محاكاة الدفع: في الإنتاج يتم خصم من المحفظة أو بوابة دفع
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    setStores(prev => prev.map(s => s.id === storeId ? {
      ...s,
      subscription: {
        status: 'active',
        isActive: true,
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        pricePaidILS: priceILS,
        autoRenew: true,
        planId: 'store_monthly',
        lastPaymentAt: now.toISOString(),
      },
      storeType: 'verified_store',
      verified: true,
    } : s));
    // سجل في المحفظة كعملية دفع
    const tx: WalletTransaction = {
      id: `tx-store-${Date.now()}`,
      type: 'withdrawal',
      title: `تفعيل المتجر لمدة 30 يوم - ${priceILS} ₪`,
      titleEn: `Store Activation 30 days - ${priceILS} ILS`,
      amountSAR: -priceILS, // ILS ≈ SAR
      date: 'الآن',
      status: 'completed',
      note: `store:${storeId}`,
    };
    setWallet(prev => ({ ...prev, transactions: [tx, ...prev.transactions] }));
    return true;
  };

  const renewStoreSubscription = (storeId: string): boolean => {
    return activateStoreSubscription(storeId);
  };

  const cancelStoreSubscription = (storeId: string) => {
    setStores(prev => prev.map(s => s.id === storeId ? {
      ...s,
      subscription: s.subscription ? { ...s.subscription, status: 'expired', isActive: false, autoRenew: false } : undefined,
      storeType: 'pending_store',
    } : s));
  };

  // ===== فصل الحسابات: توثيق الحسابات =====
  const getVerificationTier = (userId: string): VerificationTier => {
    const user = users.find(u => u.id === userId);
    if (!user?.verification || !user.verification.isActive) return 'none';
    if (user.verification.expiresAt && new Date(user.verification.expiresAt).getTime() <= Date.now()) return 'none';
    return user.verification.tier || user.verificationTier || 'none';
  };

  const isAccountVerified = (userId: string): boolean => {
    const tier = getVerificationTier(userId);
    return tier === 'blue' || tier === 'gold';
  };

  const purchaseVerification = (userId: string, tier: VerificationTier): boolean => {
    if (tier === 'none') return false;
    const priceILS = tier === 'gold' ? adminSettings.subscriptionPricing.goldBadgeILS : adminSettings.subscriptionPricing.accountVerificationILS;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      verified: true,
      verificationTier: tier,
      verification: {
        tier,
        isActive: true,
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        pricePaidILS: priceILS,
        autoRenew: true,
      }
    } : u));
    const tx: WalletTransaction = {
      id: `tx-verify-${Date.now()}`,
      type: 'withdrawal',
      title: tier === 'gold' ? `العلامة الذهبية المميزة - ${priceILS} ₪` : `توثيق الحساب (علامة زرقاء) - ${priceILS} ₪`,
      titleEn: tier === 'gold' ? `Gold Badge - ${priceILS} ILS` : `Blue Verification - ${priceILS} ILS`,
      amountSAR: -priceILS,
      date: 'الآن',
      status: 'completed',
      note: `verify:${userId}:${tier}`,
    };
    setWallet(prev => ({ ...prev, transactions: [tx, ...prev.transactions] }));
    return true;
  };

  const cancelVerification = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      verified: false,
      verificationTier: 'none',
      verification: u.verification ? { ...u.verification, tier: 'none', isActive: false, autoRenew: false } : { tier: 'none', isActive: false, pricePaidILS: 0, autoRenew: false }
    } : u));
  };

  // ===== الحظر والإبلاغ والمتابعة =====
  const blockUser = (userId: string): boolean => {
    if (userId === currentUser.id) return false;
    if (blockedUsers.some(b => b.userId === userId)) return false;
    const user = users.find(u => u.id === userId) || users.find(u => u.username === userId);
    const target = user || { id: userId, username: userId, name: userId, avatar: '' };
    const newBlock: BlockedUser = {
      id: `block-${Date.now()}`,
      userId: (target as any).id,
      blockedBy: currentUser.id,
      username: (target as any).username,
      name: (target as any).name,
      avatar: (target as any).avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      createdAt: new Date().toISOString(),
    };
    setBlockedUsers(prev => [...prev, newBlock]);
    setUsers(prev => prev.map(u => u.id === (target as any).id ? { ...u, isFollowing: false, followersCount: Math.max(0, u.followersCount - 1) } : u));
    // Remove conversations with blocked user
    setConversations(prev => prev.filter(c => c.participantId !== (target as any).id && c.participantUsername !== (target as any).username));
    setNotifications(prev => [{
      id: `notif-block-${Date.now()}`,
      type: 'follow',
      actorUsername: (target as any).username,
      actorName: (target as any).name,
      actorAvatar: (target as any).avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: lang === 'ar' ? `تم حظر @${(target as any).username} بنجاح` : `Blocked @${(target as any).username}`,
      textEn: `Blocked @${(target as any).username}`,
      time: 'الآن',
      isRead: false
    }, ...prev]);
    return true;
  };

  const unblockUser = (userId: string) => {
    setBlockedUsers(prev => prev.filter(b => b.userId !== userId && b.username !== userId));
  };

  const isBlocked = (userId: string): boolean => {
    return blockedUsers.some(b => b.userId === userId || b.username === userId);
  };

  const reportTarget = (targetId: string, targetType: ReportTargetType, reason: ReportReason, description: string, targetName?: string, targetUsername?: string): Report => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      reporterId: currentUser.id,
      reporterUsername: currentUser.username,
      targetId,
      targetType,
      targetName,
      targetUsername,
      reason,
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    setNotifications(prev => [{
      id: `notif-report-${Date.now()}`,
      type: 'comment',
      actorUsername: 'system',
      actorName: lang === 'ar' ? 'نظام الإبلاغ' : 'Report System',
      actorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: lang === 'ar' ? `تم إرسال بلاغك عن ${targetName || targetId} وسيتم مراجعته` : `Report submitted for ${targetName || targetId}`,
      textEn: `Report submitted for ${targetName || targetId}`,
      time: 'الآن',
      isRead: false
    }, ...prev]);
    return newReport;
  };

  const getFilteredProducts = (): Product[] => {
    const blockedIds = new Set(blockedUsers.map(b => b.userId));
    const blockedUsernames = new Set(blockedUsers.map(b => b.username));
    return products.filter(p => {
      const store = stores.find(s => s.id === p.storeId);
      if (!store) return !blockedIds.has(p.storeId);
      if (blockedIds.has(store.id) || blockedUsernames.has(store.username)) return false;
      if (store.ownerId && blockedIds.has(store.ownerId)) return false;
      return true;
    });
  };

  const getFilteredStories = (): Story[] => {
    const blockedIds = new Set(blockedUsers.map(b => b.userId));
    const blockedUsernames = new Set(blockedUsers.map(b => b.username));
    return stories.filter(s => !blockedIds.has(s.storeId) && !blockedUsernames.has(s.storeName));
  };

  const getFilteredReels = (): Reel[] => {
    const blockedIds = new Set(blockedUsers.map(b => b.userId));
    const blockedUsernames = new Set(blockedUsers.map(b => b.username));
    return reels.filter(r => !blockedIds.has(r.userId) && !blockedUsernames.has(r.username));
  };

  const getFilteredConversations = (): Conversation[] => {
    const blockedIds = new Set(blockedUsers.map(b => b.userId));
    const blockedUsernames = new Set(blockedUsers.map(b => b.username));
    return conversations.filter(c => !blockedIds.has(c.participantId) && !blockedUsernames.has(c.participantUsername));
  };

  // ===== الحظر العام (باند) - aygram_user =====
  const banUser = (userId: string, reason?: string) => {
    setUsers(prev => prev.map(u => u.id === userId || u.username === userId ? { ...u, isBanned: true, bannedAt: new Date().toISOString(), bannedReason: reason || 'مخالفة شروط المجتمع' } : u));
    // Also update auth users
    try {
      const raw = localStorage.getItem('aygram_auth_users_v1');
      if (raw) {
        const arr = JSON.parse(raw);
        const updated = arr.map((u: any) => u.id === userId || u.username === userId ? { ...u, isBanned: true } : u);
        localStorage.setItem('aygram_auth_users_v1', JSON.stringify(updated));
      }
    } catch {}
    setNotifications(prev => [{
      id: `notif-ban-${Date.now()}`,
      type: 'follow',
      actorUsername: 'system',
      actorName: 'نظام الإدارة',
      actorAvatar: 'https://ui-avatars.com/api/?name=System&background=1f2937&color=fff&size=100',
      text: `تم حظر الحساب ${userId} — سيظهر كـ aygram_user`,
      textEn: `Account ${userId} banned — shows as aygram_user`,
      time: 'الآن',
      isRead: false
    }, ...prev]);
  };

  const unbanUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId || u.username === userId ? { ...u, isBanned: false, bannedAt: undefined, bannedReason: undefined } : u));
    try {
      const raw = localStorage.getItem('aygram_auth_users_v1');
      if (raw) {
        const arr = JSON.parse(raw);
        const updated = arr.map((u: any) => u.id === userId || u.username === userId ? { ...u, isBanned: false } : u);
        localStorage.setItem('aygram_auth_users_v1', JSON.stringify(updated));
      }
    } catch {}
  };

  const isUserBanned = (userId: string): boolean => {
    const user = users.find(u => u.id === userId || u.username === userId);
    return !!user?.isBanned;
  };

  const getDisplayUser = (user: UserAccount) => {
    if (user.isBanned) {
      return {
        name: 'aygram_user',
        username: 'aygram_user',
        avatar: 'https://ui-avatars.com/api/?name=aygram+user&background=d1d5db&color=6b7280&size=200&rounded=true&bold=true&format=svg',
        isBanned: true,
      };
    }
    return {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      isBanned: false,
    };
  };

  const getDisplayStore = (store: Store) => {
    const owner = store.ownerId ? users.find(u => u.id === store.ownerId) : null;
    if (owner?.isBanned || (store as any).isBanned) {
      return {
        name: 'aygram_user',
        username: 'aygram_user',
        avatar: 'https://ui-avatars.com/api/?name=aygram+user&background=d1d5db&color=6b7280&size=200&rounded=true&bold=true&format=svg',
        isBanned: true,
      };
    }
    return {
      name: store.name,
      username: store.username,
      avatar: store.avatar,
      isBanned: false,
    };
  };

  // ===== الكلمات الممنوعة =====
  const bannedWords = adminSettings.bannedWords || [];
  const addBannedWord = (word: string) => {
    const w = word.trim().toLowerCase();
    if (!w || bannedWords.includes(w)) return;
    updateAdminSettings({ bannedWords: [...bannedWords, w] });
  };
  const removeBannedWord = (word: string) => {
    updateAdminSettings({ bannedWords: bannedWords.filter(x => x !== word) });
  };
  const containsBannedWord = (text: string): boolean => {
    if (!adminSettings.bannedWordsEnabled || !bannedWords.length) return false;
    const lower = text.toLowerCase();
    return bannedWords.some(w => lower.includes(w.toLowerCase()));
  };

  // ===== إشعارات الإدارة =====
  const sendAdminNotification = (title: string, titleEn: string, message: string, messageEn: string) => {
    const notif: NotificationItem = {
      id: `notif-admin-${Date.now()}`,
      type: 'reel',
      actorUsername: 'aygram_admin',
      actorName: 'إدارة aygram',
      actorAvatar: 'https://ui-avatars.com/api/?name=Admin&background=1e293b&color=fff&size=100',
      actorVerified: true,
      text: `${title}: ${message}`,
      textEn: `${titleEn}: ${messageEn}`,
      time: 'الآن',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const t = translations[lang];

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        formatPrice,
        t,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        stores,
        products,
        stories,
        orders,
        cart,
        reels,
        conversations,
        activeConversationId,
        setActiveConversationId,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        isNotificationsOpen,
        setIsNotificationsOpen,
        users,
        currentUser,
        updateCurrentUser,
        comments,
        likedProducts,
        savedProducts,
        likedReels,
        savedReels,
        isAdmin,
        adminModalOpen,
        adminSettings,
        setAdminModalOpen,
        handleLogoClick,
        verifyAdminPassword,
        logoutAdmin,
        addStore,
        updateStore,
        deleteStore,
        addProduct,
        updateProduct,
        deleteProduct,
        addReel,
        deleteReel,
        toggleLikeReel,
        toggleSaveReel,
        addStory,
        sendMessage,
        toggleLikeMessage,
        startDirectMessage,
        addComment,
        toggleLikeComment,
        toggleFollowUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        toggleLikeProduct,
        toggleSaveProduct,
        activeStoreModal,
        setActiveStoreModal,
        activeProductModal,
        setActiveProductModal,
        activeStoryIndex,
        setActiveStoryIndex,
        activeCommentTarget,
        setActiveCommentTarget,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCreateStoreOpen,
        setIsCreateStoreOpen,
        isCreateMediaOpen,
        setIsCreateMediaOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        isLiveViewerOpen,
        setIsLiveViewerOpen,
        isGoLiveModalOpen,
        setIsGoLiveModalOpen,
        isWalletOpen,
        setIsWalletOpen,
        isApiExplorerOpen,
        setIsApiExplorerOpen,
        liveStreams,
        activeLiveStream,
        setActiveLiveStream,
        startLiveStream,
        endLiveStream,
        sendLiveComment,
        sendLiveGift,
        likeLiveStream,
        wallet,
        withdrawEarnings,
        updateAdminSettings,
        exportVercelSourceCode,
        importBackupData,
        resetToInitialData,
        activateStoreSubscription,
        renewStoreSubscription,
        cancelStoreSubscription,
        isStoreActive,
        purchaseVerification,
        cancelVerification,
        isAccountVerified,
        getVerificationTier,
        blockedUsers,
        reports,
        blockUser,
        unblockUser,
        isBlocked,
        reportTarget,
        getFilteredProducts,
        getFilteredStories,
        getFilteredReels,
        getFilteredConversations,
        banUser,
        unbanUser,
        isUserBanned,
        getDisplayUser,
        getDisplayStore,
        bannedWords,
        addBannedWord,
        removeBannedWord,
        containsBannedWord,
        sendAdminNotification
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
