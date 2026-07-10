USE appjonacademy_db;

-- Course 2
INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 1 — Fillimi i Rrugëtimit', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 1 ( VIP )', NULL, 2700, 0, 1),
(@sec, 2, 'Hipnoza për ''Mendimet negative, bindjet e vjetra dhe pengesat e brendshme''. ( VIP )', NULL, 1320, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 1 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 2 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 3 ( VIP )', NULL, 600, 0, 5);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 2 — Fëmija i Brendshëm', 2);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 2 ( VIP )', NULL, 3000, 0, 1),
(@sec, 2, 'Hipnoza carousel,fëmija i brëndshëm ( VIP )', NULL, 1500, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 4 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 5 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 6 ( VIP )', NULL, 600, 0, 5);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 3 — Vizionimi i së Ardhmes', 3);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 3 ( VIP )', NULL, 2880, 0, 1),
(@sec, 2, 'Vizualizim''Treni i se ardhmes'' ( VIP )', NULL, 1200, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 7 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 8 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 9 ( VIP )', NULL, 600, 0, 5),
(@sec, 2, 'Përtej Limiteve — Detyra 10 ( VIP )', NULL, 600, 0, 6);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 4 — Libraria e Vetëbesimit', 4);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 4 ( VIP )', NULL, 3120, 0, 1),
(@sec, 2, 'Hipnoze''Libraria e Vetebesimit'' ( VIP )', NULL, 1440, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 11 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 12 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 13 ( VIP )', NULL, 600, 0, 5),
(@sec, 2, 'Përtej Limiteve — Detyra 14 ( VIP )', NULL, 600, 0, 6),
(@sec, 2, 'Përtej Limiteve — Detyra 15 ( VIP )', NULL, 600, 0, 7),
(@sec, 2, 'Përtej Limiteve — Detyra 16 ( VIP )', NULL, 600, 0, 8),
(@sec, 2, 'Përtej Limiteve — Detyra 17 ( VIP )', NULL, 600, 0, 9);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 5 — Udhëtimi Drejt Shpirtit', 5);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 5 ( VIP )', NULL, 3300, 0, 1),
(@sec, 2, 'Meditim ''Udhëtimi drejt shpirtit'' ( VIP )', NULL, 1320, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 18 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 19 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 20 ( VIP )', NULL, 600, 0, 5),
(@sec, 2, 'Përtej Limiteve — Detyra 21 ( VIP )', NULL, 600, 0, 6);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 6 — Kanalizimi i Energjisë', 6);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 6 ( VIP )', NULL, 3000, 0, 1),
(@sec, 2, 'Vizualizim "Kanalizim energjie" ( VIP )', NULL, 1200, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 22 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 23 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 24 ( VIP )', NULL, 600, 0, 5);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 7 — Liria Emocionale', 7);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 7 ( VIP )', NULL, 2880, 0, 1),
(@sec, 2, 'Vizualizim për ''Liri emocionale '' ( VIP )', NULL, 1200, 0, 2),
(@sec, 2, 'Përtej Limiteve — Detyra 25 ( VIP )', NULL, 600, 0, 3),
(@sec, 2, 'Përtej Limiteve — Detyra 26 ( VIP )', NULL, 600, 0, 4),
(@sec, 2, 'Përtej Limiteve — Detyra 27 ( VIP )', NULL, 600, 0, 5);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seanca 8 — Transformimi Final', 8);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve — Seanca 8 ( VIP )', NULL, 3600, 0, 1),
(@sec, 2, 'Përtej Limiteve — Detyra 28 ( VIP )', NULL, 600, 0, 2),
(@sec, 2, 'Vizualizimi ''Lidhja me engjëjt'' ( VIP )', NULL, 1500, 0, 3);

INSERT INTO course_sections (course_id, title, order_index) VALUES (2, 'Seminar Bonus', 9);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 2, 'Përtej Limiteve Njerëzor — Bonus 1', NULL, 1800, 0, 1),
(@sec, 2, 'Përtej Limiteve Njerëzor — Bonus 2', NULL, 1800, 0, 2),
(@sec, 2, 'Përtej Limiteve Njerëzor — Bonus 3', NULL, 1800, 0, 3),
(@sec, 2, 'Përtej Limiteve Njerëzor — Bonus 4', NULL, 1800, 0, 4);

-- Course 3
INSERT INTO course_sections (course_id, title, order_index) VALUES (3, 'Seanca 1 (74 min)', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 3, 'Ankthi — Seanca 1', '1UK1uft7JX2jbc1qhcpgytM4NT27ht_Ku', 4440, 0, 1),
(@sec, 3, 'Ankthi — Detyra 1', NULL, 60, 0, 2),
(@sec, 3, 'Ankthi — Detyra 2', NULL, 120, 0, 3),
(@sec, 3, 'Ankthi — Detyra 3', NULL, 60, 0, 4);

INSERT INTO course_sections (course_id, title, order_index) VALUES (3, 'Seanca 2 (53 min)', 2);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 3, 'Ankthi — Seanca 2', NULL, 3180, 0, 1),
(@sec, 3, 'Hipnoza për mendimet negative...', NULL, 1500, 0, 2),
(@sec, 3, 'Ankthi — Detyra 4', NULL, 180, 0, 3),
(@sec, 3, 'Ankthi — Detyra 5', NULL, 60, 0, 4),
(@sec, 3, 'Ankthi — Detyra 6', NULL, 60, 0, 5),
(@sec, 3, 'Ankthi — Detyra 7', NULL, 60, 0, 6),
(@sec, 3, 'Ankthi — Detyra 8', NULL, 240, 0, 7),
(@sec, 3, 'Ankthi — Detyra 9', NULL, 60, 0, 8);

INSERT INTO course_sections (course_id, title, order_index) VALUES (3, 'Seanca 3 (73 min)', 3);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 3, 'Ankthi — Seanca 3', NULL, 4380, 0, 1),
(@sec, 3, 'Hipnoza për fëmijën e brendshëm dhe faljen', NULL, 1500, 0, 2),
(@sec, 3, 'Ankthi — Detyra 10', NULL, 120, 0, 3),
(@sec, 3, 'Ankthi — Detyra 11', NULL, 60, 0, 4),
(@sec, 3, 'Ankthi — Detyra 12', NULL, 60, 0, 5),
(@sec, 3, 'Ankthi — Detyra 13', NULL, 60, 0, 6),
(@sec, 3, 'Ankthi — Detyra 14', NULL, 60, 0, 7),
(@sec, 3, 'Ankthi — Detyra 15', NULL, 120, 0, 8),
(@sec, 3, 'Ankthi — Detyra 16', NULL, 120, 0, 9),
(@sec, 3, 'Ankthi — Detyra 17', NULL, 60, 0, 10),
(@sec, 3, 'Ankthi — Detyra 18', NULL, 60, 0, 11),
(@sec, 3, 'Ankthi — Detyra 19', NULL, 60, 0, 12),
(@sec, 3, 'Ankthi — Detyra 20', NULL, 60, 0, 13);

INSERT INTO course_sections (course_id, title, order_index) VALUES (3, 'Seanca 4 (46 min)', 4);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 3, 'Ankthi — Seanca 4', NULL, 2760, 0, 1),
(@sec, 3, 'Hipnoza për rritje të vetëbesimit', NULL, 1500, 0, 2),
(@sec, 3, 'Ankthi — Detyra 21', NULL, 60, 0, 3),
(@sec, 3, 'Ankthi — Detyra 22', NULL, 120, 0, 4),
(@sec, 3, 'Ankthi — Detyra 23', NULL, 60, 0, 5),
(@sec, 3, 'Ankthi — Detyra 24', NULL, 60, 0, 6),
(@sec, 3, 'Ankthi — Detyra 25', NULL, 60, 0, 7);

INSERT INTO course_sections (course_id, title, order_index) VALUES (3, 'Seanca 5 (1 orë)', 5);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 3, 'Ankthi — Seanca 5', NULL, 3600, 0, 1),
(@sec, 3, 'Vizualizim për liri emocionale!', NULL, 1200, 0, 2);

INSERT INTO course_sections (course_id, title, order_index) VALUES (3, 'Seminar Bonus', 6);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 3, 'Menaxho Ankthin — BONUS 1', NULL, 1200, 0, 1),
(@sec, 3, 'Menaxho Ankthin — BONUS 2', NULL, 1200, 0, 2),
(@sec, 3, 'Menaxho Ankthin — BONUS 3', NULL, 1200, 0, 3),
(@sec, 3, 'Menaxho Ankthin — BONUS 4', NULL, 1200, 0, 4),
(@sec, 3, 'Menaxho Ankthin — BONUS 5', NULL, 1200, 0, 5),
(@sec, 3, 'Menaxho Ankthin — BONUS 6', NULL, 1200, 0, 6);

-- Course 4
INSERT INTO course_sections (course_id, title, order_index) VALUES (4, 'Materialet', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 4, 'Ankthi — Seanca 1 ( VIP )', NULL, 4440, 0, 1),
(@sec, 4, 'Ankthi — Detyra 1 ( VIP )', NULL, 60, 0, 2),
(@sec, 4, 'Ankthi — Detyra 2 ( VIP )', NULL, 120, 0, 3),
(@sec, 4, 'Ankthi — Detyra 3 ( VIP )', NULL, 60, 0, 4),
(@sec, 4, 'Ankthi — Seanca 2 ( VIP )', NULL, 3180, 0, 5),
(@sec, 4, 'Hipnoza për mendimet negative... ( VIP )', NULL, 0, 0, 6),
(@sec, 4, 'Ankthi — Detyra 4 ( VIP )', NULL, 180, 0, 7),
(@sec, 4, 'Ankthi — Detyra 5 ( VIP )', NULL, 60, 0, 8),
(@sec, 4, 'Ankthi — Detyra 6 ( VIP )', NULL, 60, 0, 9),
(@sec, 4, 'Ankthi — Detyra 7 ( VIP )', NULL, 60, 0, 10),
(@sec, 4, 'Ankthi — Detyra 8 ( VIP )', NULL, 240, 0, 11),
(@sec, 4, 'Ankthi — Detyra 9 ( VIP )', NULL, 60, 0, 12),
(@sec, 4, 'Ankthi — Seanca 3 ( VIP )', NULL, 4380, 0, 13),
(@sec, 4, 'Hipnoza për fëmijën e brendshëm dhe faljen ( VIP )', NULL, 0, 0, 14),
(@sec, 4, 'Ankthi — Detyra 10 ( VIP )', NULL, 120, 0, 15),
(@sec, 4, 'Ankthi — Detyra 11 ( VIP )', NULL, 60, 0, 16),
(@sec, 4, 'Ankthi — Detyra 12 ( VIP )', NULL, 60, 0, 17),
(@sec, 4, 'Ankthi — Detyra 13 ( VIP )', NULL, 60, 0, 18),
(@sec, 4, 'Ankthi — Detyra 14 ( VIP )', NULL, 60, 0, 19),
(@sec, 4, 'Ankthi — Detyra 15 ( VIP )', NULL, 120, 0, 20),
(@sec, 4, 'Ankthi — Detyra 16 ( VIP )', NULL, 120, 0, 21),
(@sec, 4, 'Ankthi — Detyra 17 ( VIP )', NULL, 60, 0, 22),
(@sec, 4, 'Ankthi — Detyra 18 ( VIP )', NULL, 60, 0, 23),
(@sec, 4, 'Ankthi — Detyra 19 ( VIP )', NULL, 60, 0, 24),
(@sec, 4, 'Ankthi — Detyra 20 ( VIP )', NULL, 60, 0, 25),
(@sec, 4, 'Ankthi — Seanca 4 ( VIP )', NULL, 2760, 0, 26),
(@sec, 4, 'Hipnoza për rritje të vetëbesimit ( VIP )', NULL, 0, 0, 27),
(@sec, 4, 'Ankthi — Detyra 21 ( VIP )', NULL, 60, 0, 28),
(@sec, 4, 'Ankthi — Detyra 22 ( VIP )', NULL, 120, 0, 29),
(@sec, 4, 'Ankthi — Detyra 23 ( VIP )', NULL, 60, 0, 30),
(@sec, 4, 'Ankthi — Detyra 24 ( VIP )', NULL, 60, 0, 31),
(@sec, 4, 'Ankthi — Detyra 25 ( VIP )', NULL, 60, 0, 32),
(@sec, 4, 'Ankthi — Seanca 5 ( VIP )', NULL, 3600, 0, 33),
(@sec, 4, 'Vizualizim për liri emocionale! ( VIP )', NULL, 0, 0, 34);

-- Course 5
INSERT INTO course_sections (course_id, title, order_index) VALUES (5, 'Materialet', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 5, 'Pjesa 1', NULL, 5580, 0, 1),
(@sec, 5, 'Pjesa 2', NULL, 3120, 0, 2),
(@sec, 5, 'Pjesa 3', NULL, 4380, 0, 3);

-- Course 6
INSERT INTO course_sections (course_id, title, order_index) VALUES (6, 'Seminari', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 6, 'BIZNESI, KARRIERA FINANSAT EMIGRIMI, BLLOKIMET FINANCIARE, PAVARËSIA FINANCIARE', NULL, 9060, 0, 1);

-- Course 7
INSERT INTO course_sections (course_id, title, order_index) VALUES (7, 'Seminari', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 7, 'PRINDËR POZITIV SI TË JEM NJË PRIND I VETËDIJSHËM, ANKTHI TE FËMIJËT, SHPËRTHIMET EMOCIONALE TE ADOLESHENTËT', NULL, 6480, 0, 1);

-- Course 8
INSERT INTO course_sections (course_id, title, order_index) VALUES (8, 'Seminari', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 8, 'Shëro traumat dhe bllokimet emocionale', NULL, 8280, 0, 1);

-- Course 9
INSERT INTO course_sections (course_id, title, order_index) VALUES (9, 'Seminari', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 9, 'Si të ndërtojmë vetëbesim të hekurt', NULL, 9060, 0, 1);

-- Course 10
INSERT INTO course_sections (course_id, title, order_index) VALUES (10, 'Seminari', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 10, 'Si të shkruaj një libër hap pas hapi deri te botimi', NULL, 7260, 0, 1);

-- Course 11
INSERT INTO course_sections (course_id, title, order_index) VALUES (11, 'Seminari', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 11, 'Ankthi dhe problemet e shëndetit mendor', NULL, 9180, 0, 1);

-- Course 12
INSERT INTO course_sections (course_id, title, order_index) VALUES (12, 'Materialet', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Seanca 1', NULL, 1320, 0, 1),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Detyra 1', NULL, 120, 0, 2),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Seanca 2', NULL, 1620, 0, 3),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Detyra 2', NULL, 180, 0, 4),
(@sec, 12, 'Hipnoza për ''Mendimet negative''', NULL, 1500, 0, 5),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Seanca 3', NULL, 720, 0, 6),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Detyra 3', NULL, 180, 0, 7),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Seanca 4', NULL, 1320, 0, 8),
(@sec, 12, 'Zhvillim personal niveli "Fillestar"- Detyra 4', NULL, 120, 0, 9),
(@sec, 12, 'Përmbledhje', NULL, 240, 0, 10);

-- Course 13
INSERT INTO course_sections (course_id, title, order_index) VALUES (13, 'Materialet', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 13, 'Zhvillim personal niveli Mesatar — Seanca 1', NULL, 1020, 0, 1),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Detyra 1', NULL, 60, 0, 2),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Seanca 2', NULL, 1740, 0, 3),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Detyra 2', NULL, 420, 0, 4),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Seanca 3', NULL, 780, 0, 5),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Detyra 3', NULL, 180, 0, 6),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Seanca 4', NULL, 420, 0, 7),
(@sec, 13, 'Zhvillim personal niveli Mesatar — Detyra 4', NULL, 120, 0, 8),
(@sec, 13, 'Hipnoza për ''Rritjen e vetëbesimit''', NULL, 1080, 0, 9);

-- Course 14
INSERT INTO course_sections (course_id, title, order_index) VALUES (14, 'Materialet', 1);
SET @sec := LAST_INSERT_ID();
INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Seanca 1', NULL, 1320, 0, 1),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Detyra 1', NULL, 60, 0, 2),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Seanca 2', NULL, 1620, 0, 3),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Detyra 2', NULL, 240, 0, 4),
(@sec, 14, 'Hipnoza për ''Mendimet negative, bindjet e vjetra dhe pengesat e brendshme''', NULL, 900, 0, 5),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Seanca 3', NULL, 1140, 0, 6),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Detyra 3', NULL, 120, 0, 7),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Seanca 4', NULL, 1740, 0, 8),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Detyra 4', NULL, 120, 0, 9),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Seanca 5', NULL, 1140, 0, 10),
(@sec, 14, 'Zhvillim personal niveli i "Avancuar"- Detyra 5', NULL, 60, 0, 11),
(@sec, 14, 'Vizualizim — E ardhmja', NULL, 600, 0, 12);

