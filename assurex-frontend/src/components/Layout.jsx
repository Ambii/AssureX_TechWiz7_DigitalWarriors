import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children, userRole, setUserRole }) {
  return (
    <div className="app-container">
      <Sidebar userRole={userRole} />
      <div className="main-wrapper">
        <Navbar userRole={userRole} setUserRole={setUserRole} />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}