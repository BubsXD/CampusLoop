import React, { useState, useEffect } from 'react';
import { ShieldCheck, PlusCircle } from 'lucide-react';
import { api } from '../api';

export default function ProfileScreen({ user, onLogout }) {
  const [showAdd, setShowAdd] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', category: 'Electronics', price: '', value: '', condition: 'Good' });

  const fetchItems = async () => {
    try {
      // Find items owned by this user (filtering by owner name client-side since API doesn't have ?owner filter yet, or we can just fetch all and filter)
      const allItems = await api.getItems();
      setItems(allItems.filter(i => i.owner_id === user.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.createItem({
        title: formData.title,
        category: formData.category,
        price_per_day: Number(formData.price),
        item_value: Number(formData.value),
        condition: formData.condition,
        description: '',
        image: "/images/casio-fx-991ex.svg"
      });
      setShowAdd(false);
      setFormData({ title: '', category: 'Electronics', price: '', value: '', condition: 'Good' });
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.deleteItem(id);
        fetchItems();
      } catch(err) {
        alert(err.message);
      }
    }
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
            <input required type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Scientific Calculator" />
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
              <input required type="number" min="1" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label>Item Value (Rs)</label>
              <input required type="number" min="1" className="input" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
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
          {user.name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{fontWeight: '700', fontSize: '20px', marginBottom: '6px'}}>{user.name}</div>
          <div className="muted" style={{fontSize: '14px', marginBottom: '4px'}}>{user.college}</div>
          <div style={{fontSize: '14px'}}>{user.roll_no} • {user.phone}</div>
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

      {loading ? <div className="text-center" style={{padding: '24px'}}><div className="spinner"></div></div> : (
        <div style={{marginBottom: '40px'}} className={items.length > 0 ? "item-grid" : ""}>
          {items.length === 0 && <div className="muted text-center" style={{padding: '24px', border: '1px dashed var(--line)', borderRadius: '14px', fontSize: '14px'}}>You haven't listed any items.</div>}
          {items.map(item => (
            <div key={item.id} className="card row" style={{justifyContent: 'space-between', gap: '16px', marginBottom: '0'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <div className="thumb" style={{width: '56px', height: '56px', borderRadius: '10px'}}>
                   <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                   <div className="thumb-fallback" style={{display: 'none'}}></div>
                 </div>
                 <div>
                   <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '4px'}}>{item.title}</div>
                   <div style={{color: 'var(--accent)', fontSize: '14px', fontWeight: '700'}}>Rs {item.price_per_day} / day</div>
                 </div>
               </div>
               <button onClick={() => handleDelete(item.id)} style={{background: 'none', border: 'none', color: '#BF616A', cursor: 'pointer', fontSize: '13px', fontWeight: '700'}}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div className="hr" style={{marginBottom: '24px'}}></div>
      <div className="text-center" style={{marginBottom: '40px'}}>
        <button onClick={onLogout} className="btn-outline" style={{borderColor: 'var(--line)', color: 'var(--text)'}}>Log out</button>
      </div>
    </div>
  );
}
