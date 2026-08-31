const express = require('express');
const db      = require('../db');
const { protect, staffOrAdmin } = require('../middleware/auth');
const router  = express.Router();

// Sales by date range
router.get('/sales', protect, staffOrAdmin, async (req, res) => {
  const { from, to } = req.query;
  try {
    const [rows] = await db.query(`
      SELECT DATE(created_at) AS date,
             COUNT(*) AS orders,
             SUM(total) AS revenue,
             SUM(discount) AS discounts
      FROM orders
      WHERE order_status='completed'
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at) ORDER BY date`,
      [from || '2024-01-01', to || new Date().toISOString().slice(0,10)]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Top selling products
router.get('/top-products', protect, staffOrAdmin, async (req, res) => {
  const { from, to, limit = 10 } = req.query;
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.name, p.image, p.price,
             SUM(oi.quantity) AS units_sold,
             SUM(oi.subtotal) AS revenue
      FROM order_items oi
      JOIN products p ON oi.product_id=p.id
      JOIN orders o ON oi.order_id=o.id
      WHERE o.order_status='completed'
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY oi.product_id ORDER BY units_sold DESC LIMIT ?`,
      [from||'2024-01-01', to||new Date().toISOString().slice(0,10), parseInt(limit)]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Payment method breakdown
router.get('/payment-methods', protect, staffOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT payment_method, COUNT(*) AS count, SUM(total) AS total
      FROM orders WHERE order_status='completed'
      AND MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())
      GROUP BY payment_method`);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Inventory value
router.get('/inventory', protect, staffOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name,
             (p.stock * p.cost_price) AS stock_value,
             (p.stock * p.price) AS retail_value
      FROM products p JOIN categories c ON p.category_id=c.id
      ORDER BY stock_value DESC`);
    const [[totals]] = await db.query(`
      SELECT SUM(stock*cost_price) AS total_cost, SUM(stock*price) AS total_retail
      FROM products WHERE is_active=1`);
    res.json({ products: rows, totals });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
