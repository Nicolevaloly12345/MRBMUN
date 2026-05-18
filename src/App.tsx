import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import PortalPage from './pages/PortalPage';
import AdminDashboard from './pages/AdminDashboard';
import { useVisitorTracker } from './hooks/useVisitorTracker';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'portal' | 'admin'>('landing');

  useVisitorTracker();

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage 
          onEnterPortal={() => setCurrentView('portal')} 
          onAdminAccess={() => setCurrentView('admin')}
        />
      ) : currentView === 'portal' ? (
        <PortalPage onExitPortal={() => setCurrentView('landing')} />
      ) : (
        <AdminDashboard onClose={() => setCurrentView('landing')} />
      )}
    </>
  );
}
