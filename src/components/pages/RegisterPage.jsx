import React, { useState } from 'react';
import { Eye, EyeOff, Leaf, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function RegisterPage({ onGoLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passStrength();
  const strengthColors = ['#E5E7EB', '#EF4444', '#F59E0B', '#22C55E', '#16A34A'];
  const strengthLabels = ['', 'Fraca', 'Regular', 'Boa', 'Forte'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Informe seu nome completo.');
    if (!form.email.includes('@')) return setError('Informe um e-mail válido.');
    if (form.password.length < 6) return setError('A senha precisa ter no mínimo 6 caracteres.');
    if (form.password !== form.confirmPassword) return setError('A confirmação de senha não confere.');

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.confirmPassword);
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      padding: '32px 20px',
      fontFamily: 'var(--font-family)'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '52px', height: '52px', backgroundColor: 'var(--color-primary-tint)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 12px' }}>
            <Leaf size={30} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>VitaTrack</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Criar conta</p>
          <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)', marginTop: '8px' }}>Comece sua jornada agora</p>
        </div>

        <div className="vt-card" style={{ padding: '32px' }}>
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
              <label className="vt-label" htmlFor="reg-name">Nome completo</label>
              <input
                id="reg-name"
                type="text"
                className="vt-input"
                placeholder="Seu nome"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                required
              />
            </div>

            <div className="vt-form-group">
              <label className="vt-label" htmlFor="reg-email">E-mail</label>
              <input
                id="reg-email"
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
              <label className="vt-label" htmlFor="reg-password">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  className="vt-input"
                  placeholder="Crie uma senha segura"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4].map(level => (
                      <div key={level} style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '2px',
                        backgroundColor: strength >= level ? strengthColors[Math.min(strength, 4)] : 'var(--color-gray-light)',
                        transition: 'background-color 0.3s ease'
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Força: {strengthLabels[Math.min(strength, 4)] || 'Muito fraca'}
                  </span>
                </div>
              )}
            </div>

            <div className="vt-form-group">
              <label className="vt-label" htmlFor="reg-confirm">Confirmar senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm"
                  type={showPass ? 'text' : 'password'}
                  className="vt-input"
                  placeholder="Confirme sua senha"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                  required
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <Check size={18} color="var(--color-primary)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="vt-btn vt-btn-primary vt-btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Criando sua conta...
                </span>
              ) : 'Criar minha conta'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onGoLogin}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            Entrar
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
