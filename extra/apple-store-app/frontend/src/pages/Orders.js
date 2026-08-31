import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api, fmt } from '../utils/api';

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [search, setSearch]   = useState('');
  const [dateFilter, setDate] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]   = useState(null);

  const load = () => api.getOrders({ search, date: dateFilter }).then(r => setOrders(r.data));
  useEffect(() => { load(); }, [search, dateFilter]);

  const openDetail = async (o) => {
    setSelected(o);
    const { data } = await api.getOrder(o.id);
    setDetail(data);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      toast.success('Status updated');
      load();
      if (detail?.id === id) setDetail({...detail, order_status: status});
    } catch { toast.error('Failed'); }
  };

  const statusColor = (s) => ({ completed:'badge-green', cancelled:'badge-red', pending:'badge-yellow', refunded:'badge-blue' }[s] || 'badge-blue');

  return (
    <div>
      <div className="page-header">
        <h2>Orders</h2>
        <span style={{ fontSize:'13px', color:'var(--text2)' }}>{orders.length} orders</span>
      </div>

      <div className="card" style={{ marginBottom:'16px', padding:'14px 16px' }}>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <div className="search-bar" style={{ flex:1 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search order # or customer…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <input type="date" className="form-input" style={{ width:'160px' }} value={dateFilter} onChange={e=>setDate(e.target.value)} />
          {dateFilter && <button className="btn btn-ghost btn-sm" onClick={()=>setDate('')}>Clear</button>}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Order #</th><th>Customer</th><th>Cashier</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily:'monospace', fontSize:'12px', color:'var(--accent)' }}>{o.order_number}</td>
                <td style={{ fontSize:'13px' }}>{o.customer_name}</td>
                <td style={{ fontSize:'12px', color:'var(--text2)' }}>{o.cashier_name}</td>
                <td style={{ fontSize:'12px', color:'var(--text2)' }}>—</td>
                <td style={{ fontWeight:'700', color:'var(--accent)' }}>{fmt.currency(o.total)}</td>
                <td><span className="badge badge-blue" style={{ textTransform:'uppercase', fontSize:'9px' }}>{o.payment_method}</span></td>
                <td><span className={`badge ${statusColor(o.order_status)}`}>{o.order_status}</span></td>
                <td style={{ fontSize:'11px', color:'var(--text3)' }}>{fmt.datetime(o.created_at).slice(0,16)}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={()=>openDetail(o)}>View</button></td>
              </tr>
            ))}
            {orders.length===0 && <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--text3)', padding:'40px' }}>No orders found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => { setSelected(null); setDetail(null); }}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order {selected.order_number}</h3>
              <button className="modal-close" onClick={()=>{setSelected(null);setDetail(null);}}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
                {[['Customer', selected.customer_name],['Cashier', selected.cashier_name],['Payment', selected.payment_method.toUpperCase()],['Date', fmt.datetime(selected.created_at).slice(0,16)]].map(([l,v])=>(
                  <div key={l}><div style={{ fontSize:'11px',color:'var(--text3)',marginBottom:'2px' }}>{l}</div><div style={{ fontSize:'13px',fontWeight:'600' }}>{v}</div></div>
                ))}
              </div>

              {detail?.items && (
                <div style={{ marginBottom:'16px' }}>
                  <div style={{ fontSize:'11px',fontWeight:'700',letterSpacing:'.06em',color:'var(--text3)',textTransform:'uppercase',marginBottom:'8px' }}>Items</div>
                  {detail.items.map((i,idx) => (
                    <div key={idx} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',fontSize:'13px' }}>
                      <span>{i.product_name} × {i.quantity}</span>
                      <span style={{ fontWeight:'600' }}>{fmt.currency(i.subtotal)}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex',justifyContent:'space-between',marginTop:'8px',fontWeight:'700',fontSize:'15px' }}>
                    <span>Total</span><span style={{ color:'var(--accent)' }}>{fmt.currency(selected.total)}</span>
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize:'11px',fontWeight:'700',letterSpacing:'.06em',color:'var(--text3)',textTransform:'uppercase',marginBottom:'8px' }}>Update Status</div>
                <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                  {['completed','pending','cancelled','refunded'].map(s=>(
                    <button key={s} className={`btn btn-sm ${s==='completed'?'btn-success':s==='cancelled'?'btn-danger':'btn-ghost'}`}
                      onClick={()=>updateStatus(selected.id,s)}>
                      {s.charAt(0).toUpperCase()+s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
