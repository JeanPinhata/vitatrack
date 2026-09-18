import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ForgotPasswordPage({ onGoLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) return setError('Por favor, informe um e-mail válido.');
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSent(true);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '32px 20px', fontFamily: 'var(--font-family)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-primary-tint)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 12px' }}>
            <Leaf size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>VitaTrack</h1>
        </div>

        <div className="vt-card" style={{ padding: '32px' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📧</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>Verifique seu e-mail</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Se o e-mail <b>{email}</b> estiver cadastrado em nossa base, você receberá as instruções de redefinição de senha em instantes.
              </p>
              <button onClick={onGoLogin} className="vt-btn vt-btn-primary" style={{ width: '100%' }}>
                Voltar ao login
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Recuperar senha</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
              </p>
              {error && (
                <div style={{ backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', padding: '12px', color: 'var(--color-danger)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="vt-form-group">
                  <label className="vt-label" htmlFor="forgot-email">E-mail</label>
                  <input id="forgot-email" type="email" className="vt-input" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="vt-btn vt-btn-primary vt-btn-lg" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                  {loading ? 'Enviando...' : 'Enviar instruções'}
                </button>
              </form>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem' }}>
          <button onClick={onGoLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}>
            ← Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
}
