import React from 'react';
import { Search, Bell, User, ShieldCheck } from 'lucide-react';

export default function Navbar({ userRole, setUserRole }) {
  return (
    <header className="navbar">
      <div className="nav-search">
        <Search size={18} color="#94a3b8" />
        <input type="text" placeholder="Search claims, warranties, serial numbers..." />
      </div>

      <div className="nav-profile">
        {/* Role Switcher for Testing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <small style={{ color: '#64748b' }}>Switch View:</small>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            style={{ padding: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="Customer">Customer</option>
            <option value="Reviewer">Reviewer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <span className="role-badge">{userRole} View</span>
        <Bell size={20} color="#64748b" style={{ cursor: 'pointer' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{ background: '#e2e8f0', padding: '6px', borderRadius: '50%' }}>
            <User size={20} color="#0f172a" />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ambreen</span>
        </div>
      </div>
    </header>
  );
}