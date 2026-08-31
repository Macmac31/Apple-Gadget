import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api, fmt } from '../utils/api';

const EMPTY = { category_id:'', name:'', description:'', price:'', cost_price:'', stock:'', low_stock_at:'5', sku:'', color:'', storage:'', image:'', is_active:true };

export default function Inventory() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [modal, setModal]           = useState(false);
  const [form, setForm]             = useState(EMPTY);
  const [editing, setEditing]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [deleting, setDeleting]     = useState(null);

  const load = () => {
    api.getProducts({ search }).then(r => setProducts(r.data));
  };
  useEffect(() => { load(); api.getCategories().then(r => setCategories(r.data)); }, [search]);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, is_active: !!p.is_active });
    setEditing(p.id); setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) { await api.updateProduct(editing, form); toast.success('Product updated'); }
      else         { await api.createProduct(form);          toast.success('Product added'); }
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeleting(id);
    try { await api.deleteProduct(id); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete'); }
    finally { setDeleting(null); }
  };

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const low = products.filter(p => p.stock <= p.low_stock_at).length;

  return (
    <div>
      <div className="page-header">
        <h2>Inventory</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {low > 0 && (
        <div style={{ background:'rgba(255,69,58,.1)', border:'1px solid rgba(255,69,58,.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
          <span>⚠️</span>
          <span style={{ fontSize:'13px', color:'#ff6961' }}><strong>{low} product{low>1?'s':''}</strong> at or below low stock threshold.</span>
        </div>
      )}

      <div className="card" style={{ marginBottom:'16px', padding:'14px 16px' }}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Search products, SKU…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th><th>SKU</th><th>Category</th>
              <th>Price</th><th>Cost</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    {p.image
                      ? <img src={`/images/${p.image}`} alt="" style={{ width:36,height:36,objectFit:'contain',borderRadius:6,background:'#111' }} onError={e=>e.target.style.display='none'} />
                      : <div style={{ width:36,height:36,borderRadius:6,background:'var(--bg4)',display:'flex',alignItems:'center',justifyContent:'center' }}>📱</div>
                    }
                    <div>
                      <div style={{ fontSize:'13px', fontWeight:'600' }}>{p.name}</div>
                      {p.color && <div style={{ fontSize:'11px', color:'var(--text3)' }}>{p.color}{p.storage ? ' · '+p.storage : ''}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ fontSize:'12px', color:'var(--text2)', fontFamily:'monospace' }}>{p.sku||'—'}</td>
                <td style={{ fontSize:'12px' }}>{p.category_name}</td>
                <td style={{ fontWeight:'600', color:'var(--accent)' }}>{fmt.currency(p.price)}</td>
                <td style={{ fontSize:'12px', color:'var(--text2)' }}>{fmt.currency(p.cost_price)}</td>
                <td>
                  <span className={`badge ${p.stock <= 0 ? 'badge-red' : p.stock <= p.low_stock_at ? 'badge-yellow' : 'badge-green'}`}>
                    {p.stock}
                  </span>
                </td>
                <td><span className={`badge ${p.is_active ? 'badge-green' : 'badge-red'}`}>{p.is_active ? 'Active':'Inactive'}</span></td>
                <td>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)} disabled={deleting===p.id}>Del</button>
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
          <div className="modal modal-lg">
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" required value={form.name} onChange={e=>set('name',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select form-input" required value={form.category_id} onChange={e=>set('category_id',e.target.value)}>
                      <option value="">Select…</option>
                      {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price (₱) *</label>
                    <input className="form-input" type="number" step="0.01" required value={form.price} onChange={e=>set('price',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost Price (₱)</label>
                    <input className="form-input" type="number" step="0.01" value={form.cost_price} onChange={e=>set('cost_price',e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" value={form.stock} onChange={e=>set('stock',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Low Stock Alert At</label>
                    <input className="form-input" type="number" value={form.low_stock_at} onChange={e=>set('low_stock_at',e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">SKU</label>
                    <input className="form-input" value={form.sku} onChange={e=>set('sku',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image filename</label>
                    <input className="form-input" placeholder="iphone17pro_black.jpg" value={form.image} onChange={e=>set('image',e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <input className="form-input" value={form.color} onChange={e=>set('color',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Storage</label>
                    <input className="form-input" placeholder="128GB" value={form.storage} onChange={e=>set('storage',e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontSize:'13px' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e=>set('is_active',e.target.checked)} />
                    Active (visible in POS)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Saving…':'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
