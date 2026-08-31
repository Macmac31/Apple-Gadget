import axios from 'axios';

export const api = {
  // Auth
  login:          (d) => axios.post('/api/auth/login', d),
  me:             ()  => axios.get('/api/auth/me'),
  register:       (d) => axios.post('/api/auth/register', d),
  changePassword: (d) => axios.post('/api/auth/change-password', d),

  // Dashboard
  dashboard: () => axios.get('/api/dashboard'),

  // Products
  getProducts:   (p) => axios.get('/api/products', { params: p }),
  getProduct:    (id) => axios.get(`/api/products/${id}`),
  createProduct: (d)  => axios.post('/api/products', d),
  updateProduct: (id,d) => axios.put(`/api/products/${id}`, d),
  deleteProduct: (id)   => axios.delete(`/api/products/${id}`),
  getCategories: ()     => axios.get('/api/products/meta/categories'),

  // Orders
  createOrder: (d)   => axios.post('/api/orders', d),
  getOrders:   (p)   => axios.get('/api/orders', { params: p }),
  getOrder:    (id)  => axios.get(`/api/orders/${id}`),
  updateOrderStatus: (id,s) => axios.patch(`/api/orders/${id}/status`, { status: s }),

  // Users
  getUsers:       ()    => axios.get('/api/users'),
  updateUser:     (id,d) => axios.put(`/api/users/${id}`, d),
  deleteUser:     (id)   => axios.delete(`/api/users/${id}`),
  resetPassword:  (id,pw) => axios.post(`/api/users/${id}/reset-password`, { password: pw }),

  // Reports
  salesReport:    (p) => axios.get('/api/reports/sales', { params: p }),
  topProducts:    (p) => axios.get('/api/reports/top-products', { params: p }),
  paymentMethods: ()  => axios.get('/api/reports/payment-methods'),
  inventoryReport:()  => axios.get('/api/reports/inventory'),
};

export const fmt = {
  currency: (n) => `₱${parseFloat(n||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
  date:     (d) => new Date(d).toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }),
  datetime: (d) => new Date(d).toLocaleString('en-PH'),
};
