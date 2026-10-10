import React, { useState } from 'react';
import { ChevronLeft, Calendar } from 'lucide-react';
import { api } from '../api';

export default function BookingScreen({ params, user, onBack, onContinue }) {
  const { item, days: initialDays } = params;
  const [days, setDays] = useState(initialDays || 3);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);
  const formatDate = (date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const rent = item.price_per_day * days;
  const deposit = item.deposit ? item.deposit : 0;
  const fee = Math.round(rent * 0.02);
  const total = rent + deposit + fee;

  const handleContinue = async () => {
    if (!accepted) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.bookItem({
        itemId: item.id,
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        agreementAccepted: true
      });
      // Continue to payment with booking response ID
      onContinue({ itemId: item.id, bookingId: response.id, days, rent, deposit, fee, total, item });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pad" style={{paddingTop: '16px'}}>
      <div className="header-row">
        <button onClick={onBack} className="back-btn-static"><ChevronLeft size={24} /></button>
        <h2 style={{margin:0}}>Booking Details</h2>
      </div>

      {error && <div className="banner" style={{background: 'rgba(191,97,106,0.2)', color: '#BF616A', border: '1px solid #BF616A'}}>{error}</div>}

      <div className="split-layout">
        <div>
          <h3 style={{fontWeight: '700', fontSize: '15px', marginBottom: '12px'}}>Rental Period</h3>
          <div className="row gap-3 mb-4">
            <div className="card flex-1 text-center" style={{marginBottom: 0}}>
              <div style={{fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px'}}>From</div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700'}}>
                <Calendar size={18} color="var(--accent)" /> {formatDate(today)}
              </div>
            </div>
            <div className="card flex-1 text-center" style={{marginBottom: 0}}>
              <div style={{fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px'}}>To</div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700'}}>
                <Calendar size={18} color="var(--accent)" /> {formatDate(endDate)}
              </div>
            </div>
          </div>

          <div className="card row mb-4">
            <span style={{fontWeight: '700'}}>Total Days</span>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <button onClick={() => setDays(Math.max(1, days - 1))} className="back-btn-static" style={{width: '36px', height: '36px'}}>-</button>
              <span style={{fontWeight: '700', fontSize: '18px', width: '24px', textAlign: 'center'}}>{days}</span>
              <button onClick={() => setDays(days + 1)} className="back-btn-static" style={{width: '36px', height: '36px'}}>+</button>
            </div>
          </div>

          <h3 style={{fontWeight: '700', fontSize: '15px', marginBottom: '12px', marginTop: '24px'}}>Rental Agreement</h3>
          <div className="agreement-card">
            <ol>
              <li>Borrower uses the item with care and returns it on the agreed date.</li>
              <li>Damage or loss is settled from the deposit.</li>
              <li>Late return is charged at the daily rent.</li>
              <li>Both parties confirm they are verified students.</li>
            </ol>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <span>I have read and accept the agreement</span>
          </label>
        </div>

        <div>
          <div className="card row" style={{justifyContent: 'flex-start', gap: '16px', marginBottom: '24px'}}>
            <div className="thumb">
              <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <div className="thumb-fallback" style={{display: 'none'}}></div>
            </div>
            <div>
              <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '6px'}}>{item.title}</div>
              <div style={{color: 'var(--accent)', fontWeight: '700', fontSize: '15px'}}>Rs {item.price_per_day} / day</div>
            </div>
          </div>
          
          <div className="fixed-bottom desktop-fixed-bottom-reset">
            <button className="btn" onClick={handleContinue} disabled={!accepted || loading} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
               {loading ? <div className="spinner"></div> : 'Accept and Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
