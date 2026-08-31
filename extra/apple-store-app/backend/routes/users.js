const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../db');
const { protect, adminOnly } = require('../middleware/auth');
const router  = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id,name,email,role,phone,created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, email, role, phone } = req.body;
  try {
    await db.query('UPDATE users SET name=?,email=?,role=?,phone=? WHERE id=?',
      [name, email, role, phone, req.params.id]);
    res.json({ message: 'User updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  if (req.user.id === parseInt(req.params.id))
    return res.status(400).json({ message: 'Cannot delete yourself' });
  try {
    await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/reset-password', protect, adminOnly, async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  try {
    await db.query('UPDATE users SET password=? WHERE id=?', [hash, req.params.id]);
    res.json({ message: 'Password reset' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
