import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Donors from './pages/Donors';
import Inventory from './pages/Inventory';
import Organs from './pages/Organs';
import Tissues from './pages/Tissues';
import Recipients from './pages/Recipients';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import Hospitals from './pages/Hospitals';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/donors" element={<Donors />} />
                    <Route path="/blood" element={<Inventory />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/organs" element={<Organs />} />
                    <Route path="/tissues" element={<Tissues />} />
                    <Route path="/recipients" element={<Recipients />} />
                    <Route path="/donations" element={<Donations />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/hospitals" element={<Hospitals />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
