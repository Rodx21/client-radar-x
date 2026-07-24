# ClientRadarX — Entity-Relationship Diagram

Reflects the schema defined in `supabase/migrations/20260610000000_init.sql`.
Render this with any Mermaid-compatible tool (e.g. https://mermaid.live, the
Mermaid VS Code extension, or Mermaid support in Word/Notion) and paste the
resulting image into the Final Report's Specification and Design section.

```mermaid
erDiagram
    TENANTS ||--o{ SERVICES : "offers"
    TENANTS ||--o{ APPOINTMENTS : "hosts"
    TENANTS ||--o{ QUOTES : "receives"
    TENANTS ||--o{ GALLERY_ITEMS : "displays"
    AUTH_USERS ||--o| PROFILES : "has"
    AUTH_USERS ||--o{ APPOINTMENTS : "books"
    AUTH_USERS ||--o{ QUOTES : "submits (optional)"
    SERVICES ||--o{ APPOINTMENTS : "booked as"

    TENANTS {
        uuid id PK
        text name
        text slug UK
        text brand_color
        text logo_url
        text whatsapp
        text address
        text instagram
        timestamptz created_at
    }

    PROFILES {
        uuid id PK "references auth.users(id)"
        text email
        text full_name
        text phone
        timestamptz created_at
    }

    SERVICES {
        uuid id PK
        uuid tenant_id FK
        text name
        text description
        numeric price_from
        text category
        text image_url
        boolean active
        timestamptz created_at
    }

    APPOINTMENTS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK "references auth.users(id)"
        uuid service_id FK
        text car_model
        text car_year
        date date
        time time
        text status "pending | confirmed | cancelled | completed"
        text notes
        timestamptz created_at
    }

    QUOTES {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK "nullable, references auth.users(id)"
        text service
        text car_model
        text car_year
        text_array photos
        text contact_name
        text contact_phone
        text status "pending | viewed | replied"
        timestamptz created_at
    }

    GALLERY_ITEMS {
        uuid id PK
        uuid tenant_id FK
        text title
        text description
        text category
        text before_url
        text after_url
        timestamptz created_at
    }

    AUTH_USERS {
        uuid id PK "managed by Supabase Auth"
        text email
    }
```

## Row Level Security summary

| Table | Read | Write |
|---|---|---|
| `tenants` | public | — |
| `profiles` | owner only (`auth.uid() = id`) | owner only |
| `services` | public, `active = true` only | — |
| `appointments` | owner only (`auth.uid() = user_id`) | owner only |
| `quotes` | owner only (`auth.uid() = user_id`) | anyone can insert (supports unauthenticated quote requests) |
| `gallery_items` | public | — |

A trigger (`handle_new_user`) auto-creates a `profiles` row whenever a new
`auth.users` record is created, populating `full_name` from sign-up metadata
or the email's local part as a fallback.

## Multi-tenancy note

Every business-data table carries a `tenant_id` foreign key into `tenants`,
which is what allows this schema to support shared multi-tenancy if a future
deployment needs it. The current deployment uses a white-label **silo**
model instead (one Supabase project per client, see Interim Report §3.1 and
§6.3) — `TENANT_ID` in `config/client.ts` is a compile-time constant rather
than a runtime-selected value, but every query still filters by it so the
same schema works unmodified under either model.
