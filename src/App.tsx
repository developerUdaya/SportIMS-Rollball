import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TeamRegistration from './components/Team/TeamRegistration';
import PlayerManagement from './components/Player/PlayerManagement';
import EventManagement from './components/Event/EventManagement';
import TeamManagement from './components/Admin/TeamManagement';
import GroupManagement from './components/Group/GroupManagement';
import MatchScheduling from './components/Match/MatchScheduling';
import KnockoutStage from './components/Knockout/KnockoutStage';
import Results from './components/Results/Results';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team-registration" element={<TeamRegistration />} />
          <Route path="/players" element={<PlayerManagement />} />
          {user?.role === 'admin' && (
            <>
              <Route path="/events" element={<EventManagement />} />
              <Route path="/teams" element={<TeamManagement />} />
              <Route path="/groups" element={<GroupManagement />} />
              <Route path="/matches" element={<MatchScheduling />} />
              <Route path="/knockout" element={<KnockoutStage />} />
              <Route path="/results" element={<Results />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;