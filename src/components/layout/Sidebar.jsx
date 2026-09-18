import React from 'react';
import {
  LayoutDashboard,
  Scale,
  Ruler,
  TrendingUp,
  GitCompare,
  UtensilsCrossed,
  ChefHat,
  History,
  Camera,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar({ currentTab, onSelectTab }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'weights', label: 'Pesagens', icon: Scale },
    { id: 'measurements', label: 'Medidas', icon: Ruler },
    { id: 'compare', label: 'Comparar', icon: GitCompare },
    { id: 'evolution', label: 'Evolução', icon: TrendingUp },
    { id: 'proteins', label: 'Proteínas', icon: UtensilsCrossed },
    { id: 'recipes', label: 'Receitas', icon: ChefHat },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'photos', label: 'Fotos', icon: Camera },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-card)',
        borderRight: '1px solid var(--color-gray-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}
      className="sidebar-desktop"
    >
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 12" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              VitaTrack
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
              Sua evolução, todos os dias.
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--color-primary-tint)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-soft)';
                  e.currentTarget.style.color = 'var(--color-text-main)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--color-gray-border)', backgroundColor: 'var(--color-card-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-light)' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Mariana Silva'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'mariana@vitatrack.com'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Sair da conta"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
