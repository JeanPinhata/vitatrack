import React, { useState } from 'react';
import {
  LayoutDashboard,
  Ruler,
  UtensilsCrossed,
  ChefHat,
  MoreHorizontal,
  Scale,
  GitCompare,
  TrendingUp,
  History,
  Camera,
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function BottomNav({ currentTab, onSelectTab }) {
  const { logout } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'measurements', label: 'Medidas', icon: Ruler },
    { id: 'proteins', label: 'Proteínas', icon: UtensilsCrossed },
    { id: 'recipes', label: 'Receitas', icon: ChefHat }
  ];

  const moreItems = [
    { id: 'weights', label: 'Pesagens', icon: Scale },
    { id: 'compare', label: 'Comparação de Medidas', icon: GitCompare },
    { id: 'evolution', label: 'Minha Evolução', icon: TrendingUp },
    { id: 'history', label: 'Histórico Completo', icon: History },
    { id: 'photos', label: 'Fotos de Progresso', icon: Camera },
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const handleSelect = (id) => {
    onSelectTab(id);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* More Drawer Modal */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(38, 51, 47, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px 16px 32px',
              boxShadow: 'var(--shadow-modal)',
              maxHeight: '75vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--color-gray-border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Mais Opções</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: isActive ? 'var(--color-primary-tint)' : 'transparent',
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => { setShowMoreMenu(false); logout(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-danger)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '8px',
                  borderTop: '1px solid var(--color-gray-border)'
                }}
              >
                <LogOut size={20} />
                <span>Sair da conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--mobile-nav-height)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--color-gray-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 80,
          boxShadow: '0 -2px 12px rgba(38, 51, 47, 0.05)'
        }}
        className="bottom-nav-mobile"
      >
        {mainItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 500,
                flex: 1,
                height: '100%'
              }}
            >
              <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Mais button */}
        <button
          onClick={() => setShowMoreMenu(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: showMoreMenu || moreItems.some(i => i.id === currentTab) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 500,
            flex: 1,
            height: '100%'
          }}
        >
          <MoreHorizontal size={21} />
          <span>Mais</span>
        </button>
      </nav>
    </>
  );
}
