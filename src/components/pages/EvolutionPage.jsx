import React, { useState, useEffect } from 'react';
import { TrendingUp, Scale, Ruler } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const formatDate = (d) => {
  if (!d) return '--';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

export function EvolutionPage() {
  const { token } = useAuth();
  const [weights, setWeights] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [wRes, mRes] = await Promise.all([
          fetch('/api/weights', { headers }),
          fetch('/api/measurements', { headers })
        ]);
        const [wData, mData] = await Promise.all([wRes.json(), mRes.json()]);
        setWeights(wData);
        setMeasurements(mData);

        // Set default start date from first entry
        if (wData?.summary?.first_date) setStartDate(wData.summary.first_date);
        else if (mData?.entries?.[0]) setStartDate(mData.entries[mData.entries.length - 1]?.date || '');
      } catch {}
      setLoading(false);
    }
    load();
  }, [token]);

  const handleCompare = async () => {
    if (!startDate || !endDate) return;
    setComparing(true);
    try {
      const res = await fetch(`/api/measurements/compare?start=${startDate}&end=${endDate}`, { headers });
      const data = await res.json();
      setCompareData(data);
    } catch {}
    setComparing(false);
  };

  useEffect(() => {
    if (startDate && endDate) handleCompare();
  }, [startDate, endDate]);

  const ws = weights?.summary;
  const ms = measurements?.stats;
  const trackingDays = ws?.first_date ? Math.round((new Date(endDate) - new Date(ws.first_date)) / 86400000) : 0;

  return (
    <div className="page-body">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Minha Evolução</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Visão completa da sua jornada de acompanhamento
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando dados...</div>
      ) : (
        <>
          {/* Summary Banner */}
          {ws && ws.total_entries > 0 && (
            <div style={{ background: 'linear-gradient(135deg, #267058 0%, #3a8a6e 100%)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '24px', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.75, marginBottom: '6px' }}>Período de acompanhamento</p>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                    {formatDate(ws.first_date)} → {formatDate(ws.last_date)}
                  </h2>
                  <p style={{ opacity: 0.7, marginTop: '4px', fontSize: '0.875rem' }}>{trackingDays} dias de acompanhamento consistente</p>
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                      {ws.total_variation > 0 ? '+' : ''}{ws.total_variation?.toFixed(1)} kg
                    </div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>Variação de peso</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{ws.total_entries}</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>Pesagens</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{measurements?.entries?.length || 0}</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>Medições</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Measurements Evolution */}
          {ms && (
            <div className="vt-card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ruler size={20} color="var(--color-primary)" /> Evolução das Medidas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                {Object.entries({ abdomen: 'Abdômen', waist: 'Cintura', arm: 'Braço', thigh: 'Coxa', hip: 'Quadril' }).map(([key, label]) => {
                  const s = ms[key];
                  if (!s) return null;
                  return (
                    <div key={key} style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '8px', fontWeight: 500 }}>{label}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{s.initial}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{s.current}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>cm</span>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: s.diff < 0 ? 'var(--color-primary)' : s.diff > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                        {s.diff > 0 ? '+' : ''}{s.diff} cm
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comparison Tool */}
          <div className="vt-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--color-primary)" /> Comparar Evolução
            </h3>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="vt-form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                <label className="vt-label">Data inicial</label>
                <input type="date" className="vt-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="vt-form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                <label className="vt-label">Data final</label>
                <input type="date" className="vt-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <button onClick={handleCompare} className="vt-btn vt-btn-primary" disabled={comparing}>
                {comparing ? 'Comparando...' : 'Comparar'}
              </button>
            </div>

            {compareData && (
              <div className="vt-table-wrapper">
                <table className="vt-table">
                  <thead>
                    <tr>
                      <th>Medida</th>
                      <th>Inicial ({formatDate(compareData.dates?.actual_start)})</th>
                      <th>Atual ({formatDate(compareData.dates?.actual_end)})</th>
                      <th>Diferença</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareData.comparison?.map(row => (
                      <tr key={row.key}>
                        <td style={{ fontWeight: 600 }}>{row.label}</td>
                        <td>{row.initial !== null ? `${row.initial} ${row.unit}` : '—'}</td>
                        <td style={{ fontWeight: 600 }}>{row.current !== null ? `${row.current} ${row.unit}` : '—'}</td>
                        <td>
                          {row.difference !== null ? (
                            <span style={{ fontWeight: 700, color: row.difference < 0 ? 'var(--color-primary)' : row.difference > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                              {row.difference > 0 ? '+' : ''}{row.difference} {row.unit}
                            </span>
                          ) : '—'}
                        </td>
                        <td>
                          {row.percent !== null ? (
                            <span style={{ color: row.percent < 0 ? 'var(--color-primary)' : 'var(--color-warning)', fontWeight: 600 }}>
                              {row.percent > 0 ? '+' : ''}{row.percent}%
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
