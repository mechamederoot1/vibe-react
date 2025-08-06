import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/auth/LoginScreen';
import ModernRegisterScreen from './screens/auth/ModernRegisterScreen';
import HomeScreen from './screens/home/HomeScreen';
import ModernProfileScreen from './screens/profile/ModernProfileScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="mobile-container">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-vibe-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vibe-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-vibe-blue-dark font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/:userId" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<ModernRegisterScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
