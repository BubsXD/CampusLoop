import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Search, List, User, PlusCircle, CheckCircle, ShieldCheck, ChevronLeft, Calendar, Info, Star } from 'lucide-react';
import initialData from './data.json';

import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import DetailsScreen from './components/DetailsScreen';
import BookingScreen from './components/BookingScreen';
import PaymentScreen from './components/PaymentScreen';
import RentalsScreen from './components/RentalsScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(initialData.users[0]);
  
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [bookingParams, setBookingParams] = useState(null);
  const [searchInitialCategory, setSearchInitialCategory] = useState('All');

  useEffect(() => {
    const localItems = localStorage.getItem('cl_items_v2');
    const localBookings = localStorage.getItem('cl_bookings_v2');
    if (localItems) setItems(JSON.parse(localItems));
    else { setItems(initialData.items); localStorage.setItem('cl_items_v2', JSON.stringify(initialData.items)); }
    
    if (localBookings) setBookings(JSON.parse(localBookings));
    else { setBookings(initialData.bookings); localStorage.setItem('cl_bookings_v2', JSON.stringify(initialData.bookings)); }
  }, []);

  useEffect(() => { if (items.length) localStorage.setItem('cl_items_v2', JSON.stringify(items)); }, [items]);
  useEffect(() => { if (bookings.length) localStorage.setItem('cl_bookings_v2', JSON.stringify(bookings)); }, [bookings]);

  const resetData = () => {
    setItems(initialData.items);
    setBookings(initialData.bookings);
    localStorage.setItem('cl_items_v2', JSON.stringify(initialData.items));
    localStorage.setItem('cl_bookings_v2', JSON.stringify(initialData.bookings));
    setCurrentScreen('Home');
    setActiveTab('Profile');
  };

  const navigateTo = (screen, props = {}) => {
    if (props.itemId) setSelectedItemId(props.itemId);
    if (props.bookingParams) setBookingParams(props.bookingParams);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleNavigateToSearch = (category = 'All') => {
    setSearchInitialCategory(category);
    setActiveTab('Search');
    setCurrentScreen('Search');
    window.scrollTo(0, 0);
  };

  const addBooking = (booking) => {
    setBookings([{...booking, id: 'b' + Date.now()}, ...bookings]);
  };

  const updateBookingStatus = (id, status) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const addItem = (item) => {
    setItems([{...item, id: 'i' + Date.now()}, ...items]);
  };

  const activeBooking = bookings.find(b => b.status === 'Requested' || b.status === 'Active');

  let ScreenComponent;
  if (currentScreen === 'Home') {
    ScreenComponent = <HomeScreen items={items} user={user} activeBooking={activeBooking} onNavigateToSearch={handleNavigateToSearch} onSelect={(id) => navigateTo('Details', { itemId: id })} />;
  }
  else if (currentScreen === 'Search') {
    ScreenComponent = <SearchScreen items={items} initialCategory={searchInitialCategory} onSelect={(id) => navigateTo('Details', { itemId: id })} />;
  }
  else if (currentScreen === 'Rentals') {
    ScreenComponent = <RentalsScreen bookings={bookings} items={items} onUpdateStatus={updateBookingStatus} />;
  }
  else if (currentScreen === 'Profile') {
    ScreenComponent = <ProfileScreen user={user} onReset={resetData} onAdd={addItem} items={items.filter(i => i.owner === user.name)} />;
  }
  else if (currentScreen === 'Details') {
    const item = items.find(i => i.id === selectedItemId);
    ScreenComponent = <DetailsScreen item={item} onBack={() => setCurrentScreen(activeTab === 'Search' ? 'Search' : 'Home')} onBook={(params) => navigateTo('Booking', { bookingParams: params })} />;
  }
  else if (currentScreen === 'Booking') {
    const item = items.find(i => i.id === bookingParams.itemId);
    ScreenComponent = <BookingScreen item={item} initialDays={bookingParams.days} onBack={() => setCurrentScreen('Details')} onContinue={(params) => navigateTo('Payment', { bookingParams: params })} />;
  }
  else if (currentScreen === 'Payment') {
    const item = items.find(i => i.id === bookingParams.itemId);
    ScreenComponent = <PaymentScreen item={item} params={bookingParams} user={user} onBack={() => setCurrentScreen('Booking')} onSuccess={(booking) => {
      addBooking(booking);
      setActiveTab('Rentals');
      setCurrentScreen('Rentals');
    }} />;
  }

  const showBottomNav = ['Home', 'Search', 'Rentals', 'Profile'].includes(currentScreen);

  return (
    <div className="app">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
           <div className="ring"></div> Campus Loop
        </div>
        <button className={`nav-item-side ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => { setActiveTab('Home'); setCurrentScreen('Home'); }}>
          <HomeIcon size={20} /> <span>Home</span>
        </button>
        <button className={`nav-item-side ${activeTab === 'Search' ? 'active' : ''}`} onClick={() => { setActiveTab('Search'); setCurrentScreen('Search'); }}>
          <Search size={20} /> <span>Search</span>
        </button>
        <button className={`nav-item-side ${activeTab === 'Rentals' ? 'active' : ''}`} onClick={() => { setActiveTab('Rentals'); setCurrentScreen('Rentals'); }}>
          <List size={20} /> <span>Rentals</span>
        </button>
        <button className={`nav-item-side ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => { setActiveTab('Profile'); setCurrentScreen('Profile'); }}>
          <User size={20} /> <span>Profile</span>
        </button>
      </aside>

      <main className="main-content">
        {ScreenComponent}
      </main>

      {/* Mobile/Tablet Bottom Nav */}
      {showBottomNav && (
        <nav className="nav">
          <button className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => { setActiveTab('Home'); setCurrentScreen('Home'); }}>
            <HomeIcon size={24} /> <span>Home</span>
          </button>
          <button className={`nav-item ${activeTab === 'Search' ? 'active' : ''}`} onClick={() => { setActiveTab('Search'); setCurrentScreen('Search'); }}>
            <Search size={24} /> <span>Search</span>
          </button>
          <button className={`nav-item ${activeTab === 'Rentals' ? 'active' : ''}`} onClick={() => { setActiveTab('Rentals'); setCurrentScreen('Rentals'); }}>
            <List size={24} /> <span>Rentals</span>
          </button>
          <button className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => { setActiveTab('Profile'); setCurrentScreen('Profile'); }}>
            <User size={24} /> <span>Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
}
