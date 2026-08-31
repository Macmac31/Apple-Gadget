import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label:'Dashboard',  path:'/',          icon:'📊', section:'Main' },
  { label:'POS',        path:'/pos',        icon:'🛒', section:'Main' },
  { label:'Orders',     path:'/orders',     icon:'📋', section:'Main' },
  { label:'Inventory',  path:'/inventory',  icon:'📦', section:'Store' },
  { label:'Reports',    path:'/reports',    icon:'📈', section:'Store' },
  { label:'Users',      path:'/users',      icon:'👥', section:'Admin', adminOnly: true },
  { label:'Profile',    path:'/profile',    icon:'⚙️', section:'Account' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = NAV.filter(n => !n.adminOnly || user?.role === 'admin');
  const sections = [...new Set(navItems.map(n => n.section))];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span style={{ fontSize:'22px' }}>&#63743;</span>
          <span>Apple Store</span>
        </div>

        <nav className="sidebar-nav">
          {sections.map(sec => (
            <div key={sec}>
              <div className="nav-section-label">{sec}</div>
              {navItems.filter(n => n.section === sec).map(n => (
                <button key={n.path} className={`nav-item ${location.pathname === n.path ? 'active' : ''}`}
                  onClick={() => { navigate(n.path); setSidebarOpen(false); }}>
                  <span className="icon">{n.icon}</span>
                  {n.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card" onClick={() => navigate('/profile')}>
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ width:'100%', marginTop:'8px', justifyContent:'center', borderRadius:'10px', fontSize:'12px' }}
            onClick={logout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <button className="btn-icon btn-ghost" style={{ display:'none' }} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="topbar-title">
              {NAV.find(n => n.path === location.pathname)?.label || 'Apple Store'}
            </span>
          </div>
          <div className="topbar-actions">
            <span style={{ fontSize:'12px', color:'var(--text2)' }}>
              {new Date().toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric' })}
            </span>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent2)' }} title="Online" />
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
