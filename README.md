# 🎵 Musify

Musify can be installed as a mobile web app from its HTTPS site. On Android, use **Install** when offered or the browser's **Install app** menu. On iPhone or iPad, use **Share → Add to Home Screen**. Installation support depends on the browser; the installed app and the website share the same account and library.

The mobile player supports phone safe areas, portrait and landscape layouts, and lock-screen/headset controls through the Media Session API where available. Start playback by tapping a track or Play. The app keeps one audio element alive while navigating. Background playback remains subject to the phone and browser's policies. Music streams need an internet connection; the service worker caches the app shell and static assets, not authenticated API responses or audio files. Available updates wait for the user to choose **Update** so a new deployment does not reload an active listening session.

PWA installation and service-worker behavior should be tested against `npm run build` followed by the backend server or `npm --prefix frontend run preview`. Development mode does not install a service worker. Regenerate app icons with `node scripts/generate-app-icons.cjs`.

The React app lives in `frontend/` and the Express API lives in `backend/`. Run `npm run dev:frontend` and `npm run dev:backend` in separate terminals. Use `npm run check` from the repository root to validate the project.

Authentication uses a server-verified Firebase session cookie lasting seven days. The profile stays in Redux memory and is reloaded from `/api/auth/session` after a refresh. The old local-storage `user` entry is removed at startup. Firebase browser authentication uses memory persistence only; successful login exchanges its temporary ID token for the session cookie and signs out the browser SDK. Existing users need to sign in again after this migration.

Session cookies are `HttpOnly`, `SameSite=Lax`, and host-only. Production uses the `__Host-` cookie prefix and `Secure`; deploy behind HTTPS with `NODE_ENV=production` (App Engine is detected automatically). Plain HTTP cookies are only for local development. Serve the API under the same origin as the frontend, using Vite’s `/api` proxy during development. API responses are not cached. All API POST requests, including multipart uploads, require the `X-Musify-Request` header to prevent cross-site form submissions; keep the API’s cross-origin access disabled. Logout and account deletion clear the server cookie.

The frontend uses Vite 8 and strict TypeScript, with Vitest for tests and standalone ESLint. Use Node.js 24.15 or newer for development and deployment. Vite runs on port 3000 and proxies `/api` to the backend on port 8080. Production builds remain in `frontend/build` for Express to serve. Run `npm --prefix frontend run preview` to preview a production build on port 4173.

Run `npm run typecheck` for compiler checks or `npm run check` for all validation. Frontend types are colocated with their owners: a component’s props live in its own `types/ComponentName.types.ts`, while hooks, Redux slices, services, and utilities own their corresponding `types/*.types.ts` files. There is no shared root types directory. New frontend source files should use `.ts` or `.tsx`; components should use the typed hooks from `frontend/src/redux/hooks.ts`. The app uses React 19, MUI 9, React Router 7, Firebase 13, and browser-native audio metadata parsing. TypeScript stays on the latest compatible 6.0 release because the lint tooling does not support TypeScript 7 yet. `npm test` runs the Vitest and backend regression suites; `npm --prefix frontend run test:watch` watches frontend tests.

## 🌐 Website Link  
[Visit the Application](https://tejas-musify.wl.r.appspot.com/)

## 📽️ Demo Link  
[Watch on YouTube](https://youtu.be/a4fB9b7h3oA?si=VRNRHWyofjqSH-v6)

---

## 🎤 Introduction  
Welcome to **Musify** — Upload your favorite audio files and enjoy ad-free listening anytime, anywhere.

---

## 🧭 Directions

### 🔐 Signup and Login  
Users can create an account using their email ID and password, or sign in directly with their Google account.  
If they choose the former, they must verify their email address before logging in.

![Signup](https://github.com/user-attachments/assets/55e24145-1987-4e4e-9f24-6c8b503784d7)

---

### 🏠 Homepage  
This is the landing page of the application. Create your playlist, search for your favorite songs, or listen to high-quality, royalty-free music!

<img width="1911" height="941" alt="Homepage" src="https://github.com/user-attachments/assets/7db86a4a-7ce6-4c4e-90a5-ee3ad78a778a" />

---

### 📤 Audio Uploader  
Upload audio files and enjoy them ad-free, anytime.

<img width="1700" height="896" alt="Uploader" src="https://github.com/user-attachments/assets/0b8f8359-6573-4209-9b41-f5cf7fc1b021" />

---

<img width="1257" height="774" alt="Library" src="https://github.com/user-attachments/assets/c945adce-6fdf-4016-b1c0-a85c89e08f07" />

---

### 🎧 Audio Player  
Lose yourself in your favorite music with our sleek audio player!

<img width="1421" height="920" alt="Player" src="https://github.com/user-attachments/assets/913c5463-0b01-434c-b02a-47423c1058dc" />

---

### 🔍 Search  
Quickly find songs from your personal collection with the search feature.

<img width="840" height="539" alt="image" src="https://github.com/user-attachments/assets/afb865b7-6781-4f8a-9eaa-31d9103595da" />

---

### 🎯 For You  
Enjoy personally curated music recommendations based on your listening history.

---

## ❤️ Favorites  
All your liked songs in one place.

<img width="1314" height="786" alt="Favorites" src="https://github.com/user-attachments/assets/dc45edec-e9bf-46e2-a9d6-4ffd0d9e5f41" />

---

## ⏮️ Recently Played  
Revisit your recently played tracks.

<img width="864" height="300" alt="Recently Played" src="https://github.com/user-attachments/assets/deac50dc-c47c-4ef1-a66b-2ce11dc32a00" />

---

## 🔁 Most Played  
Your most-listened tracks, ranked.

<img width="590" height="453" alt="Most Played" src="https://github.com/user-attachments/assets/12b6bafa-c282-4f28-ab28-4e40882ea87e" />
