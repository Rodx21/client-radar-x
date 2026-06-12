# ClientRadarX — Mobile (Auto Music Sound e Film)

> **ClientRadarX** is a low-cost SaaS platform that gives small businesses —
> workshops, local stores, service shops — a professional mobile app and
> website to manage customers, services, and appointments, without needing a
> big budget or a tech team.

---

## The Idea

Most small businesses have great service but zero digital infrastructure.
They lose customers because they have no easy way to receive quote requests,
manage appointments, or showcase their work.

**ClientRadarX solves this with a single affordable subscription:**

- A branded mobile app (iOS & Android)
- Customer-facing service catalogue with pricing
- Quote flow integrated with WhatsApp
- Appointment scheduling backed by a multi-tenant Supabase database
- Photo gallery (before & after)

The platform is built once and replicated per client — each store gets its
own branded version via `config/client.ts` without starting from scratch.

---

## Client #1 — Auto Music Sound e Film

[**Auto Music Sound e Film**](https://www.instagram.com/automusicsound/) is a
car audio, window tint, and vehicle customization store in **Tatuapé, São
Paulo — Brazil**. They are the first real client and the base template from
which future ClientRadarX clients are built.

| | |
|---|---|
| Address | R. Serra de Botucatu, 2100 — Tatuapé, SP |
| Hours | Mon–Fri 9h–17h · Sat 8h–16h · Sun closed |
| Google | 4.5 ★ · 244 reviews |
| Instagram | [@automusicsound](https://www.instagram.com/automusicsound/) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 56 + React Native 0.85.3 |
| Language | TypeScript 6 |
| Routing | Expo Router v6 — file-based, Drawer + Tabs |
| Backend | Supabase (PostgreSQL, Auth, Row Level Security) |
| State | React Context + AsyncStorage (no Redux) |
| Animations | React Native Animated API — native driver |
| i18n | Custom `useT()` hook (PT-BR) |
| Design | Token-based design system (`theme/tokens.ts`) — dark/light |
| Photos | expo-image-picker (multi-select, permissions) |
| Haptics | expo-haptics — tactile feedback on wizard steps |

---

## Project Structure

```
app/
├── _layout.tsx              # Root stack: ThemeProvider + I18nProvider
├── index.tsx                 # Redirects to (drawer)/(tabs)/inicio
├── login.tsx                 # Supabase Auth — sign in / sign up
├── (drawer)/
│   ├── _layout.tsx            # Drawer nav, session-aware links
│   └── (tabs)/
│       ├── _layout.tsx         # Bottom tab bar
│       ├── inicio/             # Home — quote CTA, services preview, find us
│       ├── services/           # Service catalogue
│       ├── agenda/             # Appointments (Supabase-backed, login-gated)
│       └── gallery/             # Before/after photo gallery (login-gated)
├── quote/                      # 4-step quote wizard, draft auto-saved
├── settings/                   # Theme + language toggle, about
├── theme/                      # tokens.ts + ThemeProvider + UI component library
├── i18n/                       # useT() hook + dictionary
└── lib/
    ├── supabase.ts              # Supabase client (SSR-safe storage adapter)
    ├── session.ts                # getSession() / signOut() helpers
    └── storage.ts                 # AsyncStorage preference helpers

config/
└── client.ts                   # White-label config (branding, tenant ID, Supabase keys)

supabase/
├── config.toml                 # Supabase CLI project config
├── seed.sql                    # Local dev seed (schema seed ships in the migration)
└── migrations/
    └── 20260610000000_init.sql  # Schema + RLS (see Backend section below)
```

---

## Backend (Supabase)

The database schema lives in
[`supabase/migrations/20260610000000_init.sql`](supabase/migrations/20260610000000_init.sql)
and defines six tables, all multi-tenant via a `tenant_id` foreign key to
`tenants`:

| Table | Purpose | RLS policy |
|-------|---------|------------|
| `tenants` | One row per ClientRadarX client | Public read |
| `profiles` | Auto-created on sign-up via `handle_new_user()` trigger | User reads/writes own row |
| `services` | Service catalogue (name, price, category) | Public read of active services |
| `appointments` | Bookings | User reads/writes own rows |
| `quotes` | Quote requests | Anyone can insert; user reads own |
| `gallery_items` | Before/after portfolio photos | Public read |

To apply the schema to a Supabase project:

```bash
npm install -g supabase
supabase link --project-ref <ref> --password "<db-password>"
supabase db push
```

The currently deployed project (`oyzfvxwplnipnzqkueqs`, see `.env`) already
has this migration applied and seeded with the Auto Music Sound e Film tenant
and its six services.

---

## Current Status

| Area | Status |
|------|--------|
| Auth (sign up / sign in) | ✅ Live — `supabase.auth.signInWithPassword` / `signUp` |
| Agenda (appointments) | ✅ Live — queries `appointments` joined to `services`, filtered by `tenant_id` |
| Services catalogue | ⚠️ Static array in `services/index.tsx` — not yet reading from the `services` table |
| Gallery | ⚠️ Static local images in `gallery/index.tsx` — not yet reading from `gallery_items` |
| Quote wizard | ⚠️ Drafts to AsyncStorage, submits via WhatsApp deep link — not yet persisted to `quotes` |
| Supabase Storage | ❌ Not used — gallery/quote images are local only |
| i18n | ⚠️ PT-BR only — the EN/PT toggle in Settings persists a preference but the `en-US` dictionary is not implemented yet |
| Multi-tenancy | ⚠️ Schema + RLS support multiple tenants; only one tenant (`auto-music-sound`) is deployed/configured |

This reflects an intentional phase-1 build: authentication and the
appointments flow are fully wired end-to-end against the live database,
proving the multi-tenant pattern. Services, gallery, quotes, and Storage are
schema-ready and are the next features to connect.

---

## Running Locally

```bash
npm install
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start
```

Scan the QR with [Expo Go](https://expo.dev/go) on your phone, or press `w`
for the web build.

---

## Deploying for a New Client

ClientRadarX uses a white-label architecture. Most client-specific values
live in **`config/client.ts`**.

### 1. Add brand assets

```
assets/brands/<client-slug>/
  wordmark-transparent.png   # logo for the app header (transparent bg)
  gallery/                    # optional: initial gallery images
```

### 2. Update `config/client.ts`

Replace `businessName`, `tagline`, `slug`, `tenantId`, `logo`, `colors`,
`whatsappPhone`, `instagramHandle`/`instagramUrl`, `mapsUrl`, `address`, and
`serviceCategories` for the new client.

> **Note:** `app/i18n/index.tsx` currently hardcodes some PT-BR strings
> (business name, address, hours) under `drawer.*` and `business.*` instead
> of reading them from `CLIENT`. Until that's refactored, also update those
> keys when rebranding.

### 3. Create a Supabase project for the new client

```bash
SUPABASE_ACCESS_TOKEN=<token> supabase projects create "<client-name>" \
  --org-id <org-id> --region eu-west-1 --db-password "<strong-password>"

supabase link --project-ref <ref> --password "<strong-password>"
supabase db push
```

Insert a row into `tenants` with the new client's details — that row's `id`
becomes `tenantId` in `config/client.ts`.

### 4. Set environment variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 5. Update `app.json`

Change `expo.name`, `expo.slug`, `expo.scheme`, `ios.bundleIdentifier`, and
`android.package` for the new client.

### 6. Build for production

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

> Each client should be on a separate Git branch (e.g.
> `client/auto-music-sound`, `client/<new-client-slug>`) so their configs
> never conflict.

---

## Roadmap

- [ ] Wire Services and Gallery screens to `services` / `gallery_items` tables
- [ ] Persist quote submissions to the `quotes` table (in addition to WhatsApp)
- [ ] Supabase Storage for gallery and quote photos
- [ ] Implement the `en-US` i18n dictionary (currently PT-BR only)
- [ ] Derive white-label strings (`drawer.title`, `business.*`) from `config/client.ts`
- [ ] Automated tests
- [ ] Web dashboard for store owners
- [ ] Client #2 onboarding (validates the multi-tenant architecture end-to-end)
