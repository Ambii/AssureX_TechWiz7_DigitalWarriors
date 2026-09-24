import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CustomerDashboard from './pages/CustomerDashboard';
import SubmitClaim from './pages/SubmitClaim';
import ClaimDetails from './pages/ClaimDetails';

export default function App() {
  const [userRole, setUserRole] = useState('Customer'); 

  return (
    <BrowserRouter>
      <Layout userRole={userRole} setUserRole={setUserRole}>
        <Routes>
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/claim/:id" element={<ClaimDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}