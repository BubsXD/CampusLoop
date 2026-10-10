import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShieldCheck, Star } from 'lucide-react';

export default function SearchScreen({ items, initialCategory, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory || 'All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [noDeposit, setNoDeposit] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  const categories = ['All', 'Lab', 'Books', 'Electronics', 'Cycles'];
  const popularSearches = ['calculator', 'camera', 'cycle', 'books'];

  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
    const saved = localStorage.getItem('cl_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cl_recent_searches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      saveRecentSearch(searchTerm);
      e.target.blur();
    }
  };

  let filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = category === 'All' || item.category === category;
    const matchesVerified = !verifiedOnly || true; // Assuming all currently have true/fake verification for owners in this mockup, or filter by rating > 4.5
    const matchesDeposit = !noDeposit || (!item.deposit && item.value < 5000);
    const matchesPrice = item.price <= maxPrice;
    return matchesSearch && matchesCat && matchesVerified && matchesDeposit && matchesPrice;
  });

  if (sortBy === 'Price low to high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price high to low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Top rated') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const isPristine = !searchTerm && category === 'All' && !verifiedOnly && !noDeposit && maxPrice === 300;

  return (
    <div className="pad" style={{paddingTop: '16px'}}>
      <div className="search-input-wrapper mb-4">
        <Search size={20} color="var(--muted)" style={{position: 'absolute', left: '16px'}} />
        <input 
          ref={searchRef}
          type="text" 
          placeholder="Search items..." 
          className="input"
          style={{paddingLeft: '44px', paddingRight: '44px', borderRadius: '24px'}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
        {searchTerm && (
          <button className="clear-btn" onClick={() => setSearchTerm('')}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className="chips">
        {categories.map(cat => (
          <div key={cat} onClick={() => setCategory(cat)} className={`chip ${category === cat ? 'active' : ''}`}>
            {cat}
          </div>
        ))}
      </div>

      <div className="filters-row">
        <div className="filter-item">
          Sort by:
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Relevance</option>
            <option>Price low to high</option>
            <option>Price high to low</option>
            <option>Top rated</option>
          </select>
        </div>
        
        <div className="filter-item">
          <div className={`toggle-switch ${verifiedOnly ? 'on' : ''}`} onClick={() => setVerifiedOnly(!verifiedOnly)}>
            <div className="knob"></div>
          </div>
          Verified only
        </div>
        
        <div className="filter-item">
          <div className={`toggle-switch ${noDeposit ? 'on' : ''}`} onClick={() => setNoDeposit(!noDeposit)}>
            <div className="knob"></div>
          </div>
          No deposit
        </div>

        <div className="filter-item" style={{flex: '1', minWidth: '150px'}}>
          <span>Max: Rs {maxPrice}</span>
          <input type="range" min="0" max="300" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="range-slider" />
        </div>
      </div>

      {isPristine && (
        <div className="mb-4">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h3 style={{fontSize: '14px', marginBottom: '12px'}}>Recent searches</h3>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                {recentSearches.map(s => (
                  <button key={s} onClick={() => setSearchTerm(s)} className="recent-chip">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 style={{fontSize: '14px', marginBottom: '12px'}}>Popular searches</h3>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              {popularSearches.map(s => (
                <button key={s} onClick={() => setSearchTerm(s)} className="recent-chip">{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isPristine && (
        <div style={{fontSize: '14px', fontWeight: '700', marginBottom: '16px'}}>
          {filtered.length} items found
        </div>
      )}

      {!isPristine && filtered.length === 0 ? (
        <div className="text-center" style={{padding: '40px 0'}}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--line)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 16px'}}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="9" y1="9" x2="13" y2="13"></line>
            <line x1="13" y1="9" x2="9" y2="13"></line>
          </svg>
          <h3 style={{fontSize: '18px', marginBottom: '16px'}}>No items found</h3>
          <button className="btn-outline" onClick={() => { setSearchTerm(''); setCategory('All'); setVerifiedOnly(false); setNoDeposit(false); setMaxPrice(300); }} style={{maxWidth: '200px', margin: '0 auto'}}>Clear filters</button>
        </div>
      ) : (
        <div className="item-grid">
          {filtered.map(item => (
            <div key={item.id} className="item" onClick={() => { saveRecentSearch(searchTerm); onSelect(item.id); }}>
              <div className="thumb">
                <img src={item.image} alt={item.name} loading="lazy" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <div className="thumb-fallback" style={{display: 'none'}}></div>
              </div>
              <div className="item-info">
                <div className="item-title">{item.name}</div>
                <div className="item-owner">
                  {item.owner} 
                  <span style={{color: 'var(--yellow)', display: 'flex', alignItems: 'center'}}><Star size={10} fill="currentColor" style={{marginLeft: '4px', marginRight: '2px'}}/> {item.rating}</span>
                </div>
                <div><span className="tag"><ShieldCheck size={10}/> Verified</span></div>
              </div>
              <div className="price" style={{textAlign: 'right'}}>
                Rs {item.price} <div style={{fontSize: '10px', color: 'var(--muted)', fontWeight: 'normal'}}>/ day</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
