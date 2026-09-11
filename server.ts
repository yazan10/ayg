import express, { Request, Response } from 'express';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import * as adminApp from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------
// Firebase Admin SDK (server-side only - NEVER expose to client)
// Credentials come from env: FIREBASE_SERVICE_ACCOUNT_JSON (raw or base64)
// or FIREBASE_SERVICE_ACCOUNT_PATH (path to serviceAccountKey.json).
// The legacy RTDB database secret (FIREBASE_DATABASE_SECRET) is NOT needed
// when the Admin SDK is configured - keep it private in env if you store it.
// ----------------------------------------------------
let adminAuth: any = null;
let adminDb: any = null;
let adminReady = false;

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function initFirebaseAdmin() {
  try {
    let credential: any = null;
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '';
    if (rawJson) {
      try {
        // Support base64-encoded JSON (safe for single-line env vars)
        const maybeJson = /^[A-Za-z0-9+/=\s]+$/.test(rawJson) && !rawJson.trim().startsWith('{')
          ? Buffer.from(rawJson, 'base64').toString('utf8')
          : rawJson;
        credential = adminApp.cert(JSON.parse(maybeJson));
      } catch (e: any) {
        console.warn('[admin] Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', e?.message);
      }
    } else if (keyPath) {
      try {
        credential = adminApp.cert(keyPath);
      } catch (e: any) {
        console.warn('[admin] Cannot load FIREBASE_SERVICE_ACCOUNT_PATH:', e?.message);
      }
    }
    if (!credential) {
      console.warn('[admin] Admin SDK not configured - set FIREBASE_SERVICE_ACCOUNT_JSON. Admin sessions will use env-credential fallback.');
      return;
    }
    const app = adminApp.getApps().length === 0
      ? adminApp.initializeApp({
          credential,
          databaseURL: 'https://aygram-8d0d0-default-rtdb.firebaseio.com',
        })
      : adminApp.getApps()[0];
    adminAuth = getAuth(app);
    try {
      adminDb = getDatabase(app);
    } catch {}
    adminReady = true;
    console.log('[admin] Firebase Admin SDK ready');
    await ensureAdminUser();
  } catch (e: any) {
    console.warn('[admin] firebase-admin unavailable:', e?.message);
  }
}

// Create the admin Auth user (if missing) and grant the admin claim.
// The admin MUST verify the email (Firebase sends the verification link)
// before admin sessions are issued - that is the email-confirmation step.
async function ensureAdminUser() {
  try {
    if (!adminReady || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      if (ADMIN_EMAIL && !isValidEmail(ADMIN_EMAIL)) {
        console.warn('[admin] ADMIN_EMAIL is not a valid email address - fix it in env (did you mean a full address with domain?). Skipping admin bootstrap.');
      }
      return;
    }
    let user: any = null;
    try {
      user = await adminAuth.getUserByEmail(ADMIN_EMAIL);
    } catch (e: any) {
      if (e?.code === 'auth/user-not-found') {
        user = await adminAuth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: 'aygram Admin',
          emailVerified: false,
        });
        console.log('[admin] Admin Auth user created - a verification email must be confirmed before login');
      } else {
        throw e;
      }
    }
    const claims = (user.customClaims || {}) as Record<string, unknown>;
    if (claims.admin !== true) {
      await adminAuth.setCustomUserClaims(user.uid, { ...claims, admin: true });
      console.log('[admin] Admin claim granted');
    }
    if (adminDb) {
      await adminDb.ref(`admins/${user.uid}`).update({
        email: ADMIN_EMAIL,
        role: 'superadmin',
        updatedAt: new Date().toISOString(),
      }).catch(() => {});
    }
  } catch (e: any) {
    console.warn('[admin] ensureAdminUser failed:', e?.message);
  }
}

initFirebaseAdmin();

// ----------------------------------------------------
// Admin sessions + rate limiting (in-memory)
// ----------------------------------------------------
const adminSessions = new Map<string, { email: string; uid: string; mode: string; expiresAt: number }>();
const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, max = 10, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  rec.count += 1;
  return rec.count <= max;
}

function issueAdminSession(email: string, uid: string, mode: string): string {
  const token = `aygram_admin_${crypto.randomBytes(32).toString('hex')}`;
  adminSessions.set(token, { email, uid, mode, expiresAt: Date.now() + ADMIN_SESSION_TTL_MS });
  return token;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  try {
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

// In-memory data store seeded for backend REST API
const apiData: any = {
  currencies: {
    SAR: { code: 'SAR', symbol: 'ر.س', rateFromSAR: 1, name: 'Saudi Riyal' },
    ILS: { code: 'ILS', symbol: '₪', rateFromSAR: 1.0, name: 'Shekel' },
    JOD: { code: 'JOD', symbol: 'د.أ', rateFromSAR: 0.189, name: 'Jordanian Dinar' },
    USD: { code: 'USD', symbol: '$', rateFromSAR: 0.267, name: 'US Dollar' }
  },
  wallet: {
    balanceSAR: 4850.00,
    totalEarnedSAR: 18450.00,
    salesEarningsSAR: 12600.00,
    liveGiftsEarningsSAR: 5850.00
  },
  subscriptionPricing: {
    storeActivationILS: 30,
    accountVerificationILS: 25,
    goldBadgeILS: 50,
    currency: 'ILS',
    updatedAt: new Date().toISOString(),
  },
  stores: [
    { id: 'store-1', username: 'nokhba_oud', name: 'نخبة العود والمسك', verified: true, subscription: { status: 'active', isActive: true, pricePaidILS: 30, expiresAt: new Date(Date.now() + 20*24*60*60*1000).toISOString() }, storeType: 'verified_store' },
    { id: 'store-2', username: 'roshana_fashion', name: 'روشانا ستايل', verified: true, subscription: { status: 'active', isActive: true, pricePaidILS: 30, expiresAt: new Date(Date.now() + 25*24*60*60*1000).toISOString() }, storeType: 'verified_store' },
    { id: 'store-3', username: 'roast_artisan', name: 'محمصة أرتيزان', verified: true, subscription: { status: 'active', isActive: true, pricePaidILS: 30, expiresAt: new Date(Date.now() + 10*24*60*60*1000).toISOString() }, storeType: 'verified_store' },
    { id: 'store-4', username: 'gadget_zone_tech', name: 'جادجيت زون', verified: false, subscription: { status: 'expired', isActive: false, pricePaidILS: 30, expiresAt: new Date(Date.now() - 15*24*60*60*1000).toISOString() }, storeType: 'pending_store' },
  ],
  users: [
    { id: 'user-me', username: 'ayzan_official', name: 'يزن صلاق', verificationTier: 'gold', verification: { tier: 'gold', isActive: true, pricePaidILS: 50 } },
    { id: 'user-sarah', username: 'sarah_fashion_vibes', name: 'سارة العتيبي', verificationTier: 'blue', verification: { tier: 'blue', isActive: true, pricePaidILS: 25 } },
    { id: 'user-fahad', username: 'fahad_tech', name: 'فهد التقني', verificationTier: 'blue', verification: { tier: 'blue', isActive: true, pricePaidILS: 25 } },
    { id: 'user-mona', username: 'mona_coffeelover', name: 'منى بريستا', verificationTier: 'none', verification: { tier: 'none', isActive: false, pricePaidILS: 0 } },
  ],
  liveStreams: [
    {
      id: 'live-1',
      username: 'sarah_fashion_vibes',
      name: 'سارة العتيبي',
      title: 'بث حي: استعراض تشكيلة فساتين الصيف وتنسيقات الألوان الجديدة 🔥💃',
      viewerCount: 2840,
      likesCount: 19400,
      isLive: true,
      category: 'أزياء وجمال'
    },
    {
      id: 'live-2',
      username: 'nokhba_oud',
      name: 'نخبة العود والمسك',
      title: 'تعتيق العود الملكي مباشرة من المعمل السري 👑 تجربة البخور النادر',
      viewerCount: 1530,
      likesCount: 14200,
      isLive: true,
      category: 'عطور وبخور'
    }
  ]
};

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Health & Server Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'aygram Core API Engine',
    version: '2.5.0',
    timestamp: new Date().toISOString(),
    supportedCurrencies: ['SAR', 'ILS', 'JOD', 'USD']
  });
});

// 2. Currencies & Exchange Rates
app.get('/api/currencies', (req: Request, res: Response) => {
  res.json({
    baseCurrency: 'SAR',
    rates: apiData.currencies,
    updatedAt: new Date().toISOString()
  });
});

// 3. Live Streaming Endpoints
app.get('/api/live', (req: Request, res: Response) => {
  res.json({
    success: true,
    streams: apiData.liveStreams,
    totalLive: apiData.liveStreams.length
  });
});

app.post('/api/live/start', (req: Request, res: Response) => {
  const { title, category, username, name } = req.body;
  const newStream = {
    id: `live-${Date.now()}`,
    username: username || 'ayzan_official',
    name: name || 'يزن صلاق',
    title: title || 'بث مباشر جديد على aygram',
    viewerCount: 1,
    likesCount: 0,
    isLive: true,
    category: category || 'عام'
  };
  apiData.liveStreams.unshift(newStream);
  res.status(201).json({
    success: true,
    message: 'Live stream broadcast started successfully',
    stream: newStream
  });
});

app.post('/api/live/:id/gift', (req: Request, res: Response) => {
  const { giftName, priceSAR, senderUsername } = req.body;
  const amount = Number(priceSAR) || 10;
  apiData.wallet.balanceSAR += amount;
  apiData.wallet.totalEarnedSAR += amount;
  apiData.wallet.liveGiftsEarningsSAR += amount;

  res.json({
    success: true,
    message: `Gift ${giftName || 'Gift'} sent successfully!`,
    sender: senderUsername || 'user',
    amountCreditedSAR: amount,
    newWalletBalanceSAR: apiData.wallet.balanceSAR
  });
});

// 4. Creator Wallet & Earnings Endpoints
app.get('/api/wallet', (req: Request, res: Response) => {
  const currency = (req.query.currency as string) || 'SAR';
  const rate = apiData.currencies[currency as keyof typeof apiData.currencies]?.rateFromSAR || 1;
  const symbol = apiData.currencies[currency as keyof typeof apiData.currencies]?.symbol || 'ر.س';

  res.json({
    success: true,
    currency,
    symbol,
    balance: Number((apiData.wallet.balanceSAR * rate).toFixed(2)),
    totalEarned: Number((apiData.wallet.totalEarnedSAR * rate).toFixed(2)),
    salesEarnings: Number((apiData.wallet.salesEarningsSAR * rate).toFixed(2)),
    liveGiftsEarnings: Number((apiData.wallet.liveGiftsEarningsSAR * rate).toFixed(2)),
    baseBalanceSAR: apiData.wallet.balanceSAR
  });
});

app.post('/api/wallet/withdraw', (req: Request, res: Response) => {
  const { amountSAR, method, recipientDetails } = req.body;
  const requested = Number(amountSAR);

  if (!requested || requested <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid withdrawal amount' });
  }

  if (requested > apiData.wallet.balanceSAR) {
    return res.status(400).json({ success: false, error: 'Insufficient balance in wallet' });
  }

  apiData.wallet.balanceSAR -= requested;

  res.json({
    success: true,
    message: 'Withdrawal request submitted successfully',
    transactionId: `tx-w-${Date.now()}`,
    withdrawnSAR: requested,
    remainingBalanceSAR: apiData.wallet.balanceSAR,
    payoutMethod: method || 'Bank Transfer (IBAN)',
    recipient: recipientDetails || 'Registered IBAN Account',
    status: 'processing'
  });
});

// 5. Auth & OTP System (Email + OTP + Username/Password)
const authUsers: Array<{ id: string; name: string; username: string; email: string; password: string; avatar: string; verified: boolean; createdAt: string }> = [
  { id: 'user-me', name: 'يزن صلاق', username: 'ayzan_official', email: 'yazan@aygram.com', password: 'yaz@#5Y', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300', verified: true, createdAt: '2024-01-01' },
  { id: 'user-sarah', name: 'سارة العتيبي', username: 'sarah_fashion_vibes', email: 'sarah@aygram.com', password: 'sarah123', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', verified: true, createdAt: '2024-02-01' },
];
const otpStore: Record<string, { code: string; expiresAt: number; type: 'login' | 'register'; pendingData?: any }> = {};
const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { email, type } = req.body;
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) return res.status(400).json({ success: false, message: 'البريد الإلكتروني غير صالح' });
  if (type === 'login') {
    const exists = authUsers.find(u => u.email.toLowerCase() === normalized);
    if (!exists) return res.status(404).json({ success: false, message: 'البريد غير مسجل، الرجاء إنشاء حساب جديد' });
  }
  if (type === 'register') {
    const exists = authUsers.find(u => u.email.toLowerCase() === normalized);
    if (exists) return res.status(400).json({ success: false, message: 'البريد مسجل مسبقاً' });
  }
  const code = generateOtpCode();
  otpStore[normalized] = { code, expiresAt: Date.now() + 5 * 60 * 1000, type: type || 'login' };
  console.log(`[aygram OTP] ${type} for ${normalized}: ${code}`);
  res.json({ success: true, message: type === 'login' ? 'تم إرسال رمز الدخول إلى بريدك' : 'تم إرسال رمز التأكيد إلى بريدك', demoCode: code, expiresIn: 300 });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, username, email, password, confirmPassword, avatar, nationality, nationalityNameAr } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedUsername = (username || '').trim().toLowerCase().replace(/^@/, '');
  if (!name || !normalizedUsername || !normalizedEmail || !password) return res.status(400).json({ success: false, message: 'الرجاء تعبئة جميع الحقول' });
  if (password !== confirmPassword) return res.status(400).json({ success: false, message: 'كلمة المرور وتأكيدها غير متطابقتين' });
  if (password.length < 6) return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
  if (normalizedUsername.length < 3) {
    if (normalizedUsername.length === 2) return res.status(400).json({ success: false, message: 'اليوزر من حرفين يتطلب طلب حجز خاص', needsReservation: true });
    return res.status(400).json({ success: false, message: 'اليوزر يجب أن يكون 3 أحرف على الأقل' });
  }
  if (!/^[a-z0-9_.]+$/.test(normalizedUsername)) return res.status(400).json({ success: false, message: 'اسم المستخدم يجب أن يحتوي أحرف إنجليزية وأرقام فقط' });
  if (authUsers.find(u => u.email.toLowerCase() === normalizedEmail)) return res.status(400).json({ success: false, message: 'البريد مسجل مسبقاً' });
  if (authUsers.find(u => u.username.toLowerCase() === normalizedUsername)) return res.status(400).json({ success: false, message: 'اسم المستخدم محجوز' });
  const code = generateOtpCode();
  otpStore[normalizedEmail] = { code, expiresAt: Date.now() + 5 * 60 * 1000, type: 'register', pendingData: { name: name.trim(), username: normalizedUsername, email: normalizedEmail, password, avatar, nationality, nationalityNameAr } };
  console.log(`[aygram REGISTER OTP] for ${normalizedEmail}: ${code}`);
  res.json({ success: true, message: 'تم إرسال رمز التأكيد إلى بريدك', demoCode: code, needOtp: true, email: normalizedEmail });
});

// Check username availability - Server verification
app.get('/api/auth/check-username', (req: Request, res: Response) => {
  const username = ((req.query.username as string) || '').trim().toLowerCase().replace(/^@/, '');
  if (!username) return res.json({ available: false, message: 'أدخل اليوزر', isShort: true });
  if (username.length < 2) return res.json({ available: false, message: 'قصير جداً — حرفين يحتاج حجز', needsReservation: true, isShort: true });
  if (username.length === 2) return res.json({ available: false, message: 'اليوزرات بحرفين محجوزة — قدم طلب حجز', needsReservation: true, isShort: true });
  if (username.length < 3) return res.json({ available: false, message: 'الحد الأدنى 3 أحرف', isShort: true });
  if (!/^[a-z0-9_.]+$/.test(username)) return res.json({ available: false, message: 'أحرف إنجليزية وأرقام ونقطة فقط' });
  const exists = authUsers.find(u => u.username.toLowerCase() === username);
  if (exists) return res.json({ available: false, message: 'اليوزر محجوز ✕' });
  return res.json({ available: true, message: 'اليوزر متاح ✓' });
});

// Reserve 2-char username
const usernameReservations: Array<{ username: string; email: string; createdAt: string }> = [];
app.post('/api/auth/reserve-username', (req: Request, res: Response) => {
  const { username, email } = req.body;
  const normalized = (username || '').trim().toLowerCase().replace(/^@/, '');
  if (normalized.length !== 2) return res.status(400).json({ success: false, message: 'الحجز فقط لليوزرات بحرفين' });
  if (!/^[a-z0-9_.]+$/.test(normalized)) return res.status(400).json({ success: false, message: 'يوزر غير صالح' });
  if (authUsers.find(u => u.username.toLowerCase() === normalized)) return res.status(400).json({ success: false, message: 'اليوزر محجوز بالفعل' });
  if (usernameReservations.find(r => r.username === normalized)) return res.status(400).json({ success: false, message: 'تم تقديم طلب حجز مسبقاً لهذا اليوزر' });
  usernameReservations.push({ username: normalized, email: (email || '').trim().toLowerCase(), createdAt: new Date().toISOString() });
  console.log(`[aygram RESERVE] ${normalized} for ${email}`);
  res.json({ success: true, message: `تم استلام طلب حجز اليوزر "${normalized}" — سيتم مراجعته خلال 24 ساعة` });
});

app.post('/api/auth/verify-register', (req: Request, res: Response) => {
  const { email, code } = req.body;
  const normalized = (email || '').trim().toLowerCase();
  const record = otpStore[normalized];
  if (!record || record.type !== 'register' || !record.pendingData) return res.status(400).json({ success: false, message: 'لا يوجد طلب تسجيل معلق' });
  if (Date.now() > record.expiresAt) { delete otpStore[normalized]; return res.status(400).json({ success: false, message: 'انتهت صلاحية الرمز' }); }
  if (record.code !== (code || '').trim()) return res.status(400).json({ success: false, message: 'الرمز غير صحيح' });
  const pending = record.pendingData;
  const avatarToUse = pending.avatar && pending.avatar.trim() ? pending.avatar.trim() : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300`;
  const newUser: any = { id: `user-${Date.now()}`, name: pending.name, username: pending.username, email: pending.email, password: pending.password, avatar: avatarToUse, verified: true, createdAt: new Date().toISOString().split('T')[0], nationality: pending.nationality, nationalityNameAr: pending.nationalityNameAr };
  authUsers.push(newUser);
  delete otpStore[normalized];
  res.json({ success: true, message: 'تم إنشاء الحساب بنجاح! مرحباً بك في aygram', user: { id: newUser.id, name: newUser.name, username: newUser.username, email: newUser.email, avatar: newUser.avatar, verified: newUser.verified }, token: `aygram_token_${Date.now()}` });
});

app.post('/api/auth/verify-login', (req: Request, res: Response) => {
  const { email, code } = req.body;
  const normalized = (email || '').trim().toLowerCase();
  const record = otpStore[normalized];
  if (!record || record.type !== 'login') return res.status(400).json({ success: false, message: 'الرجاء طلب رمز الدخول أولاً' });
  if (Date.now() > record.expiresAt) { delete otpStore[normalized]; return res.status(400).json({ success: false, message: 'انتهت صلاحية الرمز' }); }
  if (record.code !== (code || '').trim()) return res.status(400).json({ success: false, message: 'الرمز غير صحيح' });
  const user = authUsers.find(u => u.email.toLowerCase() === normalized);
  if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
  delete otpStore[normalized];
  res.json({ success: true, message: `مرحباً بعودتك ${user.name}!`, user: { id: user.id, name: user.name, username: user.username, email: user.email, avatar: user.avatar, verified: user.verified }, token: `aygram_token_${Date.now()}` });
});

app.post('/api/auth/login-password', (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;
  const normalized = (emailOrUsername || '').trim().toLowerCase();
  const user = authUsers.find(u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized);
  if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
  if (user.password !== password) return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
  res.json({ success: true, message: `مرحباً ${user.name}!`, user: { id: user.id, name: user.name, username: user.username, email: user.email, avatar: user.avatar, verified: user.verified }, token: `aygram_token_${Date.now()}` });
});

app.get('/api/auth/users', (req: Request, res: Response) => {
  res.json({ success: true, users: authUsers.map(u => ({ id: u.id, name: u.name, username: u.username, email: u.email, avatar: u.avatar, verified: u.verified, createdAt: u.createdAt })), total: authUsers.length });
});

// 5b. Firebase-backed verification codes (authoritative path).
// Codes are stored via Admin SDK (RTDB otpCodes + Firestore pending_otps)
// and verified here, with hard per-IP and per-device limits so code
// endpoints cannot be abused to drain resources.
const codeDeviceLimits = new Map<string, { count: number; resetAt: number }>();
const checkDeviceLimit = (key: string, max: number, windowMs: number): boolean => {
  const now = Date.now();
  const rec = codeDeviceLimits.get(key);
  if (!rec || now > rec.resetAt) {
    codeDeviceLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  rec.count += 1;
  return rec.count <= max;
};
const CODE_TTL_MS = 5 * 60 * 1000;
const emailDocKey = (email: string) => email.trim().toLowerCase().replace(/[@.]/g, '_');

app.post('/api/auth/request-code', async (req: Request, res: Response) => {
  const ip = (req.ip || req.socket?.remoteAddress || 'unknown').toString();
  if (!checkRateLimit(ip, 10)) {
    return res.status(429).json({ success: false, error: 'Too many requests - try later' });
  }
  const { email, username, name, deviceFp } = req.body || {};
  const normalized = (email || '').trim().toLowerCase();
  const fp = (deviceFp || '').toString().slice(0, 80);
  if (!normalized || !normalized.includes('@')) return res.status(400).json({ success: false, message: 'البريد الإلكتروني غير صالح' });
  if (!/^[a-z0-9_.]+$/.test((username || '').toLowerCase().replace(/^@/, '')) || (username || '').length < 3) {
    return res.status(400).json({ success: false, message: 'اسم المستخدم غير صالح' });
  }
  if (!fp) return res.status(400).json({ success: false, message: 'بصمة الجهاز مطلوبة' });
  if (!checkDeviceLimit(`req:${fp}`, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ success: false, message: 'تجاوزت حد طلب الرموز لهذا الجهاز — حاول لاحقاً' });
  }
  if (!adminReady) {
    return res.status(503).json({ success: false, message: 'Code service unavailable', useDirect: true });
  }
  try {
    try {
      await adminAuth.getUserByEmail(normalized);
      return res.status(409).json({ success: false, message: 'البريد مسجل مسبقاً، سجل الدخول' });
    } catch (e: any) {
      if (e?.code !== 'auth/user-not-found') throw e;
    }
    const code = generateOtpCode();
    const expiresAtMs = Date.now() + CODE_TTL_MS;
    const key = emailDocKey(normalized);
    const record = { email: normalized, code, deviceFp: fp, attempts: 0, expiresAtMs, createdAt: new Date().toISOString() };
    if (adminDb) {
      await adminDb.ref(`otpCodes/${key}`).set(record).catch(() => {});
    }
    try {
      const { getFirestore } = await import('firebase-admin/firestore');
      const db = getFirestore();
      await db.doc(`pending_otps/${key}`).set(record, { merge: false }).catch(() => {});
      await db.collection('otp_audit').add({ email: normalized, deviceFp: fp, action: 'request', atMs: Date.now() }).catch(() => {});
    } catch {}
    console.log(`[aygram CODE] register code stored for ${normalized} (device-bound, 5 min)`);
    return res.json({ success: true, message: 'تم إرسال رمز التحقق — صالح لمدة 5 دقائق', code, expiresAtMs, email: normalized });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: 'تعذر إنشاء الرمز — حاول مجدداً' });
  }
});

app.post('/api/auth/verify-code', async (req: Request, res: Response) => {
  const ip = (req.ip || req.socket?.remoteAddress || 'unknown').toString();
  if (!checkRateLimit(ip, 30)) {
    return res.status(429).json({ success: false, error: 'Too many attempts - try later' });
  }
  const { email, code, deviceFp } = req.body || {};
  const normalized = (email || '').trim().toLowerCase();
  const typed = (code || '').trim();
  const fp = (deviceFp || '').toString().slice(0, 80);
  if (!/^\d{6}$/.test(typed)) return res.status(400).json({ success: false, message: 'الرمز يجب أن يكون 6 أرقام' });
  if (!adminReady) {
    return res.status(503).json({ success: false, message: 'Code service unavailable', useDirect: true });
  }
  try {
    const key = emailDocKey(normalized);
    let record: any = null;
    if (adminDb) {
      const snap = await adminDb.ref(`otpCodes/${key}`).get().catch(() => null);
      if (snap && snap.exists()) record = snap.val();
    }
    if (!record) {
      try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const snap = await getFirestore().doc(`pending_otps/${key}`).get().catch(() => null);
        if (snap && snap.exists) record = snap.data();
      } catch {}
    }
    if (!record) return res.status(404).json({ success: false, message: 'الرمز غير موجود أو انتهى — اطلب رمزاً جديداً' });
    if (Date.now() > record.expiresAtMs) {
      try { if (adminDb) await adminDb.ref(`otpCodes/${key}`).remove().catch(() => {}); } catch {}
      return res.status(410).json({ success: false, message: 'انتهت صلاحية الرمز — اطلب رمزاً جديداً' });
    }
    if (record.deviceFp && record.deviceFp !== fp) {
      return res.status(403).json({ success: false, message: 'هذا الرمز مرتبط بالجهاز الذي طُلب منه' });
    }
    if ((record.attempts || 0) >= 5) {
      return res.status(403).json({ success: false, message: 'انتهت محاولات هذا الرمز — اطلب رمزاً جديداً' });
    }
    if (record.code !== typed) {
      const attempts = (record.attempts || 0) + 1;
      try {
        if (adminDb) await adminDb.ref(`otpCodes/${key}/attempts`).set(attempts).catch(() => {});
        const { getFirestore } = await import('firebase-admin/firestore');
        await getFirestore().doc(`pending_otps/${key}`).update({ attempts }).catch(() => {});
      } catch {}
      const left = 5 - attempts;
      return res.status(403).json({
        success: false,
        message: left > 0 ? `الرمز غير صحيح — بقيت ${left} محاولات` : 'الرمز غير صحيح — انتهت المحاولات، اطلب رمزاً جديداً',
        remaining: Math.max(0, left),
      });
    }
    // Match: burn the code so it cannot be reused
    try {
      if (adminDb) await adminDb.ref(`otpCodes/${key}`).remove().catch(() => {});
      const { getFirestore } = await import('firebase-admin/firestore');
      await getFirestore().doc(`pending_otps/${key}`).delete().catch(() => {});
    } catch {}
    return res.json({ success: true, message: 'تم تأكيد الرمز بنجاح' });
  } catch {
    return res.status(500).json({ success: false, message: 'تعذر التحقق — حاول مجدداً' });
  }
});

// 6. Subscriptions & Pricing - فصل المتاجر عن الحسابات
app.get('/api/pricing', (req: Request, res: Response) => {
  res.json({
    success: true,
    pricing: apiData.subscriptionPricing,
    plans: {
      storeActivation: { nameAr: 'تفعيل المتجر', nameEn: 'Store Activation', priceILS: apiData.subscriptionPricing.storeActivationILS, interval: 'monthly', section: 'stores', descriptionAr: 'تفعيل متجرك للبيع لمدة 30 يوم', descriptionEn: 'Activate store for 30 days' },
      accountVerification: { nameAr: 'توثيق الحساب', nameEn: 'Blue Verification', priceILS: apiData.subscriptionPricing.accountVerificationILS, interval: 'monthly', section: 'accounts', descriptionAr: 'علامة زرقاء للحسابات', descriptionEn: 'Blue badge for accounts' },
      goldBadge: { nameAr: 'العلامة الزرقاء الذهبية', nameEn: 'Gold Blue Badge', priceILS: apiData.subscriptionPricing.goldBadgeILS, interval: 'monthly', section: 'accounts', descriptionAr: 'علامة ذهبية مميزة', descriptionEn: 'Premium gold badge' },
    },
    separatedSections: {
      stores: { titleAr: 'قسم المتاجر', titleEn: 'Stores Section', count: apiData.stores.length, active: apiData.stores.filter((s: any) => s.subscription?.isActive).length },
      accounts: { titleAr: 'قسم الحسابات', titleEn: 'Accounts Section', count: apiData.users.length, verified: apiData.users.filter((u: any) => u.verification?.isActive).length },
    }
  });
});

app.post('/api/pricing/update', (req: Request, res: Response) => {
  const { storeActivationILS, accountVerificationILS, goldBadgeILS } = req.body;
  if (storeActivationILS !== undefined) apiData.subscriptionPricing.storeActivationILS = Number(storeActivationILS);
  if (accountVerificationILS !== undefined) apiData.subscriptionPricing.accountVerificationILS = Number(accountVerificationILS);
  if (goldBadgeILS !== undefined) apiData.subscriptionPricing.goldBadgeILS = Number(goldBadgeILS);
  apiData.subscriptionPricing.updatedAt = new Date().toISOString();
  res.json({ success: true, message: 'تم تحديث الأسعار بنجاح', pricing: apiData.subscriptionPricing });
});

app.get('/api/stores', (req: Request, res: Response) => {
  const filter = req.query.filter as string;
  let result = apiData.stores;
  if (filter === 'active') result = result.filter((s: any) => s.subscription?.isActive);
  if (filter === 'expired') result = result.filter((s: any) => !s.subscription?.isActive);
  res.json({ success: true, section: 'stores_separated', total: apiData.stores.length, active: apiData.stores.filter((s: any) => s.subscription?.isActive).length, stores: result, pricing: { activationILS: apiData.subscriptionPricing.storeActivationILS } });
});

app.post('/api/stores/:id/activate', (req: Request, res: Response) => {
  const store = apiData.stores.find((s: any) => s.id === req.params.id);
  if (!store) return res.status(404).json({ success: false, error: 'Store not found' });
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  store.subscription = { status: 'active', isActive: true, startedAt: now.toISOString(), expiresAt: expiresAt.toISOString(), pricePaidILS: apiData.subscriptionPricing.storeActivationILS, autoRenew: true, planId: 'store_monthly' };
  store.storeType = 'verified_store';
  store.verified = true;
  res.json({ success: true, message: `تم تفعيل المتجر ${store.name} لمدة 30 يوم مقابل ${store.subscription.pricePaidILS}₪`, store, expiresAt: store.subscription.expiresAt });
});

app.post('/api/stores/:id/cancel', (req: Request, res: Response) => {
  const store = apiData.stores.find((s: any) => s.id === req.params.id);
  if (!store) return res.status(404).json({ success: false, error: 'Store not found' });
  if (store.subscription) { store.subscription.status = 'expired'; store.subscription.isActive = false; store.subscription.autoRenew = false; }
  store.storeType = 'pending_store';
  res.json({ success: true, message: 'تم إلغاء اشتراك المتجر', store });
});

app.get('/api/accounts', (req: Request, res: Response) => {
  const filter = req.query.filter as string;
  let result = apiData.users;
  if (filter === 'verified') result = result.filter((u: any) => u.verification?.isActive);
  if (filter === 'gold') result = result.filter((u: any) => u.verification?.tier === 'gold' && u.verification?.isActive);
  if (filter === 'blue') result = result.filter((u: any) => u.verification?.tier === 'blue' && u.verification?.isActive);
  res.json({ success: true, section: 'accounts_separated', total: apiData.users.length, verified: apiData.users.filter((u: any) => u.verification?.isActive).length, accounts: result, pricing: { verificationILS: apiData.subscriptionPricing.accountVerificationILS, goldBadgeILS: apiData.subscriptionPricing.goldBadgeILS } });
});

app.post('/api/accounts/:id/verify', (req: Request, res: Response) => {
  const { tier } = req.body; // 'blue' | 'gold'
  const user = apiData.users.find((u: any) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'Account not found' });
  if (!['blue', 'gold'].includes(tier)) return res.status(400).json({ success: false, error: 'Invalid tier' });
  const priceILS = tier === 'gold' ? apiData.subscriptionPricing.goldBadgeILS : apiData.subscriptionPricing.accountVerificationILS;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  user.verification = { tier, isActive: true, startedAt: now.toISOString(), expiresAt: expiresAt.toISOString(), pricePaidILS: priceILS, autoRenew: true };
  user.verificationTier = tier as any;
  user.verified = true;
  res.json({ success: true, message: tier === 'gold' ? `تم تفعيل العلامة الذهبية مقابل ${priceILS}₪` : `تم توثيق الحساب مقابل ${priceILS}₪`, user, expiresAt: user.verification.expiresAt });
});

app.post('/api/accounts/:id/cancel-verification', (req: Request, res: Response) => {
  const user = apiData.users.find((u: any) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'Account not found' });
  user.verification = { tier: 'none', isActive: false, pricePaidILS: 0, autoRenew: false };
  user.verificationTier = 'none';
  user.verified = false;
  res.json({ success: true, message: 'تم إلغاء التوثيق', user });
});

// 7. Admin & Security Verification (Firebase Admin SDK backed)
//
// Primary flow (works with Admin SDK configured):
//   client signs in with Firebase Auth -> POST { idToken } ->
//   server verifies token + admin claim + verified email -> session token.
// Fallback flow (Admin SDK key not set on this host):
//   POST { email, password } checked against ADMIN_EMAIL/ADMIN_PASSWORD env.
// Legacy weak passwords were removed - they no longer grant access.
app.post('/api/admin/verify', async (req: Request, res: Response) => {
  const ip = (req.ip || req.socket?.remoteAddress || 'unknown').toString();
  if (!checkRateLimit(ip, 10)) {
    return res.status(429).json({ success: false, authorized: false, error: 'Too many attempts - try later' });
  }

  const { idToken, email, password } = req.body || {};

  // Mode A: verify Firebase ID token (preferred)
  if (idToken && adminReady) {
    try {
      const decoded: any = await adminAuth.verifyIdToken(idToken, true);
      const claimsOk = decoded?.admin === true;
      const mailOk = decoded?.email_verified === true;
      const mail = (decoded?.email || '').toLowerCase();
      if (!claimsOk) {
        return res.status(403).json({ success: false, authorized: false, error: 'Account is not an admin' });
      }
      if (!mailOk) {
        return res.status(403).json({ success: false, authorized: false, error: 'Email not verified - confirm the verification email first', needEmailVerification: true });
      }
      const token = issueAdminSession(mail, decoded.uid, 'sdk');
      return res.json({ success: true, authorized: true, role: 'superadmin', email: mail, mode: 'sdk', token });
    } catch (e: any) {
      return res.status(401).json({ success: false, authorized: false, error: 'Invalid session - sign in again' });
    }
  }

  // Mode B: env-credential fallback (only when Admin SDK is not configured here)
  if (!adminReady) {
    const e = (email || '').trim().toLowerCase();
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !isValidEmail(ADMIN_EMAIL)) {
      return res.status(503).json({ success: false, authorized: false, error: 'Admin login not configured on this server' });
    }
    if (e && timingSafeEqualStr(e, ADMIN_EMAIL) && typeof password === 'string' && timingSafeEqualStr(password, ADMIN_PASSWORD)) {
      const token = issueAdminSession(ADMIN_EMAIL, 'env-admin', 'env');
      return res.json({ success: true, authorized: true, role: 'superadmin', email: ADMIN_EMAIL, mode: 'env', token });
    }
    return res.status(401).json({ success: false, authorized: false, error: 'Invalid admin credentials' });
  }

  return res.status(400).json({ success: false, authorized: false, error: 'Sign in with the admin email first' });
});

app.get('/api/admin/me', (req: Request, res: Response) => {
  const header = (req.headers.authorization || '').toString();
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const sess = token ? adminSessions.get(token) : undefined;
  if (!sess || Date.now() > sess.expiresAt) {
    if (token) adminSessions.delete(token);
    return res.status(401).json({ success: false, isAdmin: false });
  }
  return res.json({ success: true, isAdmin: true, email: sess.email, mode: sess.mode });
});

// ----------------------------------------------------
// VITE SPA MIDDLEWARE / STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Share a single HTTP server between Express and Vite so that HMR's
    // WebSocket is served from the same origin/port as the app. This is
    // required behind the HTTPS preview proxy, where a separate Vite HMR
    // WebSocket port is not reachable and the client would fail to connect.
    const httpServer = createHttpServer(app);

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`aygram API & Dev Server active at http://0.0.0.0:${PORT}`);
    });
    return;
  }

  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`aygram API & Dev Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
