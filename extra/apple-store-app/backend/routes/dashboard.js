const express = require('express');
const db      = require('../db');
const { protect, staffOrAdmin } = require('../middleware/auth');
const router  = express.Router();

router.get('/', protect, staffOrAdmin, async (req, res) => {
  try {
    const [[sales]]    = await db.query(`SELECT COALESCE(SUM(total),0) AS today_sales, COUNT(*) AS today_orders FROM orders WHERE DATE(created_at)=CURDATE() AND order_status='completed'`);
    const [[monthly]]  = await db.query(`SELECT COALESCE(SUM(total),0) AS month_sales FROM orders WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE()) AND order_status='completed'`);
    const [[products]] = await db.query(`SELECT COUNT(*) AS total FROM products WHERE is_active=1`);
    const [[lowstock]] = await db.query(`SELECT COUNT(*) AS total FROM products WHERE stock <= low_stock_at`);
    const [[customers]]= await db.query(`SELECT COUNT(*) AS total FROM users WHERE role='customer'`);

    const [chartData]  = await db.query(`
      SELECT DATE(created_at) AS date, SUM(total) AS revenue, COUNT(*) AS orders
      FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND order_status='completed'
      GROUP BY DATE(created_at) ORDER BY date`);

    const [topProducts] = await db.query(`
      SELECT p.name, p.image, SUM(oi.quantity) AS sold, SUM(oi.subtotal) AS revenue
      FROM order_items oi JOIN products p ON oi.product_id=p.id
      JOIN orders o ON oi.order_id=o.id
      WHERE o.order_status='completed' AND MONTH(o.created_at)=MONTH(CURDATE())
      GROUP BY oi.product_id ORDER BY sold DESC LIMIT 5`);

    const [recentOrders] = await db.query(`
      SELECT o.*, u.name AS cashier_name FROM orders o
      LEFT JOIN users u ON o.cashier_id=u.id
      ORDER BY o.created_at DESC LIMIT 8`);

    res.json({
      today_sales:    parseFloat(sales.today_sales),
      today_orders:   sales.today_orders,
      month_sales:    parseFloat(monthly.month_sales),
      total_products: products.total,
      low_stock:      lowstock.total,
      total_customers:customers.total,
      chart_data:     chartData,
      top_products:   topProducts,
      recent_orders:  recentOrders,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
