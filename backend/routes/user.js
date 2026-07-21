const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/user/me — profili i userit
router.get('/me', auth, async (req, res) => {
  try {
    const [[user]] = await db.query(
      'SELECT id, full_name, email, avatar_url, membership_type, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// GET /api/user/enrollments — kurset e regjistruara
router.get('/enrollments', auth, async (req, res) => {
  try {
    const [enrollments] = await db.query(`
      SELECT e.id AS enrollment_id, e.progress_percent, e.status AS enrollment_status, e.enrolled_at,
             c.*, i.full_name AS instructor_name, cat.name AS category_name, cat.icon AS category_icon
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      JOIN instructors i ON i.id = c.instructor_id
      JOIN categories cat ON cat.id = c.category_id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [req.user.id]);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// GET /api/user/certificates — certifikatat
router.get('/certificates', auth, async (req, res) => {
  try {
    const [certs] = await db.query(`
      SELECT cert.*, c.title AS course_title
      FROM certificates cert
      JOIN courses c ON c.id = cert.course_id
      WHERE cert.user_id = ?
      ORDER BY cert.issued_at DESC
    `, [req.user.id]);
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// PATCH /api/user/profile — ndrysho emrin
router.patch('/profile', auth, async (req, res) => {
  const { full_name } = req.body;
  if (!full_name || !full_name.trim())
    return res.status(400).json({ error: 'Emri nuk mund të jetë bosh' });

  try {
    await db.query('UPDATE users SET full_name = ? WHERE id = ?', [full_name.trim(), req.user.id]);
    res.json({ success: true, full_name: full_name.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// PATCH /api/user/email — ndrysho email-in (kërkon fjalëkalimin aktual)
router.patch('/email', auth, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email dhe fjalëkalimi janë të detyrueshëm' });

  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Fjalëkalimi është i gabuar' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
    if (existing.length > 0) return res.status(409).json({ error: 'Ky email është tashmë në përdorim' });

    await db.query('UPDATE users SET email = ? WHERE id = ?', [email, req.user.id]);
    res.json({ success: true, email });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// PATCH /api/user/password — ndrysho fjalëkalimin
router.patch('/password', auth, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ error: 'Të gjitha fushat janë të detyrueshme' });
  if (new_password.length < 6)
    return res.status(400).json({ error: 'Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere' });

  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(current_password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Fjalëkalimi aktual është i gabuar' });

    const hash = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// GET /api/user/subscription — abonimi aktiv (nëse ka)
router.get('/subscription', auth, async (req, res) => {
  try {
    const [[sub]] = await db.query(`
      SELECT s.*, p.name AS plan_name, p.price, p.billing_cycle
      FROM subscriptions s
      JOIN subscription_plans p ON p.id = s.plan_id
      WHERE s.user_id = ? AND s.status = 'aktiv'
      ORDER BY s.started_at DESC LIMIT 1
    `, [req.user.id]);
    res.json(sub || null);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// POST /api/user/enrollments — regjistrim në kurs pas pagesës
router.post('/enrollments', auth, async (req, res) => {
  const { course_id } = req.body;
  if (!course_id) return res.status(400).json({ error: 'course_id është i detyrueshëm' });

  try {
    const [[course]] = await db.query('SELECT id, price FROM courses WHERE id = ?', [course_id]);
    if (!course) return res.status(404).json({ error: 'Kursi nuk u gjet' });

    await db.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id',
      [req.user.id, course_id]
    );
    await db.query(
      'INSERT INTO payments (user_id, course_id, amount, status) VALUES (?, ?, ?, ?)',
      [req.user.id, course_id, course.price, 'i_suksesshem']
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// POST /api/user/subscriptions — abonim pas pagesës
router.post('/subscriptions', auth, async (req, res) => {
  const { plan_id } = req.body;
  if (!plan_id) return res.status(400).json({ error: 'plan_id është i detyrueshëm' });

  try {
    const [[plan]] = await db.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id]);
    if (!plan) return res.status(404).json({ error: 'Plani nuk u gjet' });

    const renewInterval = plan.billing_cycle === 'yearly' ? 'INTERVAL 1 YEAR' : 'INTERVAL 1 MONTH';
    const [result] = await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, renews_at) VALUES (?, ?, 'aktiv', DATE_ADD(NOW(), ${renewInterval}))`,
      [req.user.id, plan_id]
    );
    await db.query(
      'INSERT INTO payments (user_id, subscription_id, amount, status) VALUES (?, ?, ?, ?)',
      [req.user.id, result.insertId, plan.price, 'i_suksesshem']
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// GET /api/user/notification-settings
router.get('/notification-settings', auth, async (req, res) => {
  try {
    const [[settings]] = await db.query(
      'SELECT new_courses, lesson_reminders, offers_promotions, certificates, messages FROM notification_settings WHERE user_id = ?',
      [req.user.id]
    );
    res.json(settings || { new_courses: 1, lesson_reminders: 1, offers_promotions: 0, certificates: 1, messages: 1 });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// PATCH /api/user/notification-settings
router.patch('/notification-settings', auth, async (req, res) => {
  const { new_courses, lesson_reminders, offers_promotions, certificates, messages } = req.body;
  try {
    await db.query(`
      INSERT INTO notification_settings (user_id, new_courses, lesson_reminders, offers_promotions, certificates, messages)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        new_courses = VALUES(new_courses),
        lesson_reminders = VALUES(lesson_reminders),
        offers_promotions = VALUES(offers_promotions),
        certificates = VALUES(certificates),
        messages = VALUES(messages)
    `, [req.user.id, new_courses ? 1 : 0, lesson_reminders ? 1 : 0, offers_promotions ? 1 : 0, certificates ? 1 : 0, messages ? 1 : 0]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// GET /api/user/notifications — njoftimet e userit
router.get('/notifications', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, type, titulli, mesazhi, lexuar, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// PATCH /api/user/notifications/read-all — shëno të gjitha si të lexuara
router.patch('/notifications/read-all', auth, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET lexuar = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// PATCH /api/user/notifications/:id/read — shëno një njoftim si të lexuar
router.patch('/notifications/:id/read', auth, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET lexuar = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// DELETE /api/user/notifications/:id
router.delete('/notifications/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

module.exports = router;
