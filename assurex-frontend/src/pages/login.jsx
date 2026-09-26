import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        login(data.role);
        
        // Navigate based on role returned from DB
        const role = data.role.toLowerCase();
        if (role === 'admin') navigate('/admin');
        else if (role === 'reviewer') navigate('/reviewer');
        else navigate('/customer');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    }
  };

  return (
    <div className="split-layout">
      {/* Left Side - Branding (Homepage) */}
      <div className="branding-side">
        <div className="branding-content">
          <div className="logo-container">
            <Shield size={64} className="brand-logo-icon" color="white" />
          </div>
          <h1 className="brand-title">AssureX</h1>
          <h2 className="brand-subtitle">AI-Powered Warranty Claim Engine</h2>
          <p className="brand-description">
            NextWave AI & ML technology streamlining document operations, reducing manual triage, and automatically evaluating warranty claims with dual-model verification.
          </p>
          <div className="brand-graphics">
             <div className="glass-card decorative">
               <ShieldCheck size={24} color="#4ade80" />
               <span>Real-time Adjudication Engine Online</span>
             </div>
          </div>
        </div>
        <div className="branding-overlay"></div>
      </div>

      {/* Right Side - Login */}
      <div className="login-side">
        <div className="login-box">
          <div className="login-header">
            <h2>Secure Portal Access</h2>
            <p>Please log in with your assigned credentials. (Only Admins can register new users)</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <div className="input-wrapper">
                <UserIcon size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-footer">
            <p>AssureX Engine &copy; {new Date().getFullYear()} Aptech Limited.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
