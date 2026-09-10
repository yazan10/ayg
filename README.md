<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# aygram - Social & Store Platform

منصة التواصل الاجتماعي والمتاجر المتكاملة — aygram

View your app in AI Studio: https://ai.studio/apps/70f9a90d-6509-491e-9c3c-3c3885fc3a16

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   `npm install`
2. Set env in [.env.example](.env.example) → copy to `.env.local`
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDH-Srcg0yvNXp8U-6bnf47WgXYpXYczOk
   VITE_FIREBASE_AUTH_DOMAIN=aygram-8d0d0.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=aygram-8d0d0
   VITE_FIREBASE_STORAGE_BUCKET=aygram-8d0d0.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=1040582300799
   VITE_FIREBASE_APP_ID=1:1040582300799:web:28dfacf8d24e320eef9b4a
   VITE_FIREBASE_MEASUREMENT_ID=G-K6BTVB8W6B
   ```
3. Run the app:
   `npm run dev` → http://localhost:3000

## Firebase

Project: **aygram-8d0d0**

- Config in `src/lib/firebase.ts` (auto-fallback to hardcoded if no env)
- Services: Auth, Firestore, Storage, Analytics (G-K6BTVB8W6B)
- Rules: `firestore.rules` + `storage.rules`
- Sync: `src/lib/firestoreSync.ts` auto-syncs stores/products/users every 1.5s when online
- Status widget in Admin → Overview (`FirebaseStatus`)

```bash
# Login
firebase login
# Deploy hosting + firestore + storage
npm run build && firebase deploy
# Or hosting only
npm run firebase:deploy:hosting
```

## Vercel

- Config in `vercel.json` (SPA rewrites + cache + env)
- Build: `vite build && esbuild server.ts --bundle ...`
- Output: `dist/`

```bash
vercel --prod
# or
npm run vercel:deploy
```

Env on Vercel Dashboard → Settings → Environment Variables → add `VITE_FIREBASE_*` from `.env.example`.

## Scripts

- `npm run dev` — Express + Vite dev (tsx server.ts)
- `npm run build` — Vite + esbuild → dist/
- `npm run start` — node dist/server.cjs
- `npm run lint` — tsc --noEmit
- `npm run firebase:deploy` — build + deploy
