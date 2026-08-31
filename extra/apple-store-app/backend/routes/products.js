const express = require('express');
const db      = require('../db');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const router  = express.Router();

// GET /api/products  — all (with optional search/category filter)
router.get('/', async (req, res) => {
  const { search, category, lowstock } = req.query;
  let sql = `SELECT p.*, c.name AS category_name
             FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1`;
  const params = [];
  if (search)    { sql += ' AND (p.name LIKE ? OR p.sku LIKE ?)'; params.push(`%${search}%`,`%${search}%`); }
  if (category)  { sql += ' AND c.slug = ?'; params.push(category); }
  if (lowstock)  { sql += ' AND p.stock <= p.low_stock_at'; }
  sql += ' ORDER BY p.created_at DESC';
  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id=c.id WHERE p.id=?',
      [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products
router.post('/', protect, staffOrAdmin, async (req, res) => {
  const { category_id, name, description, price, cost_price, stock, low_stock_at, sku, color, storage, image, is_active } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now();
  try {
    const [r] = await db.query(
      'INSERT INTO products (category_id,name,slug,description,price,cost_price,stock,low_stock_at,sku,color,storage,image,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [category_id, name, slug, description, price, cost_price||0, stock||0, low_stock_at||5, sku||null, color||null, storage||null, image||null, is_active!==false?1:0]
    );
    res.status(201).json({ message: 'Product created', id: r.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/products/:id
router.put('/:id', protect, staffOrAdmin, async (req, res) => {
  const { category_id, name, description, price, cost_price, stock, low_stock_at, sku, color, storage, image, is_active } = req.body;
  try {
    await db.query(
      'UPDATE products SET category_id=?,name=?,description=?,price=?,cost_price=?,stock=?,low_stock_at=?,sku=?,color=?,storage=?,image=?,is_active=? WHERE id=?',
      [category_id, name, description, price, cost_price, stock, low_stock_at||5, sku, color, storage, image, is_active?1:0, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/meta/categories
router.get('/meta/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
