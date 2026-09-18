import React, { useState } from 'react';
import { Leaf, ArrowRight, SkipForward } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function OnboardingPage() {
  const { token, updateSettings } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    initial_weight: '',
    protein_goal: '150',
    tracking_start_date: new Date().toISOString().split('T')[0],
    personal_goal: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSkip = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          protein_goal: 150,
          tracking_start_date: new Date().toISOString().split('T')[0]
        })
      });
      const data = await res.json();
      if (data.settings) updateSettings(data.settings);
    } catch {}
    setLoading(false);
    updateSettings({ onboarding_completed: 1 });
  };

  const handleContinue = async () => {
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }

    // Final step: save to server
    setLoading(true);
    setError('');
    try {
      const payload = {
        protein_goal: parseFloat(form.protein_goal) || 150,
        tracking_start_date: form.tracking_start_date,
        personal_goal: form.personal_goal || null
      };
      if (form.initial_weight) payload.initial_weight = parseFloat(form.initial_weight);

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.settings) updateSettings(data.settings);
    } catch (err) {
      setError(err.message || 'Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Vamos começar!',
      subtitle: 'Um passo para conhecer você',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="ob-name">Seu peso atual (kg)</label>
            <input
              id="ob-name"
              type="number"
              step="0.1"
              min="30"
              max="400"
              className="vt-input"
              placeholder="Ex.: 78"
              value={form.initial_weight}
              onChange={e => {
                const weight = e.target.value;
                const newForm = { ...form, initial_weight: weight };
                if (weight && !isNaN(weight)) {
                  newForm.protein_goal = String(Math.round(parseFloat(weight) * 2.0));
                }
                setForm(newForm);
              }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Opcional — você pode registrar pesagens a qualquer momento.
            </p>
          </div>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="ob-start">Data de início do acompanhamento</label>
            <input
              id="ob-start"
              type="date"
              className="vt-input"
              value={form.tracking_start_date}
              onChange={e => setForm({ ...form, tracking_start_date: e.target.value })}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Meta de proteína',
      subtitle: 'Defina sua ingestão diária ideal',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            💡 Uma referência comum é consumir entre <b>1,6 a 2,2g de proteína por kg de peso corporal</b> ao dia. Consulte um nutricionista para uma recomendação personalizada.
          </div>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="ob-prot">Meta diária de proteína (g)</label>
            <input
              id="ob-prot"
              type="number"
              step="5"
              min="30"
              max="500"
              className="vt-input"
              placeholder="Ex.: 150"
              value={form.protein_goal}
              onChange={e => setForm({ ...form, protein_goal: e.target.value })}
            />
          </div>

          {/* Quick-select protein goals */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['100', '120', '150', '180', '200'].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setForm({ ...form, protein_goal: val })}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${form.protein_goal === val ? 'var(--color-primary)' : 'var(--color-gray-border)'}`,
                  backgroundColor: form.protein_goal === val ? 'var(--color-primary-tint)' : 'transparent',
                  color: form.protein_goal === val ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: form.protein_goal === val ? 600 : 400,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {val}g
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Seu objetivo',
      subtitle: 'Opcional — o que você quer alcançar?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="ob-goal">Objetivo pessoal (opcional)</label>
            <textarea
              id="ob-goal"
              className="vt-textarea"
              rows={4}
              placeholder="Ex.: Manter consistência, ganhar disposição, cuidar da saúde..."
              value={form.personal_goal}
              onChange={e => setForm({ ...form, personal_goal: e.target.value })}
              style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Escreva como se fosse para você mesmo. Este lembrete é privado.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

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
      <div style={{ width: '100%', maxWidth: '460px', animation: 'slideUp 0.4s ease' }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-primary-tint)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 12px' }}>
            <Leaf size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>VitaTrack</h1>
        </div>

        {/* Step Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1,
              maxWidth: '80px',
              height: '4px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: i < step ? 'var(--color-primary)' : 'var(--color-gray-light)',
              transition: 'background-color 0.3s ease'
            }} />
          ))}
        </div>

        <div className="vt-card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
              {currentStep.title}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              {currentStep.subtitle}
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', padding: '12px', color: 'var(--color-danger)', fontSize: '0.875rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {currentStep.content}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="vt-btn vt-btn-primary vt-btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? 'Salvando...' : step < steps.length ? (
                <><span>Continuar</span><ArrowRight size={18} /></>
              ) : 'Começar meu acompanhamento 🌿'}
            </button>

            <button
              onClick={handleSkip}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <SkipForward size={15} /> Pular por enquanto
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '20px' }}>
          Passo {step} de {steps.length}
        </p>
      </div>
    </div>
  );
}
