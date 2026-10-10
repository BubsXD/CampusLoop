import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { api } from '../api';

export default function RentalsScreen({ user, onSelect }) {
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(5);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      if (status === 'returned') {
        await api.returnBooking(id);
      }
      fetchBookings();
    } catch(err) {
      alert(err.message);
    }
  };
  
  const handleReview = async () => {
    try {
      await api.createReview({ bookingId: ratingModal, rating, comment: '' });
      setRatingModal(null);
      setRating(5);
      fetchBookings(); // To update average rating eventually
    } catch(err) {
      alert(err.message);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'requested': return 'status-requested';
      case 'active': return 'status-active';
      case 'returned': return 'status-returned';
      default: return '';
    }
  };

  if (loading) return <div className="pad text-center" style={{paddingTop:'60px'}}><div className="spinner"></div></div>;
  if (error) return <div className="pad text-center" style={{paddingTop:'60px', color: 'var(--yellow)'}}>{error}</div>;

  return (
    <div className="pad" style={{paddingTop: '16px'}}>
      <h1 style={{marginBottom: '24px'}}>My Rentals</h1>

      {bookings.length === 0 && <p className="muted text-center" style={{padding: '40px 0'}}>No rentals yet.</p>}

      <div className={bookings.length > 0 ? "item-grid" : ""}>
        {bookings.map(booking => {
          return (
            <div key={booking.id} className="card" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
              <div className="row mb-3">
                <span className={`status-badge ${getStatusClass(booking.status)}`} style={{textTransform: 'capitalize'}}>{booking.status}</span>
                <span className="muted" style={{fontSize: '11px'}}>ID: {booking.id.replace('b_', 'CL-')}</span>
              </div>
              
              <div style={{display: 'flex', gap: '16px', marginBottom: '20px', flex: 1, cursor: 'pointer'}} onClick={() => onSelect(booking.item_id)}>
                <div className="thumb">
                  <img src={booking.image} alt={booking.title} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <div className="thumb-fallback" style={{display: 'none'}}></div>
                </div>
                <div>
                  <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '6px'}}>{booking.title}</div>
                  <div className="muted" style={{fontSize: '13px', marginBottom: '8px'}}>Owner: {booking.owner_name}</div>
                  <div style={{fontWeight: '700', fontSize: '15px'}}>Total: Rs {booking.total.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {booking.status === 'requested' && (
                <div className="muted" style={{fontSize: '12px', marginTop: 'auto', textAlign: 'center'}}>Awaiting payment processing</div>
              )}

              {booking.status === 'active' && (
                <button onClick={() => { handleUpdateStatus(booking.id, 'returned'); setRatingModal(booking.id); }} className="btn-outline" style={{marginTop: 'auto'}}>Mark as returned</button>
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

            <button onClick={handleReview} className="btn">Submit Rating</button>
          </div>
        </div>
      )}
    </div>
  );
}
