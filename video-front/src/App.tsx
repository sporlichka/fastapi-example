import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetsPage from './pages/PetsPage';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pets" element={<ProtectedRoute><PetsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/pets" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
