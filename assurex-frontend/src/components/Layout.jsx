import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { userRole } = useAuth();

  return (
    <div className="app-container">
      {userRole && <Sidebar />}
      <div className="main-wrapper" style={{ minHeight: '100vh' }}>
        {userRole && <Navbar />}
        <main className="content-body" style={{ padding: userRole ? '2rem' : '0', maxWidth: userRole ? '1400px' : '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}