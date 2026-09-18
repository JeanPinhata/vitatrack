import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vitatrack_token') || null);
  const [loading, setLoading] = useState(true);
  const [showMotivationalScreen, setShowMotivationalScreen] = useState(false);

  // Helper to get auth headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  // Verify and fetch profile on load
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setSettings(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setSettings(data.settings);
        } else {
          // Token expired or invalid
          localStorage.removeItem('vitatrack_token');
          setToken(null);
          setUser(null);
          setSettings(null);
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao realizar login.');
    }

    localStorage.setItem('vitatrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setSettings(data.settings);

    // After login, show motivational screen before dashboard!
    setShowMotivationalScreen(true);
    return data;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao criar conta.');
    }

    localStorage.setItem('vitatrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setSettings(data.settings);

    // For new registrations, we direct to onboarding
    setShowMotivationalScreen(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vitatrack_token');
    setToken(null);
    setUser(null);
    setSettings(null);
    setShowMotivationalScreen(false);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateUser = (newUser) => {
    setUser(prev => ({ ...prev, ...newUser }));
  };

  const dismissMotivationalScreen = () => {
    setShowMotivationalScreen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        token,
        loading,
        showMotivationalScreen,
        login,
        register,
        logout,
        updateSettings,
        updateUser,
        dismissMotivationalScreen,
        getAuthHeaders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
