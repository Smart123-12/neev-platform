// ─── NEEV App — Routing + Layout ──────────────
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import NGODashboard from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import NeedsMap from './pages/NeedsMap';
import Login from './pages/Login';
import Register from './pages/Register';

function AppRoutes() {
  const { role, demoMode } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map"      element={<NeedsMap />} />

          <Route
            path="/ngo"
            element={
              demoMode || role === 'ngo'
                ? <NGODashboard />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/volunteer"
            element={
              demoMode || role === 'volunteer'
                ? <VolunteerDashboard />
                : <Navigate to="/login" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
