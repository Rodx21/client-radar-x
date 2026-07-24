# ClientRadarX — Architecture & Sequence Diagrams

Companion to `docs/er-diagram.md`. Render with any Mermaid-compatible tool
and paste into the Final Report alongside the ER diagram, as planned in the
Interim Report's Future Work section (component diagram + sequence diagram
for the quote submission flow).

## Component diagram

```mermaid
graph TD
    subgraph Mobile App - Expo / React Native
        UI[Screens: Inicio, Services, Gallery, Agenda, Quote, Settings, Login]
        Theme[Theme + i18n providers]
        Config["config/client.ts white-label config"]
        Lib[lib/supabase.ts, lib/session.ts, lib/storage.ts]
    end

    subgraph Supabase Cloud Project
        Auth[Supabase Auth - JWT sessions]
        DB[(PostgreSQL - 6 tables + RLS)]
        REST[Auto-generated PostgREST API]
        Storage[Supabase Storage - gallery/quote photos]
    end

    WhatsApp[WhatsApp deep link]

    UI --> Theme
    UI --> Config
    UI --> Lib
    Lib --> Auth
    Lib --> REST
    REST --> DB
    Lib -.planned.-> Storage
    UI --> WhatsApp
```

## Sequence diagram — Quote submission flow

```mermaid
sequenceDiagram
    actor Customer
    participant QuoteScreen as Quote Wizard (app/quote/index.tsx)
    participant Local as AsyncStorage (draft)
    participant Supabase as Supabase (quotes table)
    participant WhatsApp

    Customer->>QuoteScreen: Select service (step 1)
    Customer->>QuoteScreen: Enter vehicle info (step 2)
    QuoteScreen->>Local: Debounced draft save (250ms)
    Customer->>QuoteScreen: Attach photos (step 3, optional)
    Customer->>QuoteScreen: Enter contact info (step 4)
    Customer->>QuoteScreen: Tap "Send via WhatsApp"
    QuoteScreen->>Supabase: INSERT into quotes (tenant_id, service, car, contact, status=pending)
    Supabase-->>QuoteScreen: Success / error
    QuoteScreen->>Local: Clear draft
    QuoteScreen->>WhatsApp: Open wa.me link with prefilled message
    WhatsApp-->>Customer: Chat opened with business
```
