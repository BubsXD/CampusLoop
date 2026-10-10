import React, { useState } from 'react';
import { api } from '../api';

export default function LoginScreen({ onLogin, onRegisterClick, onBack }) {
  const [email, setEmail] = useState('rujal@campusloop.test');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login({ email, password });
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pad" style={{paddingTop: '60px', maxWidth: '400px', margin: '0 auto'}}>
      <div className="logo" style={{justifyContent: 'center', marginBottom: '40px', fontSize: '24px'}}>
        <div className="ring" style={{width: '32px', height: '32px'}}></div> Campus Loop
      </div>
      
      <h1 style={{fontSize: '24px', marginBottom: '24px', textAlign: 'center'}}>Log in to your account</h1>
      
      {error && <div className="banner" style={{background: 'rgba(191,97,106,0.2)', color: '#BF616A', border: '1px solid #BF616A'}}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input required type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group mb-4">
          <label>Password</label>
          <input required type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        
        <button type="submit" className="btn mb-4" disabled={loading} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          {loading ? <div className="spinner" style={{borderTopColor: '#2E3440'}}></div> : 'Log in'}
        </button>
      </form>
      
      <div className="text-center mt-4">
        <span className="muted">Don't have an account?</span>{' '}
        <button onClick={onRegisterClick} className="text-link" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: '700'}}>Sign up</button>
      </div>

      <div className="text-center mt-4 pt-4" style={{borderTop: '1px solid var(--line)'}}>
        <button onClick={onBack} className="text-link" style={{color: 'var(--muted)', textDecoration: 'none'}}>Continue as guest</button>
      </div>
    </div>
  );
}
