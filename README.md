# 🎵 Musify

Upload your audio, organize playlists, and listen to your uploads and shared library tracks in one place. Musify works in the browser and can be installed as a mobile web app.

[Open Musify](https://tejas-musify.wl.r.appspot.com/)

## Features

### Home and For You

The homepage contains three collections:

| Collection | Contents |
| --- | --- |
| For You | Favorites, Recently Played, and Most Listened |
| Your Playlists | Playlists you create and upload audio to |
| Popular Playlists | Shared system playlists stored in the database |

Uploaded and shared tracks both support favorites, search, and listening history. Recently Played and Most Listened reflect your own playback activity.

The rails are configured in [playlistCollections.ts](frontend/src/pages/homepage/constants/playlistCollections.ts). Every entry uses the same structure: `id`, `title`, `type`, `loadPlaylists`, and `cache`. For You uses the `personal` type; shared playlists use `system`.

### Accounts

Sign up with an email address and password, or sign in with Google. Email accounts must be verified before signing in.

![Sign-up form](https://github.com/user-attachments/assets/55e24145-1987-4e4e-9f24-6c8b503784d7)

### Uploads and playlists

Create playlists, upload audio, rename your playlists and tracks, move tracks between playlists, and remove items from your library. Tracks with missing or broken artwork display the default cover image.

![Audio upload dialog](https://github.com/user-attachments/assets/0b8f8359-6573-4209-9b41-f5cf7fc1b021)

![Uploaded tracks in a personal playlist](https://github.com/user-attachments/assets/c945adce-6fdf-4016-b1c0-a85c89e08f07)

### Favorites

Favorite uploaded or shared tracks from anywhere in the app. The heart changes immediately while the save runs in the background. Unfavoriting a track on the Favorites page immediately removes it from the list; failed saves restore the previous state and show an error.

![Favorites collection](https://github.com/user-attachments/assets/dc45edec-e9bf-46e2-a9d6-4ffd0d9e5f41)

### Search and playback

Search your uploads and shared tracks by title, artist, or album. Selecting a search result or a track in the search page's recently played list starts it immediately, then builds a queue with up to 50 random tracks from your accessible library.

The random queue refreshes every 20 next, previous, or automatic track advances while preserving the current track and playback position. Playback continues while navigating. Selecting a track from a regular playlist or Favorites switches playback to that list.

### Mobile installation

Open the HTTPS site on your phone:

- **Android:** use the app's **Install** prompt when available, or the browser's **Install app** menu.
- **iPhone or iPad:** use **Share → Add to Home Screen**.

The player supports portrait and landscape layouts, phone safe areas, and lock-screen and headset controls through the Media Session API where supported. Tap a track or Play to start playback. Background playback depends on the phone and browser.

Music streams require an internet connection. The service worker caches the app shell and static assets; authenticated API responses and audio files are not cached. Available app updates wait for you to choose **Update**.

## Run locally

Use **Node.js 24.15 or newer** and npm. Run these commands from the repository root:

```powershell
npm --prefix frontend ci
npm --prefix backend ci
```

Configure `backend/.env` with the credentials for your existing services:

| Variable | Purpose |
| --- | --- |
| `HASURA_URL` | Hasura GraphQL endpoint |
| `HASURA_SECRET_KEY` | Hasura admin secret |
| `FIREBASE_SERVICE_ACCOUNT` | Base64-encoded Firebase service account JSON |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PORT` | Optional backend port; defaults to `8080` |

The Firebase browser configuration is in [frontend/src/config/firebase.ts](frontend/src/config/firebase.ts). It must match the Firebase project used by the backend. Keep backend credentials out of source control.

Start the API in one terminal:

```powershell
npm run dev:backend
```

Start the frontend in another terminal:

```powershell
npm run dev:frontend
```

Open [localhost:3000](http://localhost:3000). Vite proxies `/api` requests to the backend on port `8080`. Both ports must be available. When running commands inside `frontend`, use `npm run dev` instead of the root-level `dev:frontend` script.

## Database updates

The application uses an existing Hasura/PostgreSQL schema. These scripts update that schema; they do not provision a new database. Run them against each environment using its backend credentials:

```powershell
npm --prefix backend run migrate:listening
npm --prefix backend run migrate:search-radio
```

- `migrate:listening` configures play-event constraints and removes the old listening summary view.
- `migrate:search-radio` updates the existing `fetch_user_songs_randomly` function to include both uploaded and shared tracks, returning up to 50 tracks with distinct titles.

Listening activity is recorded in `play_events` when audio actually starts. Resuming or recovering from buffering does not count as another play, and retries reuse the event ID. Recently Played and Most Listened query the signed-in user's events directly, grouping by song to find the latest play and total plays. They do not require a summary table or view.

Validate listening queries and database behavior with:

```powershell
npm --prefix backend run verify:listening
```

The verification script uses rollback-only database checks.

## Development

| Directory | Contents |
| --- | --- |
| `frontend/` | React, strict TypeScript, Vite, MUI, Redux, and frontend tests |
| `backend/` | Express API, authentication, uploads, database migrations, and backend tests |
| `scripts/` | Repository checks and app icon generation |

Frontend source uses `.ts` and `.tsx`. Types live beside their owning component, hook, service, or utility in a local `types/` folder, with filenames ending in `.types.ts`, such as `types/ComponentName.types.ts`. Components use the typed Redux hooks from [frontend/src/redux/hooks.ts](frontend/src/redux/hooks.ts).

Run all source, type, lint, test, and production build checks:

```powershell
npm run check
```

Individual commands:

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | TypeScript compiler checks |
| `npm run lint` | Frontend ESLint checks |
| `npm test` | Frontend Vitest and backend regression tests |
| `npm --prefix frontend run test:watch` | Frontend tests in watch mode |
| `npm run build` | Production frontend build in `frontend/build` |
| `npm --prefix frontend run preview` | Preview the frontend build on port `4173` |
| `node scripts/generate-app-icons.cjs` | Regenerate PWA icons |

Test PWA installation and service-worker behavior with a production build served by the backend or Vite preview. Development mode does not install a service worker. Vite preview only serves the frontend; use the backend to test authenticated API flows from a production build.

### Authentication

Firebase login exchanges a temporary ID token for a server-verified session cookie lasting seven days. Firebase browser authentication uses memory persistence, and the profile lives in Redux memory, restored through `/api/auth/session` after a refresh.

Session cookies are `HttpOnly`, `SameSite=Lax`, and host-only. Production uses `Secure` cookies with the `__Host-` prefix. Serve the frontend and API from the same HTTPS origin in production; Vite's proxy provides the same-origin API path during development. API POST requests require the `X-Musify-Request` header, which the frontend API client supplies. Logout and account deletion clear the session cookie.

## Deploy to Google App Engine

The backend's [app.yaml](backend/app.yaml) uses the Node.js 24 runtime. From the repository root, build the frontend, copy its output into the backend deployment directory, and deploy:

```powershell
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }
New-Item -ItemType Directory -Path .\backend\build -Force | Out-Null
Copy-Item .\frontend\build\* .\backend\build -Recurse -Force -ErrorAction Stop
gcloud app deploy .\backend\app.yaml --project=tejas-musify
```

Sign in to the Google Cloud CLI with an account that can deploy to the project, and supply the required backend environment configuration for the deployment. Express serves the frontend build and API from the same origin. App Engine is detected automatically for production cookie security; other production hosts should set `NODE_ENV=production`.
