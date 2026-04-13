# ClientRadarX

> Multi-tenant B2B SaaS mobile platform that gives small businesses a branded app to manage customers, quotes, appointments, and services — without needing a tech team or a big budget.

Built once, deployed per client. Each business gets their own branded version of the platform with zero rebuild from scratch.

**Current client:** [Auto Music Sound e Film](https://www.instagram.com/automusicsound/) — car audio, window tint & vehicle customisation shop, Tatuapé, São Paulo 🇧🇷

-----

## Tech Stack

|Layer        |Technology                                             |
|-------------|-------------------------------------------------------|
|Framework    |Expo ~54 + React Native 0.81                           |
|Language     |TypeScript 5 (strict mode)                             |
|Routing      |Expo Router v6 — file-based, Drawer + Tabs             |
|State        |React Context + AsyncStorage                           |
|Animations   |React Native Animated API — native driver              |
|Haptics      |expo-haptics — tactile feedback on wizard steps        |
|i18n         |Custom `useT()` hook — PT-BR + EN-US, runtime switching|
|Design System|Token-based (`tokens.ts`) — dark / light themes        |
|Photos       |expo-image-picker — multi-select, permissions handling |

-----

## Features

|Feature               |Description                                                                                     |
|----------------------|------------------------------------------------------------------------------------------------|
|**Quote Wizard**      |4-step flow: service → vehicle → photos → WhatsApp. Draft auto-saved with debounced persistence.|
|**Services Catalogue**|6 categories with filtering and pricing                                                         |
|**Appointment Agenda**|Week-strip calendar, status badges, login-gated                                                 |
|**Photo Gallery**     |Before/after grid with animated lightbox, login-gated                                           |
|**Authentication**    |Local session via AsyncStorage. Backend integration ready.                                      |
|**Settings**          |Dark/light mode + PT-BR ↔ EN-US, both persisted                                                 |

-----

## Architecture Highlights

### Custom i18n Framework

No library dependency. A `useT()` hook resolves dot-notation keys against external PT-BR / EN-US dictionary files, with runtime language switching and persisted preferences via AsyncStorage.

```ts
const { t } = useT();
<Text>{t('quote.wizard.step1.title')}</Text>
```

### Typed Design Token System

All colours, spacing, and typography live in `tokens.ts`. A `ThemeProvider` propagates the active theme via React Context — zero magic strings in components.

```ts
const { colors, spacing } = useTheme();
<View style={{ backgroundColor: colors.surface, padding: spacing.md }} />
```

### 4-Step Quote Wizard

Per-step validation, debounced auto-save draft persistence, image picker with permissions, and a WhatsApp deep-link on the final step that pre-fills the message with the client’s quote details.

### Multi-Tenant Architecture

Every UI decision — design tokens, i18n, brand config, navigation structure — was made to be rebranded per client. `assets/brands/` holds per-client assets. New client onboarding = new brand folder + config swap.

-----

## Project Structure

```
app/
├── (drawer)/
│   ├── (tabs)/
│   │   ├── inicio/        # Home — quote CTA, services, find us, FAQ
│   │   ├── services/      # Full service catalogue with filters
│   │   ├── agenda/        # Appointment scheduler (login-gated)
│   │   ├── gallery/       # Photo gallery + lightbox (login-gated)
│   │   └── orcamentos/    # Quotes overview
│   └── _layout.tsx        # Drawer nav + auth logic
├── quote/                 # 4-step quote wizard + draft persistence
├── login.tsx              # Auth screen
├── settings/              # Theme, language, about
├── theme/                 # tokens.ts + ThemeProvider + UI library
├── i18n/                  # PT-BR + EN-US dictionaries + useT()
├── auth/                  # Session management
└── storage/               # AsyncStorage wrapper

assets/
└── brands/
    └── auto-music-sound/  # Client #1 brand assets
```

-----

## Running Locally

```bash
npm install
npx expo start
```

Scan the QR with [Expo Go](https://expo.dev/go) on iOS or Android.

-----

## Roadmap

- [ ] Backend integration — quotes, appointments, gallery sync
- [ ] Push notifications for appointment reminders
- [ ] Web dashboard for store owners
- [ ] Digital marketing module — campaigns, review monitoring, social scheduling
- [ ] Multi-client admin panel
- [ ] Client #2 onboarding

-----

## About the Platform

ClientRadarX started from a simple observation: small businesses have great service but zero digital infrastructure. They lose customers because they have no easy way to receive quote requests, manage appointments, or showcase their work.

The platform solves this with a single affordable subscription — a branded mobile app, a services catalogue, a quote flow, and appointment scheduling — all ready to use without hiring a dev team.

*Built by [Rodrigo Xavier Ramos](https://github.com/Rodx21)*