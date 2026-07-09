const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(auth, requireAdmin);

// ============================================================
// STATS
// ============================================================

router.get('/stats', async (req, res) => {
  try {
    const [[{ totalCourses }]] = await db.query('SELECT COUNT(*) AS totalCourses FROM courses');
    const [[{ totalCategories }]] = await db.query('SELECT COUNT(*) AS totalCategories FROM categories');
    const [[{ totalStudents }]] = await db.query("SELECT COUNT(*) AS totalStudents FROM users WHERE role = 'student'");
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(amount), 0) AS totalRevenue FROM payments WHERE status = 'i_suksesshem'");
    const [[{ totalEnrollments }]] = await db.query('SELECT COUNT(*) AS totalEnrollments FROM enrollments');
    const [[{ activeSubscriptions }]] = await db.query("SELECT COUNT(*) AS activeSubscriptions FROM subscriptions WHERE status = 'aktiv'");

    const [recentEnrollments] = await db.query(`
      SELECT e.id, e.enrolled_at, u.full_name AS student_name, c.title AS course_title
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      JOIN courses c ON c.id = e.course_id
      ORDER BY e.enrolled_at DESC LIMIT 10
    `);

    const [recentUsers] = await db.query(`
      SELECT id, full_name, email, created_at FROM users
      WHERE role = 'student' ORDER BY created_at DESC LIMIT 10
    `);

    res.json({
      totalCourses, totalCategories, totalStudents, totalRevenue,
      totalEnrollments, activeSubscriptions, recentEnrollments, recentUsers,
    });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

// ============================================================
// CATEGORIES
// ============================================================

router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT cat.*, COUNT(c.id) AS courses_count
      FROM categories cat
      LEFT JOIN courses c ON c.category_id = cat.id
      GROUP BY cat.id ORDER BY cat.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.post('/categories', async (req, res) => {
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Emri është i detyrueshëm' });
  try {
    const [result] = await db.query(
      'INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)',
      [name, icon || null, color || null]
    );
    res.status(201).json({ id: result.insertId, name, icon, color });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Kjo kategori ekziston tashmë' });
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.put('/categories/:id', async (req, res) => {
  const { name, icon, color } = req.body;
  try {
    await db.query('UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?', [name, icon, color, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const [[{ cnt }]] = await db.query('SELECT COUNT(*) AS cnt FROM courses WHERE category_id = ?', [req.params.id]);
    if (cnt > 0) return res.status(409).json({ error: `Ka ${cnt} kurse në këtë kategori. Zhvendosi ose fshiji fillimisht.` });
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// ============================================================
// INSTRUCTORS
// ============================================================

router.get('/instructors', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, COUNT(c.id) AS courses_count
      FROM instructors i
      LEFT JOIN courses c ON c.instructor_id = i.id
      GROUP BY i.id ORDER BY i.full_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.post('/instructors', async (req, res) => {
  const { full_name, bio, avatar_url } = req.body;
  if (!full_name) return res.status(400).json({ error: 'Emri është i detyrueshëm' });
  try {
    const [result] = await db.query(
      'INSERT INTO instructors (full_name, bio, avatar_url) VALUES (?, ?, ?)',
      [full_name, bio || null, avatar_url || null]
    );
    res.status(201).json({ id: result.insertId, full_name, bio, avatar_url });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.put('/instructors/:id', async (req, res) => {
  const { full_name, bio, avatar_url } = req.body;
  try {
    await db.query('UPDATE instructors SET full_name = ?, bio = ?, avatar_url = ? WHERE id = ?', [full_name, bio, avatar_url, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.delete('/instructors/:id', async (req, res) => {
  try {
    const [[{ cnt }]] = await db.query('SELECT COUNT(*) AS cnt FROM courses WHERE instructor_id = ?', [req.params.id]);
    if (cnt > 0) return res.status(409).json({ error: `Ka ${cnt} kurse me këtë instruktor. Zhvendosi ose fshiji fillimisht.` });
    await db.query('DELETE FROM instructors WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// ============================================================
// COURSES
// ============================================================

router.get('/courses', async (req, res) => {
  const { search, category_id, level, access_type } = req.query;
  try {
    let sql = `
      SELECT c.*, i.full_name AS instructor_name, cat.name AS category_name, cat.icon AS category_icon
      FROM courses c
      JOIN instructors i ON i.id = c.instructor_id
      JOIN categories cat ON cat.id = c.category_id
      WHERE 1=1
    `;
    const params = [];
    if (search) { sql += ' AND c.title LIKE ?'; params.push(`%${search}%`); }
    if (category_id) { sql += ' AND c.category_id = ?'; params.push(category_id); }
    if (level) { sql += ' AND c.level = ?'; params.push(level); }
    if (access_type) { sql += ' AND c.access_type = ?'; params.push(access_type); }
    sql += ' ORDER BY c.id DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const [[course]] = await db.query(`
      SELECT c.*, i.full_name AS instructor_name, cat.name AS category_name
      FROM courses c
      JOIN instructors i ON i.id = c.instructor_id
      JOIN categories cat ON cat.id = c.category_id
      WHERE c.id = ?
    `, [req.params.id]);
    if (!course) return res.status(404).json({ error: 'Kursi nuk u gjet' });

    const [sections] = await db.query('SELECT * FROM course_sections WHERE course_id = ? ORDER BY order_index', [req.params.id]);
    const [lessons] = await db.query('SELECT * FROM lessons WHERE course_id = ? ORDER BY section_id, order_index', [req.params.id]);
    course.sections = sections.map(s => ({ ...s, lessons: lessons.filter(l => l.section_id === s.id) }));

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

const COURSE_FIELDS = ['title', 'short_description', 'long_description', 'category_id', 'instructor_id', 'level', 'duration_minutes', 'price', 'access_type', 'cover_image_url', 'is_new', 'is_featured'];

router.post('/courses', async (req, res) => {
  const body = req.body;
  if (!body.title || !body.category_id || !body.instructor_id) {
    return res.status(400).json({ error: 'title, category_id dhe instructor_id janë të detyrueshme' });
  }
  try {
    const cols = COURSE_FIELDS.filter(f => body[f] !== undefined);
    const values = cols.map(f => body[f]);
    const [result] = await db.query(
      `INSERT INTO courses (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
      values
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.put('/courses/:id', async (req, res) => {
  const body = req.body;
  const cols = COURSE_FIELDS.filter(f => body[f] !== undefined);
  if (cols.length === 0) return res.status(400).json({ error: 'Asnjë fushë për të përditësuar' });
  try {
    const setClause = cols.map(f => `${f} = ?`).join(', ');
    const values = cols.map(f => body[f]);
    await db.query(`UPDATE courses SET ${setClause} WHERE id = ?`, [...values, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

// ---- Sections ----

router.post('/courses/:id/sections', async (req, res) => {
  const { title, order_index } = req.body;
  if (!title) return res.status(400).json({ error: 'Titulli është i detyrueshëm' });
  try {
    const [result] = await db.query(
      'INSERT INTO course_sections (course_id, title, order_index) VALUES (?, ?, ?)',
      [req.params.id, title, order_index || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.put('/sections/:id', async (req, res) => {
  const { title, order_index } = req.body;
  try {
    await db.query('UPDATE course_sections SET title = ?, order_index = ? WHERE id = ?', [title, order_index, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.delete('/sections/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM course_sections WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// ---- Lessons ----

router.post('/sections/:id/lessons', async (req, res) => {
  const { title, video_url, duration_seconds, is_free, order_index } = req.body;
  if (!title) return res.status(400).json({ error: 'Titulli është i detyrueshëm' });
  try {
    const [[section]] = await db.query('SELECT course_id FROM course_sections WHERE id = ?', [req.params.id]);
    if (!section) return res.status(404).json({ error: 'Seksioni nuk u gjet' });

    const [result] = await db.query(
      'INSERT INTO lessons (section_id, course_id, title, video_url, duration_seconds, is_free, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.params.id, section.course_id, title, video_url || null, duration_seconds || 0, is_free ? 1 : 0, order_index || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.put('/lessons/:id', async (req, res) => {
  const { title, video_url, duration_seconds, is_free, order_index } = req.body;
  try {
    await db.query(
      'UPDATE lessons SET title = ?, video_url = ?, duration_seconds = ?, is_free = ?, order_index = ? WHERE id = ?',
      [title, video_url || null, duration_seconds || 0, is_free ? 1 : 0, order_index || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.delete('/lessons/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM lessons WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// ============================================================
// USERS
// ============================================================

router.get('/users', async (req, res) => {
  const { search } = req.query;
  try {
    let sql = `
      SELECT u.id, u.full_name, u.email, u.membership_type, u.role, u.created_at,
             COUNT(DISTINCT e.id) AS enrollments_count,
             COUNT(DISTINCT cert.id) AS certificates_count,
             MAX(CASE WHEN s.status = 'aktiv' THEN 1 ELSE 0 END) AS has_active_subscription
      FROM users u
      LEFT JOIN enrollments e ON e.user_id = u.id
      LEFT JOIN certificates cert ON cert.user_id = u.id
      LEFT JOIN subscriptions s ON s.user_id = u.id
      WHERE u.role = 'student'
    `;
    const params = [];
    if (search) { sql += ' AND (u.full_name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    sql += ' GROUP BY u.id ORDER BY u.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const [[user]] = await db.query(
      'SELECT id, full_name, email, membership_type, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!user) return res.status(404).json({ error: 'Përdoruesi nuk u gjet' });

    const [enrollments] = await db.query(`
      SELECT e.*, c.title AS course_title FROM enrollments e
      JOIN courses c ON c.id = e.course_id WHERE e.user_id = ? ORDER BY e.enrolled_at DESC
    `, [req.params.id]);

    const [certificates] = await db.query(`
      SELECT cert.*, c.title AS course_title FROM certificates cert
      JOIN courses c ON c.id = cert.course_id WHERE cert.user_id = ? ORDER BY cert.issued_at DESC
    `, [req.params.id]);

    const [subscriptions] = await db.query(`
      SELECT s.*, p.name AS plan_name FROM subscriptions s
      JOIN subscription_plans p ON p.id = s.plan_id WHERE s.user_id = ? ORDER BY s.started_at DESC
    `, [req.params.id]);

    const [payments] = await db.query('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);

    res.json({ ...user, enrollments, certificates, subscriptions, payments });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

// ============================================================
// CERTIFICATES
// ============================================================

router.get('/certificates', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT cert.*, u.full_name AS student_name, u.email AS student_email, c.title AS course_title
      FROM certificates cert
      JOIN users u ON u.id = cert.user_id
      JOIN courses c ON c.id = cert.course_id
      ORDER BY cert.issued_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.post('/certificates', async (req, res) => {
  const { user_id, course_id, instructor_signature_name } = req.body;
  if (!user_id || !course_id) return res.status(400).json({ error: 'user_id dhe course_id janë të detyrueshme' });
  try {
    const code = `CERT-JA-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const [result] = await db.query(
      'INSERT INTO certificates (user_id, course_id, certificate_code, instructor_signature_name) VALUES (?, ?, ?, ?)',
      [user_id, course_id, code, instructor_signature_name || 'Fatjona Cici']
    );
    res.status(201).json({ id: result.insertId, certificate_code: code });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

router.delete('/certificates/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// ============================================================
// SUBSCRIPTIONS & PAYMENTS (read-only)
// ============================================================

router.get('/subscriptions', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.full_name AS student_name, u.email AS student_email, p.name AS plan_name, p.price AS plan_price
      FROM subscriptions s
      JOIN users u ON u.id = s.user_id
      JOIN subscription_plans p ON p.id = s.plan_id
      ORDER BY s.started_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pay.*, u.full_name AS student_name, u.email AS student_email, c.title AS course_title
      FROM payments pay
      JOIN users u ON u.id = pay.user_id
      LEFT JOIN courses c ON c.id = pay.course_id
      ORDER BY pay.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// ============================================================
// IMAGE UPLOAD
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Vetëm skedarë imazhi lejohen'));
  },
});

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nuk u ngarkua asnjë skedar' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
