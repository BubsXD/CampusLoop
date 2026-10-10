import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function DetailsScreen({ itemId, user, onBack, onBook }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    api.getItem(itemId)
      .then(data => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading) return <div className="pad text-center" style={{paddingTop:'60px'}}><div className="spinner"></div></div>;
  if (error) return <div className="pad text-center" style={{paddingTop:'60px', color: 'var(--yellow)'}}>{error}</div>;
  if (!item) return null;

  return (
    <div className="split-layout split-details">
      <div>
        <button onClick={onBack} className="desktop-back-btn desktop-only"><ChevronLeft size={20}/> Back to list</button>
        <div className="hero-wrapper">
          <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
          <div className="thumb-fallback" style={{display: 'none'}}></div>
          <div className="hero-overlay"></div>
          <button onClick={onBack} className="back-btn mobile-only"><ChevronLeft size={24} /></button>
        </div>
      </div>

      <div className="pad">
        <span className="cat-tag">{item.category}</span>
        <h1 style={{fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: '8px'}}>{item.title}</h1>
        <div className="price" style={{fontSize: '24px', color: 'var(--accent)', marginBottom: '24px'}}>
          Rs {item.price_per_day} <span className="muted" style={{fontSize: '14px', fontWeight: 'normal'}}>/ day</span>
        </div>

        <div className="row" style={{padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: '24px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div className="avatar" style={{width: '44px', height: '44px', background: 'var(--purple)', color: 'var(--bg)', fontSize: '18px', fontWeight: 'bold'}}>{item.owner[0]}</div>
            <div>
              <div style={{fontWeight: '700', fontSize:'15px'}}>{item.owner}</div>
              <div style={{display: 'flex', gap: '12px', marginTop: '4px'}}>
                <span style={{color: 'var(--yellow)', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center'}}><Star size={14} fill="currentColor" style={{marginRight: '4px'}}/> {item.rating}</span>
                {item.verified && <span style={{color: 'var(--green)', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center'}}><ShieldCheck size={14} style={{marginRight: '4px'}}/> Verified</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="row mb-3">
            <span className="muted">Condition</span>
            <span style={{fontWeight: '700'}}>{item.condition}</span>
          </div>
          <div className="row mb-3">
            <span className="muted">Item value</span>
            <span style={{fontWeight: '700'}}>Rs {item.item_value.toLocaleString('en-IN')}</span>
          </div>
          <div className="row" style={{color: 'var(--yellow)'}}>
            <span>Refundable deposit</span>
            <span style={{fontWeight: '700'}}>Rs {item.deposit ? item.deposit.toLocaleString('en-IN') : '0'}</span>
          </div>
        </div>

        <h3 style={{fontWeight: '700', marginBottom: '8px', fontSize: '15px', marginTop:'24px'}}>Description</h3>
        <p className="muted" style={{lineHeight: '1.6', fontSize: '14px', marginBottom: '32px'}}>
          {item.description || `High-quality ${item.title.toLowerCase()} available for rent. Handle with care.`}
        </p>

        <div className="fixed-bottom desktop-fixed-bottom-reset">
          <button className="btn" onClick={() => onBook({ itemId: item.id, days: 3, item })} disabled={user?.id === item.owner_id}>
             {user?.id === item.owner_id ? 'This is your item' : 'Request to Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
