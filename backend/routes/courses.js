const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/courses — të gjitha kurset
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.*, i.full_name AS instructor_name, cat.name AS category_name, cat.icon AS category_icon
      FROM courses c
      JOIN instructors i ON i.id = c.instructor_id
      JOIN categories cat ON cat.id = c.category_id
      ORDER BY c.is_featured DESC, c.id ASC
    `);
    res.json(courses);
  } catch (err) {
    console.error('DB ERROR /courses:', err.message);
    res.status(500).json({ error: 'Gabim serveri', detail: err.message });
  }
});

// GET /api/courses/:id — kursi me seksione dhe mësime
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [[course]] = await db.query(`
      SELECT c.*, i.full_name AS instructor_name, i.bio AS instructor_bio,
             cat.name AS category_name, cat.icon AS category_icon
      FROM courses c
      JOIN instructors i ON i.id = c.instructor_id
      JOIN categories cat ON cat.id = c.category_id
      WHERE c.id = ?
    `, [id]);

    if (!course) return res.status(404).json({ error: 'Kursi nuk u gjet' });

    const [sections] = await db.query(
      'SELECT * FROM course_sections WHERE course_id = ? ORDER BY order_index',
      [id]
    );

    const [lessons] = await db.query(
      'SELECT id, section_id, title, duration_seconds, is_free, order_index FROM lessons WHERE course_id = ? ORDER BY section_id, order_index',
      [id]
    );

    const sectionsWithLessons = sections.map(s => ({
      ...s,
      lessons: lessons.filter(l => l.section_id === s.id)
    }));

    res.json({ ...course, sections: sectionsWithLessons });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

module.exports = router;
