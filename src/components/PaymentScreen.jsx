import React, { useState } from 'react';
import { ChevronLeft, Info, CheckCircle } from 'lucide-react';

export default function PaymentScreen({ item, params, user, onBack, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      const newId = 'CL-' + Math.floor(100000 + Math.random() * 900000);
      setBookingId(newId);
      setTimeout(() => onSuccess({ itemId: item.id, userId: user.id, status: 'Requested', days: params.days, total: params.total, bookingId: newId }), 2000);
    }, 1500);
  };

  if (done) {
    return (
      <div className="pad text-center" style={{paddingTop: '60px', margin: '0 auto', maxWidth: '400px'}}>
        <div className="success-icon">
          <CheckCircle size={36} />
        </div>
        <h1 style={{fontSize: '28px', marginBottom: '12px'}}>Request Sent!</h1>
        <p className="muted mb-4" style={{fontSize:'15px'}}>Your booking ID is <strong style={{color: 'var(--text)'}}>{bookingId}</strong></p>
        
        <div className="card mb-4" style={{padding: '24px'}}>
          <div style={{color: 'var(--yellow)', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px'}}>
            <ShieldIcon /> Escrow held
          </div>
          <p className="muted" style={{fontSize: '13px', lineHeight: '1.5'}}>Rs {params.total.toLocaleString('en-IN')} is held securely until the item is returned.</p>
        </div>
        
        <div className="spinner" style={{borderTopColor: 'var(--accent)', marginTop: '32px'}}></div>
      </div>
    );
  }

  return (
    <div className="pad" style={{paddingTop: '16px'}}>
      <div className="header-row">
        <button onClick={onBack} className="back-btn-static"><ChevronLeft size={24} /></button>
        <h2 style={{margin:0}}>Payment</h2>
      </div>

      <div className="split-layout">
        <div>
          <div className="banner" style={{display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(235, 203, 139, 0.1)', color: 'var(--yellow)', border: '1px solid rgba(235, 203, 139, 0.3)'}}>
            <Info size={18} /> Simulated payment - no real money is charged
          </div>

          <div className="card mb-4" style={{display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'rgba(42, 48, 60, 0.5)'}}>
            <div style={{marginTop: '2px'}}><ShieldIcon /></div>
            <div>
              <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '6px'}}>Held in escrow</div>
              <p className="muted" style={{fontSize: '13px', lineHeight: '1.6'}}>Your payment is held securely by Campus Loop. The rent is released to the owner only after the rental period, and your deposit is refunded upon safe return.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="card row" style={{justifyContent: 'flex-start', gap: '16px', marginBottom: '24px'}}>
            <div className="thumb" style={{width: '48px', height: '48px'}}>
              <img src={item.image} alt={item.name} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <div className="thumb-fallback" style={{display: 'none'}}></div>
            </div>
            <div>
              <div style={{fontWeight: '700', fontSize: '14px', marginBottom: '4px'}}>{item.name}</div>
            </div>
          </div>

          <div className="card mb-4" style={{padding: '20px'}}>
            <h3 style={{fontWeight: '700', fontSize: '15px', paddingBottom: '16px', borderBottom: '1px solid var(--line)', marginBottom: '16px'}}>Bill Breakdown</h3>
            <div className="row mb-3">
              <span className="muted">Rent ({params.days} days x Rs {item.price})</span>
              <span style={{fontWeight: '700'}}>Rs {params.rent.toLocaleString('en-IN')}</span>
            </div>
            <div className="row mb-3">
              <span className="muted">Refundable deposit</span>
              <span style={{fontWeight: '700', color: 'var(--yellow)'}}>Rs {params.deposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="row mb-4">
              <span className="muted">Platform fee (2%)</span>
              <span style={{fontWeight: '700'}}>Rs {params.fee.toLocaleString('en-IN')}</span>
            </div>
            <div className="row" style={{paddingTop: '16px', borderTop: '1px solid var(--line)'}}>
              <span style={{fontWeight: '700', fontSize: '18px'}}>Total payable</span>
              <span style={{fontWeight: '700', fontSize: '18px', color: 'var(--green)'}}>Rs {params.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="card row mb-4" style={{padding: '16px 20px'}}>
            <span style={{fontWeight: '700', fontSize: '15px'}}>Pay with:</span>
            <div style={{border: '1px solid var(--line)', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', color: 'var(--accent)', background: 'rgba(136,192,208,0.1)'}}>
              Test UPI
            </div>
          </div>

          <div className="fixed-bottom desktop-fixed-bottom-reset">
            <button className="btn" onClick={handlePay} disabled={processing} style={{background: 'var(--green)', color: '#2E3440', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {processing ? <div className="spinner"></div> : `Pay Rs ${params.total.toLocaleString('en-IN')} (Simulated)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--yellow)'}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
