import React, { useState } from 'react';
import { api } from '../api';
import { ChevronLeft } from 'lucide-react';

export default function RegisterScreen({ onRegister, onBack }) {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', college: 'Dr. D. Y. Patil Institute of Technology, Pimpri', roll_no: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.register(formData);
      onRegister(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pad" style={{paddingTop: '16px', maxWidth: '400px', margin: '0 auto', paddingBottom: '40px'}}>
      <div className="header-row">
        <button onClick={onBack} className="back-btn-static"><ChevronLeft size={24} /></button>
        <h2 style={{margin:0}}>Create an account</h2>
      </div>
      
      {error && <div className="banner" style={{background: 'rgba(191,97,106,0.2)', color: '#BF616A', border: '1px solid #BF616A'}}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input required type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Email address (.edu or .ac.in preferred)</label>
          <input required type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input required type="password" className="input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <div className="form-group">
          <label>College/University</label>
          <input required type="text" className="input" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Roll Number / ID</label>
          <input required type="text" className="input" value={formData.roll_no} onChange={e => setFormData({...formData, roll_no: e.target.value})} />
        </div>
        <div className="form-group mb-4">
          <label>Phone Number</label>
          <input required type="tel" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        
        <button type="submit" className="btn" disabled={loading} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          {loading ? <div className="spinner" style={{borderTopColor: '#2E3440'}}></div> : 'Sign up'}
        </button>
      </form>
    </div>
  );
}
