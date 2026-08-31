import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { api, fmt } from '../utils/api';

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-loading" style={{ height:'60vh' }}><div className="spinner" /></div>;
  if (!data)   return <p>Failed to load dashboard.</p>;

  const stats = [
    { label:"Today's Sales",    value: fmt.currency(data.today_sales),   icon:'💰', color:'#2997ff', glow:'#2997ff' },
    { label:"Today's Orders",   value: data.today_orders,                 icon:'🛒', color:'#30d158', glow:'#30d158' },
    { label:'Monthly Revenue',  value: fmt.currency(data.month_sales),   icon:'📈', color:'#ffd60a', glow:'#ffd60a' },
    { label:'Total Products',   value: data.total_products,               icon:'📦', color:'#bf5af2', glow:'#bf5af2' },
    { label:'Low Stock Alerts', value: data.low_stock,                    icon:'⚠️',  color:'#ff453a', glow:'#ff453a' },
    { label:'Total Customers',  value: data.total_customers,              icon:'👤', color:'#64d2ff', glow:'#64d2ff' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <span style={{ fontSize:'13px', color:'var(--text2)' }}>
          {new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-glow" style={{ background: s.glow }} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px', marginBottom:'20px' }}>
        <div className="card">
          <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'16px' }}>Revenue — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.chart_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="date" tick={{ fill:'rgba(245,245,247,.4)', fontSize:11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill:'rgba(245,245,247,.4)', fontSize:11 }} tickFormatter={v => '₱'+v.toLocaleString()} />
              <Tooltip contentStyle={{ background:'#1c1c1e', border:'1px solid rgba(255,255,255,.1)', borderRadius:'10px', color:'#f5f5f7' }}
                formatter={(v) => ['₱'+parseFloat(v).toLocaleString(), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2997ff" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'16px' }}>Orders — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.chart_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="date" tick={{ fill:'rgba(245,245,247,.4)', fontSize:11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill:'rgba(245,245,247,.4)', fontSize:11 }} />
              <Tooltip contentStyle={{ background:'#1c1c1e', border:'1px solid rgba(255,255,255,.1)', borderRadius:'10px', color:'#f5f5f7' }} />
              <Bar dataKey="orders" fill="#30d158" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        {/* Top Products */}
        <div className="card">
          <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'14px' }}>Top Products This Month</h3>
          {data.top_products.length === 0 && <p style={{ color:'var(--text3)', fontSize:'13px' }}>No sales yet.</p>}
          {data.top_products.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:'18px', width:'28px', textAlign:'center', color:'var(--text3)', fontWeight:'700' }}>#{i+1}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'13px', fontWeight:'600', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                <div style={{ fontSize:'11px', color:'var(--text3)' }}>{p.units_sold} units sold</div>
              </div>
              <span style={{ fontSize:'13px', fontWeight:'600', color:'var(--accent)' }}>{fmt.currency(p.revenue)}</span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 style={{ fontSize:'15px', fontWeight:'700', marginBottom:'14px' }}>Recent Orders</h3>
          {data.recent_orders.map(o => (
            <div key={o.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'12.5px', fontWeight:'600' }}>{o.order_number}</div>
                <div style={{ fontSize:'11px', color:'var(--text3)' }}>{o.customer_name} · {fmt.datetime(o.created_at).slice(0,16)}</div>
              </div>
              <span className={`badge badge-${o.order_status==='completed'?'green':o.order_status==='cancelled'?'red':'yellow'}`}>
                {o.order_status}
              </span>
              <span style={{ fontSize:'13px', fontWeight:'700' }}>{fmt.currency(o.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
