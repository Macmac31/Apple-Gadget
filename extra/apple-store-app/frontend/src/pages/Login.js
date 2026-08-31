import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'380px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ fontSize:'64px', lineHeight:'1', marginBottom:'16px' }}>&#63743;</div>
          <h1 style={{ fontSize:'26px', fontWeight:'700', letterSpacing:'-.04em', marginBottom:'6px' }}>Apple Store</h1>
          <p style={{ color:'rgba(245,245,247,.4)', fontSize:'14px' }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handle} style={{ background:'#1c1c1e', border:'1px solid rgba(255,255,255,.09)', borderRadius:'20px', padding:'28px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom:'24px' }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:'15px', borderRadius:'12px' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'12px', color:'rgba(245,245,247,.3)' }}>
          Default: admin@applestore.com / admin123
        </p>
      </div>
    </div>
  );
}
