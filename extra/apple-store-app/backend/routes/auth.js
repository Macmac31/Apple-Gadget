const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const { protect } = require('../middleware/auth');
const router   = express.Router();

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Log activity
    await db.query('INSERT INTO activity_log (user_id, action, description) VALUES (?,?,?)',
      [user.id, 'LOGIN', `${user.name} logged in`]);

    const { password: _, ...safeUser } = user;
    res.json({ token: sign(user), user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/register  (admin creates users)
router.post('/register', protect, async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name,email,password,role,phone) VALUES (?,?,?,?,?)',
      [name, email, hash, role || 'customer', phone || null]
    );
    res.status(201).json({ message: 'User created', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id,name,email,role,phone,avatar,created_at FROM users WHERE id=?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/change-password
router.post('/change-password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id=?', [req.user.id]);
    const match = await bcrypt.compare(oldPassword, rows[0].password);
    if (!match) return res.status(400).json({ message: 'Old password incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password=? WHERE id=?', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
