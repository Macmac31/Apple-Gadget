import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api, fmt } from '../utils/api';

const EMPTY = { name:'', email:'', password:'', role:'staff', phone:'' };

export default function Users() {
  const [users, setUsers]   = useState([]);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [pwModal, setPwModal] = useState(null);
  const [newPw, setNewPw]   = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.getUsers().then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (u) => { setForm({ name:u.name, email:u.email, password:'', role:u.role, phone:u.phone||'' }); setEditing(u.id); setModal(true); };
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  const save = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) {
        await api.updateUser(editing, { name:form.name, email:form.email, role:form.role, phone:form.phone });
        toast.success('User updated');
      } else {
        await api.register(form);
        toast.success('User created');
      }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.deleteUser(id); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete'); }
  };

  const resetPw = async () => {
    if (!newPw || newPw.length < 6) return toast.error('Min 6 characters');
    try { await api.resetPassword(pwModal, newPw); toast.success('Password reset'); setPwModal(null); setNewPw(''); }
    catch { toast.error('Failed'); }
  };

  const roleColor = { admin:'badge-gold', staff:'badge-blue', customer:'badge-green' };

  return (
    <div>
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'13px', flexShrink:0 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:'600' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ fontSize:'12px', color:'var(--text2)' }}>{u.email}</td>
                <td><span className={`badge ${roleColor[u.role]||'badge-blue'}`}>{u.role}</span></td>
                <td style={{ fontSize:'12px', color:'var(--text2)' }}>{u.phone||'—'}</td>
                <td style={{ fontSize:'11px', color:'var(--text3)' }}>{fmt.date(u.created_at)}</td>
                <td>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setPwModal(u.id); setNewPw(''); }}>Reset PW</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit User' : 'Add User'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required value={form.name} onChange={e=>set('name',e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)} />
                </div>
                {!editing && (
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input className="form-input" type="password" required minLength={6} value={form.password} onChange={e=>set('password',e.target.value)} />
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-select form-input" value={form.role} onChange={e=>set('role',e.target.value)}>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Saving…':'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {pwModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close" onClick={() => setPwModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Min 6 characters" value={newPw} onChange={e=>setNewPw(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setPwModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={resetPw}>Reset Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
