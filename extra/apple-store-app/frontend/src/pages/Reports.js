import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api, fmt } from '../utils/api';

const COLORS = ['#2997ff','#30d158','#ffd60a','#ff453a','#bf5af2','#64d2ff'];

export default function Reports() {
  const [tab, setTab]         = useState('sales');
  const [sales, setSales]     = useState([]);
  const [topProds, setTopProds] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [from, setFrom]       = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0,10); });
  const [to, setTo]           = useState(new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, t, p, i] = await Promise.all([
        api.salesReport({ from, to }),
        api.topProducts({ from, to }),
        api.paymentMethods(),
        api.inventoryReport(),
      ]);
      setSales(s.data); setTopProds(t.data); setPayments(p.data); setInventory(i.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [from, to]);

  const totalRevenue = sales.reduce((s, d) => s + parseFloat(d.revenue||0), 0);
  const totalOrders  = sales.reduce((s, d) => s + parseInt(d.orders||0), 0);

  const tabs = ['sales','products','payments','inventory'];

  return (
    <div>
      <div className="page-header">
        <h2>Reports</h2>
        <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
          <input type="date" className="form-input" style={{ width:'140px' }} value={from} onChange={e=>setFrom(e.target.value)} />
          <span style={{ color:'var(--text3)', fontSize:'13px' }}>to</span>
          <input type="date" className="form-input" style={{ width:'140px' }} value={to} onChange={e=>setTo(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={load} disabled={loading}>{loading?'Loading…':'Apply'}</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'20px', background:'var(--bg3)', padding:'4px', borderRadius:'12px', width:'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'7px 18px', borderRadius:'9px', border:'none', fontWeight:'600', fontSize:'12px', textTransform:'capitalize', letterSpacing:'.02em', cursor:'pointer', transition:'all .15s',
              background: tab===t ? 'var(--bg)' : 'transparent', color: tab===t ? 'var(--text)' : 'var(--text3)', boxShadow: tab===t ? '0 1px 4px rgba(0,0,0,.3)' : 'none' }}>
            {t === 'products' ? 'Top Products' : t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* SALES TAB */}
      {tab === 'sales' && (
        <div>
          <div className="stat-grid" style={{ marginBottom:'20px' }}>
            {[
              { label:'Total Revenue', value: fmt.currency(totalRevenue), icon:'💰', color:'var(--accent)' },
              { label:'Total Orders',  value: totalOrders,                icon:'🛒', color:'var(--accent2)' },
              { label:'Avg Order',     value: fmt.currency(totalOrders ? totalRevenue/totalOrders : 0), icon:'📊', color:'var(--warning)' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value" style={{ color:s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom:'16px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'16px' }}>Daily Revenue</h3>
            {sales.length === 0 ? <p style={{ color:'var(--text3)', textAlign:'center', padding:'40px 0' }}>No sales in this period.</p> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={sales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
                  <XAxis dataKey="date" tick={{ fill:'rgba(245,245,247,.4)', fontSize:11 }} tickFormatter={d=>d.slice(5)} />
                  <YAxis tick={{ fill:'rgba(245,245,247,.4)', fontSize:11 }} tickFormatter={v=>'₱'+v.toLocaleString()} />
                  <Tooltip contentStyle={{ background:'#1c1c1e', border:'1px solid rgba(255,255,255,.1)', borderRadius:'10px', color:'#f5f5f7' }}
                    formatter={(v,n) => [n==='revenue'?fmt.currency(v):v, n==='revenue'?'Revenue':'Orders']} />
                  <Line type="monotone" dataKey="revenue" stroke="#2997ff" strokeWidth={2.5} dot={false} name="revenue" />
                  <Line type="monotone" dataKey="orders"  stroke="#30d158" strokeWidth={2}   dot={false} name="orders" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Orders</th><th>Revenue</th><th>Discounts</th></tr></thead>
              <tbody>
                {sales.map((d,i) => (
                  <tr key={i}>
                    <td>{fmt.date(d.date)}</td>
                    <td><span className="badge badge-blue">{d.orders}</span></td>
                    <td style={{ fontWeight:'600', color:'var(--accent)' }}>{fmt.currency(d.revenue)}</td>
                    <td style={{ color:'var(--danger)', fontSize:'12px' }}>{fmt.currency(d.discounts)}</td>
                  </tr>
                ))}
                {sales.length === 0 && <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text3)', padding:'30px' }}>No data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOP PRODUCTS TAB */}
      {tab === 'products' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Product</th><th>Units Sold</th><th>Revenue</th><th>Price</th></tr></thead>
            <tbody>
              {topProds.map((p,i) => (
                <tr key={p.id}>
                  <td style={{ fontWeight:'700', color:'var(--gold)', width:'40px' }}>#{i+1}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      {p.image ? <img src={`/images/${p.image}`} alt="" style={{ width:32,height:32,objectFit:'contain',borderRadius:4,background:'#111' }} onError={e=>e.target.style.display='none'} /> : <span>📱</span>}
                      <span style={{ fontSize:'13px', fontWeight:'600' }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-green">{p.units_sold} units</span></td>
                  <td style={{ fontWeight:'700', color:'var(--accent)' }}>{fmt.currency(p.revenue)}</td>
                  <td style={{ fontSize:'12px', color:'var(--text2)' }}>{fmt.currency(p.price)}</td>
                </tr>
              ))}
              {topProds.length===0 && <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text3)', padding:'30px' }}>No sales in this period.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {tab === 'payments' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div className="card">
            <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'16px' }}>Payment Methods (This Month)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={payments} dataKey="total" nameKey="payment_method" cx="50%" cy="50%" outerRadius={90} label={({payment_method,percent})=>`${payment_method} ${(percent*100).toFixed(0)}%`}>
                  {payments.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => fmt.currency(v)} contentStyle={{ background:'#1c1c1e', border:'1px solid rgba(255,255,255,.1)', borderRadius:'10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'14px' }}>Breakdown</h3>
            {payments.map((p,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:12, height:12, borderRadius:3, background:COLORS[i%COLORS.length], flexShrink:0 }} />
                <span style={{ flex:1, fontSize:'13px', fontWeight:'600', textTransform:'uppercase' }}>{p.payment_method}</span>
                <span className="badge badge-blue">{p.count} orders</span>
                <span style={{ fontWeight:'700', color:'var(--accent)' }}>{fmt.currency(p.total)}</span>
              </div>
            ))}
            {payments.length===0 && <p style={{ color:'var(--text3)', textAlign:'center', padding:'30px 0' }}>No data this month.</p>}
          </div>
        </div>
      )}

      {/* INVENTORY TAB */}
      {tab === 'inventory' && inventory && (
        <div>
          <div className="stat-grid" style={{ marginBottom:'16px' }}>
            {[
              { label:'Total Stock Value (Cost)',   value: fmt.currency(inventory.totals?.total_cost),   icon:'📦', color:'var(--accent)' },
              { label:'Total Retail Value',         value: fmt.currency(inventory.totals?.total_retail), icon:'💎', color:'var(--gold)' },
              { label:'Potential Profit',           value: fmt.currency((inventory.totals?.total_retail||0)-(inventory.totals?.total_cost||0)), icon:'📈', color:'var(--accent2)' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value" style={{ fontSize:'20px', color:s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Cost Price</th><th>Retail Price</th><th>Stock Value</th><th>Retail Value</th></tr></thead>
              <tbody>
                {inventory.products.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontSize:'13px', fontWeight:'600' }}>{p.name}</td>
                    <td style={{ fontSize:'12px', color:'var(--text2)' }}>{p.category_name}</td>
                    <td><span className={`badge ${p.stock<=0?'badge-red':p.stock<=p.low_stock_at?'badge-yellow':'badge-green'}`}>{p.stock}</span></td>
                    <td style={{ fontSize:'12px', color:'var(--text2)' }}>{fmt.currency(p.cost_price)}</td>
                    <td style={{ fontWeight:'600' }}>{fmt.currency(p.price)}</td>
                    <td style={{ color:'var(--accent)' }}>{fmt.currency(p.stock_value)}</td>
                    <td style={{ color:'var(--gold)' }}>{fmt.currency(p.retail_value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
