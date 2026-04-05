# ClientRadarX Mobile — Auto Music Sound e Film

[![GitHub](https://img.shields.io/badge/GitHub-Rodx21%2Fclient--radar--x-181717?logo=github)](https://github.com/Rodx21/client-radar-x)

> **ClientRadarX** is a low-cost SaaS platform that gives small businesses — workshops, local stores, service shops — a professional mobile app and website to manage customers, services, and appointments, without needing a big budget or a tech team.

---

## The Idea

Most small businesses have great service but zero digital infrastructure. They lose customers because they have no easy way to receive quote requests, manage appointments, or showcase their work.

**ClientRadarX solves this with a single affordable subscription:**

- A branded mobile app (iOS & Android)
- A website for the business
- Customer management tools
- Quote flow integrated with WhatsApp
- Appointment scheduling
- Service catalogue with pricing
- Photo gallery (before & after)

The platform is built once and replicated per client — each store gets their own branded version without starting from scratch.

### Digital Marketing Module *(in development)*

The next phase of ClientRadarX will include a **digital marketing management module**: automated campaigns, review monitoring, social media scheduling, and lead tracking — all inside the same dashboard the store owner already uses.

---

## Client #1 — Auto Music Sound e Film

[**Auto Music Sound e Film**](https://www.instagram.com/automusicsound/) is a car audio, window tint, and vehicle customization store in **Tatuapé, São Paulo — Brazil**.

They are the **first real client** and the base template from which all future ClientRadarX clients are built. Every decision made in this app — architecture, design system, i18n, auth, navigation — was designed to be reused and rebranded for the next client.

| | |
|---|---|
| Address | R. Serra de Botucatu, 2100 — Tatuapé, SP |
| Hours | Mon–Fri 9h–17h · Sat 8h–16h · Sun closed |
| Google | 4.5 ★ · 244 reviews |
| Instagram | [@automusicsound](https://www.instagram.com/automusicsound/) |

---

## App Features

| Feature | Description |
|---------|-------------|
| Quote Wizard | 4-step flow: service → vehicle → photos → WhatsApp. Draft auto-saved. |
| Services Catalogue | 6 categories with filtering and pricing. |
| Appointment Agenda | Week-strip calendar, status badges, login-gated. |
| Photo Gallery | Before/after grid with animated lightbox, login-gated. |
| Authentication | Local session (AsyncStorage). Backend integration ready. |
| Settings | Dark/light mode + PT-BR ↔ EN-US, both persisted. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo ~54 + React Native 0.81 |
| Language | TypeScript 5 (strict mode) |
| Routing | Expo Router v6 — file-based, Drawer + Tabs |
| State | React Context + AsyncStorage (no Redux) |
| Animations | React Native Animated API — native driver |
| i18n | Custom `useT()` hook — PT-BR + EN-US, runtime switching |
| Design | Token-based design system (`tokens.ts`) — dark/light |
| Photos | expo-image-picker (multi-select, permissions) |
| Haptics | expo-haptics — tactile feedback on wizard steps |

---

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
```

---

## Running Locally

```bash
npm install
npx expo start
```

Scan the QR with [Expo Go](https://expo.dev/go) on your phone.

---

## Roadmap

- [ ] Backend integration (quotes, appointments, gallery sync)
- [ ] Push notifications for appointment reminders
- [ ] Web dashboard for store owners
- [ ] Digital marketing module (campaigns, reviews, social media)
- [ ] Multi-client admin panel
- [ ] Client #2 onboarding

---

*ClientRadarX was born from a simple observation: small businesses deserve the same quality of digital tools as big ones — they just need them to be affordable and ready to use.*
