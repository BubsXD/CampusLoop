import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Search, List, User, PlusCircle, CheckCircle, ShieldCheck, ChevronLeft, Calendar, Info, Star } from 'lucide-react';
import { api } from './api';

import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import DetailsScreen from './components/DetailsScreen';
import BookingScreen from './components/BookingScreen';
import PaymentScreen from './components/PaymentScreen';
import RentalsScreen from './components/RentalsScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [bookingParams, setBookingParams] = useState(null);
  const [searchInitialCategory, setSearchInitialCategory] = useState('All');

  // Verify token on load
  useEffect(() => {
    const token = localStorage.getItem('cl_token');
    if (token) {
      api.getMe()
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('cl_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('cl_token', token);
    setUser(userData);
    setCurrentScreen('Home');
    setActiveTab('Home');
  };

  const handleLogout = () => {
    localStorage.removeItem('cl_token');
    setUser(null);
    setCurrentScreen('Home');
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

  if (loading) {
    return <div className="app" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="spinner"></div></div>;
  }

  // Screens that don't require login
  if (!user) {
    if (currentScreen === 'Register') {
      return <RegisterScreen onRegister={handleLogin} onBack={() => setCurrentScreen('Home')} />;
    }
    if (currentScreen === 'Login' || currentScreen !== 'Home' && currentScreen !== 'Search' && currentScreen !== 'Details') {
      return <LoginScreen onLogin={handleLogin} onRegisterClick={() => setCurrentScreen('Register')} onBack={() => setCurrentScreen('Home')} />;
    }
  }

  let ScreenComponent;
  if (currentScreen === 'Home') {
    ScreenComponent = <HomeScreen user={user} onNavigateToSearch={handleNavigateToSearch} onSelect={(id) => navigateTo('Details', { itemId: id })} onLoginClick={() => setCurrentScreen('Login')} />;
  }
  else if (currentScreen === 'Search') {
    ScreenComponent = <SearchScreen initialCategory={searchInitialCategory} onSelect={(id) => navigateTo('Details', { itemId: id })} />;
  }
  else if (currentScreen === 'Rentals') {
    ScreenComponent = <RentalsScreen user={user} onSelect={(id) => navigateTo('Details', { itemId: id })} />;
  }
  else if (currentScreen === 'Profile') {
    ScreenComponent = <ProfileScreen user={user} onLogout={handleLogout} />;
  }
  else if (currentScreen === 'Details') {
    ScreenComponent = <DetailsScreen itemId={selectedItemId} user={user} onBack={() => setCurrentScreen(activeTab === 'Search' ? 'Search' : 'Home')} onBook={(params) => navigateTo('Booking', { bookingParams: params })} />;
  }
  else if (currentScreen === 'Booking') {
    ScreenComponent = <BookingScreen params={bookingParams} user={user} onBack={() => setCurrentScreen('Details')} onContinue={(params) => navigateTo('Payment', { bookingParams: params })} />;
  }
  else if (currentScreen === 'Payment') {
    ScreenComponent = <PaymentScreen params={bookingParams} user={user} onBack={() => setCurrentScreen('Booking')} onSuccess={() => {
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
        <button className={`nav-item-side ${activeTab === 'Rentals' ? 'active' : ''}`} onClick={() => { setActiveTab('Rentals'); setCurrentScreen(user ? 'Rentals' : 'Login'); }}>
          <List size={20} /> <span>Rentals</span>
        </button>
        <button className={`nav-item-side ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => { setActiveTab('Profile'); setCurrentScreen(user ? 'Profile' : 'Login'); }}>
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
          <button className={`nav-item ${activeTab === 'Rentals' ? 'active' : ''}`} onClick={() => { setActiveTab('Rentals'); setCurrentScreen(user ? 'Rentals' : 'Login'); }}>
            <List size={24} /> <span>Rentals</span>
          </button>
          <button className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => { setActiveTab('Profile'); setCurrentScreen(user ? 'Profile' : 'Login'); }}>
            <User size={24} /> <span>Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
}
