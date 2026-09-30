import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/login';
import CustomerDashboard from './pages/CustomerDashboard';
import SubmitClaim from './pages/SubmitClaim';
import ClaimDetails from './pages/ClaimDetails';
import AdminDashboard from './pages/AdminDashboard';
import ReviewQueue from './pages/ReviewQueue';
import LiveEvaluator from './pages/LiveEvaluator';
import UserManagement from './pages/UserManagement';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole } = useAuth();
  if (!userRole) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { userRole } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={!userRole ? <Login /> : <Navigate to={
        userRole === 'Customer' ? '/customer' : 
        userRole === 'Admin' ? '/admin' : 
        userRole === 'Evaluator' ? '/evaluator' : '/reviewer'
      } />} />
      
      <Route path="/customer" element={<ProtectedRoute allowedRoles={['Customer']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/submit-claim" element={<ProtectedRoute allowedRoles={['Customer']}><SubmitClaim /></ProtectedRoute>} />
      <Route path="/claim/:id" element={<ProtectedRoute><ClaimDetails /></ProtectedRoute>} />
      
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagement /></ProtectedRoute>} />
      
      <Route path="/reviewer" element={<ProtectedRoute allowedRoles={['Reviewer', 'Admin']}><ReviewQueue /></ProtectedRoute>} />
      <Route path="/evaluator" element={<ProtectedRoute allowedRoles={['Admin', 'Evaluator']}><LiveEvaluator /></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}