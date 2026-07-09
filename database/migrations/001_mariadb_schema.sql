-- =============================================================================
-- JONA ACADEMY — Skema MariaDB
-- MariaDB 10.4+  |  ENGINE=InnoDB  |  utf8mb4
-- Migrim: 001_mariadb_schema.sql
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

ALTER DATABASE appjonacademy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE appjonacademy_db;

-- =============================================================================
-- 1. INSTRUCTORS
-- =============================================================================

CREATE TABLE instructors (
  id         BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  full_name  VARCHAR(255)     NOT NULL,
  bio        TEXT,
  avatar_url TEXT,
  created_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 2. CATEGORIES
-- =============================================================================

CREATE TABLE categories (
  id         BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)     NOT NULL,
  icon       VARCHAR(10),
  color      VARCHAR(20),
  created_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 3. USERS
-- =============================================================================

CREATE TABLE users (
  id              BIGINT UNSIGNED                 NOT NULL AUTO_INCREMENT,
  full_name       VARCHAR(255)                    NOT NULL,
  email           VARCHAR(255)                    NOT NULL,
  password_hash   TEXT                            NOT NULL,
  avatar_url      TEXT,
  membership_type ENUM('free','premium')          NOT NULL DEFAULT 'free',
  created_at      DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 4. COURSES
-- =============================================================================

CREATE TABLE courses (
  id                BIGINT UNSIGNED                                              NOT NULL AUTO_INCREMENT,
  title             VARCHAR(500)                                                 NOT NULL,
  short_description TEXT,
  long_description  TEXT,
  category_id       BIGINT UNSIGNED                                              NOT NULL,
  instructor_id     BIGINT UNSIGNED                                              NOT NULL,
  level             ENUM('fillestare','mesatar','avancuar','te_gjitha_nivelet')  NOT NULL DEFAULT 'te_gjitha_nivelet',
  duration_minutes  INT                                                          NOT NULL DEFAULT 0,
  price             DECIMAL(10,2)                                                NOT NULL DEFAULT 0,
  access_type       ENUM('free','premium','vip')                                 NOT NULL DEFAULT 'premium',
  cover_image_url   TEXT,
  is_new            TINYINT(1)                                                   NOT NULL DEFAULT 0,
  is_featured       TINYINT(1)                                                   NOT NULL DEFAULT 0,
  students_count    INT                                                          NOT NULL DEFAULT 0,
  lessons_count     INT                                                          NOT NULL DEFAULT 0,
  created_at        DATETIME                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_courses_category_id   (category_id),
  KEY idx_courses_instructor_id (instructor_id),
  KEY idx_courses_access_type   (access_type),
  KEY idx_courses_is_featured   (is_featured),
  CONSTRAINT fk_courses_category   FOREIGN KEY (category_id)   REFERENCES categories(id)   ON DELETE RESTRICT,
  CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES instructors(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 5. COURSE_SECTIONS
-- =============================================================================

CREATE TABLE course_sections (
  id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  course_id   BIGINT UNSIGNED  NOT NULL,
  title       VARCHAR(500)     NOT NULL,
  order_index INT              NOT NULL DEFAULT 0,
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_section_order (course_id, order_index),
  KEY idx_sections_course_id (course_id),
  CONSTRAINT fk_sections_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 6. LESSONS
-- =============================================================================

CREATE TABLE lessons (
  id               BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  section_id       BIGINT UNSIGNED  NOT NULL,
  course_id        BIGINT UNSIGNED  NOT NULL,
  title            VARCHAR(500)     NOT NULL,
  video_url        TEXT,
  duration_seconds INT              NOT NULL DEFAULT 0,
  is_free          TINYINT(1)       NOT NULL DEFAULT 0,
  order_index      INT              NOT NULL DEFAULT 0,
  created_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lesson_order (section_id, order_index),
  KEY idx_lessons_section_id (section_id),
  KEY idx_lessons_course_id  (course_id),
  KEY idx_lessons_is_free    (is_free),
  CONSTRAINT fk_lessons_section FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE,
  CONSTRAINT fk_lessons_course  FOREIGN KEY (course_id)  REFERENCES courses(id)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 7. SUBSCRIPTION_PLANS
-- =============================================================================

CREATE TABLE subscription_plans (
  id               BIGINT UNSIGNED                 NOT NULL AUTO_INCREMENT,
  name             VARCHAR(100)                    NOT NULL,
  price            DECIMAL(10,2)                   NOT NULL,
  billing_cycle    ENUM('monthly','yearly')        NOT NULL,
  discount_percent DECIMAL(5,2)                    NOT NULL DEFAULT 0,
  features         JSON,
  created_at       DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 8. ENROLLMENTS
-- =============================================================================

CREATE TABLE enrollments (
  id               BIGINT UNSIGNED                     NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED                     NOT NULL,
  course_id        BIGINT UNSIGNED                     NOT NULL,
  enrolled_at      DATETIME                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  progress_percent DECIMAL(5,2)                        NOT NULL DEFAULT 0,
  status           ENUM('aktiv','perfunduar')           NOT NULL DEFAULT 'aktiv',
  completed_at     DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enrollment (user_id, course_id),
  KEY idx_enrollments_user_id   (user_id),
  KEY idx_enrollments_course_id (course_id),
  KEY idx_enrollments_status    (status),
  CONSTRAINT chk_progress CHECK (progress_percent >= 0 AND progress_percent <= 100),
  CONSTRAINT fk_enrollments_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 9. LESSON_PROGRESS
-- =============================================================================

CREATE TABLE lesson_progress (
  id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED  NOT NULL,
  lesson_id       BIGINT UNSIGNED  NOT NULL,
  enrollment_id   BIGINT UNSIGNED  NOT NULL,
  is_completed    TINYINT(1)       NOT NULL DEFAULT 0,
  watched_seconds INT              NOT NULL DEFAULT 0,
  last_watched_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lesson_progress (user_id, lesson_id),
  KEY idx_lp_user_id       (user_id),
  KEY idx_lp_lesson_id     (lesson_id),
  KEY idx_lp_enrollment_id (enrollment_id),
  CONSTRAINT fk_lp_user       FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE CASCADE,
  CONSTRAINT fk_lp_lesson     FOREIGN KEY (lesson_id)     REFERENCES lessons(id)     ON DELETE CASCADE,
  CONSTRAINT fk_lp_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 10. LESSON_NOTES
-- =============================================================================

CREATE TABLE lesson_notes (
  id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED  NOT NULL,
  lesson_id       BIGINT UNSIGNED  NOT NULL,
  content         TEXT             NOT NULL,
  video_timestamp INT              NOT NULL DEFAULT 0,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notes_user_lesson (user_id, lesson_id),
  CONSTRAINT fk_notes_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_notes_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 11. CERTIFICATES
-- =============================================================================

CREATE TABLE certificates (
  id                        BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id                   BIGINT UNSIGNED  NOT NULL,
  course_id                 BIGINT UNSIGNED  NOT NULL,
  certificate_code          VARCHAR(50)      NOT NULL DEFAULT '',
  issued_at                 DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  instructor_signature_name VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE KEY uq_certificate_code  (certificate_code),
  KEY idx_certificates_user_id    (user_id),
  KEY idx_certificates_course_id  (course_id),
  CONSTRAINT fk_certs_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_certs_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 12. SUBSCRIPTIONS
-- =============================================================================

CREATE TABLE subscriptions (
  id          BIGINT UNSIGNED                        NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED                        NOT NULL,
  plan_id     BIGINT UNSIGNED                        NOT NULL,
  status      ENUM('aktiv','anulluar','skaduar')     NOT NULL DEFAULT 'aktiv',
  started_at  DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  renews_at   DATETIME,
  canceled_at DATETIME,
  created_at  DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_subscriptions_user_id (user_id),
  KEY idx_subscriptions_status  (status),
  CONSTRAINT fk_subs_user FOREIGN KEY (user_id)  REFERENCES users(id)              ON DELETE CASCADE,
  CONSTRAINT fk_subs_plan FOREIGN KEY (plan_id)  REFERENCES subscription_plans(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 13. PAYMENTS
-- =============================================================================

CREATE TABLE payments (
  id              BIGINT UNSIGNED                                  NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED                                  NOT NULL,
  course_id       BIGINT UNSIGNED,
  subscription_id BIGINT UNSIGNED,
  amount          DECIMAL(10,2)                                    NOT NULL,
  currency        VARCHAR(3)                                       NOT NULL DEFAULT 'EUR',
  payment_method  VARCHAR(100),
  status          ENUM('i_suksesshem','deshtuar','ne_pritje')      NOT NULL DEFAULT 'ne_pritje',
  created_at      DATETIME                                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payments_user_id         (user_id),
  KEY idx_payments_course_id       (course_id),
  KEY idx_payments_subscription_id (subscription_id),
  KEY idx_payments_status          (status),
  CONSTRAINT fk_payments_user         FOREIGN KEY (user_id)         REFERENCES users(id)          ON DELETE CASCADE,
  CONSTRAINT fk_payments_course       FOREIGN KEY (course_id)       REFERENCES courses(id)        ON DELETE SET NULL,
  CONSTRAINT fk_payments_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 14. NOTIFICATIONS
-- =============================================================================

CREATE TABLE notifications (
  id         BIGINT UNSIGNED                                                              NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED,
  type       ENUM('kurs_i_ri','kujtues_mesimi','oferte','certifikate','mesazh')           NOT NULL,
  title      VARCHAR(255)                                                                 NOT NULL,
  message    TEXT                                                                         NOT NULL,
  is_read    TINYINT(1)                                                                   NOT NULL DEFAULT 0,
  created_at DATETIME                                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user_id (user_id),
  KEY idx_notifications_is_read (user_id, is_read),
  KEY idx_notifications_type    (type),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 15. NOTIFICATION_SETTINGS
-- =============================================================================

CREATE TABLE notification_settings (
  id                BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id           BIGINT UNSIGNED  NOT NULL,
  new_courses       TINYINT(1)       NOT NULL DEFAULT 1,
  lesson_reminders  TINYINT(1)       NOT NULL DEFAULT 1,
  offers_promotions TINYINT(1)       NOT NULL DEFAULT 0,
  certificates      TINYINT(1)       NOT NULL DEFAULT 1,
  messages          TINYINT(1)       NOT NULL DEFAULT 1,
  created_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_notif_settings_user (user_id),
  CONSTRAINT fk_notif_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- 16. USER_SETTINGS
-- =============================================================================

CREATE TABLE user_settings (
  id                  BIGINT UNSIGNED                           NOT NULL AUTO_INCREMENT,
  user_id             BIGINT UNSIGNED                           NOT NULL,
  push_notifications  TINYINT(1)                               NOT NULL DEFAULT 1,
  email_updates       TINYINT(1)                               NOT NULL DEFAULT 1,
  autoplay_lessons    TINYINT(1)                               NOT NULL DEFAULT 1,
  video_quality       ENUM('auto','480p','720p','1080p')        NOT NULL DEFAULT 'auto',
  downloads_wifi_only TINYINT(1)                               NOT NULL DEFAULT 1,
  created_at          DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_settings_user (user_id),
  CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

DELIMITER //

-- [T1] Auto-gjenero certificate_code: CERT-JA-YYYY-XXXX
CREATE TRIGGER trg_certificate_code
BEFORE INSERT ON certificates
FOR EACH ROW
BEGIN
  DECLARE v_year  VARCHAR(4);
  DECLARE v_count BIGINT;
  DECLARE v_seq   VARCHAR(4);

  IF NEW.certificate_code = '' OR NEW.certificate_code IS NULL THEN
    SET v_year = YEAR(NOW());
    SELECT COUNT(*) + 1 INTO v_count
      FROM certificates
     WHERE YEAR(issued_at) = YEAR(NOW());
    SET v_seq = LPAD(v_count, 4, '0');
    SET NEW.certificate_code = CONCAT('CERT-JA-', v_year, '-', v_seq);
  END IF;
END //

-- [T2] Rifresho progress_percent pas çdo mësimi të kryer
CREATE TRIGGER trg_lesson_progress_refresh
AFTER UPDATE ON lesson_progress
FOR EACH ROW
BEGIN
  DECLARE v_total    INT;
  DECLARE v_done     INT;
  DECLARE v_progress DECIMAL(5,2);

  IF NEW.is_completed != OLD.is_completed THEN
    SELECT c.lessons_count INTO v_total
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
     WHERE e.id = NEW.enrollment_id;

    IF v_total IS NOT NULL AND v_total > 0 THEN
      SELECT COUNT(*) INTO v_done
        FROM lesson_progress
       WHERE enrollment_id = NEW.enrollment_id
         AND is_completed = 1;

      SET v_progress = ROUND((v_done / v_total) * 100, 2);

      UPDATE enrollments
         SET progress_percent = v_progress,
             status           = CASE WHEN v_progress >= 100 THEN 'perfunduar' ELSE 'aktiv' END,
             completed_at     = CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END
       WHERE id = NEW.enrollment_id;
    END IF;
  END IF;
END //

-- [T3] Lësh certifikatë automatikisht kur enrollment kalon 'perfunduar'
CREATE TRIGGER trg_auto_issue_certificate
AFTER UPDATE ON enrollments
FOR EACH ROW
BEGIN
  DECLARE v_instructor_name VARCHAR(255);
  DECLARE v_cert_exists     INT;

  IF NEW.status = 'perfunduar' AND OLD.status != 'perfunduar' THEN
    SELECT COUNT(*) INTO v_cert_exists
      FROM certificates
     WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

    IF v_cert_exists = 0 THEN
      SELECT i.full_name INTO v_instructor_name
        FROM courses c
        JOIN instructors i ON i.id = c.instructor_id
       WHERE c.id = NEW.course_id;

      INSERT INTO certificates (user_id, course_id, instructor_signature_name)
      VALUES (NEW.user_id, NEW.course_id, v_instructor_name);
    END IF;
  END IF;
END //

-- [T4] students_count +1 me enrollment të ri
CREATE TRIGGER trg_enrollment_students_inc
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
  UPDATE courses SET students_count = students_count + 1 WHERE id = NEW.course_id;
END //

-- [T5] students_count -1 me fshirje enrollment
CREATE TRIGGER trg_enrollment_students_dec
AFTER DELETE ON enrollments
FOR EACH ROW
BEGIN
  UPDATE courses
     SET students_count = GREATEST(students_count - 1, 0)
   WHERE id = OLD.course_id;
END //

-- [T6] lessons_count +1 me mësim të ri
CREATE TRIGGER trg_lesson_lessons_inc
AFTER INSERT ON lessons
FOR EACH ROW
BEGIN
  UPDATE courses SET lessons_count = lessons_count + 1 WHERE id = NEW.course_id;
END //

-- [T7] lessons_count -1 me fshirje mësimi
CREATE TRIGGER trg_lesson_lessons_dec
AFTER DELETE ON lessons
FOR EACH ROW
BEGIN
  UPDATE courses
     SET lessons_count = GREATEST(lessons_count - 1, 0)
   WHERE id = OLD.course_id;
END //

-- [T8] Krijo notification_settings + user_settings me user të ri
CREATE TRIGGER trg_init_user_preferences
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO notification_settings (user_id) VALUES (NEW.id);
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
END //

DELIMITER ;
