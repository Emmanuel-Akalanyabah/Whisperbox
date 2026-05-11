# 📬 WhisperBox — Anonymous Messaging Platform

A production-ready anonymous messaging web app. Share your link. Receive honest, anonymous messages from anyone.

**Live demo flow:** Anyone visits `/ask/yourname` → types a message → you see it instantly in your dashboard.

---

## ✨ Features

- 🔒 **100% Anonymous** — senders never identified
- ⚡ **Real-time** — messages appear instantly via Supabase subscriptions  
- 🎉 **Confetti on send** — delightful sender experience
- 📊 **Analytics dashboard** — message trends, profile views, stats
- 🛡️ **Spam protection** — rate limiting, report/block system
- 🌗 **Dark/light mode** — persisted preference
- 👑 **Admin panel** — user management, report resolution
- 📱 **Fully responsive** — mobile-first design

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/whisperbox.git
cd whisperbox
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. In **SQL Editor**, run the contents of `supabase/schema.sql`
3. In **Authentication → Providers**, enable Email and Google (optional)
4. Copy your **Project URL** and **anon key** from Settings → API

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Locally

```bash
npm run dev
# → http://localhost:5173
```

---

## 📁 Project Structure

```
whisperbox/
├── src/
│   ├── components/
│   │   ├── auth/         # ProtectedRoute
│   │   ├── layout/       # Navbar
│   │   ├── messages/     # MessageCard
│   │   └── ui/           # Button, Input, Badge, Skeleton
│   ├── hooks/
│   │   ├── useAuth.ts    # Auth state + Supabase auth methods
│   │   └── useMessages.ts# CRUD + real-time subscriptions
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client
│   │   ├── utils.ts      # Helpers
│   │   └── rateLimit.ts  # Client-side rate limiter
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx  # Login + Signup
│   │   ├── Dashboard.tsx
│   │   ├── AskPage.tsx   # /ask/:username — public send page
│   │   ├── SettingsPage.tsx
│   │   └── AdminPage.tsx
│   ├── store/
│   │   └── authStore.ts  # Zustand auth store (persisted)
│   └── types/
│       └── database.ts   # Full Supabase type definitions
├── supabase/
│   └── schema.sql        # Run this in Supabase SQL Editor
├── public/
│   └── favicon.svg
└── .env.example
```

---

## 🚢 Deployment

### Vercel (Recommended — free)

```bash
npm i -g vercel
vercel
# Set env vars in Vercel dashboard → Settings → Environment Variables
```

### Netlify

```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
# Or: netlify deploy --prod --dir=dist
```

### GitHub Pages

Add to `vite.config.ts`:
```ts
export default defineConfig({ base: '/whisperbox/' })
```
Then push — GitHub Actions will deploy automatically.

---

## 🔐 Security

| Layer | Implementation |
|-------|---------------|
| Auth | Supabase Auth (JWT) |
| RLS | Row Level Security on all tables |
| Rate limiting | Client-side (3 msg/min) + Supabase RLS |
| Input sanitization | 500 char limit, content validation |
| XSS | React's built-in escaping |
| Spam | Report + mark-as-spam system |

---

## 📊 Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts, settings, stats |
| `messages` | All received messages |
| `reports` | Abuse reports |
| `notifications` | In-app notification feed |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Supabase (Postgres + Auth + Realtime)
- **State:** Zustand + TanStack Query
- **Charts:** Recharts
- **Icons:** Lucide React

---

## 📄 License

MIT — free to use and modify.
