import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, ClipboardList, Settings, LogOut, Activity, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <Shield size={28} color="#6366f1" />
          <span>AssureX</span>
        </div>

        <nav className="sidebar-menu">
          {userRole === 'Customer' && (
            <>
              <NavLink to="/customer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> My Dashboard
              </NavLink>
              <NavLink to="/submit-claim" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FileText size={18} /> Submit Claim
              </NavLink>
            </>
          )}

          {userRole === 'Admin' && (
            <>
              <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Admin Telemetry
              </NavLink>
              <NavLink to="/evaluator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Activity size={18} /> Live Evaluator
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={18} /> Manage Users
              </NavLink>
            </>
          )}
          
          {userRole === 'Reviewer' && (
            <NavLink to="/reviewer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ClipboardList size={18} /> Review Queue
            </NavLink>
          )}

          {userRole === 'Evaluator' && (
            <NavLink to="/evaluator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Activity size={18} /> Live Evaluator
            </NavLink>
          )}
        </nav>
      </div>

      <div>
        <a href="#settings" className="nav-item">
          <Settings size={18} /> Settings
        </a>
        <a href="/" onClick={handleLogout} className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={18} /> Sign Out
        </a>
      </div>
    </aside>
  );
}