import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, User, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function TopBar({ onOpenQuickAction, onSelectTab }) {
  const { user } = useAuth();
  const [motivation, setMotivation] = useState(null);

  useEffect(() => {
    async function loadMotivation() {
      try {
        const token = localStorage.getItem('vitatrack_token');
        if (!token) return;
        const res = await fetch('/api/motivation/daily', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMotivation(data);
        }
      } catch (err) {
        console.error('Erro ao carregar motivação no TopBar:', err);
      }
    }
    loadMotivation();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Mariana';

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'rgba(245, 241, 231, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-gray-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
      className="topbar-container"
    >
      {/* Greeting and subtle message */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Olá, {firstName}! <span style={{ fontSize: '1.25rem' }}>👋</span>
        </h1>
        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Acompanhe sua evolução, um registro de cada vez.</span>
          {motivation?.phrase && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(38, 112, 88, 0.08)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
                fontWeight: 500,
                marginLeft: '6px'
              }}
              className="quote-pill"
            >
              <Sparkles size={12} /> {motivation.phrase}
            </span>
          )}
        </p>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Action Button */}
        {onOpenQuickAction && (
          <button
            onClick={onOpenQuickAction}
            className="vt-btn vt-btn-primary vt-btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span className="quick-action-label">Novo Registro</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-gray-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            position: 'relative'
          }}
          title="Notificações"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '9px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)'
            }}
          />
        </button>

        {/* Profile trigger */}
        <button
          onClick={() => onSelectTab && onSelectTab('profile')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-primary)'
            }}
          />
        </button>
      </div>
    </header>
  );
}
