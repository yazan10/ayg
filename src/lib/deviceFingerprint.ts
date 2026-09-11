// Device fingerprint + code rate limiting (abuse protection).
// Every code request / verification is bound to a stable device id so one
// device cannot drain email/code resources. Hard IP limits additionally apply
// on the Node server (/api/auth/*) where the client IP is observable.
const DEVICE_KEY = 'aygram_device_id';
const LIMITS_KEY = 'aygram_code_limits';

const REQ_LIMIT_PER_HOUR = 3; // max code requests per device per hour
const RESEND_COOLDOWN_SEC = 60; // min seconds between requests for same email
const VERIFY_ATTEMPTS = 5; // max wrong tries per code, then it burns
const HOUR_MS = 60 * 60 * 1000;

const fnv1a = (s: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
};

// Stable per-device id: persisted UUID + lightweight environment hash.
export const getDeviceFingerprint = (): string => {
  try {
    let uuid = localStorage.getItem(DEVICE_KEY);
    if (!uuid) {
      uuid = `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(DEVICE_KEY, uuid);
    }
    const nav = typeof navigator !== 'undefined' ? navigator : ({} as any);
    const scr = typeof screen !== 'undefined' ? screen : ({} as any);
    const env = [
      nav.userAgent || '',
      nav.language || '',
      (scr.width || 0) + 'x' + (scr.height || 0),
      (scr.colorDepth || 0) + '',
      new Date().getTimezoneOffset() + '',
    ].join('|');
    return `${uuid}.${fnv1a(env + uuid)}`;
  } catch {
    return `dev-fallback.${fnv1a(String(Date.now()))}`;
  }
};

interface LimitsState {
  reqTimes: number[]; // timestamps of code requests (device-wide)
  lastReqByEmail: Record<string, number>; // email -> last request timestamp
  verifyFails: Record<string, number>; // codeKey -> failed verify count
}

const loadLimits = (): LimitsState => {
  try {
    const raw = localStorage.getItem(LIMITS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        reqTimes: Array.isArray(p.reqTimes) ? p.reqTimes : [],
        lastReqByEmail: p.lastReqByEmail || {},
        verifyFails: p.verifyFails || {},
      };
    }
  } catch {}
  return { reqTimes: [], lastReqByEmail: {}, verifyFails: {} };
};

const saveLimits = (s: LimitsState) => {
  try {
    localStorage.setItem(LIMITS_KEY, JSON.stringify(s));
  } catch {}
};

const prune = (s: LimitsState): LimitsState => {
  const cutoff = Date.now() - HOUR_MS;
  return { ...s, reqTimes: s.reqTimes.filter(t => t > cutoff) };
};

// Can this device request a (new) code right now?
export const canRequestCode = (email: string): { ok: boolean; waitSec?: number; message?: string } => {
  const now = Date.now();
  const s = prune(loadLimits());
  const key = email.trim().toLowerCase();
  const last = s.lastReqByEmail[key] || 0;
  const sinceLast = Math.floor((now - last) / 1000);
  if (sinceLast < RESEND_COOLDOWN_SEC) {
    const waitSec = RESEND_COOLDOWN_SEC - sinceLast;
    return { ok: false, waitSec, message: `انتظر ${waitSec} ثانية قبل طلب رمز جديد` };
  }
  if (s.reqTimes.length >= REQ_LIMIT_PER_HOUR) {
    const oldest = Math.min(...s.reqTimes);
    const waitSec = Math.max(1, Math.ceil((oldest + HOUR_MS - now) / 1000));
    return { ok: false, waitSec, message: 'تجاوزت حد طلب الرموز لهذه الساعة — حاول لاحقاً' };
  }
  return { ok: true };
};

export const recordCodeRequest = (email: string) => {
  const s = prune(loadLimits());
  const key = email.trim().toLowerCase();
  s.reqTimes.push(Date.now());
  s.lastReqByEmail[key] = Date.now();
  saveLimits(s);
};

// Seconds left before this email can request another code (0 = allowed).
export const getResendCooldown = (email: string): number => {
  const last = loadLimits().lastReqByEmail[email.trim().toLowerCase()] || 0;
  return Math.max(0, RESEND_COOLDOWN_SEC - Math.floor((Date.now() - last) / 1000));
};

// Verify-attempt budget per code key (burns after VERIFY_ATTEMPTS failures).
export const canVerifyAttempt = (codeKey: string): { ok: boolean; remaining: number } => {
  const fails = loadLimits().verifyFails[codeKey] || 0;
  return { ok: fails < VERIFY_ATTEMPTS, remaining: Math.max(0, VERIFY_ATTEMPTS - fails) };
};

export const recordVerifyFail = (codeKey: string): { burned: boolean; remaining: number } => {
  const s = loadLimits();
  s.verifyFails[codeKey] = (s.verifyFails[codeKey] || 0) + 1;
  saveLimits(s);
  const remaining = Math.max(0, VERIFY_ATTEMPTS - s.verifyFails[codeKey]);
  return { burned: remaining <= 0, remaining };
};

export const clearVerifyAttempts = (codeKey: string) => {
  const s = loadLimits();
  delete s.verifyFails[codeKey];
  saveLimits(s);
};

export const CODE_TTL_MS = 5 * 60 * 1000;
export const generateCode = (): string => Math.floor(100000 + Math.random() * 900000).toString();
export const emailKey = (email: string) => email.trim().toLowerCase().replace(/[@.]/g, '_');
