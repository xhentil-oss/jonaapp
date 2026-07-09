# Jona Academy — Database Schema

**PostgreSQL 15+** · BIGSERIAL primary keys · 16 tabela · 7 triggers

## Struktura e Skedarëve

```
database/
├── migrations/
│   ├── 001_initial_schema.sql   — Të gjitha tabelat, indexet, triggerat
│   └── 002_seed_data.sql        — Kategoritë, instruktorët, planet, kurset
└── README.md
```

## Si të Ekzekutosh

```bash
# Krijo databazën
createdb jonakademy

# Ekzekuto migrimet në rend
psql -d jonakademy -f migrations/001_initial_schema.sql
psql -d jonakademy -f migrations/002_seed_data.sql
```

## Tabelat (16)

| # | Tabela | Përshkrim |
|---|--------|-----------|
| 1 | `users` | Llogaritë e përdoruesve |
| 2 | `instructors` | Instruktorët e kurseve |
| 3 | `categories` | 9 kategoritë (Motivim, Shëndet, etj.) |
| 4 | `courses` | 15 kurset me çmim dhe nivel |
| 5 | `course_sections` | Seancat/modulet brenda kursit |
| 6 | `lessons` | Mësimet me video_url dhe kohëzgjatje |
| 7 | `enrollments` | Regjistrimet user ↔ kurs |
| 8 | `lesson_progress` | Progresi për çdo mësim |
| 9 | `lesson_notes` | Shënimet e userit gjatë mësimit |
| 10 | `certificates` | Certifikatat e lëshuara automatikisht |
| 11 | `subscription_plans` | Planet Mujor/Vjetor |
| 12 | `subscriptions` | Abonimet aktive të userave |
| 13 | `payments` | Pagesat (kurs i vetëm ose abonim) |
| 14 | `notifications` | Njoftimet per user ose globale |
| 15 | `notification_settings` | Preferencat e njoftimeve (1:1 me user) |
| 16 | `user_settings` | Cilësimet e luajtjes (1:1 me user) |

## Triggerat (7)

| Trigger | Aktivizohet | Çfarë bën |
|---------|-------------|-----------|
| `trg_*_updated_at` | BEFORE UPDATE | Rifreskon `updated_at` automatikisht |
| `trg_certificate_code` | BEFORE INSERT certificates | Gjeneron `CERT-JA-YYYY-XXXX` |
| `trg_lesson_progress_refresh` | AFTER UPDATE lesson_progress | Rifreskon `progress_percent` te enrollments |
| `trg_enrollment_students_count` | AFTER INSERT/DELETE enrollments | Rifreskon `students_count` te courses |
| `trg_lesson_lessons_count` | AFTER INSERT/DELETE lessons | Rifreskon `lessons_count` te courses |
| `trg_auto_issue_certificate` | AFTER UPDATE enrollments | Lëshon certifikatë kur progress = 100% |
| `trg_init_user_preferences` | AFTER INSERT users | Krijon notification_settings + user_settings |

## ER Diagram (Mermaid)

```mermaid
erDiagram
    users {
        bigserial id PK
        varchar full_name
        varchar email UK
        text password_hash
        text avatar_url
        enum membership_type
        timestamptz created_at
        timestamptz updated_at
    }

    instructors {
        bigserial id PK
        varchar full_name
        text bio
        text avatar_url
        timestamptz created_at
    }

    categories {
        bigserial id PK
        varchar name UK
        varchar icon
        varchar color
        timestamptz created_at
    }

    courses {
        bigserial id PK
        varchar title
        text short_description
        bigint category_id FK
        bigint instructor_id FK
        enum level
        int duration_minutes
        numeric price
        enum access_type
        boolean is_featured
        boolean is_new
        int students_count
        int lessons_count
        timestamptz created_at
        timestamptz updated_at
    }

    course_sections {
        bigserial id PK
        bigint course_id FK
        varchar title
        int order_index
        timestamptz created_at
    }

    lessons {
        bigserial id PK
        bigint section_id FK
        bigint course_id FK
        varchar title
        text video_url
        int duration_seconds
        boolean is_free
        int order_index
        timestamptz created_at
    }

    enrollments {
        bigserial id PK
        bigint user_id FK
        bigint course_id FK
        timestamptz enrolled_at
        numeric progress_percent
        enum status
        timestamptz completed_at
    }

    lesson_progress {
        bigserial id PK
        bigint user_id FK
        bigint lesson_id FK
        bigint enrollment_id FK
        boolean is_completed
        int watched_seconds
        timestamptz last_watched_at
    }

    lesson_notes {
        bigserial id PK
        bigint user_id FK
        bigint lesson_id FK
        text content
        int video_timestamp
        timestamptz created_at
        timestamptz updated_at
    }

    certificates {
        bigserial id PK
        bigint user_id FK
        bigint course_id FK
        varchar certificate_code UK
        timestamptz issued_at
        varchar instructor_signature_name
    }

    subscription_plans {
        bigserial id PK
        varchar name
        numeric price
        enum billing_cycle
        numeric discount_percent
        jsonb features
        timestamptz created_at
    }

    subscriptions {
        bigserial id PK
        bigint user_id FK
        bigint plan_id FK
        enum status
        timestamptz started_at
        timestamptz renews_at
        timestamptz canceled_at
    }

    payments {
        bigserial id PK
        bigint user_id FK
        bigint course_id FK
        bigint subscription_id FK
        numeric amount
        varchar currency
        varchar payment_method
        enum status
        timestamptz created_at
    }

    notifications {
        bigserial id PK
        bigint user_id FK
        enum type
        varchar title
        text message
        boolean is_read
        timestamptz created_at
    }

    notification_settings {
        bigserial id PK
        bigint user_id FK UK
        boolean new_courses
        boolean lesson_reminders
        boolean offers_promotions
        boolean certificates
        boolean messages
    }

    user_settings {
        bigserial id PK
        bigint user_id FK UK
        boolean push_notifications
        boolean email_updates
        boolean autoplay_lessons
        enum video_quality
        boolean downloads_wifi_only
    }

    categories        ||--o{ courses              : "ka kurse"
    instructors       ||--o{ courses              : "jep mësim"
    courses           ||--o{ course_sections      : "ka seksione"
    course_sections   ||--o{ lessons              : "ka mësime"
    courses           ||--o{ lessons              : "direkt (kursit)"
    users             ||--o{ enrollments          : "regjistrohet"
    courses           ||--o{ enrollments          : "regjistrimet"
    users             ||--o{ lesson_progress      : "ndjek progresin"
    lessons           ||--o{ lesson_progress      : "progresi"
    enrollments       ||--o{ lesson_progress      : "i lidhur me"
    users             ||--o{ lesson_notes         : "shkruan shënime"
    lessons           ||--o{ lesson_notes         : "shënimet"
    users             ||--o{ certificates         : "fiton"
    courses           ||--o{ certificates         : "jep certifikatë"
    subscription_plans||--o{ subscriptions        : "plani"
    users             ||--o{ subscriptions        : "abonohet"
    users             ||--o{ payments             : "paguan"
    courses           ||--o{ payments             : "blihet"
    subscriptions     ||--o{ payments             : "pagesë abonimi"
    users             ||--o{ notifications        : "merr njoftime"
    users             ||--|| notification_settings: "preferencat"
    users             ||--|| user_settings        : "cilësimet"
```

## Rregullat e Biznesit të Implementuara

1. **Qasja te kursi** — user ka qasje nëse:
   - Ka enrollment me payment `i_suksesshem` dhe `course_id` = atij kursi, **OSE**
   - Ka abonim aktiv (`subscriptions.status = 'aktiv'`) dhe kursi është `premium`

2. **Certifikata automatike** — trigger `trg_auto_issue_certificate` e lëshon kur `enrollment.status` kalon në `perfunduar` (progress = 100%)

3. **certificate_code unik** — gjenerohet automatikisht nga trigger: `CERT-JA-2026-0001`

4. **progress_percent** — rifreskohet automatikisht nga trigger çdo herë që një mësim shënohet si i kryer

5. **is_free te lesson** — mund të jetë TRUE edhe nëse kursi është premium (mësim demo falas)

6. **notification_settings + user_settings** — krijohen automatikisht me trigger kur regjistrohet user i ri
