import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api, fmt } from '../utils/api';

export default function POS() {
  const [products, setProducts]   = useState([]);
  const [cart, setCart]           = useState([]);
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [discount, setDiscount]   = useState(0);
  const [payMethod, setPayMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt]     = useState(null);

  useEffect(() => {
    api.getProducts().then(r => setProducts(r.data));
    api.getCategories().then(r => setCategories(r.data));
  }, []);

  const filtered = products.filter(p =>
    p.is_active && p.stock > 0 &&
    (!search    || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku||'').includes(search)) &&
    (!catFilter || p.category_id === parseInt(catFilter))
  );

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.product_id === product.id);
      if (ex) {
        if (ex.quantity >= product.stock) { toast.error('Max stock reached'); return prev; }
        return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product_id: product.id, name: product.name, price: parseFloat(product.price), quantity: 1, stock: product.stock }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.product_id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
                        .filter(i => !(i.product_id === id && i.quantity + delta < 1)));
  };
  const removeItem = (id) => setCart(prev => prev.filter(i => i.product_id !== id));
  const clearCart  = () => { setCart([]); setDiscount(0); setCustomerName(''); };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const disc     = Math.min(parseFloat(discount)||0, subtotal);
  const total    = subtotal - disc;

  const checkout = async () => {
    if (!cart.length) return toast.error('Cart is empty');
    setSubmitting(true);
    try {
      const { data } = await api.createOrder({
        items:          cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        customer_name:  customerName || 'Walk-in',
        payment_method: payMethod,
        discount:       disc,
      });
      toast.success('Order placed! 🎉');
      setReceipt({ ...data.order, items: cart, disc, subtotal, total });
      clearCart();
      api.getProducts().then(r => setProducts(r.data)); // refresh stock
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Point of Sale</h2>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <select className="form-select" style={{ width:'160px', padding:'7px 10px', fontSize:'12px' }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="pos-layout">
        {/* Product Grid */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', overflow:'hidden' }}>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search product or SKU…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="product-grid">
            {filtered.map(p => (
              <div key={p.id} className="product-tile" onClick={() => addToCart(p)}>
                {p.image
                  ? <img src={`/images/${p.image}`} alt={p.name} onError={e => e.target.style.display='none'} />
                  : <div style={{ width:80, height:80, margin:'0 auto 10px', background:'var(--bg4)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>📱</div>
                }
                <div className="pt-name">{p.name}</div>
                <div className="pt-price">{fmt.currency(p.price)}</div>
                <div className="pt-stock">Stock: {p.stock}</div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ gridColumn:'1/-1', color:'var(--text3)', textAlign:'center', padding:'40px 0' }}>No products found.</p>}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="cart-panel">
          <div className="cart-header">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3>Current Order</h3>
              {cart.length > 0 && <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear</button>}
            </div>
            <input className="form-input" style={{ marginTop:'10px', fontSize:'13px', padding:'7px 10px' }}
              placeholder="Customer name (optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} />
          </div>

          <div className="cart-items">
            {cart.length === 0 && (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text3)', gap:'8px' }}>
                <span style={{ fontSize:40 }}>🛒</span>
                <span style={{ fontSize:13 }}>Cart is empty</span>
              </div>
            )}
            {cart.map(item => (
              <div key={item.product_id} className="cart-item">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQty(item.product_id, -1)}>−</button>
                  <span style={{ fontSize:'13px', fontWeight:'600', minWidth:'20px', textAlign:'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.product_id, 1)}>+</button>
                </div>
                <div className="cart-item-price">{fmt.currency(item.price * item.quantity)}</div>
                <button style={{ background:'none', border:'none', color:'var(--danger)', fontSize:'16px', cursor:'pointer', flexShrink:0 }} onClick={() => removeItem(item.product_id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total-row"><span>Subtotal</span><span>{fmt.currency(subtotal)}</span></div>
            <div className="cart-total-row" style={{ alignItems:'center' }}>
              <span>Discount (₱)</span>
              <input type="number" min="0" max={subtotal} value={discount} onChange={e => setDiscount(e.target.value)}
                style={{ width:'90px', padding:'4px 8px', fontSize:'13px', textAlign:'right', background:'var(--bg4)', border:'1px solid var(--border)', borderRadius:'6px', color:'var(--text)' }} />
            </div>
            <div className="cart-total-row grand"><span>TOTAL</span><span style={{ color:'var(--accent)' }}>{fmt.currency(total)}</span></div>

            <div style={{ marginTop:'12px', marginBottom:'12px' }}>
              <label className="form-label">Payment Method</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                {['cash','card','gcash','maya'].map(m => (
                  <button key={m} onClick={() => setPayMethod(m)}
                    style={{ padding:'8px', borderRadius:'8px', border:`1px solid ${payMethod===m?'var(--accent)':'var(--border)'}`, background: payMethod===m?'rgba(41,151,255,.15)':'var(--bg3)', color: payMethod===m?'var(--accent)':'var(--text2)', fontWeight:'600', fontSize:'12px', textTransform:'uppercase', cursor:'pointer' }}>
                    {m === 'cash' ? '💵' : m === 'card' ? '💳' : m === 'gcash' ? '📱' : '🌊'} {m}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-success" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'15px', borderRadius:'12px' }}
              onClick={checkout} disabled={submitting || !cart.length}>
              {submitting ? 'Processing…' : `Checkout — ${fmt.currency(total)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="modal-overlay" onClick={() => setReceipt(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:'380px' }}>
            <div className="modal-body" style={{ textAlign:'center' }}>
              <div style={{ fontSize:'48px', marginBottom:'8px' }}>✅</div>
              <h3 style={{ fontSize:'20px', fontWeight:'700', marginBottom:'4px' }}>Order Complete!</h3>
              <p style={{ color:'var(--text2)', fontSize:'13px', marginBottom:'20px' }}>{receipt.order_number}</p>
              <div style={{ background:'var(--bg4)', borderRadius:'10px', padding:'14px', textAlign:'left', marginBottom:'16px' }}>
                {receipt.items.map(i => (
                  <div key={i.product_id} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'6px' }}>
                    <span>{i.name} × {i.quantity}</span>
                    <span>{fmt.currency(i.price * i.quantity)}</span>
                  </div>
                ))}
                <div style={{ borderTop:'1px solid var(--border)', marginTop:'8px', paddingTop:'8px' }}>
                  {receipt.disc > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--accent2)' }}><span>Discount</span><span>-{fmt.currency(receipt.disc)}</span></div>}
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'700', fontSize:'16px', marginTop:'4px' }}>
                    <span>Total</span><span style={{ color:'var(--accent)' }}>{fmt.currency(receipt.total)}</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', borderRadius:'10px', padding:'10px' }} onClick={() => setReceipt(null)}>
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
