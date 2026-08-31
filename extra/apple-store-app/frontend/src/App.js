import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login      from './pages/Login';
import Layout     from './components/Layout';
import Dashboard  from './pages/Dashboard';
import POS        from './pages/POS';
import Inventory  from './pages/Inventory';
import Orders     from './pages/Orders';
import Reports    from './pages/Reports';
import Users      from './pages/Users';
import Profile    from './pages/Profile';

function PrivateRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index              element={<Dashboard />} />
        <Route path="pos"         element={<POS />} />
        <Route path="inventory"   element={<Inventory />} />
        <Route path="orders"      element={<Orders />} />
        <Route path="reports"     element={<Reports />} />
        <Route path="users"       element={<PrivateRoute adminOnly><Users /></PrivateRoute>} />
        <Route path="profile"     element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style:{ background:'#1c1c1e', color:'#f5f5f7', border:'1px solid rgba(255,255,255,.1)' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
