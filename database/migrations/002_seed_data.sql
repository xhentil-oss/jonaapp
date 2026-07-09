-- =============================================================================
-- JONA ACADEMY — Seed Data
-- Migrim: 002_seed_data.sql
-- Kategoritë, Instruktorët, Planet e Abonimit, Kurset kryesore
-- =============================================================================

-- =============================================================================
-- INSTRUKTORËT
-- =============================================================================

INSERT INTO instructors (id, full_name, bio, avatar_url) VALUES
(1, 'Fatjona Cici',
 'Trajnere e çertifikuar në zhvillim personal, hipnozë dhe neuro-shkencë. Krijuese e trajnimit "PËRTEJ LIMITEVE NJERËZOR" — trajnimi më i fuqishëm në Shqipëri që trajton çdo aspekt të jetës: trup, mendje dhe shpirt.',
 '/instructors/fatjona-cici.webp');

SELECT setval('instructors_id_seq', (SELECT MAX(id) FROM instructors));

-- =============================================================================
-- KATEGORITË (9 kategori)
-- =============================================================================

INSERT INTO categories (id, name, icon, color) VALUES
(1, 'Motivim',          '🔥', '#7A4F2D'),
(2, 'Shëndet',          '💪', '#4A9B6F'),
(3, 'Mirëqenie',        '🧘', '#0EA5E9'),
(4, 'Jetesë',           '✨', '#D4904A'),
(5, 'Zhvillim Personal','🎯', '#6366F1'),
(6, 'Biznes',           '💼', '#C0392B'),
(7, 'Familje',          '👨‍👩‍👧', '#E67E22'),
(8, 'Krijimtari',       '📖', '#8E44AD'),
(9, 'Psikologji',       '🧠', '#2980B9');

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- =============================================================================
-- PLANET E ABONIMIT
-- =============================================================================

INSERT INTO subscription_plans (id, name, price, billing_cycle, discount_percent, features) VALUES
(1, 'Plani Mujor',  29.00, 'monthly', 0,
  '["Qasje e plotë në të gjitha kurset premium", "Shkarkim offline", "Certifikata", "Mbështetje prioritare"]'::jsonb),
(2, 'Plani Vjetor', 199.00, 'yearly', 43,
  '["Gjithçka nga Plani Mujor", "43% kursim krahasuar me mujor", "Seancë falas 1:1 me instruktoren", "Qasje e hershme te kurset e reja"]'::jsonb);

SELECT setval('subscription_plans_id_seq', (SELECT MAX(id) FROM subscription_plans));

-- =============================================================================
-- KURSET (15 kurse)
-- =============================================================================

INSERT INTO courses (id, title, short_description, category_id, instructor_id,
                     level, duration_minutes, price, access_type,
                     cover_image_url, is_featured, is_new, students_count, lessons_count)
VALUES

-- 1. Përtej Limiteve — Standard
(1,  'Trajnimi "PËRTEJ LIMITEVE NJERËZOR"',
     'Trajnimi më i fuqishëm dhe i vetmi në Shqipëri që trajton me detaje çdo aspekt të jetës — trup, mendje dhe shpirt.',
     1, 1, 'te_gjitha_nivelet', 390, 499.00, 'premium',
     '/jona-1.webp', TRUE, FALSE, 0, 54),

-- 2. Përtej Limiteve — VIP
(2,  'Trajnimi "PËRTEJ LIMITEVE NJERËZOR" – VIP',
     'Paketa VIP me akses të plotë, mentorim personal 1:1 dhe mbështetje 30 ditë pas trajnimit.',
     1, 1, 'te_gjitha_nivelet', 390, 999.00, 'vip',
     '/jona-2.webp', TRUE, FALSE, 0, 48),

-- 3. RESTART 2026
(3,  'RESTART 2026',
     'Rifillo vitin me qëllim, energji dhe plan konkret. Lëre të kaluarën dhe ndez të ardhmen.',
     5, 1, 'fillestare', 180, 149.00, 'premium',
     '/jona-3.webp', TRUE, TRUE, 0, 24),

-- 4. Komunikimi Efektiv
(4,  'Komunikimi Efektiv',
     'Mëso të komunikosh me besim, të vendosësh kufij dhe të ndërtosh marrëdhënie të shëndetshme.',
     5, 1, 'fillestare', 210, 179.00, 'premium',
     '/jona-4.webp', FALSE, FALSE, 0, 20),

-- 5. Menaxhimi i Stresit
(5,  'Menaxhimi i Stresit',
     'Teknika praktike për të reduktuar stresin, ankthit dhe tensionit të përditshëm.',
     3, 1, 'fillestare', 150, 129.00, 'premium',
     '/jona-5.webp', FALSE, FALSE, 0, 18),

-- 6. Zhvillim Personal – Niveli Fillestar
(6,  'Zhvillim Personal – Niveli Fillestar',
     'Bazat e zhvillimit personal: vetënjohja, zakonet dhe mindset-i i suksesit.',
     5, 1, 'fillestare', 240, 99.00, 'premium',
     '/jona-6.webp', FALSE, FALSE, 0, 30),

-- 7. Zhvillim Personal – Niveli Mesatar
(7,  'Zhvillim Personal – Niveli Mesatar',
     'Thello njohuritë: inteligjenca emocionale, lidershipi personal dhe produktiviteti.',
     5, 1, 'mesatar', 270, 149.00, 'premium',
     '/jona-7.webp', FALSE, FALSE, 0, 32),

-- 8. Zhvillim Personal – Niveli Avancuar
(8,  'Zhvillim Personal – Niveli Avancuar',
     'Masterclass: transformimi i thellë, manifestimi dhe gjetja e misionit të jetës.',
     5, 1, 'avancuar', 300, 199.00, 'premium',
     '/jona-8.webp', FALSE, FALSE, 0, 36),

-- 9. Shëndeti Holistik
(9,  'Shëndeti Holistik',
     'Kujdesuni ndaj trupit, mendjes dhe shpirtit me qasje gjithëpërfshirëse.',
     2, 1, 'fillestare', 180, 99.00, 'premium',
     '/jona-9.webp', FALSE, FALSE, 0, 22),

-- 10. Psikologjia e Suksesit
(10, 'Psikologjia e Suksesit',
     'Kuptoni se si funksionon mendja dhe si t\'i programoni për sukses.',
     9, 1, 'mesatar', 210, 149.00, 'premium',
     '/jona-10.webp', FALSE, FALSE, 0, 25),

-- 11. Marrëdhëniet dhe Familja
(11, 'Marrëdhëniet dhe Familja',
     'Ndërtoni lidhje të shëndetshme familjare dhe romantike bazuar në dashuri dhe respekt.',
     7, 1, 'te_gjitha_nivelet', 180, 129.00, 'premium',
     '/jona-11.webp', FALSE, FALSE, 0, 20),

-- 12. Biznes dhe Sipërmarrje
(12, 'Biznes dhe Sipërmarrje',
     'Nga idea tek biznesi: mentaliteti i sipërmarrësit, planifikimi dhe lidershipi.',
     6, 1, 'mesatar', 240, 199.00, 'premium',
     '/jona-12.webp', FALSE, FALSE, 0, 28),

-- 13. Krijimtaria dhe Vetëshprehja
(13, 'Krijimtaria dhe Vetëshprehja',
     'Zbuloni potencialin krijues, shprehni veten lirshëm dhe ndërtoni identitetin tuaj.',
     8, 1, 'fillestare', 150, 99.00, 'premium',
     '/jona-13.webp', FALSE, FALSE, 0, 16),

-- 14. Menaxho Ankthin dhe Frikën
(14, 'Menaxho Ankthin dhe Frikën',
     'Teknika të provuara për të kapërcyer frikën, ankthin dhe bllokimet mendore.',
     9, 1, 'fillestare', 180, 129.00, 'premium',
     '/jona-14.webp', FALSE, TRUE, 0, 18),

-- 15. Jona VIP Club
(15, 'Jona VIP Club',
     'Aksesi ekskluziv VIP: sesione live mujore, komunitet privat dhe materialet premium.',
     1, 1, 'te_gjitha_nivelet', 0, 1499.00, 'vip',
     '/jona-15.webp', TRUE, TRUE, 0, 0);

SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));

-- =============================================================================
-- SEKSIONET DHE MËSIMET — Kursi 1: "PËRTEJ LIMITEVE NJERËZOR"
-- =============================================================================

INSERT INTO course_sections (id, course_id, title, order_index) VALUES
(101, 1, 'Seanca 1 — Fillimi i Rrugëtimit',     1),
(102, 1, 'Seanca 2 — Fëmija i Brendshëm',        2),
(103, 1, 'Seanca 3 — Vizionimi i së Ardhmes',    3),
(104, 1, 'Seanca 4 — Libraria e Vetëbesimit',     4),
(105, 1, 'Seanca 5 — Udhëtimi Drejt Shpirtit',   5),
(106, 1, 'Seanca 6 — Kanalizimi i Energjisë',    6),
(107, 1, 'Seanca 7 — Liria Emocionale',          7),
(108, 1, 'Seanca 8 — Transformimi Final',        8);

SELECT setval('course_sections_id_seq', (SELECT MAX(id) FROM course_sections));

INSERT INTO lessons (id, section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
-- Seanca 1
(1,  101, 1, 'Përtej Limiteve — Seanca 1',                                                          '1UK1uft7JX2jbc1qhcpgytM4NT27ht_Ku', 2700, TRUE,  1),
(2,  101, 1, 'Hipnoza për ''Mendimet negative, bindjet e vjetra dhe pengesat e brendshme''',         '1osKk4awhW9iNYxlLqoj_WintsweHyoIS', 1320, FALSE, 2),
(3,  101, 1, 'Përtej Limiteve — Detyra 1',                                                          NULL,                                  600, FALSE, 3),
(4,  101, 1, 'Përtej Limiteve — Detyra 2',                                                          NULL,                                  600, FALSE, 4),
(5,  101, 1, 'Përtej Limiteve — Detyra 3',                                                          NULL,                                  600, FALSE, 5),
-- Seanca 2
(6,  102, 1, 'Përtej Limiteve — Seanca 2',                                                          NULL, 3000, FALSE, 1),
(7,  102, 1, 'Hipnoza carousel, fëmija i brendshëm',                                                NULL, 1500, FALSE, 2),
(8,  102, 1, 'Përtej Limiteve — Detyra 4',                                                          NULL,  600, FALSE, 3),
(9,  102, 1, 'Përtej Limiteve — Detyra 5',                                                          NULL,  600, FALSE, 4),
(10, 102, 1, 'Përtej Limiteve — Detyra 6',                                                          NULL,  600, FALSE, 5),
-- Seanca 3
(11, 103, 1, 'Përtej Limiteve — Seanca 3',                                                          NULL, 2880, FALSE, 1),
(12, 103, 1, 'Vizualizim ''Treni i së Ardhmes''',                                                   NULL, 1200, FALSE, 2),
(13, 103, 1, 'Përtej Limiteve — Detyra 7',                                                          NULL,  600, FALSE, 3),
(14, 103, 1, 'Përtej Limiteve — Detyra 8',                                                          NULL,  600, FALSE, 4),
(15, 103, 1, 'Përtej Limiteve — Detyra 9',                                                          NULL,  600, FALSE, 5),
(16, 103, 1, 'Përtej Limiteve — Detyra 10',                                                         NULL,  600, FALSE, 6),
-- Seanca 4
(17, 104, 1, 'Përtej Limiteve — Seanca 4',                                                          NULL, 3120, FALSE, 1),
(18, 104, 1, 'Hipnozë ''Libraria e Vetëbesimit''',                                                   NULL, 1440, FALSE, 2),
(19, 104, 1, 'Përtej Limiteve — Detyra 11',                                                         NULL,  600, FALSE, 3),
(20, 104, 1, 'Përtej Limiteve — Detyra 12',                                                         NULL,  600, FALSE, 4),
(21, 104, 1, 'Përtej Limiteve — Detyra 13',                                                         NULL,  600, FALSE, 5),
(22, 104, 1, 'Përtej Limiteve — Detyra 14',                                                         NULL,  600, FALSE, 6),
(23, 104, 1, 'Përtej Limiteve — Detyra 15',                                                         NULL,  600, FALSE, 7),
(24, 104, 1, 'Përtej Limiteve — Detyra 16',                                                         NULL,  600, FALSE, 8),
(25, 104, 1, 'Përtej Limiteve — Detyra 17',                                                         NULL,  600, FALSE, 9),
-- Seanca 5
(26, 105, 1, 'Përtej Limiteve — Seanca 5',                                                          NULL, 3300, FALSE, 1),
(27, 105, 1, 'Meditim ''Udhëtimi drejt Shpirtit''',                                                 NULL, 1320, FALSE, 2),
(28, 105, 1, 'Përtej Limiteve — Detyra 18',                                                         NULL,  600, FALSE, 3),
(29, 105, 1, 'Përtej Limiteve — Detyra 19',                                                         NULL,  600, FALSE, 4),
(30, 105, 1, 'Përtej Limiteve — Detyra 20',                                                         NULL,  600, FALSE, 5),
(31, 105, 1, 'Përtej Limiteve — Detyra 21',                                                         NULL,  600, FALSE, 6),
-- Seanca 6
(32, 106, 1, 'Përtej Limiteve — Seanca 6',                                                          NULL, 3000, FALSE, 1),
(33, 106, 1, 'Vizualizim ''Kanalizim Energjie''',                                                    NULL, 1200, FALSE, 2),
(34, 106, 1, 'Përtej Limiteve — Detyra 22',                                                         NULL,  600, FALSE, 3),
(35, 106, 1, 'Përtej Limiteve — Detyra 23',                                                         NULL,  600, FALSE, 4),
(36, 106, 1, 'Përtej Limiteve — Detyra 24',                                                         NULL,  600, FALSE, 5),
-- Seanca 7
(37, 107, 1, 'Përtej Limiteve — Seanca 7',                                                          NULL, 2880, FALSE, 1),
(38, 107, 1, 'Vizualizim për ''Liri Emocionale''',                                                  NULL, 1200, FALSE, 2),
(39, 107, 1, 'Përtej Limiteve — Detyra 25',                                                         NULL,  600, FALSE, 3),
(40, 107, 1, 'Përtej Limiteve — Detyra 26',                                                         NULL,  600, FALSE, 4),
(41, 107, 1, 'Përtej Limiteve — Detyra 27',                                                         NULL,  600, FALSE, 5),
-- Seanca 8
(42, 108, 1, 'Përtej Limiteve — Seanca 8',                                                          NULL, 3600, FALSE, 1),
(43, 108, 1, 'Përtej Limiteve — Detyra 28',                                                         NULL,  600, FALSE, 2),
(44, 108, 1, 'Vizualizimi ''Lidhja me Engjëjt''',                                                   NULL, 1500, FALSE, 3),
(45, 108, 1, 'Materialet Shtesë — Pjesa 1',                                                         NULL,  900, FALSE, 4),
(46, 108, 1, 'Materialet Shtesë — Pjesa 2',                                                         NULL,  900, FALSE, 5),
(47, 108, 1, 'Materialet Shtesë — Pjesa 3',                                                         NULL,  900, FALSE, 6),
(48, 108, 1, 'Materialet Shtesë — Pjesa 4',                                                         NULL,  900, FALSE, 7),
(49, 108, 1, 'Materialet Shtesë — Pjesa 5',                                                         NULL,  900, FALSE, 8),
(50, 108, 1, 'Materialet Shtesë — Pjesa 6',                                                         NULL,  900, FALSE, 9),
(51, 108, 1, 'Materialet Shtesë — Pjesa 7',                                                         NULL,  900, FALSE, 10),
(52, 108, 1, 'Materialet Shtesë — Pjesa 8',                                                         NULL,  900, FALSE, 11),
(53, 108, 1, 'Materialet Shtesë — Pjesa 9',                                                         NULL,  900, FALSE, 12),
(54, 108, 1, 'Përmbyllja dhe Hapat e Ardhshëm',                                                     NULL, 1200, FALSE, 13);

SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));

-- Rifresho lessons_count të kursit 1 (54 mësime u shtuan direkt, triggeri nuk aktivizohet)
UPDATE courses SET lessons_count = 54 WHERE id = 1;
