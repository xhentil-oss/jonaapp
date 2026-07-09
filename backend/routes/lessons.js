const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/lessons/:id — mësimi me video_url (vetëm për të autentikuarit ose mësimet falas)
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [[lesson]] = await db.query(`
      SELECT l.*, c.title AS course_title, s.title AS section_title
      FROM lessons l
      JOIN courses c ON c.id = l.course_id
      JOIN course_sections s ON s.id = l.section_id
      WHERE l.id = ?
    `, [id]);
    if (!lesson) return res.status(404).json({ error: 'Mësimi nuk u gjet' });

    if (!lesson.is_free) {
      const [[enrollment]] = await db.query(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
        [userId, lesson.course_id]
      );
      if (!enrollment)
        return res.status(403).json({ error: 'Nuk ke akses në këtë mësim' });
    }

    const [siblings] = await db.query(`
      SELECT l.id, l.title, l.is_free, l.order_index, l.section_id
      FROM lessons l
      JOIN course_sections s ON s.id = l.section_id
      WHERE l.course_id = ?
      ORDER BY s.order_index, l.order_index
    `, [lesson.course_id]);

    res.json({ ...lesson, siblings });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// POST /api/lessons/:id/progress — ruaj progresin
router.post('/:id/progress', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { watched_seconds, is_completed, enrollment_id } = req.body;

  try {
    await db.query(`
      INSERT INTO lesson_progress (user_id, lesson_id, enrollment_id, watched_seconds, is_completed)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        watched_seconds = GREATEST(watched_seconds, VALUES(watched_seconds)),
        is_completed = VALUES(is_completed)
    `, [userId, id, enrollment_id, watched_seconds || 0, is_completed ? 1 : 0]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

module.exports = router;
