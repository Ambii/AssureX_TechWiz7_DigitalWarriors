import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, ClipboardList, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ userRole }) {
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
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> My Dashboard
              </NavLink>
              <NavLink to="/submit-claim" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FileText size={18} /> Submit Claim
              </NavLink>
            </>
          )}

          {(userRole === 'Admin' || userRole === 'Reviewer') && (
            <>
              <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Analytics Board
              </NavLink>
              <NavLink to="/review-queue" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <ClipboardList size={18} /> Review Queue
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div>
        <a href="#settings" className="nav-item">
          <Settings size={18} /> Settings
        </a>
        <a href="#logout" className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={18} /> Sign Out
        </a>
      </div>
    </aside>
  );
}