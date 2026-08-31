import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [pw, setPw] = useState({ oldPassword:'', newPassword:'', confirm:'' });
  const [loading, setLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast.error('Passwords do not match');
    if (pw.newPassword.length < 6) return toast.error('Min 6 characters');
    setLoading(true);
    try {
      await api.changePassword({ oldPassword: pw.oldPassword, newPassword: pw.newPassword });
      toast.success('Password changed!');
      setPw({ oldPassword:'', newPassword:'', confirm:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:'560px' }}>
      <div className="page-header"><h2>My Profile</h2></div>

      {/* User info card */}
      <div className="card" style={{ marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'18px', marginBottom:'20px' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:'700', flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:'20px', fontWeight:'700', marginBottom:'4px' }}>{user?.name}</div>
            <div style={{ fontSize:'13px', color:'var(--text2)' }}>{user?.email}</div>
            <span className={`badge ${user?.role==='admin'?'badge-gold':user?.role==='staff'?'badge-blue':'badge-green'}`} style={{ marginTop:'6px' }}>{user?.role}</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', fontSize:'13px' }}>
          <div><span style={{ color:'var(--text3)', display:'block', fontSize:'11px', marginBottom:'3px' }}>EMAIL</span>{user?.email}</div>
          <div><span style={{ color:'var(--text3)', display:'block', fontSize:'11px', marginBottom:'3px' }}>ROLE</span>{user?.role}</div>
        </div>
      </div>

      {/* Change password */}
      <div className="card">
        <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'18px' }}>Change Password</h3>
        <form onSubmit={changePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" required value={pw.oldPassword} onChange={e=>setPw({...pw,oldPassword:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" required minLength={6} value={pw.newPassword} onChange={e=>setPw({...pw,newPassword:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" required value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Saving…':'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}
