-- ============================================================
--  Apple Store Web App — Database Schema
--  Import this into phpMyAdmin or run: mysql -u root < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS apple_store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE apple_store_db;

-- ── Users (admin + customers) ──────────────────────────────
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','staff','customer') DEFAULT 'customer',
  avatar      VARCHAR(255) DEFAULT NULL,
  phone       VARCHAR(20)  DEFAULT NULL,
  address     TEXT         DEFAULT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Product Categories ─────────────────────────────────────
CREATE TABLE categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Products (iPhones + accessories) ──────────────────────
CREATE TABLE products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT NOT NULL,
  name          VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) NOT NULL UNIQUE,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  cost_price    DECIMAL(10,2) DEFAULT 0.00,
  stock         INT NOT NULL DEFAULT 0,
  low_stock_at  INT DEFAULT 5,
  sku           VARCHAR(100) UNIQUE,
  image         VARCHAR(255) DEFAULT NULL,
  color         VARCHAR(50)  DEFAULT NULL,
  storage       VARCHAR(50)  DEFAULT NULL,
  is_active     TINYINT(1) DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ── Orders ────────────────────────────────────────────────
CREATE TABLE orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(50) NOT NULL UNIQUE,
  user_id         INT DEFAULT NULL,
  cashier_id      INT NOT NULL,
  customer_name   VARCHAR(150) DEFAULT 'Walk-in',
  customer_email  VARCHAR(150) DEFAULT NULL,
  subtotal        DECIMAL(10,2) NOT NULL,
  discount        DECIMAL(10,2) DEFAULT 0.00,
  tax             DECIMAL(10,2) DEFAULT 0.00,
  total           DECIMAL(10,2) NOT NULL,
  payment_method  ENUM('cash','card','gcash','maya') DEFAULT 'cash',
  payment_status  ENUM('paid','pending','refunded') DEFAULT 'paid',
  order_status    ENUM('completed','pending','cancelled','refunded') DEFAULT 'completed',
  notes           TEXT DEFAULT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (cashier_id) REFERENCES users(id)
);

-- ── Order Items ───────────────────────────────────────────
CREATE TABLE order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL,
  product_id  INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity    INT NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ── Activity Log ──────────────────────────────────────────
CREATE TABLE activity_log (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT DEFAULT NULL,
  action      VARCHAR(200) NOT NULL,
  description TEXT,
  ip_address  VARCHAR(50),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
--  SEED DATA
-- ============================================================

-- Default admin (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User',  'admin@applestore.com',  '$2b$10$rN9vBqK8mHzL2pX4wY6uOu8Kj3mF5nQ1vR7sT0xW4aE6bC9dG2iHm', 'admin'),
('Staff One',   'staff@applestore.com',  '$2b$10$rN9vBqK8mHzL2pX4wY6uOu8Kj3mF5nQ1vR7sT0xW4aE6bC9dG2iHm', 'staff'),
('Macmac',      'macmac@applestore.com', '$2b$10$rN9vBqK8mHzL2pX4wY6uOu8Kj3mF5nQ1vR7sT0xW4aE6bC9dG2iHm', 'admin');

-- Categories
INSERT INTO categories (name, slug, description) VALUES
('iPhone 17 Series',   'iphone-17',   'Latest iPhone 17 lineup'),
('iPhone 16 Series',   'iphone-16',   'iPhone 16 lineup'),
('iPhone 15 Series',   'iphone-15',   'iPhone 15 lineup'),
('Accessories',        'accessories', 'Cases, cables, chargers'),
('AirPods',            'airpods',     'AirPods lineup');

-- Products
INSERT INTO products (category_id, name, slug, price, cost_price, stock, sku, color, storage, image) VALUES
(1, 'iPhone 17 Pro — Cosmic Orange',   'iphone-17-pro-cosmic-orange',  78990, 55000, 15, 'IP17P-CO',  'Cosmic Orange', '256GB', 'iphone17pro_cosmic_orange.jpg'),
(1, 'iPhone 17 Pro — Deep Blue',       'iphone-17-pro-deep-blue',      78990, 55000, 12, 'IP17P-DB',  'Deep Blue',     '256GB', 'iphone17pro_deepblue.jpg'),
(1, 'iPhone 17 Pro — Silver',          'iphone-17-pro-silver',         78990, 55000, 10, 'IP17P-SL',  'Silver',        '256GB', 'iphone17pro_silver.jpg'),
(1, 'iPhone 17 Pro Max — Cosmic Orange','iphone-17-pro-max-co',        95990, 68000,  8, 'IP17PM-CO', 'Cosmic Orange', '256GB', 'iphone17promax_cosmic_orange.jpg'),
(1, 'iPhone 17 Pro Max — Deep Blue',   'iphone-17-pro-max-db',         95990, 68000,  6, 'IP17PM-DB', 'Deep Blue',     '256GB', 'iphone17promax_deepblue.jpg'),
(1, 'iPhone Air — Sky Blue',           'iphone-air-sky-blue',          72990, 50000, 20, 'IAIR-SB',   'Sky Blue',      '128GB', 'iphoneair_skyblue.jpg'),
(1, 'iPhone Air — Cloud White',        'iphone-air-cloud-white',       72990, 50000, 18, 'IAIR-CW',   'Cloud White',   '128GB', 'iphoneair_cloudwhite.jpg'),
(1, 'iPhone 17 — Lavender',            'iphone-17-lavender',           57990, 40000, 25, 'IP17-LV',   'Lavender',      '128GB', 'iphone17_lavender.jpg'),
(1, 'iPhone 17 — Black',               'iphone-17-black',              57990, 40000, 22, 'IP17-BK',   'Black',         '128GB', 'iphone17_black.jpg'),
(1, 'iPhone 17e — Pink',               'iphone-17e-pink',              44990, 30000, 30, 'IP17E-PK',  'Pink',          '128GB', 'iphone17e_pink.jpg'),
(2, 'iPhone 16 — Ultramarine',         'iphone-16-ultramarine',        46990, 32000, 20, 'IP16-UM',   'Ultramarine',   '128GB', 'iphone16_ultramarine.jpg'),
(2, 'iPhone 16 Pro — Black Titanium',  'iphone-16-pro-black-ti',       62990, 44000, 14, 'IP16P-BT',  'Black Titanium','256GB', 'iphone16pro_blacktitanium.jpg'),
(4, 'AirPods Pro 2',                   'airpods-pro-2',                14990,  9000, 40, 'APP2',      'White',         NULL,    NULL),
(4, 'MagSafe Charger',                 'magsafe-charger',               2490,  1200, 60, 'MGS1',      'White',         NULL,    NULL);
