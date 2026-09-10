import { Store, Product, Story, AdminSettings, Reel, Conversation, NotificationItem, UserAccount, Comment, LiveStream, LiveGift, CreatorWallet } from '../types';

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    username: 'nokhba_oud',
    name: 'نخبة العود والمسك',
    nameEn: 'Nokhba Oud & Musk',
    bio: 'عطور شرقية فاخرة وبخور ملكي معتق 👑 ضمان ثبات أصلي 100% | شحن لجميع دول الخليج ✈️',
    bioEn: 'Luxury oriental perfumes & royal aged oud 👑 100% Authentic longevity guarantee | Shipping worldwide ✈️',
    avatar: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=1200&auto=format&fit=crop&q=80',
    category: 'عطور ومستحضرات',
    categoryEn: 'Perfumes & Cosmetics',
    verified: true,
    followersCount: 38400,
    rating: 4.9,
    whatsapp: '+966501234567',
    phone: '+966501234567',
    email: 'contact@nokhbaoud.com',
    website: 'https://nokhba.store',
    location: 'الرياض، المملكة العربية السعودية',
    locationEn: 'Riyadh, Saudi Arabia',
    currency: 'SAR',
    createdAt: '2024-01-15',
    highlights: [
      { id: 'h1', title: 'آراء العملاء', titleEn: 'Reviews', coverImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&auto=format&fit=crop&q=80' },
      { id: 'h2', title: 'عروض اليوم', titleEn: 'Offers', coverImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=150&auto=format&fit=crop&q=80' },
      { id: 'h3', title: 'الشحن والتوصيل', titleEn: 'Shipping', coverImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=150&auto=format&fit=crop&q=80' },
    ],
    subscription: {
      status: 'active',
      isActive: true,
      startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      pricePaidILS: 30,
      autoRenew: true,
      planId: 'store_monthly',
    },
    storeType: 'verified_store',
    ownerId: 'user-me'
  },
  {
    id: 'store-2',
    username: 'roshana_fashion',
    name: 'روشانا ستايل للأزياء',
    nameEn: 'Roshana Fashion Studio',
    bio: 'تصاميم عبايات وأزياء عصرية راقية تمزج الفخامة بالأناقة اليومية ✨ تسوقي تشكيلة الصيف الجديدة الآن',
    bioEn: 'Contemporary haute abayas & luxury everyday modest wear ✨ Shop the new Summer Collection now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    category: 'أزياء وموضة',
    categoryEn: 'Fashion & Clothing',
    verified: true,
    followersCount: 52100,
    rating: 4.8,
    whatsapp: '+966559876543',
    phone: '+966559876543',
    email: 'orders@roshana.com',
    website: 'https://roshana.fashion',
    location: 'جدة، المملكة العربية السعودية',
    locationEn: 'Jeddah, Saudi Arabia',
    currency: 'SAR',
    createdAt: '2024-02-01',
    highlights: [
      { id: 'h4', title: 'جديد الأسبوع', titleEn: 'New Arrivals', coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80' },
      { id: 'h5', title: 'دليل القياسات', titleEn: 'Size Guide', coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop&q=80' },
      { id: 'h6', title: 'مشاهير مع روشانا', titleEn: 'VIP Looks', coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=150&auto=format&fit=crop&q=80' },
    ],
    subscription: {
      status: 'active',
      isActive: true,
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      pricePaidILS: 30,
      autoRenew: true,
      planId: 'store_monthly',
    },
    storeType: 'verified_store',
    ownerId: 'user-sarah'
  },
  {
    id: 'store-3',
    username: 'roast_artisan',
    name: 'محمصة أرتيزان للقهوة',
    nameEn: 'Artisan Specialty Roastery',
    bio: 'حبوب بن مختصة منتقاة من أجود مزارع إثيوبيا وكولومبيا ☕ تحميص طازج يومياً في دبي 🌿',
    bioEn: 'Specialty coffee beans curated from Ethiopia & Colombia ☕ Fresh daily craft roasting in Dubai 🌿',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=80',
    category: 'أغذية ومشروبات',
    categoryEn: 'Food & Specialty Coffee',
    verified: true,
    followersCount: 19600,
    rating: 5.0,
    whatsapp: '+971501112233',
    phone: '+971501112233',
    email: 'hello@artisanroasters.ae',
    website: 'https://artisanroasters.ae',
    location: 'دبي، الإمارات العربية المتحدة',
    locationEn: 'Dubai, UAE',
    currency: 'AED',
    createdAt: '2024-03-10',
    highlights: [
      { id: 'h7', title: 'محاصيل البن', titleEn: 'Crops', coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80' },
      { id: 'h8', title: 'طرق التحضير', titleEn: 'Brew Guides', coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&auto=format&fit=crop&q=80' },
    ],
    subscription: {
      status: 'active',
      isActive: true,
      startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      pricePaidILS: 30,
      autoRenew: false,
      planId: 'store_monthly',
    },
    storeType: 'verified_store',
    ownerId: 'user-mona'
  },
  {
    id: 'store-4',
    username: 'gadget_zone_tech',
    name: 'جادجيت زون إلكترونكس',
    nameEn: 'GadgetZone Tech Hub',
    bio: 'إلكترونيات ذكية وملحقات هواتف وسماعات لاسلكية أصلية ⚡ شحن سريع وضمان سنتين على كافة المنتجات 🎧',
    bioEn: 'Smart tech, wireless earbuds, charging docks & authentic accessories ⚡ Fast delivery & 2-year warranty 🎧',
    avatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    category: 'إلكترونيات وهواتف',
    categoryEn: 'Electronics & Gadgets',
    verified: false,
    followersCount: 14200,
    rating: 4.7,
    whatsapp: '+966540001122',
    phone: '+966540001122',
    email: 'support@gadgetzone.com',
    location: 'الدمام، المملكة العربية السعودية',
    locationEn: 'Dammam, Saudi Arabia',
    currency: 'SAR',
    createdAt: '2024-04-05',
    highlights: [
      { id: 'h9', title: 'سماعات Pro', titleEn: 'Earbuds', coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80' },
      { id: 'h10', title: 'شواحن ذكية', titleEn: 'Chargers', coverImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=150&auto=format&fit=crop&q=80' }
    ],
    subscription: {
      status: 'expired',
      isActive: false,
      startedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      pricePaidILS: 30,
      autoRenew: false,
      planId: 'store_monthly',
    },
    storeType: 'pending_store',
    ownerId: 'user-fahad'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    storeId: 'store-1',
    name: 'عطر دهن العود الكمبودي الملكي المعتّق',
    nameEn: 'Royal Aged Cambodian Oud Oil',
    price: 380,
    originalPrice: 490,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'دهن عود كمبودي طبيعي أصلي معتق لأكثر من 15 سنة، يتميز بنكهة سويتية بخورية وثبات يدوم أكثر من 48 ساعة على الملابس. يأتي في قنينة كريستال فاخرة مع علبة جلدية هدية.',
    descriptionEn: 'Pure authentic Cambodian oud oil aged over 15 years, with sweet incense notes and 48+ hours longevity. Delivered in a luxury crystal vial with a velvet gift box.',
    category: 'عطور ومستحضرات',
    inStock: true,
    stockCount: 18,
    likes: 342,
    salesCount: 89,
    isFeatured: true,
    createdAt: '2024-05-01',
    tags: ['عود', 'عطور_فاخرة', 'ملكي', 'بخور']
  },
  {
    id: 'prod-2',
    storeId: 'store-1',
    name: 'مجموعة مسك الختام والحرير الأبيض (3 تولات)',
    nameEn: 'Misk Al-Khitam White Silk Set (3 Tolas)',
    price: 195,
    originalPrice: 260,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'ثلاث تولات من أنقى أنواع المسك الملكي (مسك الطهارة الأبيض، مسك الباودر، ومسك الختام). رائحة نظافة منعشة مناسبة لكلا الجنسين وللاستخدام اليومي.',
    descriptionEn: 'Three tolas of premium royal white musks. Fresh powdery clean aroma suitable for daily luxury wear.',
    category: 'عطور ومستحضرات',
    inStock: true,
    stockCount: 35,
    likes: 215,
    salesCount: 140,
    isFeatured: true,
    createdAt: '2024-05-03',
    tags: ['مسك', 'طهارة', 'نظافة', 'هدية']
  },
  {
    id: 'prod-3',
    storeId: 'store-2',
    name: 'عباية كريب حريري بقصة كيمونو وتطريز يدوي',
    nameEn: 'Hand-Embroidered Silk Crepe Kimono Abaya',
    price: 450,
    originalPrice: 580,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'عباية صيفية سوداء فاخرة من الكريب الكوري الحريري الخفيف، بتطريز برتقالي داكن وذهبي على الأكمام، تصميم عصري فضفاض ومريح للمناسبات الرسمية والطلعات.',
    descriptionEn: 'Luxury summer black abaya crafted from silky Korean crepe, featuring artisanal dark orange & gold sleeve embroidery. Flowy and elegant for formal evenings.',
    category: 'أزياء وموضة',
    inStock: true,
    stockCount: 12,
    likes: 512,
    salesCount: 63,
    isFeatured: true,
    createdAt: '2024-05-10',
    tags: ['عبايات', 'أزياء', 'كريب', 'موضة']
  },
  {
    id: 'prod-4',
    storeId: 'store-2',
    name: 'حقيبة جلد طبيعي كلاسيكية بلون برتقالي محروق',
    nameEn: 'Artisan Burnt Orange Genuine Leather Bag',
    price: 290,
    originalPrice: 340,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'شنطة يد راقية مصنوعة يدوياً من الجلد الإيطالي الفاخر بلون برتقالي غامق ساحر مع إبزيم معدني مذهب وسير كتف قابل للتعديل.',
    descriptionEn: 'Handmade genuine Italian leather bag in burnt dark orange, with polished metallic hardware and adjustable strap.',
    category: 'أزياء وموضة',
    inStock: true,
    stockCount: 9,
    likes: 189,
    salesCount: 27,
    isFeatured: false,
    createdAt: '2024-05-12',
    tags: ['حقائب', 'جلد_طبيعي', 'اكسسوارات']
  },
  {
    id: 'prod-5',
    storeId: 'store-3',
    name: 'بن إثيوبي ييرغاتشيف مجفف طبيعياً (250 جرام)',
    nameEn: 'Ethiopian Yirgacheffe Natural Process Coffee (250g)',
    price: 68,
    originalPrice: 85,
    currency: 'AED',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'محصول إثيوبي فاخر بمعالجة مجففة، إيحاءات التوت البري والياسمين والخوخ. مناسب جداً لتحضير القهوة المقطرة V60 والإسبريسو الفاكهي.',
    descriptionEn: 'Single-origin Ethiopian specialty beans, natural process with notes of wild blueberries, jasmine, and peach. Perfect for V60 & espresso.',
    category: 'أغذية ومشروبات',
    inStock: true,
    stockCount: 40,
    likes: 420,
    salesCount: 210,
    isFeatured: true,
    createdAt: '2024-05-15',
    tags: ['قهوة_مختصة', 'V60', 'إثيوبيا', 'بن']
  },
  {
    id: 'prod-6',
    storeId: 'store-4',
    name: 'سماعات رأس لاسلكية بخاصية إلغاء الضوضاء الفائقة Pro',
    nameEn: 'Acoustic Pro Wireless ANC Headphones',
    price: 349,
    originalPrice: 420,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'عزل صوتي هجين Active Noise Cancelling، بطارية تدوم حتى 40 ساعة متواصلة، صوت عالي الدقة Hi-Res مع وسائد أذن ميموري فوم مريحة.',
    descriptionEn: 'Hybrid Active Noise Cancelling headphones, 40-hour ultra battery life, Hi-Res audio drivers with memory foam ear cushions.',
    category: 'إلكترونيات وهواتف',
    inStock: true,
    stockCount: 14,
    likes: 674,
    salesCount: 115,
    isFeatured: true,
    createdAt: '2024-05-20',
    tags: ['سماعات', 'إلكترونيات', 'عزل_صوت', 'لاسلكي']
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    storeId: 'store-1',
    storeName: 'نخبة العود والمسك',
    storeAvatar: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    caption: 'وصول دفعة جديدة من خشب العود المروكي الفاخر اليوم فقط خصم 25% 🔥',
    captionEn: 'Fresh drop of royal Maroki Agarwood! Limited 25% flash offer today 🔥',
    productId: 'prod-1',
    createdAt: 'منذ ساعتين'
  },
  {
    id: 'story-2',
    storeId: 'store-2',
    storeName: 'روشانا ستايل',
    storeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    caption: 'وراء الكواليس: تصوير كولكشن عبايات العيد الجديدة باللون البرتقالي والأسود ✨',
    captionEn: 'Behind the scenes: Shooting the new Eid fashion collection ✨',
    productId: 'prod-3',
    createdAt: 'منذ 4 ساعات'
  },
  {
    id: 'story-3',
    storeId: 'store-3',
    storeName: 'محمصة أرتيزان',
    storeAvatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    caption: 'جلسة التذوق الصباحية لأول شحنة بن قادمة من بنما جيشا ☕ جرب النقاء!',
    captionEn: 'Morning cupping session of our newest Panama Geisha harvest ☕',
    productId: 'prod-5',
    createdAt: 'منذ 6 ساعات'
  },
  {
    id: 'story-4',
    storeId: 'store-4',
    storeName: 'جادجيت زون',
    storeAvatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    caption: 'اختبار عزل الضوضاء في شوارع المدينة لسماعات Pro الجديدة 🎧 عزل كامل!',
    captionEn: 'Street noise test for the new Acoustic Pro headphones 🎧 Total immersion!',
    productId: 'prod-6',
    createdAt: 'منذ 8 ساعات'
  }
];

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

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    userId: 'user-sarah',
    username: 'sarah_fashion_vibes',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    userName: 'سارة العتيبي',
    verified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'تنسيقات صيفية أنيقة لا تستغني عنها في إطلالاتك اليومية ✨ ما رأيكم باللون البرتقالي المحروق؟ #aygram #fashion #موضة_العيد',
    captionEn: 'Chic summer look inspirations you need in your daily wardrobe ✨ What do you think of burnt orange? #aygram #fashion',
    audioTrack: 'Sarah Vibes • الصوت الأصلي - تريند الصيف 🎵',
    likes: 18420,
    commentsCount: 382,
    sharesCount: 1240,
    viewsCount: 145000,
    isLiked: true,
    isSaved: true,
    createdAt: 'منذ يوم',
    tags: ['fashion', 'style', 'aygram', 'أزياء']
  },
  {
    id: 'reel-2',
    userId: 'user-fahad',
    username: 'fahad_tech',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    userName: 'فهد التقني',
    verified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'تجربة حية لأقوى ميزة عزل ضوضائي لسماعات Pro الذكية 🎧 هل يستحق الشراء؟ #تقنية #مراجعات #سماعات',
    captionEn: 'Live test of active noise cancellation on Acoustic Pro 🎧 Worth upgrading? #tech #review',
    audioTrack: 'Fahad Tech • صوت استعراض التقنية ⚡️',
    likes: 31200,
    commentsCount: 650,
    sharesCount: 2980,
    viewsCount: 320000,
    isLiked: false,
    isSaved: false,
    createdAt: 'منذ يومين',
    tags: ['tech', 'audio', 'gadgets', 'تقنية']
  },
  {
    id: 'reel-3',
    userId: 'user-mona',
    username: 'mona_coffeelover',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    userName: 'منى بريستا',
    verified: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    caption: 'سر استخلاص القهوة المقطرة V60 بإيحاءات التوت البري المتوازنة ☕️ احفظوا الفيديو للتجربة القادمة! #قهوة_مختصة #v60',
    captionEn: 'Secret to extracting balanced blueberry notes with V60 ☕️ Save for later! #specialtycoffee',
    audioTrack: 'Acoustic Beats • Relaxing Morning Coffee ☕️',
    likes: 9540,
    commentsCount: 194,
    sharesCount: 870,
    viewsCount: 78000,
    isLiked: false,
    isSaved: true,
    createdAt: 'منذ 3 أيام',
    tags: ['coffee', 'v60', 'morning', 'قهوة']
  },
  {
    id: 'reel-4',
    userId: 'store-1',
    username: 'nokhba_oud',
    userAvatar: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    userName: 'نخبة العود والمسك',
    verified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    caption: 'رحلة تعتيق دهن العود الكمبودي النادر لأكثر من 15 عاماً 👑 فخامة تعانق الذوق الرفيع. #عود_معتق #بخور_ملكي #aygram',
    captionEn: 'Aging process of rare Cambodian royal oud for 15+ years 👑 Pure timeless majesty. #oud #luxury',
    audioTrack: 'Royal Heritage Music • معزوفة شرقية هادئة 🎻',
    likes: 42100,
    commentsCount: 812,
    sharesCount: 3400,
    viewsCount: 410000,
    isLiked: true,
    isSaved: true,
    createdAt: 'منذ 4 أيام',
    tags: ['oud', 'luxury', 'perfume', 'عطور']
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'store-1',
    participantUsername: 'nokhba_oud',
    participantName: 'نخبة العود والمسك',
    participantAvatar: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    participantVerified: true,
    isOnline: true,
    unreadCount: 1,
    lastMessage: 'أهلاً بك! نعم دهن العود الكمبودي متوفر وجاهز للشحن السريع اليوم 🚚',
    lastMessageTime: '10:45 ص',
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-me',
        senderUsername: 'ayzan_official',
        text: 'السلام عليكم، هل متوفر عطر دهن العود الكمبودي حالياً؟',
        timestamp: '10:30 ص'
      },
      {
        id: 'msg-2',
        senderId: 'store-1',
        senderUsername: 'nokhba_oud',
        text: 'وعليكم السلام ورحمة الله وبركاته! أهلاً وسهلاً بك في متجر نخبة العود 🌹',
        timestamp: '10:35 ص'
      },
      {
        id: 'msg-3',
        senderId: 'store-1',
        senderUsername: 'nokhba_oud',
        text: 'أهلاً بك! نعم دهن العود الكمبودي متوفر وجاهز للشحن السريع اليوم 🚚',
        timestamp: '10:45 ص'
      }
    ]
  },
  {
    id: 'conv-2',
    participantId: 'user-sarah',
    participantUsername: 'sarah_fashion_vibes',
    participantName: 'سارة العتيبي',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    participantVerified: true,
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'تم نشر الريلز الجديد على aygram! شكراً لدعمك الدائم ❤️',
    lastMessageTime: 'أمس',
    messages: [
      {
        id: 'msg-4',
        senderId: 'user-me',
        senderUsername: 'ayzan_official',
        text: 'مبدعة دائماً يا سارة، التنسيق البرتقالي رهيب جداً!',
        timestamp: 'أمس 04:15 م'
      },
      {
        id: 'msg-5',
        senderId: 'user-sarah',
        senderUsername: 'sarah_fashion_vibes',
        text: 'تم نشر الريلز الجديد على aygram! شكراً لدعمك الدائم ❤️',
        timestamp: 'أمس 05:00 م',
        isLiked: true
      }
    ]
  },
  {
    id: 'conv-3',
    participantId: 'store-3',
    participantUsername: 'roast_artisan',
    participantName: 'محمصة أرتيزان',
    participantAvatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    participantVerified: true,
    isOnline: true,
    unreadCount: 0,
    lastMessage: 'وصلتنا اليوم أكياس محصول بنما جيشا الطازج ☕️',
    lastMessageTime: 'منذ يومين',
    messages: [
      {
        id: 'msg-6',
        senderId: 'store-3',
        senderUsername: 'roast_artisan',
        text: 'وصلتنا اليوم أكياس محصول بنما جيشا الطازج ☕️',
        timestamp: 'منذ يومين'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'like',
    actorUsername: 'sarah_fashion_vibes',
    actorName: 'سارة العتيبي',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    actorVerified: true,
    text: 'أعجبت بمنشورك الأخير في aygram',
    textEn: 'liked your latest post on aygram',
    targetImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80',
    time: 'منذ 15 دقيقة',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'comment',
    actorUsername: 'nokhba_oud',
    actorName: 'نخبة العود',
    actorAvatar: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    actorVerified: true,
    text: 'علّق: "تصميم رائع وجودة استثنائية! شكراً لاختياركم 👑"',
    textEn: 'commented: "Magnificent quality! Thank you 👑"',
    targetImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    time: 'منذ ساعة',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'follow',
    actorUsername: 'fahad_tech',
    actorName: 'فهد التقني',
    actorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    actorVerified: true,
    text: 'بدأ بمتابعتك على aygram',
    textEn: 'started following you on aygram',
    time: 'منذ 3 ساعات',
    isRead: true
  },
  {
    id: 'notif-4',
    type: 'reel',
    actorUsername: 'mona_coffeelover',
    actorName: 'منى بريستا',
    actorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    text: 'نشرت مقطع ريلز جديد: "سر استخلاص V60" ☕️',
    textEn: 'shared a new reel: "V60 Secret Extraction" ☕️',
    targetImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    time: 'منذ 5 ساعات',
    isRead: true
  },
  {
    id: 'notif-5',
    type: 'order',
    actorUsername: 'roshana_fashion',
    actorName: 'روشانا ستايل',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    actorVerified: true,
    text: 'تم تجهيز وتأكيد طلبك رقم #AYG-7821 بنجاح 🛍️',
    textEn: 'Your order #AYG-7821 is packed and confirmed 🛍️',
    time: 'أمس',
    isRead: true
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    targetId: 'prod-1',
    userId: 'user-sarah',
    username: 'sarah_fashion_vibes',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    text: 'ما شاء الله الرائحة وثبات دهن العود الكمبودي من أروع ما جربت! يستحق كل ريال 😍👑',
    createdAt: 'منذ 3 ساعات',
    likes: 19,
    isLiked: true
  },
  {
    id: 'comm-2',
    targetId: 'prod-1',
    userId: 'user-fahad',
    username: 'fahad_tech',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    text: 'هل التوصيل لمدينة الدمام ياخذ يومين فقط؟',
    createdAt: 'منذ ساعتين',
    likes: 4,
    isLiked: false
  },
  {
    id: 'comm-3',
    targetId: 'prod-3',
    userId: 'user-mona',
    username: 'mona_coffeelover',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    text: 'التطريز البرتقالي مع الكريب الأسود خيال! طلبتها مباشرة للعيد ✨',
    createdAt: 'منذ يوم',
    likes: 12,
    isLiked: true
  }
];

export const LIVE_GIFTS: LiveGift[] = [
  { id: 'gift-1', nameAr: 'وردة بيضاء', nameEn: 'White Rose', icon: '🌹', priceSAR: 5 },
  { id: 'gift-2', nameAr: 'فنجان قهوة مختصة', nameEn: 'Artisan Coffee', icon: '☕', priceSAR: 15 },
  { id: 'gift-3', nameAr: 'ماسة زرقاء لامعة', nameEn: 'Blue Diamond', icon: '💎', priceSAR: 50 },
  { id: 'gift-4', nameAr: 'تاج الفخامة الملكي', nameEn: 'Royal Crown', icon: '👑', priceSAR: 100 },
  { id: 'gift-5', nameAr: 'صاروخ الدعم الذهبي', nameEn: 'Gold Rocket', icon: '🚀', priceSAR: 250 },
  { id: 'gift-6', nameAr: 'كأس التميز الأسطوري', nameEn: 'Champion Trophy', icon: '🏆', priceSAR: 500 }
];

export const INITIAL_LIVE_STREAMS: LiveStream[] = [
  {
    id: 'live-1',
    userId: 'user-sarah',
    username: 'sarah_fashion_vibes',
    userName: 'سارة العتيبي',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    userVerified: true,
    title: 'بث حي: استعراض تشكيلة فساتين الصيف وتنسيقات الألوان الجديدة 🔥💃',
    titleEn: 'Live: Summer Dresses & Fashion Color Matching 🔥💃',
    viewerCount: 2840,
    likesCount: 19400,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isLive: true,
    startedAt: 'منذ 18 دقيقة',
    category: 'أزياء وجمال',
    comments: [
      {
        id: 'lc-1',
        streamId: 'live-1',
        userId: 'u-1',
        username: 'reem_style',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        text: 'ما شاء الله التنسيق الأزرق الملكي خياااالي 😍',
        createdAt: 'الآن'
      },
      {
        id: 'lc-2',
        streamId: 'live-1',
        userId: 'u-2',
        username: 'khalid_ksa',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        text: 'أرسل هدية 💎 ماسة زرقاء لامعة!',
        createdAt: 'الآن',
        isGiftNotice: true
      },
      {
        id: 'lc-3',
        streamId: 'live-1',
        userId: 'u-3',
        username: 'amal_design',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
        text: 'هل متوفر مقاس M من الفستان الأول؟',
        createdAt: 'منذ دقيقة'
      }
    ]
  },
  {
    id: 'live-2',
    userId: 'store-1',
    username: 'nokhba_oud',
    userName: 'نخبة العود والمسك',
    userAvatar: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300&auto=format&fit=crop&q=80',
    userVerified: true,
    title: 'تعتيق العود الملكي مباشرة من المعمل السري 👑 تجربة البخور النادر',
    titleEn: 'Aging Royal Cambodian Oud Live 👑 Rare Incense Showcase',
    viewerCount: 1530,
    likesCount: 14200,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    isLive: true,
    startedAt: 'منذ 34 دقيقة',
    category: 'عطور وبخور',
    comments: [
      {
        id: 'lc-4',
        streamId: 'live-2',
        userId: 'u-4',
        username: 'omar_riyadh',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        text: 'ريحته واصلة للشاشة من فخامته ما شاء الله 👑',
        createdAt: 'الآن'
      },
      {
        id: 'lc-5',
        streamId: 'live-2',
        userId: 'u-5',
        username: 'mona_coffeelover',
        userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
        text: 'أرسل هدية 👑 تاج الفخامة الملكي!',
        createdAt: 'الآن',
        isGiftNotice: true
      }
    ]
  }
];

export const INITIAL_WALLET: CreatorWallet = {
  balanceSAR: 4850.00,
  totalEarnedSAR: 18450.00,
  salesEarningsSAR: 12600.00,
  liveGiftsEarningsSAR: 5850.00,
  pendingPayoutSAR: 0.00,
  transactions: [
    {
      id: 'tx-1',
      type: 'live_gift',
      title: 'هدية بث مباشر: تاج ملكي 👑',
      titleEn: 'Live Gift: Royal Crown 👑',
      amountSAR: 100,
      date: 'اليوم 03:20 م',
      status: 'completed',
      senderUsername: 'mona_coffeelover'
    },
    {
      id: 'tx-2',
      type: 'live_gift',
      title: 'هدية بث مباشر: صاروخ الدعم الذهبي 🚀',
      titleEn: 'Live Gift: Gold Rocket 🚀',
      amountSAR: 250,
      date: 'اليوم 02:45 م',
      status: 'completed',
      senderUsername: 'fahad_tech'
    },
    {
      id: 'tx-3',
      type: 'product_sale',
      title: 'أرباح مبيعات: عطر دهن العود الكمبودي 🛍️',
      titleEn: 'Sales Earning: Royal Cambodian Oud 🛍️',
      amountSAR: 380,
      date: 'أمس 08:10 م',
      status: 'completed'
    },
    {
      id: 'tx-4',
      type: 'withdrawal',
      title: 'تحويل أرباح لحساب بنك الراجحي (IBAN)',
      titleEn: 'Withdrawal to Bank Account (IBAN)',
      amountSAR: -2000,
      date: 'منذ 3 أيام',
      status: 'completed',
      note: 'SA4480000213608010009999'
    }
  ]
};
