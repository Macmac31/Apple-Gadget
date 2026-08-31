require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const authRoutes      = require('./routes/auth');
const productRoutes   = require('./routes/products');
const orderRoutes     = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes      = require('./routes/users');
const reportRoutes    = require('./routes/reports');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/reports',   reportRoutes);

app.get('/', (req, res) => res.json({ message: 'Apple Store API running ✓' }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
