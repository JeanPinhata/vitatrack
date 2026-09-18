import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function MotivationalScreen({ onContinue }) {
  const { user, token } = useAuth();
  const [motivation, setMotivation] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/motivation/daily', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMotivation(data);
        }
      } catch {}
    }
    load();
  }, [token]);

  const firstName = user?.name?.split(' ')[0] || 'você';
  const greeting = motivation?.greeting || `Olá, ${firstName} 👋`;
  const phrase = motivation?.phrase || 'Pequenos passos, grandes mudanças.';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1d5644 0%, #267058 40%, #3a8a6e 75%, #A7C9B8 100%)',
      fontFamily: 'var(--font-family)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '440px', height: '440px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

      <div style={{
        textAlign: 'center',
        maxWidth: '440px',
        width: '100%',
        animation: 'slideUp 0.5s ease'
      }}>
        {/* Avatar */}
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{ width: '88px', height: '88px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.5)', objectFit: 'cover', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
          />
        </div>

        {/* Greeting */}
        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: '16px'
        }}>
          {greeting}
        </h1>

        {/* Motivational phrase card */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '28px 32px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Sparkles size={28} color="rgba(255,255,255,0.8)" />
          </div>
          <p style={{
            fontSize: '1.35rem',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1.5,
            fontStyle: 'italic',
            letterSpacing: '-0.01em'
          }}>
            "{phrase}"
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.65)',
            marginTop: '14px',
            lineHeight: 1.6
          }}>
            Seu progresso acontece um dia de cada vez.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onContinue}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FFFFFF',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: '14px',
            padding: '16px 36px',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            letterSpacing: '-0.01em'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
          }}
        >
          Continuar
          <ArrowRight size={20} />
        </button>

        {/* VitaTrack Logo at Bottom */}
        <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.5 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 12" />
          </svg>
          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>VitaTrack</span>
        </div>
      </div>
    </div>
  );
}
