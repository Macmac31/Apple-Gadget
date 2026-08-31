const express = require('express');
const db      = require('../db');
const { protect, staffOrAdmin } = require('../middleware/auth');
const router  = express.Router();

const genOrderNum = () => 'ORD-' + Date.now().toString().slice(-8);

// POST /api/orders  — create new sale (POS checkout)
router.post('/', protect, staffOrAdmin, async (req, res) => {
  const { items, customer_name, customer_email, payment_method, discount, notes } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Verify stock & calculate totals
    let subtotal = 0;
    for (const item of items) {
      const [p] = await conn.query('SELECT * FROM products WHERE id=? FOR UPDATE', [item.product_id]);
      if (!p.length) throw new Error(`Product ${item.product_id} not found`);
      if (p[0].stock < item.quantity) throw new Error(`Insufficient stock for ${p[0].name}`);
      item.unit_price = parseFloat(p[0].price);
      item.product_name = p[0].name;
      subtotal += item.unit_price * item.quantity;
    }

    const disc  = parseFloat(discount) || 0;
    const tax   = parseFloat(((subtotal - disc) * 0.00).toFixed(2)); // 0% VAT — adjust as needed
    const total = parseFloat((subtotal - disc + tax).toFixed(2));

    const [orderRes] = await conn.query(
      `INSERT INTO orders (order_number,cashier_id,customer_name,customer_email,
        subtotal,discount,tax,total,payment_method,notes)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [genOrderNum(), req.user.id, customer_name||'Walk-in', customer_email||null,
       subtotal, disc, tax, total, payment_method||'cash', notes||null]
    );
    const orderId = orderRes.insertId;

    // Insert items & deduct stock
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id,product_id,product_name,quantity,unit_price,subtotal) VALUES (?,?,?,?,?,?)',
        [orderId, item.product_id, item.product_name, item.quantity, item.unit_price, item.unit_price * item.quantity]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id=?', [item.quantity, item.product_id]);
    }

    await conn.query('INSERT INTO activity_log (user_id,action,description) VALUES (?,?,?)',
      [req.user.id, 'SALE', `Order #${orderId} — ₱${total}`]);

    await conn.commit();
    conn.release();

    const [newOrder] = await db.query('SELECT * FROM orders WHERE id=?', [orderId]);
    res.status(201).json({ message: 'Order placed', order: newOrder[0] });
  } catch (err) {
    await conn.rollback();
    conn.release();
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders
router.get('/', protect, staffOrAdmin, async (req, res) => {
  const { date, status, search, limit = 50, offset = 0 } = req.query;
  let sql = `SELECT o.*, u.name AS cashier_name FROM orders o
             LEFT JOIN users u ON o.cashier_id = u.id WHERE 1=1`;
  const params = [];
  if (date)   { sql += ' AND DATE(o.created_at) = ?'; params.push(date); }
  if (status) { sql += ' AND o.order_status = ?'; params.push(status); }
  if (search) { sql += ' AND (o.order_number LIKE ? OR o.customer_name LIKE ?)'; params.push(`%${search}%`,`%${search}%`); }
  sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/orders/:id  — with items
router.get('/:id', protect, staffOrAdmin, async (req, res) => {
  try {
    const [order] = await db.query(
      'SELECT o.*, u.name AS cashier_name FROM orders o LEFT JOIN users u ON o.cashier_id=u.id WHERE o.id=?',
      [req.params.id]);
    if (!order.length) return res.status(404).json({ message: 'Order not found' });
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id=?', [req.params.id]);
    res.json({ ...order[0], items });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', protect, staffOrAdmin, async (req, res) => {
  try {
    await db.query('UPDATE orders SET order_status=? WHERE id=?', [req.body.status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
