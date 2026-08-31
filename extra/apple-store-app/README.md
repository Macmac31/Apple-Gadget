# 🍎 Apple Store Web App
**React + Node.js + MySQL | Full POS System**

---

## 📁 Project Structure
```
apple-store-app/
├── database.sql          ← Import this into phpMyAdmin first
├── backend/              ← Node.js API server
│   ├── server.js
│   ├── .env              ← Configure DB credentials here
│   ├── db.js
│   ├── middleware/
│   └── routes/
└── frontend/             ← React app
    ├── public/
    └── src/
```

---

## ⚙️ Setup Instructions

### Step 1 — Requirements
- **Node.js** v18+: https://nodejs.org
- **XAMPP** (for MySQL): https://www.apachefriends.org
- **Git** (optional)

---

### Step 2 — Database Setup
1. Open XAMPP → Start **MySQL**
2. Open **phpMyAdmin** → http://localhost/phpmyadmin
3. Click **Import** → Choose `database.sql` → Click **Go**
4. Database `apple_store_db` will be created with tables + seed data ✓

---

### Step 3 — Backend Setup
```bash
cd backend
npm install
```

Edit `.env` if your MySQL password is set:
```
DB_PASSWORD=your_mysql_password   # leave blank if no password
```

Start the backend:
```bash
npm run dev     # with auto-reload (recommended)
# OR
npm start       # production
```
✅ Backend runs on: http://localhost:5000

---

### Step 4 — Frontend Setup
```bash
cd frontend
npm install
npm start
```
✅ Frontend runs on: http://localhost:3000

---

## 🔐 Default Login Credentials

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@applestore.com     | admin123  |
| Staff | staff@applestore.com     | admin123  |
| Admin | macmac@applestore.com    | admin123  |

> ⚠️ Change passwords after first login!

---

## 📱 Features

### Dashboard
- Today's sales & orders
- Monthly revenue
- 7-day revenue & orders charts
- Top selling products
- Recent orders feed
- Low stock alerts

### POS (Point of Sale)
- Product grid with search + category filter
- Add to cart with quantity control
- Discount support
- Payment methods: Cash, Card, GCash, Maya
- Auto stock deduction on checkout
- Receipt modal after sale

### Inventory
- Add / Edit / Delete products
- Stock levels with low-stock badge
- Category management
- SKU, color, storage tracking
- Active/Inactive toggle

### Orders
- Full order history with search + date filter
- View order details + items
- Update order status (completed/pending/cancelled/refunded)

### Reports
- Sales report by date range
- Top selling products
- Payment method breakdown (pie chart)
- Inventory value report

### Users (Admin only)
- Add / Edit / Delete users
- Roles: Admin, Staff, Customer
- Reset any user's password

---

## 🔗 API Endpoints

| Method | Endpoint                   | Description            |
|--------|----------------------------|------------------------|
| POST   | /api/auth/login            | Login                  |
| GET    | /api/auth/me               | Current user           |
| GET    | /api/dashboard             | Dashboard stats        |
| GET    | /api/products              | List products          |
| POST   | /api/products              | Create product         |
| PUT    | /api/products/:id          | Update product         |
| DELETE | /api/products/:id          | Delete product         |
| POST   | /api/orders                | Create order (POS)     |
| GET    | /api/orders                | List orders            |
| GET    | /api/orders/:id            | Order detail           |
| GET    | /api/reports/sales         | Sales report           |
| GET    | /api/reports/top-products  | Top products           |
| GET    | /api/reports/inventory     | Inventory report       |
| GET    | /api/users                 | List users (admin)     |

---

## 🌐 Your Live Frontend Site
https://apple-gadget-two.vercel.app/

The admin app is separate from your storefront. Run both simultaneously:
- **Storefront**: your existing HTML site (Vercel)  
- **Admin Panel**: http://localhost:3000 (this app)

---

## 🛠 Troubleshooting

**CORS error?** → Make sure backend is running on port 5000

**DB connection failed?** → Check `.env` credentials, ensure XAMPP MySQL is started

**npm not found?** → Install Node.js from https://nodejs.org

**Port 3000 in use?** → React will ask to use another port, press Y
