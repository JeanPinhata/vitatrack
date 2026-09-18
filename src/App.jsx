import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { TopBar } from './components/layout/TopBar';

// Pages
import { Dashboard } from './components/pages/Dashboard';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage';
import { MotivationalScreen } from './components/pages/MotivationalScreen';
import { OnboardingPage } from './components/pages/OnboardingPage';
import { WeightsPage } from './components/pages/WeightsPage';
import { MeasurementsPage } from './components/pages/MeasurementsPage';
import { ProteinsPage } from './components/pages/ProteinsPage';
import { RecipesPage } from './components/pages/RecipesPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { EvolutionPage } from './components/pages/EvolutionPage';
import { ProfilePage } from './components/pages/ProfilePage';

function AppContent() {
  const { user, loading, settings } = useAuth();
  
  // Auth routes states
  const [authView, setAuthView] = useState('login'); // login, register, forgot

  // Main app states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMotivation, setShowMotivation] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>Carregando VitaTrack...</div>;
  }

  // Unauthenticated flow
  if (!user) {
    if (authView === 'register') return <RegisterPage onGoLogin={() => setAuthView('login')} />;
    if (authView === 'forgot') return <ForgotPasswordPage onGoLogin={() => setAuthView('login')} />;
    return <LoginPage onGoRegister={() => setAuthView('register')} onGoForgot={() => setAuthView('forgot')} />;
  }

  // Onboarding flow
  if (!settings?.onboarding_completed) {
    return <OnboardingPage />;
  }

  // Motivational Screen flow (shown once per session after login)
  if (showMotivation) {
    return <MotivationalScreen onContinue={() => setShowMotivation(false)} />;
  }

  // Main Authenticated Layout
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onSelectTab={setActiveTab} />;
      case 'weights': return <WeightsPage />;
      case 'measurements': return <MeasurementsPage />;
      case 'proteins': return <ProteinsPage />;
      case 'recipes': return <RecipesPage />;
      case 'history': return <HistoryPage />;
      case 'evolution': return <EvolutionPage />;
      case 'profile': return <ProfilePage />;
      default: return <Dashboard onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        isOpen={showMobileSidebar} 
        onClose={() => setShowMobileSidebar(false)} 
      />
      <div className="main-content">
        <TopBar onMenuClick={() => setShowMobileSidebar(true)} />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
