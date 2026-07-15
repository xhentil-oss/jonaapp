const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { sendPasswordResetEmail } = require('../utils/mailer');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ error: 'Të gjitha fushat janë të detyrueshme' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'Email-i ekziston tashmë' });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, hash]
    );

    const token = jwt.sign(
      { id: result.insertId, email, full_name, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ token, user: { id: result.insertId, full_name, email, role: 'student' } });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email dhe password janë të detyrueshme' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Email ose password gabim' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Email ose password gabim' });

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, membership_type: user.membership_type, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email është i detyrueshëm' });

  const genericResponse = { message: 'Nëse ky email ekziston, të kemi dërguar udhëzimet për rivendosjen e fjalëkalimit.' };

  try {
    const [[user]] = await db.query('SELECT id, full_name, email FROM users WHERE email = ?', [email]);
    if (!user) return res.json(genericResponse); // don't reveal whether the email exists

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.query(
      'UPDATE users SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?',
      [tokenHash, expires, user.id]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user.email, user.full_name, resetUrl);

    res.json(genericResponse);
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, new_password } = req.body;
  if (!token || !new_password) return res.status(400).json({ error: 'Token dhe fjalëkalimi i ri janë të detyrueshëm' });
  if (new_password.length < 6) return res.status(400).json({ error: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere' });

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const [[user]] = await db.query(
      'SELECT id FROM users WHERE reset_token_hash = ? AND reset_token_expires > NOW()',
      [tokenHash]
    );
    if (!user) return res.status(400).json({ error: 'Linku është i pavlefshëm ose ka skaduar. Kërko një link të ri.' });

    const hash = await bcrypt.hash(new_password, 12);
    await db.query(
      'UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = ?',
      [hash, user.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri' });
  }
});

module.exports = router;
