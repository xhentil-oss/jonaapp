-- =============================================================================
-- JONA ACADEMY — Skema Fillestare e Databazës
-- PostgreSQL 15+
-- Migrim: 001_initial_schema.sql
-- =============================================================================

-- Aktivizo extensionin për UUID (opsional — po përdorim BIGSERIAL)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE membership_type_enum  AS ENUM ('free', 'premium');
CREATE TYPE course_level_enum      AS ENUM ('fillestare', 'mesatar', 'avancuar', 'te_gjitha_nivelet');
CREATE TYPE access_type_enum       AS ENUM ('free', 'premium', 'vip');
CREATE TYPE enrollment_status_enum AS ENUM ('aktiv', 'perfunduar');
CREATE TYPE sub_status_enum        AS ENUM ('aktiv', 'anulluar', 'skaduar');
CREATE TYPE billing_cycle_enum     AS ENUM ('monthly', 'yearly');
CREATE TYPE payment_status_enum    AS ENUM ('i_suksesshem', 'deshtuar', 'ne_pritje');
CREATE TYPE video_quality_enum     AS ENUM ('auto', '480p', '720p', '1080p');
CREATE TYPE notification_type_enum AS ENUM (
  'kurs_i_ri', 'kujtues_mesimi', 'oferte', 'certifikate', 'mesazh'
);

-- =============================================================================
-- 1. INSTRUCTORS
-- =============================================================================

CREATE TABLE instructors (
  id          BIGSERIAL    PRIMARY KEY,
  full_name   VARCHAR(255) NOT NULL,
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. CATEGORIES
-- =============================================================================

CREATE TABLE categories (
  id         BIGSERIAL    PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  icon       VARCHAR(10),   -- emoji p.sh. 🔥
  color      VARCHAR(20),   -- hex p.sh. #7A4F2D
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. USERS
-- =============================================================================

CREATE TABLE users (
  id              BIGSERIAL           PRIMARY KEY,
  full_name       VARCHAR(255)        NOT NULL,
  email           VARCHAR(255)        NOT NULL UNIQUE,
  password_hash   TEXT                NOT NULL,
  avatar_url      TEXT,
  membership_type membership_type_enum NOT NULL DEFAULT 'free',
  created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

-- =============================================================================
-- 4. COURSES
-- =============================================================================

CREATE TABLE courses (
  id                BIGSERIAL          PRIMARY KEY,
  title             VARCHAR(500)       NOT NULL,
  short_description TEXT,
  long_description  TEXT,
  category_id       BIGINT             NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  instructor_id     BIGINT             NOT NULL REFERENCES instructors(id) ON DELETE RESTRICT,
  level             course_level_enum  NOT NULL DEFAULT 'te_gjitha_nivelet',
  duration_minutes  INT                NOT NULL DEFAULT 0,
  price             NUMERIC(10,2)      NOT NULL DEFAULT 0,
  access_type       access_type_enum   NOT NULL DEFAULT 'premium',
  cover_image_url   TEXT,
  is_new            BOOLEAN            NOT NULL DEFAULT FALSE,
  is_featured       BOOLEAN            NOT NULL DEFAULT FALSE,
  students_count    INT                NOT NULL DEFAULT 0,   -- denormalizuar, rifreskohet me trigger
  lessons_count     INT                NOT NULL DEFAULT 0,   -- denormalizuar, rifreskohet me trigger
  created_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_category_id   ON courses (category_id);
CREATE INDEX idx_courses_instructor_id ON courses (instructor_id);
CREATE INDEX idx_courses_access_type   ON courses (access_type);
CREATE INDEX idx_courses_is_featured   ON courses (is_featured) WHERE is_featured = TRUE;

-- =============================================================================
-- 5. COURSE_SECTIONS
-- =============================================================================

CREATE TABLE course_sections (
  id          BIGSERIAL    PRIMARY KEY,
  course_id   BIGINT       NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(500) NOT NULL,
  order_index INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_section_order UNIQUE (course_id, order_index)
);

CREATE INDEX idx_sections_course_id ON course_sections (course_id);

-- =============================================================================
-- 6. LESSONS
-- =============================================================================

CREATE TABLE lessons (
  id               BIGSERIAL    PRIMARY KEY,
  section_id       BIGINT       NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  course_id        BIGINT       NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title            VARCHAR(500) NOT NULL,
  video_url        TEXT,          -- Google Drive file ID ose URL e plotë
  duration_seconds INT          NOT NULL DEFAULT 0,
  is_free          BOOLEAN      NOT NULL DEFAULT FALSE,
  order_index      INT          NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_lesson_order UNIQUE (section_id, order_index)
);

CREATE INDEX idx_lessons_section_id ON lessons (section_id);
CREATE INDEX idx_lessons_course_id  ON lessons (course_id);
CREATE INDEX idx_lessons_is_free    ON lessons (is_free) WHERE is_free = TRUE;

-- =============================================================================
-- 7. SUBSCRIPTION_PLANS
-- =============================================================================

CREATE TABLE subscription_plans (
  id               BIGSERIAL          PRIMARY KEY,
  name             VARCHAR(100)       NOT NULL,  -- 'Mujor', 'Vjetor'
  price            NUMERIC(10,2)      NOT NULL,
  billing_cycle    billing_cycle_enum NOT NULL,
  discount_percent NUMERIC(5,2)       NOT NULL DEFAULT 0,
  features         JSONB,             -- ["Akses i plotë", "Certifikata", ...]
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. ENROLLMENTS
-- =============================================================================

CREATE TABLE enrollments (
  id               BIGSERIAL              PRIMARY KEY,
  user_id          BIGINT                 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id        BIGINT                 NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at      TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  progress_percent NUMERIC(5,2)           NOT NULL DEFAULT 0
                   CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status           enrollment_status_enum NOT NULL DEFAULT 'aktiv',
  completed_at     TIMESTAMPTZ,

  CONSTRAINT uq_enrollment UNIQUE (user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id   ON enrollments (user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments (course_id);
CREATE INDEX idx_enrollments_status    ON enrollments (status);

-- =============================================================================
-- 9. LESSON_PROGRESS
-- =============================================================================

CREATE TABLE lesson_progress (
  id               BIGSERIAL   PRIMARY KEY,
  user_id          BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id        BIGINT      NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id    BIGINT      NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  is_completed     BOOLEAN     NOT NULL DEFAULT FALSE,
  watched_seconds  INT         NOT NULL DEFAULT 0,
  last_watched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_lesson_progress UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id     ON lesson_progress (user_id);
CREATE INDEX idx_lesson_progress_lesson_id   ON lesson_progress (lesson_id);
CREATE INDEX idx_lesson_progress_enrollment  ON lesson_progress (enrollment_id);

-- =============================================================================
-- 10. LESSON_NOTES
-- =============================================================================

CREATE TABLE lesson_notes (
  id              BIGSERIAL   PRIMARY KEY,
  user_id         BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id       BIGINT      NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content         TEXT        NOT NULL,
  video_timestamp INT         NOT NULL DEFAULT 0,  -- sekonda
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lesson_notes_user_lesson ON lesson_notes (user_id, lesson_id);

-- =============================================================================
-- 11. CERTIFICATES
-- =============================================================================

CREATE TABLE certificates (
  id                       BIGSERIAL    PRIMARY KEY,
  user_id                  BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id                BIGINT       NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_code         VARCHAR(50)  NOT NULL UNIQUE,  -- CERT-JA-2026-0615
  issued_at                TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  instructor_signature_name VARCHAR(255)
);

CREATE INDEX idx_certificates_user_id   ON certificates (user_id);
CREATE INDEX idx_certificates_course_id ON certificates (course_id);
CREATE INDEX idx_certificates_code      ON certificates (certificate_code);

-- =============================================================================
-- 12. SUBSCRIPTIONS
-- =============================================================================

CREATE TABLE subscriptions (
  id          BIGSERIAL        PRIMARY KEY,
  user_id     BIGINT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id     BIGINT           NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status      sub_status_enum  NOT NULL DEFAULT 'aktiv',
  started_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  renews_at   TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_status  ON subscriptions (status);

-- =============================================================================
-- 13. PAYMENTS
-- =============================================================================

CREATE TABLE payments (
  id               BIGSERIAL           PRIMARY KEY,
  user_id          BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id        BIGINT              REFERENCES courses(id) ON DELETE SET NULL,        -- nullable
  subscription_id  BIGINT              REFERENCES subscriptions(id) ON DELETE SET NULL,  -- nullable
  amount           NUMERIC(10,2)       NOT NULL,
  currency         VARCHAR(3)          NOT NULL DEFAULT 'EUR',
  payment_method   VARCHAR(100),        -- 'card', 'stripe', 'paypal', etj.
  status           payment_status_enum NOT NULL DEFAULT 'ne_pritje',
  created_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_payment_target CHECK (
    course_id IS NOT NULL OR subscription_id IS NOT NULL
  )
);

CREATE INDEX idx_payments_user_id        ON payments (user_id);
CREATE INDEX idx_payments_course_id      ON payments (course_id);
CREATE INDEX idx_payments_subscription_id ON payments (subscription_id);
CREATE INDEX idx_payments_status         ON payments (status);

-- =============================================================================
-- 14. NOTIFICATIONS
-- =============================================================================

CREATE TABLE notifications (
  id         BIGSERIAL              PRIMARY KEY,
  user_id    BIGINT                 REFERENCES users(id) ON DELETE CASCADE,  -- NULL = global
  type       notification_type_enum NOT NULL,
  title      VARCHAR(255)           NOT NULL,
  message    TEXT                   NOT NULL,
  is_read    BOOLEAN                NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id  ON notifications (user_id);
CREATE INDEX idx_notifications_is_read  ON notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_type     ON notifications (type);

-- =============================================================================
-- 15. NOTIFICATION_SETTINGS
-- =============================================================================

CREATE TABLE notification_settings (
  id                BIGSERIAL   PRIMARY KEY,
  user_id           BIGINT      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  new_courses       BOOLEAN     NOT NULL DEFAULT TRUE,
  lesson_reminders  BOOLEAN     NOT NULL DEFAULT TRUE,
  offers_promotions BOOLEAN     NOT NULL DEFAULT FALSE,
  certificates      BOOLEAN     NOT NULL DEFAULT TRUE,
  messages          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 16. USER_SETTINGS
-- =============================================================================

CREATE TABLE user_settings (
  id                   BIGSERIAL          PRIMARY KEY,
  user_id              BIGINT             NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  push_notifications   BOOLEAN            NOT NULL DEFAULT TRUE,
  email_updates        BOOLEAN            NOT NULL DEFAULT TRUE,
  autoplay_lessons     BOOLEAN            NOT NULL DEFAULT TRUE,
  video_quality        video_quality_enum NOT NULL DEFAULT 'auto',
  downloads_wifi_only  BOOLEAN            NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- [T1] updated_at auto-refresh për çdo tabelë me updated_at
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_lesson_notes_updated_at
  BEFORE UPDATE ON lesson_notes
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- [T2] Auto-gjenero certificate_code: CERT-JA-YYYY-XXXX
CREATE OR REPLACE FUNCTION fn_generate_certificate_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_year  TEXT;
  v_seq   TEXT;
  v_count BIGINT;
BEGIN
  IF NEW.certificate_code IS NULL OR NEW.certificate_code = '' THEN
    v_year  := TO_CHAR(NOW(), 'YYYY');
    SELECT COUNT(*) + 1 INTO v_count FROM certificates
      WHERE EXTRACT(YEAR FROM issued_at) = EXTRACT(YEAR FROM NOW());
    v_seq   := LPAD(v_count::TEXT, 4, '0');
    NEW.certificate_code := 'CERT-JA-' || v_year || '-' || v_seq;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_certificate_code
  BEFORE INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION fn_generate_certificate_code();

-- [T3] Rifresho progress_percent te enrollments pas çdo ndryshimi të lesson_progress
CREATE OR REPLACE FUNCTION fn_refresh_enrollment_progress()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_total    INT;
  v_done     INT;
  v_progress NUMERIC(5,2);
BEGIN
  SELECT c.lessons_count INTO v_total
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
   WHERE e.id = NEW.enrollment_id;

  IF v_total IS NULL OR v_total = 0 THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO v_done
    FROM lesson_progress
   WHERE enrollment_id = NEW.enrollment_id
     AND is_completed = TRUE;

  v_progress := ROUND((v_done::NUMERIC / v_total) * 100, 2);

  UPDATE enrollments
     SET progress_percent = v_progress,
         status = CASE WHEN v_progress >= 100 THEN 'perfunduar'::enrollment_status_enum
                       ELSE 'aktiv'::enrollment_status_enum END,
         completed_at = CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END
   WHERE id = NEW.enrollment_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lesson_progress_refresh
  AFTER INSERT OR UPDATE OF is_completed ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION fn_refresh_enrollment_progress();

-- [T4] Rifresho students_count te courses pas enrollment të ri
CREATE OR REPLACE FUNCTION fn_refresh_students_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses SET students_count = students_count + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses SET students_count = GREATEST(students_count - 1, 0) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_enrollment_students_count
  AFTER INSERT OR DELETE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION fn_refresh_students_count();

-- [T5] Rifresho lessons_count te courses pas shtimit/fshirjes së mësimit
CREATE OR REPLACE FUNCTION fn_refresh_lessons_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses SET lessons_count = lessons_count + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses SET lessons_count = GREATEST(lessons_count - 1, 0) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_lesson_lessons_count
  AFTER INSERT OR DELETE ON lessons
  FOR EACH ROW EXECUTE FUNCTION fn_refresh_lessons_count();

-- [T6] Kur enrollment kalon 'perfunduar', krijo automatikisht certifikatën
CREATE OR REPLACE FUNCTION fn_auto_issue_certificate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_instructor_name TEXT;
BEGIN
  IF NEW.status = 'perfunduar' AND (OLD.status IS DISTINCT FROM 'perfunduar') THEN
    -- Kontrollo nëse certifikata ekziston tashmë
    IF NOT EXISTS (
      SELECT 1 FROM certificates
       WHERE user_id = NEW.user_id AND course_id = NEW.course_id
    ) THEN
      SELECT i.full_name INTO v_instructor_name
        FROM courses c
        JOIN instructors i ON i.id = c.instructor_id
       WHERE c.id = NEW.course_id;

      INSERT INTO certificates (user_id, course_id, instructor_signature_name)
      VALUES (NEW.user_id, NEW.course_id, v_instructor_name);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_issue_certificate
  AFTER UPDATE OF status ON enrollments
  FOR EACH ROW EXECUTE FUNCTION fn_auto_issue_certificate();

-- [T7] Kur krijohet user, shto automatikisht notification_settings dhe user_settings
CREATE OR REPLACE FUNCTION fn_init_user_preferences()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO notification_settings (user_id) VALUES (NEW.id);
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_init_user_preferences
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION fn_init_user_preferences();
