import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-search">
        <Search size={18} color="#94a3b8" />
        <input type="text" placeholder="Search claims, warranties, serial numbers..." />
      </div>

      <div className="nav-profile">
        {userRole && <span className="role-badge">{userRole} View</span>}
        <Bell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{ background: '#e2e8f0', padding: '6px', borderRadius: '50%' }}>
            <User size={20} color="#0f172a" />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ambreen</span>
        </div>
        
        <LogOut 
          size={20} 
          color="#ef4444" 
          style={{ cursor: 'pointer', marginLeft: '10px' }} 
          onClick={handleLogout} 
          title="Logout" 
        />
      </div>
    </header>
  );
}