import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Clinics from './pages/Clinics';
import ClinicDetail from './pages/ClinicDetail';
import Conversations from './pages/Conversations';
import Dashboard from './pages/Dashboard';
import AgentUserManagement from './pages/AgentUserManagement';
import SystemEvents from './pages/SystemEvents';
import Consumables from './pages/Consumables';
import Purchasables from './pages/Purchasables';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Custom redirect component that checks authentication
const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/clinics" element={<Layout><Clinics /></Layout>} />
          <Route path="/clinics/:clinicId" element={<Layout><ClinicDetail /></Layout>} />
          <Route path="/clinics/:clinicId/conversations" element={<Layout><Conversations /></Layout>} />
          <Route path="/agents" element={<Layout><AgentUserManagement /></Layout>} />
          <Route path="/system/events" element={<Layout><SystemEvents /></Layout>} />
          <Route path="/consumables" element={<Layout><Consumables /></Layout>} />
          <Route path="/purchasables" element={<Layout><Purchasables /></Layout>} />
        </Route>

        {/* Fallback route - redirect to login if not authenticated */}
        <Route path="*" element={<AuthRedirect />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
