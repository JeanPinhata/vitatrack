import React, { useState } from 'react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage({ onGoRegister, onGoForgot }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim()) return setError('Por favor, informe seu e-mail.');
    if (!form.password) return setError('Por favor, informe sua senha.');
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm(prev => ({ ...prev, email: 'mariana@vitatrack.com', password: 'senha123' }));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-bg)',
      fontFamily: 'var(--font-family)'
    }}>
      {/* Left hero panel - hidden on mobile */}
      <div
        className="login-hero"
        style={{
          flex: '0 0 48%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #1d5644 0%, #267058 50%, #3a8a6e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '48px'
        }}
      >
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=900&auto=format&fit=crop&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.28
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <Leaf size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>VitaTrack</h1>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Sua evolução, todos os dias.</p>
            </div>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '16px' }}>
            Mais do que<br />números, é sobre<br />o seu progresso.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            Registre sua evolução diária com leveza.<br />Cada passo importa.
          </p>
        </div>
      </div>

      {/* Right Form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        overflowY: 'auto'
      }}>
        {/* Mobile Logo */}
        <div className="login-mobile-logo" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-primary-tint)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <Leaf size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>VitaTrack</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Sua evolução, todos os dias.</p>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>Entrar</h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)' }}>
              Acesse sua conta para continuar
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid rgba(192, 57, 43, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              color: 'var(--color-danger)',
              fontSize: '0.875rem',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="vt-form-group">
              <label className="vt-label" htmlFor="login-email">E-mail</label>
              <input
                id="login-email"
                type="email"
                className="vt-input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            <div className="vt-form-group">
              <label className="vt-label" htmlFor="login-password">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="vt-input"
                  placeholder="Sua senha"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex'
                  }}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm({ ...form, remember: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                Lembrar de mim
              </label>
              <button
                type="button"
                onClick={onGoForgot}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="vt-btn vt-btn-primary vt-btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          {/* Demo account hint */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={fillDemo}
              style={{
                background: 'none',
                border: '1px dashed var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: 'var(--color-primary)',
                width: '100%'
              }}
            >
              ✨ Usar conta demonstração (Mariana Silva)
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Ainda não tem uma conta?{' '}
            <button
              type="button"
              onClick={onGoRegister}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-hero { display: none !important; }
          .login-mobile-logo { display: flex !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
