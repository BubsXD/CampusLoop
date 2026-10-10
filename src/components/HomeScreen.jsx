import React, { useState, useEffect } from 'react';
import { Search, FlaskConical, BookOpen, Monitor, Bike, LayoutGrid, ShieldCheck, User } from 'lucide-react';
import { api } from '../api';

export default function HomeScreen({ user, onNavigateToSearch, onSelect, onLoginClick }) {
  const [popularItems, setPopularItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await api.getItems();
        setPopularItems([...items].sort((a, b) => b.rating - a.rating).slice(0, 5));
        setRecentItems([...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5));
        
        if (user) {
          const bookings = await api.getMyBookings();
          const active = bookings.find(b => b.status === 'requested' || b.status === 'active');
          if (active) setActiveBooking(active);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const categories = [
    { name: 'Lab', icon: <FlaskConical size={24} /> },
    { name: 'Books', icon: <BookOpen size={24} /> },
    { name: 'Electronics', icon: <Monitor size={24} /> },
    { name: 'Cycles', icon: <Bike size={24} /> },
    { name: 'All', icon: <LayoutGrid size={24} /> }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'requested': return 'status-requested';
      case 'active': return 'status-active';
      case 'returned': return 'status-returned';
      default: return '';
    }
  };

  if (loading) return <div className="pad text-center" style={{paddingTop: '60px'}}><div className="spinner"></div></div>;

  return (
    <div>
      <div className="top">
        <div className="logo">
          <div className="ring"></div>
          <div>
            Campus Loop
            <div style={{fontSize:'10px', color:'var(--muted)', fontWeight:'normal'}}>DYPIT campus network</div>
          </div>
        </div>
        {user ? (
          <div className="avatar">{user.name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}</div>
        ) : (
          <button onClick={onLoginClick} style={{background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '700', fontSize: '14px', cursor: 'pointer'}}>Log in</button>
        )}
      </div>

      <div className="pad">
        <h2 style={{fontSize: 'clamp(24px, 3vw, 28px)', marginBottom: '20px'}}>
          {user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome to Campus Loop'}
        </h2>

        <div className="fake-search" onClick={() => onNavigateToSearch('All')}>
          <Search size={20} />
          <span>What do you need today?</span>
        </div>

        <div className="h-scroll" style={{gap: '12px', paddingBottom: '16px'}}>
          {categories.map(cat => (
            <div key={cat.name} className="icon-card" onClick={() => onNavigateToSearch(cat.name)}>
              {cat.icon}
              <span style={{fontSize: '12px', fontWeight: '700'}}>{cat.name}</span>
            </div>
          ))}
        </div>

        {activeBooking && (
          <div className="mb-4">
            <h3 style={{fontSize: '15px', fontWeight: '700', marginBottom: '12px'}}>Your active rental</h3>
            <div className="card row" style={{justifyContent: 'flex-start', gap: '16px', cursor: 'pointer', borderColor: 'var(--accent)'}} onClick={() => onSelect(activeBooking.item_id)}>
              <div className="thumb" style={{width: '50px', height: '50px'}}>
                <img src={activeBooking.image} alt="Rental" loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <div className="thumb-fallback" style={{display: 'none'}}></div>
              </div>
              <div>
                <div style={{fontWeight: '700', fontSize: '14px', marginBottom: '4px'}}>{activeBooking.title}</div>
                <span className={`status-badge ${getStatusClass(activeBooking.status)}`} style={{textTransform: 'capitalize'}}>{activeBooking.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="banner" style={{background: 'linear-gradient(135deg, rgba(136, 192, 208, 0.2), rgba(180, 142, 173, 0.2))', border: '1px solid var(--accent)', color: 'var(--text)'}}>
          <h4 style={{fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: 'var(--accent)'}}>Save more by renting</h4>
          <p style={{fontSize: '12px', fontWeight: 'normal', lineHeight: '1.4'}}>Rent instead of buying and keep items out of the bin. Help build a sustainable campus.</p>
        </div>

        <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '12px', marginTop: '24px'}}>Popular this week</h3>
        <div className="h-scroll">
          {popularItems.map(item => (
            <div key={item.id} className="h-scroll-item" onClick={() => onSelect(item.id)}>
              <div className="thumb">
                <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <div className="thumb-fallback" style={{display: 'none'}}></div>
              </div>
              <div className="item-title">{item.title}</div>
              <div style={{color: 'var(--accent)', fontWeight: '700', fontSize: '13px', marginTop: '4px'}}>Rs {item.price_per_day} / day</div>
            </div>
          ))}
        </div>

        <h3 style={{fontSize: '16px', fontWeight: '700', marginBottom: '12px'}}>Recently listed</h3>
        <div className="h-scroll">
          {recentItems.map(item => (
            <div key={item.id} className="h-scroll-item" onClick={() => onSelect(item.id)}>
              <div className="thumb">
                <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <div className="thumb-fallback" style={{display: 'none'}}></div>
              </div>
              <div className="item-title">{item.title}</div>
              <div style={{color: 'var(--accent)', fontWeight: '700', fontSize: '13px', marginTop: '4px'}}>Rs {item.price_per_day} / day</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
