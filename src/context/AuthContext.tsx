import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string; // plain for demo (in production use hash)
  avatar: string;
  verified: boolean;
  createdAt: string;
  isDeactivated?: boolean;
  deactivatedAt?: string;
  nationality?: string; // ISO code e.g. PS, JO
  nationalityNameAr?: string;
}

interface PendingOtp {
  code: string;
  email: string;
  expiresAt: number;
  type: 'login' | 'register';
  pendingUserData?: Omit<AuthUser, 'id' | 'createdAt' | 'avatar' | 'verified'> & { name: string; username: string; email: string; password: string };
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
  sendOtp: (email: string, type: 'login' | 'register') => Promise<{ success: boolean; code?: string; message: string }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string; needOtp?: boolean }>;
  confirmRegisterOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  loginWithOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resendOtp: (email: string) => Promise<{ success: boolean; code?: string; message: string }>;
  deactivateAccount: () => Promise<{ success: boolean; message: string }>;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
  reactivateAccount: (emailOrUsername: string) => Promise<{ success: boolean; message: string }>;
  checkUsername: (username: string) => Promise<{ available: boolean; message: string; needsReservation?: boolean; isShort?: boolean }>;
  reserveUsername: (username: string, email: string) => Promise<{ success: boolean; message: string }>;
  updateNationality: (code: string, nameAr: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USERS = 'aygram_auth_users_v1';
const STORAGE_SESSION = 'aygram_auth_session_v1';
const STORAGE_OTP = 'aygram_auth_otp_v1';

const generateOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();

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

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [otpStore, setOtpStore] = useState<Record<string, PendingOtp>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_OTP);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isLoading] = useState(false);

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
    if (currentUser) localStorage.setItem(STORAGE_SESSION, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_SESSION);
    // Notify StoreContext and other listeners in same tab
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_OTP, JSON.stringify(otpStore));
  }, [otpStore]);

  // Clean expired OTPs every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setOtpStore(prev => {
        const next: Record<string, PendingOtp> = {};
        let changed = false;
        for (const [email, data] of Object.entries(prev) as [string, PendingOtp][]) {
          if (data.expiresAt > now) next[email] = data;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const sendOtp = async (email: string, type: 'login' | 'register'): Promise<{ success: boolean; code?: string; message: string }> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return { success: false, message: 'البريد الإلكتروني غير صالح' };
    }

    if (type === 'login') {
      const exists = users.find(u => u.email.toLowerCase() === normalized);
      if (!exists) {
        return { success: false, message: 'البريد غير مسجل، الرجاء إنشاء حساب جديد' };
      }
    }

    if (type === 'register') {
      const exists = users.find(u => u.email.toLowerCase() === normalized);
      if (exists) {
        return { success: false, message: 'البريد مسجل مسبقاً، جرب تسجيل الدخول' };
      }
    }

    const code = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    setOtpStore(prev => ({
      ...prev,
      [normalized]: { code, email: normalized, expiresAt, type }
    }));

    // Simulate sending email - in production integrate with backend / email service
    console.log(`[aygram OTP] ${type} code for ${normalized}: ${code} (expires in 5 min)`);

    // Also store for demo visible in UI
    return { success: true, code, message: type === 'login' ? 'تم إرسال رمز الدخول إلى بريدك' : 'تم إرسال رمز التأكيد إلى بريدك' };
  };

  const verifyOtp = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    const record = otpStore[normalized];
    if (!record) return { success: false, message: 'لم يتم العثور على رمز، الرجاء طلب رمز جديد' };
    if (Date.now() > record.expiresAt) {
      setOtpStore(prev => {
        const next = { ...prev };
        delete next[normalized];
        return next;
      });
      return { success: false, message: 'انتهت صلاحية الرمز، الرجاء طلب رمز جديد' };
    }
    if (record.code !== code.trim()) {
      return { success: false, message: 'الرمز غير صحيح' };
    }
    return { success: true, message: 'تم التحقق بنجاح' };
  };

  const register = async (data: { name: string; username: string; email: string; password: string; confirmPassword: string; avatar?: string; nationality?: string; nationalityNameAr?: string }): Promise<{ success: boolean; message: string; needOtp?: boolean }> => {
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

    // Generate OTP for registration
    const code = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    setOtpStore(prev => ({
      ...prev,
      [normalizedEmail]: {
        code,
        email: normalizedEmail,
        expiresAt,
        type: 'register',
        pendingUserData: { name: name.trim(), username: normalizedUsername, email: normalizedEmail, password, avatar: avatar?.trim() || '', nationality, nationalityNameAr }
      }
    }));

    console.log(`[aygram REGISTER OTP] for ${normalizedEmail}: ${code}`);

    return { success: true, message: 'تم إرسال رمز التأكيد إلى بريدك الإلكتروني', needOtp: true };
  };

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

  const confirmRegisterOtp = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    const record = otpStore[normalized];
    if (!record || record.type !== 'register' || !record.pendingUserData) {
      return { success: false, message: 'لا يوجد طلب تسجيل معلق لهذا البريد' };
    }
    if (Date.now() > record.expiresAt) {
      setOtpStore(prev => {
        const next = { ...prev };
        delete next[normalized];
        return next;
      });
      return { success: false, message: 'انتهت صلاحية رمز التأكيد' };
    }
    if (record.code !== code.trim()) {
      return { success: false, message: 'رمز التأكيد غير صحيح' };
    }

    const pending = record.pendingUserData;
    const avatarToUse = (pending as any).avatar && (pending as any).avatar.trim() ? (pending as any).avatar.trim() : DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: pending.name,
      username: pending.username,
      email: pending.email,
      password: pending.password,
      avatar: avatarToUse,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
      nationality: (pending as any).nationality,
      nationalityNameAr: (pending as any).nationalityNameAr,
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    setOtpStore(prev => {
      const next = { ...prev };
      delete next[normalized];
      return next;
    });

    return { success: true, message: 'تم إنشاء الحساب بنجاح! مرحباً بك في aygram' };
  };

  const loginWithOtp = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const normalized = email.trim().toLowerCase();
    const record = otpStore[normalized];
    if (!record || record.type !== 'login') {
      return { success: false, message: 'الرجاء طلب رمز الدخول أولاً' };
    }
    if (Date.now() > record.expiresAt) {
      setOtpStore(prev => {
        const next = { ...prev };
        delete next[normalized];
        return next;
      });
      return { success: false, message: 'انتهت صلاحية رمز الدخول' };
    }
    if (record.code !== code.trim()) {
      return { success: false, message: 'رمز الدخول غير صحيح' };
    }

    const user = users.find(u => u.email.toLowerCase() === normalized);
    if (!user) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    setCurrentUser(user);
    setOtpStore(prev => {
      const next = { ...prev };
      delete next[normalized];
      return next;
    });

    return { success: true, message: `مرحباً بعودتك ${user.name}!` };
  };

  const loginWithPassword = async (emailOrUsername: string, password: string): Promise<{ success: boolean; message: string }> => {
    const normalized = emailOrUsername.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized);
    if (!user) return { success: false, message: 'المستخدم غير موجود' };
    if (user.password !== password) return { success: false, message: 'كلمة المرور غير صحيحة' };
    setCurrentUser(user);
    return { success: true, message: `مرحباً ${user.name}!` };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_SESSION);
    try { window.dispatchEvent(new Event('aygram_auth_change')); } catch {}
  };

  const resendOtp = async (email: string): Promise<{ success: boolean; code?: string; message: string }> => {
    const normalized = email.trim().toLowerCase();
    const existing = otpStore[normalized];
    const type = existing?.type || 'login';
    return sendOtp(normalized, type);
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

  // Prevent login for deactivated accounts - override login functions to check
  const originalLoginWithPassword = loginWithPassword;
  const originalLoginWithOtp = loginWithOtp;

  return (
    <AuthContext.Provider value={{ currentUser, users, isAuthenticated: !!currentUser, isLoading, sendOtp, verifyOtp, register, confirmRegisterOtp, loginWithOtp: async (email, code) => {
      const normalized = email.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === normalized);
      if (user?.isDeactivated) {
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, isDeactivated: false, deactivatedAt: undefined } : u);
        setUsers(updatedUsers);
      }
      return originalLoginWithOtp(email, code);
    }, loginWithPassword: async (emailOrUsername, password) => {
      const normalized = emailOrUsername.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized);
      if (user?.isDeactivated) {
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, isDeactivated: false, deactivatedAt: undefined } : u);
        setUsers(updatedUsers);
      }
      return originalLoginWithPassword(emailOrUsername, password);
    }, logout, resendOtp, deactivateAccount, deleteAccount, reactivateAccount, checkUsername, reserveUsername, updateNationality }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
