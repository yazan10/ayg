import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getDeviceFingerprint,
  canRequestCode,
  recordCodeRequest,
  getResendCooldown,
  canVerifyAttempt,
  recordVerifyFail,
  clearVerifyAttempts,
  CODE_TTL_MS,
  generateCode,
  emailKey,
} from '../lib/deviceFingerprint';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string; // local mirror only - never sent to cloud
  avatar: string;
  verified: boolean;
  createdAt: string;
  isDeactivated?: boolean;
  deactivatedAt?: string;
  nationality?: string; // ISO code e.g. PS, JO
  nationalityNameAr?: string;
  authProvider?: 'firebase' | 'local'; // where the account is backed
  emailVerified?: boolean; // Firebase email verification state
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
  nationality?: string;
  nationalityNameAr?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  users: AuthUser[];
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  requestRegisterCode: (data: RegisterData) => Promise<{ success: boolean; message: string; code?: string; email?: string; cooldownSec?: number }>;
  confirmRegisterCode: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  getCodeCooldown: (email: string) => number;
  loginWithPassword: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message: string }>;
  sendLoginLink: (email: string) => Promise<{ success: boolean; message: string }>;
  completeLoginLink: (email: string) => Promise<{ success: boolean; message: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  deactivateAccount: () => Promise<{ success: boolean; message: string }>;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
  reactivateAccount: (emailOrUsername: string) => Promise<{ success: boolean; message: string }>;
  checkUsername: (username: string) => Promise<{ available: boolean; message: string; needsReservation?: boolean; isShort?: boolean }>;
  reserveUsername: (username: string, email: string) => Promise<{ success: boolean; message: string }>;
  updateNationality: (code: string, nameAr: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USERS = 'aygram_auth_users_v3';
const STORAGE_SESSION = 'aygram_auth_session_v3';
const STORAGE_EMAIL_LINK = 'aygram_email_link';
const STORAGE_PENDING_REG = 'aygram_pending_reg';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
];

const INITIAL_DEMO_USERS: AuthUser[] = [];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS);
      if (saved) return JSON.parse(saved);
      return INITIAL_DEMO_USERS;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  });

  // Cookie helpers for auto-persistence
  const setCookie = (name: string, value: string, days = 30) => {
    try {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    } catch {}
  };
  const getCookie = (name: string): string | null => {
    try {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    } catch {
      return null;
    }
  };
  const deleteCookie = (name: string) => {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    } catch {}
  };

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION);
      if (saved) return JSON.parse(saved);
      const cookie = getCookie('aygram_session');
      if (cookie) return JSON.parse(cookie);
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  // Translate Firebase auth errors to Arabic
  const firebaseErrorMessage = (e: any, fallback = 'حدث خطأ، حاول مجدداً'): string => {
    const code = e?.code as string | undefined;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'البريد مسجل مسبقاً، سجل الدخول';
      case 'auth/invalid-email':
        return 'البريد الإلكتروني غير صالح';
      case 'auth/weak-password':
        return 'كلمة المرور ضعيفة (6 أحرف على الأقل)';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'بيانات الدخول غير صحيحة';
      case 'auth/too-many-requests':
        return 'محاولات كثيرة — انتظر قليلاً وحاول مجدداً';
      case 'auth/operation-not-allowed':
        return 'تسجيل الدخول متوقف مؤقتاً — حاول لاحقاً';
      case 'auth/expired-action-code':
      case 'auth/invalid-action-code':
        return 'الرابط منتهي أو غير صالح — اطلب رابطاً جديداً';
      default:
        return e?.message || fallback;
    }
  };

  // Save public profile to cloud (never includes password)
  const saveProfileToCloud = async (u: { id: string; name: string; username: string; email: string; avatar: string; nationality?: string; nationalityNameAr?: string; verified: boolean; createdAt: string }) => {
    try {
      const { db, rtdb } = await import('../lib/firebase');
      const profile = {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        avatar: u.avatar,
        nationality: u.nationality || '',
        nationalityNameAr: u.nationalityNameAr || '',
        verified: u.verified,
        createdAt: u.createdAt,
      };
      if (db) {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'users', u.id), profile, { merge: true }).catch(() => {});
      }
      if (rtdb) {
        const { ref, set } = await import('firebase/database');
        await set(ref(rtdb, `users/${u.id}`), profile).catch(() => {});
      }
    } catch {}
  };

  // Keep email-verification flag in sync with Firebase (never logs anyone out)
  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const { auth } = await import('../lib/firebase');
        if (!auth) return;
        const { onAuthStateChanged } = await import('firebase/auth');
        unsub = onAuthStateChanged(auth, async (fbUser) => {
          if (!fbUser?.email) return;
          try { await fbUser.reload(); } catch {}
          const verified = fbUser.emailVerified;
          const email = fbUser.email.toLowerCase();
          if (currentUser && currentUser.email.toLowerCase() === email && currentUser.emailVerified !== verified) {
            const updated = { ...currentUser, emailVerified: verified };
            setCurrentUser(updated);
            setUsers(prev => prev.map(u => u.email.toLowerCase() === email ? { ...u, emailVerified: verified } : u));
          }
        });
      } catch {}
    })();
    return () => { try { unsub?.(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
    // Also sync to StoreContext users storage (aygram_users_v2) for backwards compat
    try {
      const raw = localStorage.getItem('aygram_users_v2');
      const existing: any[] = raw ? JSON.parse(raw) : [];
      const existingIds = new Set(existing.map((u: any) => u.id));
      const existingUsernames = new Set(existing.map((u: any) => u.username));
      let changed = false;
      const merged = [...existing];
      for (const u of users) {
        if (!existingIds.has(u.id) && !existingUsernames.has(u.username)) {
          merged.push({
            id: u.id,
            username: u.username,
            name: u.name,
            nameEn: u.name,
            avatar: u.avatar,
            bio: `حساب ${u.name} على aygram`,
            bioEn: `${u.name} on aygram`,
            verified: u.verified,
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            category: 'عضو aygram',
            isCurrentUser: false,
          });
          changed = true;
        }
      }
      if (changed) localStorage.setItem('aygram_users_v2', JSON.stringify(merged));
    } catch {}
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      const serialized = JSON.stringify(currentUser);
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(currentUser));
      setCookie('aygram_session', serialized, 30);
      setCookie('aygram_user', currentUser.username, 30);
    } else {
      localStorage.removeItem(STORAGE_SESSION);
      deleteCookie('aygram_session');
      deleteCookie('aygram_user');
    }
    // Notify StoreContext and other listeners in same tab
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
  }, [currentUser]);

  // Passwordless login: Firebase sends a REAL sign-in link to the email
  const sendLoginLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return { success: false, message: 'البريد الإلكتروني غير صالح' };
    }

    // Only registered emails can request a login link
    const existsLocally = users.some(u => u.email.toLowerCase() === normalized);
    if (!existsLocally) {
      try {
        const { db } = await import('../lib/firebase');
        if (db) {
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const snap = await getDocs(query(collection(db, 'users'), where('email', '==', normalized)));
          if (snap.empty) {
            return { success: false, message: 'البريد غير مسجل، الرجاء إنشاء حساب جديد' };
          }
        } else if (!existsLocally) {
          return { success: false, message: 'البريد غير مسجل، الرجاء إنشاء حساب جديد' };
        }
      } catch {
        if (!existsLocally) {
          return { success: false, message: 'البريد غير مسجل، الرجاء إنشاء حساب جديد' };
        }
      }
    }

    try {
      const { auth } = await import('../lib/firebase');
      if (!auth) throw { code: 'auth/network-request-failed' };
      const { sendSignInLinkToEmail } = await import('firebase/auth');
      await sendSignInLinkToEmail(auth, normalized, {
        url: `${window.location.origin}/finishSignIn?email=${encodeURIComponent(normalized)}`,
        handleCodeInApp: true,
      });
      try { localStorage.setItem(STORAGE_EMAIL_LINK, normalized); } catch {}
      return { success: true, message: 'تم إرسال رابط الدخول إلى بريدك — افتحه من نفس الجهاز' };
    } catch (e: any) {
      return { success: false, message: firebaseErrorMessage(e, 'تعذر إرسال رابط الدخول') };
    }
  };

  // Complete passwordless sign-in when returning from the email link
  const completeLoginLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return { success: false, message: 'أدخل بريدك لإتمام الدخول' };
    try {
      const { auth, db } = await import('../lib/firebase');
      if (!auth) throw { code: 'auth/network-request-failed' };
      const { isSignInWithEmailLink, signInWithEmailLink } = await import('firebase/auth');
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        return { success: false, message: 'رابط غير صالح — اطلب رابطاً جديداً' };
      }
      const cred = await signInWithEmailLink(auth, normalized, window.location.href);
      try { localStorage.removeItem(STORAGE_EMAIL_LINK); } catch {}
      try { await cred.user.reload(); } catch {}

      // Load profile: local first, then cloud
      let profile = users.find(u => u.email.toLowerCase() === normalized);
      if (!profile && db) {
        try {
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const snap = await getDocs(query(collection(db, 'users'), where('email', '==', normalized)));
          if (!snap.empty) {
            const d = snap.docs[0].data() as any;
            profile = {
              id: d.id || cred.user.uid,
              name: d.name || cred.user.displayName || normalized.split('@')[0],
              username: d.username || normalized.split('@')[0],
              email: normalized,
              password: '',
              avatar: d.avatar || cred.user.photoURL || DEFAULT_AVATARS[0],
              verified: true,
              createdAt: d.createdAt || new Date().toISOString().split('T')[0],
              nationality: d.nationality,
              nationalityNameAr: d.nationalityNameAr,
              authProvider: 'firebase',
              emailVerified: true,
            };
            setUsers(prev => (prev.some(u => u.email.toLowerCase() === normalized) ? prev : [...prev, profile!]));
          }
        } catch {}
      }
      if (!profile) {
        return { success: false, message: 'البريد غير مسجل، أنشئ حساباً جديداً' };
      }
      const updated = { ...profile, authProvider: 'firebase' as const, emailVerified: true };
      setUsers(prev => prev.map(u => u.email.toLowerCase() === normalized ? updated : u));
      setCurrentUser(updated);
      return { success: true, message: `مرحباً بعودتك ${updated.name}!` };
    } catch (e: any) {
      return { success: false, message: firebaseErrorMessage(e, 'تعذر إتمام الدخول بالرابط') };
    }
  };

  // REAL password-reset email from Firebase
  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return { success: false, message: 'البريد الإلكتروني غير صالح' };
    }
    try {
      const { auth } = await import('../lib/firebase');
      if (!auth) throw { code: 'auth/network-request-failed' };
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, normalized);
      return { success: true, message: 'تم إرسال رابط الاستعادة إلى بريدك' };
    } catch (e: any) {
      // Don't reveal whether the email exists
      if (e?.code === 'auth/user-not-found') {
        return { success: true, message: 'إن كان البريد مسجلاً ستصلك رسالة استعادة' };
      }
      return { success: false, message: firebaseErrorMessage(e, 'تعذر إرسال رابط الاستعادة') };
    }
  };

  // Resend the Firebase verification email
  const resendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { auth } = await import('../lib/firebase');
      const fbUser = auth?.currentUser;
      if (!auth || !fbUser?.email) {
        return { success: false, message: 'سجل الدخول أولاً لإعادة إرسال التحقق' };
      }
      try { await fbUser.reload(); } catch {}
      if (fbUser.emailVerified) {
        const email = (fbUser.email || '').toLowerCase();
        setCurrentUser(prev => (prev ? { ...prev, emailVerified: true } : prev));
        setUsers(prev => prev.map(u => (u.email.toLowerCase() === email ? { ...u, emailVerified: true } : u)));
        return { success: true, message: 'بريدك موثق مسبقاً ✓' };
      }
      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(fbUser);
      return { success: true, message: 'تم إرسال رابط التحقق إلى بريدك' };
    } catch (e: any) {
      return { success: false, message: firebaseErrorMessage(e, 'تعذر إرسال رابط التحقق') };
    }
  };

  const register = async (data: { name: string; username: string; email: string; password: string; confirmPassword: string; avatar?: string; nationality?: string; nationalityNameAr?: string }): Promise<{ success: boolean; message: string }> => {
    const { name, username, email, password, confirmPassword, avatar, nationality, nationalityNameAr } = data;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase().replace(/^@/, '');

    if (!name.trim() || !normalizedUsername || !normalizedEmail || !password) {
      return { success: false, message: 'الرجاء تعبئة جميع الحقول المطلوبة' };
    }
    if (password !== confirmPassword) {
      return { success: false, message: 'كلمة المرور وتأكيدها غير متطابقتين' };
    }
    if (password.length < 6) {
      return { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }
    if (normalizedUsername.length < 3) {
      if (normalizedUsername.length === 2) {
        return { success: false, message: 'اليوزر من حرفين يتطلب طلب حجز خاص — اضغط "طلب حجز"' };
      }
      return { success: false, message: 'اليوزر يجب أن يكون 3 أحرف على الأقل' };
    }
    if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
    }
    if (users.find(u => u.username.toLowerCase() === normalizedUsername)) {
      return { success: false, message: 'اسم المستخدم محجوز، جرب اسماً آخر' };
    }
    if (!/^[a-z0-9_.]+$/.test(normalizedUsername)) {
      return { success: false, message: 'اسم المستخدم يجب أن يحتوي أحرف إنجليزية وأرقام فقط' };
    }

    const avatarToUse = avatar?.trim() || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];

    // Create the account in Firebase Auth (sends a REAL verification email)
    try {
      const { auth } = await import('../lib/firebase');
      if (!auth) throw { code: 'auth/network-request-failed' };
      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      await updateProfile(cred.user, { displayName: name.trim(), photoURL: avatarToUse }).catch(() => {});
      await sendEmailVerification(cred.user).catch(() => {});
      try { await cred.user.reload(); } catch {}

      const newUser: AuthUser = {
        id: cred.user.uid,
        name: name.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        avatar: avatarToUse,
        verified: true,
        createdAt: new Date().toISOString().split('T')[0],
        nationality,
        nationalityNameAr,
        authProvider: 'firebase',
        emailVerified: cred.user.emailVerified,
      };
      await saveProfileToCloud(newUser);
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true, message: 'تم إنشاء حسابك بنجاح! أرسلنا رابط تحقق إلى بريدك' };
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') {
        return { success: false, message: 'البريد مسجل مسبقاً، سجل الدخول' };
      }
      if (e?.code === 'auth/network-request-failed') {
        // Offline: create a local-only account so the user is never stuck
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          username: normalizedUsername,
          email: normalizedEmail,
          password,
          avatar: avatarToUse,
          verified: true,
          createdAt: new Date().toISOString().split('T')[0],
          nationality,
          nationalityNameAr,
          authProvider: 'local',
          emailVerified: false,
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        return { success: true, message: 'تم إنشاء حسابك محلياً (بدون اتصال) — سيُزامَن عند عودة الإنترنت' };
      }
      return { success: false, message: firebaseErrorMessage(e, 'تعذر إنشاء الحساب') };
    }
  };

  // Try the Node server (authoritative path with hard IP+device limits).
  // Returns parsed JSON on success, null when unreachable (caller falls back).
  const tryServer = async (path: string, body: unknown): Promise<any | null> => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) return null;
      const data = await res.json();
      return data && data.success ? data : null;
    } catch {
      return null;
    }
  };

  const validateRegisterData = (data: RegisterData): { ok: boolean; message?: string; email?: string; username?: string } => {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim().toLowerCase().replace(/^@/, '');
    if (!data.name.trim() || !username || !email || !data.password) {
      return { ok: false, message: 'الرجاء تعبئة جميع الحقول المطلوبة' };
    }
    if (!email.includes('@')) return { ok: false, message: 'البريد الإلكتروني غير صالح' };
    if (data.password !== data.confirmPassword) return { ok: false, message: 'كلمة المرور وتأكيدها غير متطابقتين' };
    if (data.password.length < 6) return { ok: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    if (username.length < 3) {
      if (username.length === 2) return { ok: false, message: 'اليوزر من حرفين يتطلب طلب حجز خاص — اضغط "طلب حجز"' };
      return { ok: false, message: 'اليوزر يجب أن يكون 3 أحرف على الأقل' };
    }
    if (!/^[a-z0-9_.]+$/.test(username)) return { ok: false, message: 'اسم المستخدم يجب أن يحتوي أحرف إنجليزية وأرقام فقط' };
    if (users.find(u => u.email.toLowerCase() === email)) return { ok: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
    if (users.find(u => u.username.toLowerCase() === username)) return { ok: false, message: 'اسم المستخدم محجوز، جرب اسماً آخر' };
    return { ok: true, email, username };
  };

  // Step 1: request a numeric verification code.
  // The code is stored IN Firebase (Firestore pending_otps + server RTDB when
  // available) bound to this device fingerprint, with per-device rate limits.
  const requestRegisterCode = async (data: RegisterData): Promise<{ success: boolean; message: string; code?: string; email?: string; cooldownSec?: number }> => {
    const v = validateRegisterData(data);
    if (!v.ok) return { success: false, message: v.message! };
    const email = v.email!;
    const username = v.username!;
    const deviceFp = getDeviceFingerprint();

    const gate = canRequestCode(email);
    if (!gate.ok) {
      return { success: false, message: gate.message!, cooldownSec: gate.waitSec };
    }

    const code = generateCode();
    const expiresAtMs = Date.now() + CODE_TTL_MS;

    // Authoritative server path first (hard IP + device limits, Admin SDK store)
    const serverRes = await tryServer('/api/auth/request-code', {
      email, username, name: data.name.trim(), deviceFp,
    });
    const finalCode = serverRes?.code && /^\d{6}$/.test(serverRes.code) ? serverRes.code as string : code;
    const finalExpiry = serverRes?.expiresAtMs && typeof serverRes.expiresAtMs === 'number' ? serverRes.expiresAtMs : expiresAtMs;

    // Mirror to Firebase Firestore (works on any host, rules-validated)
    try {
      const { db } = await import('../lib/firebase');
      if (db) {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'pending_otps', emailKey(email)), {
          email,
          code: finalCode,
          deviceFp,
          attempts: 0,
          expiresAtMs: finalExpiry,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
        // Abuse-audit trail (append-only)
        try {
          const { collection, addDoc } = await import('firebase/firestore');
          await addDoc(collection(db, 'otp_audit'), { email, deviceFp, action: 'request', atMs: Date.now() }).catch(() => {});
        } catch {}
      }
    } catch {}

    // Pending profile stays on this device until the code is confirmed
    // (includes a local mirror of the code for offline/static fallback)
    try {
      localStorage.setItem(STORAGE_PENDING_REG, JSON.stringify({
        email,
        name: data.name.trim(),
        username,
        password: data.password,
        avatar: data.avatar?.trim() || '',
        nationality: data.nationality || '',
        nationalityNameAr: data.nationalityNameAr || '',
        codeKey: emailKey(email),
        code: finalCode,
        source: serverRes ? 'server' : 'direct',
      }));
    } catch {}

    recordCodeRequest(email);
    clearVerifyAttempts(emailKey(email));
    return { success: true, message: 'تم إرسال رمز التحقق — صالح لمدة 5 دقائق', code: finalCode, email };
  };

  // Step 2: confirm the code FROM Firebase, then create the Firebase account.
  const confirmRegisterCode = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    const key = emailKey(normalized);
    const deviceFp = getDeviceFingerprint();
    const typed = code.trim();

    if (!/^\d{6}$/.test(typed)) return { success: false, message: 'الرمز يجب أن يكون 6 أرقام' };

    let pending: any = null;
    try {
      const raw = localStorage.getItem(STORAGE_PENDING_REG);
      const p = raw ? JSON.parse(raw) : null;
      if (p && p.email === normalized) pending = p;
    } catch {}
    if (!pending) {
      return { success: false, message: 'لا يوجد طلب تسجيل معلق — اطلب رمزاً جديداً' };
    }
    if (users.find(u => u.email.toLowerCase() === normalized)) {
      return { success: false, message: 'البريد مسجل مسبقاً، سجل الدخول' };
    }

    const budget = canVerifyAttempt(key);
    if (!budget.ok) {
      return { success: false, message: 'انتهت محاولات هذا الرمز — اطلب رمزاً جديداً' };
    }

    // Authoritative server verification first
    const serverRes = await tryServer('/api/auth/verify-code', { email: normalized, code: typed, deviceFp });
    let cloudDoc: any = null;
    if (!serverRes) {
      // Direct Firebase verification: read the code doc back from Firestore
      try {
        const { db } = await import('../lib/firebase');
        if (db) {
          const { doc, getDoc, updateDoc } = await import('firebase/firestore');
          const ref = doc(db, 'pending_otps', key);
          const snap = await getDoc(ref);
          if (!snap.exists()) {
            return { success: false, message: 'الرمز غير موجود أو انتهى — اطلب رمزاً جديداً' };
          }
          cloudDoc = snap.data() as any;
          if (!cloudDoc.expiresAtMs || Date.now() > cloudDoc.expiresAtMs) {
            return { success: false, message: 'انتهت صلاحية الرمز — اطلب رمزاً جديداً' };
          }
          if (cloudDoc.deviceFp && cloudDoc.deviceFp !== deviceFp) {
            return { success: false, message: 'هذا الرمز مرتبط بالجهاز الذي طُلب منه' };
          }
          if ((cloudDoc.attempts || 0) >= 5) {
            return { success: false, message: 'انتهت محاولات هذا الرمز — اطلب رمزاً جديداً' };
          }
          if (cloudDoc.code !== typed) {
            recordVerifyFail(key);
            try { await updateDoc(ref, { attempts: (cloudDoc.attempts || 0) + 1 }).catch(() => {}); } catch {}
            const left = budget.remaining - 1;
            return left > 0
              ? { success: false, message: `الرمز غير صحيح — بقيت ${left} محاولات` }
              : { success: false, message: 'الرمز غير صحيح — انتهت المحاولات، اطلب رمزاً جديداً' };
          }
        }
      } catch {
        // Firestore unreachable: fall back to the locally mirrored code below
      }
      // Local mirror check (offline/static fallback)
      if (!cloudDoc) {
        const localCode = pending.code;
        if (!localCode || localCode !== typed) {
          const r = recordVerifyFail(key);
          return r.burned
            ? { success: false, message: 'الرمز غير صحيح — انتهت المحاولات، اطلب رمزاً جديداً' }
            : { success: false, message: `الرمز غير صحيح — بقيت ${r.remaining} محاولات` };
        }
      }
    }

    // Code confirmed - burn it (best effort) so it cannot be reused
    clearVerifyAttempts(key);
    try {
      const { db } = await import('../lib/firebase');
      if (db) {
        const { doc, getDoc, updateDoc } = await import('firebase/firestore');
        const ref = doc(db, 'pending_otps', key);
        const snap = await getDoc(ref).catch(() => null);
        const cur = snap && snap.exists() ? ((snap.data() as any).attempts || 0) : 0;
        for (let a = cur; a < 5; a++) {
          try { await updateDoc(ref, { attempts: a + 1 }).catch(() => {}); } catch {}
        }
      }
    } catch {}

    // Create the real Firebase Auth user + profile, then log in
    const avatarToUse = pending.avatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
    try {
      const { auth } = await import('../lib/firebase');
      if (!auth) throw { code: 'auth/network-request-failed' };
      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
      const cred = await createUserWithEmailAndPassword(auth, normalized, pending.password);
      await updateProfile(cred.user, { displayName: pending.name, photoURL: avatarToUse }).catch(() => {});
      await sendEmailVerification(cred.user).catch(() => {});
      try { await cred.user.reload(); } catch {}
      const newUser: AuthUser = {
        id: cred.user.uid,
        name: pending.name,
        username: pending.username,
        email: normalized,
        password: pending.password,
        avatar: avatarToUse,
        verified: true,
        createdAt: new Date().toISOString().split('T')[0],
        nationality: pending.nationality || undefined,
        nationalityNameAr: pending.nationalityNameAr || undefined,
        authProvider: 'firebase',
        emailVerified: cred.user.emailVerified,
      };
      await saveProfileToCloud(newUser);
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      try { localStorage.removeItem(STORAGE_PENDING_REG); } catch {}
      return { success: true, message: 'تم إنشاء حسابك بنجاح! أرسلنا رابط تحقق إلى بريدك' };
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') {
        return { success: false, message: 'البريد مسجل مسبقاً، سجل الدخول' };
      }
      if (e?.code === 'auth/network-request-failed') {
        return { success: false, message: 'تعذر الاتصال — تحقق من الإنترنت وحاول مجدداً' };
      }
      return { success: false, message: firebaseErrorMessage(e, 'تم تأكيد الرمز لكن تعذر إنشاء الحساب') };
    }
  };

  const getCodeCooldown = (email: string): number => getResendCooldown(email);

  const checkUsername = async (username: string): Promise<{ available: boolean; message: string; needsReservation?: boolean; isShort?: boolean }> => {
    const normalized = username.trim().toLowerCase().replace(/^@/, '');
    if (!normalized) return { available: false, message: 'أدخل اليوزر', isShort: true };
    if (normalized.length < 2) return { available: false, message: 'قصير جداً — حرفين يحتاج حجز', needsReservation: true, isShort: true };
    if (normalized.length === 2) return { available: false, message: 'اليوزرات بحرفين محجوزة — قدم طلب حجز', needsReservation: true, isShort: true };
    if (normalized.length < 3) return { available: false, message: 'الحد الأدنى 3 أحرف', isShort: true };
    if (!/^[a-z0-9_.]+$/.test(normalized)) return { available: false, message: 'أحرف إنجليزية وأرقام ونقطة فقط' };
    // Try server first
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(normalized)}`);
      if (res.ok) {
        const data = await res.json();
        return { available: data.available, message: data.message, needsReservation: data.needsReservation, isShort: data.isShort };
      }
    } catch {}
    // Fallback local
    const exists = users.find(u => u.username.toLowerCase() === normalized);
    if (exists) return { available: false, message: 'اليوزر محجوز ✕' };
    return { available: true, message: 'اليوزر متاح ✓' };
  };

  const reserveUsername = async (username: string, email: string): Promise<{ success: boolean; message: string }> => {
    const normalized = username.trim().toLowerCase().replace(/^@/, '');
    if (normalized.length !== 2) return { success: false, message: 'الحجز فقط لليوزرات بحرفين' };
    try {
      const res = await fetch('/api/auth/reserve-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalized, email }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch {
      // Fallback mock
      console.log(`[aygram RESERVE] ${normalized} for ${email}`);
      return { success: true, message: `تم استلام طلب حجز اليوزر "${normalized}" — سيتم مراجعته خلال 24 ساعة` };
    }
  };

  const updateNationality = async (code: string, nameAr: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'لا يوجد حساب' };
    const updated = { ...currentUser, nationality: code, nationalityNameAr: nameAr };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    return { success: true, message: `تم اختيار جنسيتك: ${nameAr} ${code}` };
  };

  // NOTE: registration now completes inside register() via Firebase Auth -
  // no separate OTP-confirm step is needed anymore.

  const loginWithPassword = async (emailOrUsername: string, password: string): Promise<{ success: boolean; message: string }> => {
    const normalized = emailOrUsername.trim().toLowerCase();

    // Firebase-first when an email is given (usernames only exist locally)
    if (normalized.includes('@')) {
      try {
        const { auth, db } = await import('../lib/firebase');
        if (!auth) throw { code: 'auth/network-request-failed' };
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const cred = await signInWithEmailAndPassword(auth, normalized, password);
        try { await cred.user.reload(); } catch {}
        const fbVerified = cred.user.emailVerified;

        // Merge cloud profile (username/avatar live in Firestore)
        let merged = users.find(u => u.email.toLowerCase() === normalized);
        if (db) {
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const snap = await getDoc(doc(db, 'users', cred.user.uid));
            if (snap.exists()) {
              const d = snap.data() as any;
              merged = {
                id: cred.user.uid,
                name: d.name || cred.user.displayName || merged?.name || normalized.split('@')[0],
                username: d.username || merged?.username || normalized.split('@')[0],
                email: normalized,
                password: merged?.password || password,
                avatar: d.avatar || cred.user.photoURL || merged?.avatar || DEFAULT_AVATARS[0],
                verified: true,
                createdAt: d.createdAt || merged?.createdAt || new Date().toISOString().split('T')[0],
                nationality: d.nationality || merged?.nationality,
                nationalityNameAr: d.nationalityNameAr || merged?.nationalityNameAr,
                isDeactivated: merged?.isDeactivated,
                deactivatedAt: merged?.deactivatedAt,
                authProvider: 'firebase',
                emailVerified: fbVerified,
              };
            }
          } catch {}
        }
        if (!merged) {
          merged = {
            id: cred.user.uid,
            name: cred.user.displayName || normalized.split('@')[0],
            username: (merged as AuthUser | undefined)?.username || normalized.split('@')[0],
            email: normalized,
            password,
            avatar: cred.user.photoURL || DEFAULT_AVATARS[0],
            verified: true,
            createdAt: new Date().toISOString().split('T')[0],
            authProvider: 'firebase',
            emailVerified: fbVerified,
          };
        } else {
          merged = { ...merged, authProvider: 'firebase', emailVerified: fbVerified };
        }
        if (merged.isDeactivated) {
          merged = { ...merged, isDeactivated: false, deactivatedAt: undefined };
        }
        const finalUser = merged;
        setUsers(prev => {
          const i = prev.findIndex(u => u.email.toLowerCase() === normalized);
          if (i === -1) return [...prev, finalUser];
          const next = [...prev];
          next[i] = finalUser;
          return next;
        });
        setCurrentUser(finalUser);
        await saveProfileToCloud(finalUser);
        return { success: true, message: fbVerified ? `مرحباً ${finalUser.name}!` : `مرحباً ${finalUser.name}! — تحقق من بريدك لتفعيل كل المزايا` };
      } catch (e: any) {
        // Fall through to local accounts on network issues or unknown users
        const code = e?.code as string | undefined;
        if (code && !['auth/network-request-failed', 'auth/user-not-found', 'auth/invalid-credential', 'auth/wrong-password'].includes(code)) {
          return { success: false, message: firebaseErrorMessage(e) };
        }
      }
    }

    // Local fallback (offline accounts + username login)
    const user = users.find(u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized);
    if (!user) return { success: false, message: 'المستخدم غير موجود' };
    if (user.password !== password) return { success: false, message: 'كلمة المرور غير صحيحة' };
    setCurrentUser(user);
    return { success: true, message: `مرحباً ${user.name}!` };
  };

  const logout = () => {
    // Best-effort Firebase sign-out, then clear local session
    (async () => {
      try {
        const { auth } = await import('../lib/firebase');
        if (auth?.currentUser) {
          const { signOut } = await import('firebase/auth');
          await signOut(auth).catch(() => {});
        }
      } catch {}
    })();
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_SESSION);
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
  };

  const deactivateAccount = async (): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'لا يوجد حساب مسجل دخول' };
    const updatedUsers = users.map(u =>
      u.id === currentUser.id ? { ...u, isDeactivated: true, deactivatedAt: new Date().toISOString() } : u
    );
    setUsers(updatedUsers);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_SESSION);
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
    return { success: true, message: 'تم تعطيل حسابك بنجاح. يمكنك استعادته بتسجيل الدخول مجدداً.' };
  };

  const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'لا يوجد حساب مسجل دخول' };
    const userId = currentUser.id;
    // Best-effort: remove cloud profile + auth user (may need recent login)
    try {
      const { auth, db, rtdb } = await import('../lib/firebase');
      if (db) {
        const { doc, deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'users', userId)).catch(() => {});
      }
      if (rtdb) {
        const { ref, remove } = await import('firebase/database');
        await remove(ref(rtdb, `users/${userId}`)).catch(() => {});
      }
      if (auth?.currentUser) {
        const { deleteUser } = await import('firebase/auth');
        await deleteUser(auth.currentUser).catch(() => {});
      }
    } catch {}
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_SESSION);
    // Also remove from StoreContext users if exists
    try {
      const raw = localStorage.getItem('aygram_users_v2');
      if (raw) {
        const arr = JSON.parse(raw);
        const filtered = arr.filter((x: any) => x.id !== userId);
        localStorage.setItem('aygram_users_v2', JSON.stringify(filtered));
      }
    } catch {}
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
    return { success: true, message: 'تم حذف حسابك نهائياً وجميع بياناتك.' };
  };

  const reactivateAccount = async (emailOrUsername: string): Promise<{ success: boolean; message: string }> => {
    const normalized = emailOrUsername.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized);
    if (!user) return { success: false, message: 'المستخدم غير موجود' };
    if (!user.isDeactivated) return { success: false, message: 'الحساب نشط بالفعل' };
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, isDeactivated: false, deactivatedAt: undefined } : u
    );
    setUsers(updatedUsers);
    setCurrentUser({ ...user, isDeactivated: false, deactivatedAt: undefined });
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
    return { success: true, message: 'تم استعادة حسابك بنجاح!' };
  };

  // Prevent login for deactivated accounts - auto-reactivate on successful login
  const unblockDeactivated = (emailOrUsername: string) => {
    const normalized = emailOrUsername.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized);
    if (user?.isDeactivated) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isDeactivated: false, deactivatedAt: undefined } : u));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, isAuthenticated: !!currentUser, isLoading, register, loginWithPassword: async (emailOrUsername, password) => {
      unblockDeactivated(emailOrUsername);
      return loginWithPassword(emailOrUsername, password);
    }, sendLoginLink, completeLoginLink, sendPasswordReset, resendVerificationEmail, requestRegisterCode, confirmRegisterCode, getCodeCooldown, logout, deactivateAccount, deleteAccount, reactivateAccount, checkUsername, reserveUsername, updateNationality }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
