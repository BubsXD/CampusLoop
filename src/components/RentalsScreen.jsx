import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RentalsScreen({ bookings, items, onUpdateStatus }) {
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(5);

  const getStatusClass = (status) => {
    switch(status) {
      case 'Requested': return 'status-requested';
      case 'Active': return 'status-active';
      case 'Returned': return 'status-returned';
      default: return '';
    }
  };

  return (
    <div className="pad" style={{paddingTop: '16px'}}>
      <h1 style={{marginBottom: '24px'}}>My Rentals</h1>

      {bookings.length === 0 && <p className="muted text-center" style={{padding: '40px 0'}}>No rentals yet.</p>}

      <div className={bookings.length > 0 ? "item-grid" : ""}>
        {bookings.map(booking => {
          const item = items.find(i => i.id === booking.itemId);
          if (!item) return null;

          return (
            <div key={booking.id} className="card" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
              <div className="row mb-3">
                <span className={`status-badge ${getStatusClass(booking.status)}`}>{booking.status}</span>
                <span className="muted" style={{fontSize: '11px'}}>ID: {booking.bookingId || booking.id}</span>
              </div>
              
              <div style={{display: 'flex', gap: '16px', marginBottom: '20px', flex: 1}}>
                <div className="thumb">
                  <img src={item.image} alt={item.name} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <div className="thumb-fallback" style={{display: 'none'}}></div>
                </div>
                <div>
                  <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '6px'}}>{item.name}</div>
                  <div className="muted" style={{fontSize: '13px', marginBottom: '8px'}}>Owner: {item.owner}</div>
                  <div style={{fontWeight: '700', fontSize: '15px'}}>Total: Rs {booking.total.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {booking.status === 'Requested' && (
                <button onClick={() => onUpdateStatus(booking.id, 'Active')} className="btn" style={{padding: '12px', fontSize: '14px', marginTop: 'auto'}}>Owner Accept (Sim)</button>
              )}

              {booking.status === 'Active' && (
                <button onClick={() => { onUpdateStatus(booking.id, 'Returned'); setRatingModal(booking.id); }} className="btn-outline" style={{marginTop: 'auto'}}>Mark as returned</button>
              )}
            </div>
          );
        })}
      </div>

      {ratingModal && (
        <div className="rating-modal">
          <div className="card">
            <div className="success-icon" style={{width: '60px', height: '60px', margin: '0 auto 16px'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style={{fontSize: '22px', fontWeight: '700', marginBottom: '8px'}}>Item Returned</h3>
            <p style={{color: 'var(--green)', fontWeight: '700', marginBottom: '32px'}}>Deposit released</p>
            
            <p style={{fontSize: '15px'}}>Rate your experience</p>
            <div className="stars">
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={36} onClick={() => setRating(star)} className={star <= rating ? 'filled' : ''} />
              ))}
            </div>

            <button onClick={() => { setRatingModal(null); setRating(5); }} className="btn">Submit Rating</button>
          </div>
        </div>
      )}
    </div>
  );
}
