import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User as UserIcon, ArrowRight, X } from 'lucide-react';
import './Login.css';
import heroBg from '../assets/hero-bg.jpg';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      if (response.ok) {
        const data = await response.json();
        // The API returns account details in `user`; accept the older flat
        // response too so the page stays compatible with existing deployments.
        const account = data.user || data;
        if (!account.role) {
          setError('The server returned an incomplete account response. Please contact your administrator.');
          return;
        }
        login(account.role, account.username || account.full_name || account.email);

        // Navigate based on role
        const role = account.role.toLowerCase();
        if (role === 'admin') navigate('/admin');
        else if (role === 'reviewer') navigate('/reviewer');
        else if (role === 'evaluator') navigate('/evaluator');
        else navigate('/customer');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || (response.status === 401
          ? 'Invalid username/email or password.'
          : `Login failed (server error ${response.status}).`));
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">AssureX</div>
        <div className="nav-links">
          <button className="nav-login-btn" onClick={() => setShowModal(true)}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        {/* Left Content Card */}
        <div className="hero-content-card">
          <h1 className="hero-title">AssureX</h1>
          <h2 className="hero-subtitle">AI-Powered Warranty<br />Claim Engine</h2>
          <p className="hero-description">
            Streamline your claims. Leverage intelligent automation for faster, effortless, and optimized warranty processing. Experience the future of warranty management today.
          </p>

        </div>

        {/* Right Image Container */}
        <div className="hero-image-container">
          <img src={heroBg} alt="Smart Appliances" className="hero-image" />
        </div>
      </div>

      {/* Login Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            <div className="login-header">
              <h2>Secure Portal Access</h2>
              <p>Please log in with your assigned credentials.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="login-form" onSubmit={handleLogin} autoComplete="off">
              <div className="input-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <UserIcon size={18} className="input-icon" />
                  <input
                    type="text"
                    name="username-field"
                    autoComplete="new-password"
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
                    name="password-field"
                    autoComplete="new-password"
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
          </div>
        </div>
      )}
    </div>
  );
}
