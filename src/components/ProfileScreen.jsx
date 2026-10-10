import React, { useState } from 'react';
import { ShieldCheck, PlusCircle } from 'lucide-react';

export default function ProfileScreen({ user, items, onReset, onAdd }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Electronics', price: '', value: '', condition: 'Good' });

  const handleAdd = (e) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      value: Number(formData.value),
      condition: formData.condition,
      owner: user.name,
      rating: 5.0,
      deposit: Number(formData.value) >= 5000 ? Math.round(Number(formData.value) * 0.1) : 0,
      image: "/images/casio-fx-991ex.svg" // fallback
    });
    setShowAdd(false);
    setFormData({ name: '', category: 'Electronics', price: '', value: '', condition: 'Good' });
  };

  if (showAdd) {
    return (
      <div className="pad" style={{paddingTop: '16px'}}>
        <div className="header-row">
          <button onClick={() => setShowAdd(false)} style={{background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '15px'}}>Cancel</button>
          <h2 style={{margin: 0}}>List an Item</h2>
        </div>
        <form onSubmit={handleAdd} style={{maxWidth: '500px'}}>
          <div className="form-group">
            <label>Title</label>
            <input required type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Scientific Calculator" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Lab</option><option>Books</option><option>Electronics</option><option>Cycles</option>
            </select>
          </div>
          <div className="row gap-3">
            <div className="form-group flex-1">
              <label>Price / Day (Rs)</label>
              <input required type="number" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label>Item Value (Rs)</label>
              <input required type="number" className="input" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Condition</label>
            <select className="input" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
              <option>Like new</option><option>Good</option><option>Fair</option>
            </select>
          </div>
          <button type="submit" className="btn mt-4">List Item</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pad" style={{paddingTop: '16px'}}>
      <h1 style={{marginBottom: '24px'}}>Profile</h1>

      <div className="card row" style={{justifyContent: 'flex-start', gap: '20px', marginBottom: '16px'}}>
        <div className="avatar" style={{width: '72px', height: '72px', fontSize: '28px', background: 'var(--purple)', color: 'var(--bg)'}}>
          {user.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div>
          <div style={{fontWeight: '700', fontSize: '20px', marginBottom: '6px'}}>{user.name}</div>
          <div className="muted" style={{fontSize: '14px', marginBottom: '4px'}}>{user.major}</div>
          <div style={{fontSize: '14px'}}>{user.college}</div>
        </div>
      </div>

      {user.verified && (
        <div className="card row" style={{justifyContent: 'flex-start', gap: '16px', background: 'rgba(163,190,140,0.1)', borderColor: 'rgba(163,190,140,0.3)', marginBottom: '32px'}}>
          <ShieldCheck color="var(--green)" size={28} />
          <div>
            <div style={{fontWeight: '700', fontSize: '15px', color: 'var(--green)', marginBottom: '4px'}}>Verified Student</div>
            <div className="muted" style={{fontSize: '12px'}}>ID card & phone verified (re-verified each semester)</div>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <h3 style={{fontWeight: '700', fontSize: '16px'}}>My Listings</h3>
        <button onClick={() => setShowAdd(true)} style={{background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}>
          <PlusCircle size={18} /> Add Item
        </button>
      </div>

      <div style={{marginBottom: '40px'}} className={items.length > 0 ? "item-grid" : ""}>
        {items.length === 0 && <div className="muted text-center" style={{padding: '24px', border: '1px dashed var(--line)', borderRadius: '14px', fontSize: '14px'}}>You haven't listed any items.</div>}
        {items.map(item => (
          <div key={item.id} className="card row" style={{justifyContent: 'flex-start', gap: '16px', marginBottom: '0'}}>
             <div className="thumb" style={{width: '56px', height: '56px', borderRadius: '10px'}}>
               <img src={item.image} alt={item.name} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
               <div className="thumb-fallback" style={{display: 'none'}}></div>
             </div>
             <div>
               <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '4px'}}>{item.name}</div>
               <div style={{color: 'var(--accent)', fontSize: '14px', fontWeight: '700'}}>Rs {item.price} / day</div>
             </div>
          </div>
        ))}
      </div>

      <div className="hr" style={{marginBottom: '24px'}}></div>
      <div className="text-center">
        <button onClick={onReset} className="text-link">Reset demo data</button>
      </div>
    </div>
  );
}
