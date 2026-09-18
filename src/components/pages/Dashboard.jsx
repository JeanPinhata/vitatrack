import React, { useEffect, useState } from 'react';
import { Scale, Ruler, Target, TrendingUp, Plus, Activity, Lightbulb, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { WeightChart } from '../charts/WeightChart';

const formatDate = (d) => {
  if (!d) return '--';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

const formatNum = (n, decimals = 1) => {
  if (n === null || n === undefined) return '--';
  return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

export function Dashboard({ onSelectTab }) {
  const { token } = useAuth();
  const [weightData, setWeightData] = useState(null);
  const [measData, setMeasData] = useState(null);
  const [proteinData, setProteinData] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('all');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { 'Authorization': `Bearer ${token}` };
  const today = new Date().toISOString().split('T')[0];

  async function loadAll() {
    setLoading(true);
    try {
      const [wRes, mRes, pRes] = await Promise.all([
        fetch(`/api/weights?period=${chartPeriod}`, { headers }),
        fetch('/api/measurements', { headers }),
        fetch(`/api/proteins/dashboard?date=${today}`, { headers })
      ]);

      const [wData, mData, pData] = await Promise.all([
        wRes.json(),
        mRes.json(),
        pRes.json()
      ]);

      setWeightData(wData);
      setMeasData(mData);
      setProteinData(pData);
      setChartData(wData.chartData || []);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const handlePeriodChange = async (period) => {
    setChartPeriod(period);
    try {
      const res = await fetch(`/api/weights?period=${period}`, { headers });
      const data = await res.json();
      setChartData(data.chartData || []);
    } catch {}
  };

  // Calculate insights from real data
  const buildInsights = () => {
    const insights = [];
    if (weightData?.summary?.total_variation && weightData.summary.total_variation < 0) {
      insights.push(`Seu peso atual está ${Math.abs(weightData.summary.total_variation).toFixed(1)} kg abaixo do primeiro registro.`);
    }
    if (measData?.stats?.waist?.diff && measData.stats.waist.diff < 0) {
      insights.push(`Sua cintura reduziu ${Math.abs(measData.stats.waist.diff)} cm desde a primeira medição.`);
    }
    if (proteinData?.met_in_14_days > 0) {
      insights.push(`Você registrou proteína em ${proteinData.met_in_14_days} dos últimos 14 dias.`);
    }
    if (weightData?.summary?.total_entries >= 2) {
      insights.push(`Você já tem ${weightData.summary.total_entries} pesagens registradas. Continue consistente!`);
    }
    return insights;
  };

  const insights = buildInsights();

  // Stats
  const ws = weightData?.summary;
  const trackingDays = ws?.first_date ? Math.round((new Date(today) - new Date(ws.first_date)) / 86400000) : 0;

  const SkeletonCard = () => (
    <div className="stat-card" style={{ animation: 'pulse 1.5s ease infinite' }}>
      <div style={{ height: '12px', backgroundColor: 'var(--color-gray-light)', borderRadius: '6px', marginBottom: '8px' }} />
      <div style={{ height: '28px', backgroundColor: 'var(--color-gray-lighter)', borderRadius: '6px', width: '60%' }} />
    </div>
  );

  return (
    <div className="page-body">
      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Pesagem', icon: Scale, tab: 'weights' },
          { label: 'Medidas', icon: Ruler, tab: 'measurements' },
          { label: 'Proteína', icon: Target, tab: 'proteins' },
          { label: 'Receita', icon: Activity, tab: 'recipes' }
        ].map(({ label, icon: Icon, tab }) => (
          <button
            key={label}
            onClick={() => onSelectTab(tab)}
            className="vt-btn vt-btn-secondary vt-btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          >
            <Plus size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {/* Peso Atual */}
            <div className="stat-card" onClick={() => onSelectTab('weights')} style={{ cursor: 'pointer' }}>
              <div className="stat-header">
                <span>Peso atual</span>
                <Scale size={17} color="var(--color-primary)" />
              </div>
              <div className="stat-value">
                {ws?.current_weight ? formatNum(ws.current_weight) : '--'}
                <small>kg</small>
              </div>
              <div className="stat-footer">
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  Inicial: <b>{ws?.initial_weight ? formatNum(ws.initial_weight) : '--'} kg</b>
                </span>
              </div>
              {ws?.total_variation !== undefined && ws.total_variation !== 0 && (
                <div style={{ marginTop: '4px' }}>
                  <span
                    className="vt-badge"
                    style={{
                      backgroundColor: ws.total_variation < 0 ? 'var(--color-primary-tint)' : 'var(--color-warning-bg)',
                      color: ws.total_variation < 0 ? 'var(--color-primary)' : 'var(--color-warning)',
                      fontSize: '0.75rem'
                    }}
                  >
                    {ws.total_variation > 0 ? '+' : ''}{formatNum(ws.total_variation)} kg &nbsp;({ws.total_variation > 0 ? '+' : ''}{formatNum(ws.percentage_variation, 1)}%)
                  </span>
                </div>
              )}
            </div>

            {/* Última medição */}
            <div className="stat-card" onClick={() => onSelectTab('measurements')} style={{ cursor: 'pointer' }}>
              <div className="stat-header">
                <span>Última medição</span>
                <Ruler size={17} color="var(--color-primary)" />
              </div>
              {measData?.latest ? (
                <>
                  <div className="stat-value" style={{ fontSize: '1.1rem', marginTop: '4px' }}>
                    {formatDate(measData.latest.date)}
                  </div>
                  <div className="stat-footer" style={{ marginTop: '4px' }}>
                    <span className="vt-badge vt-badge-success">
                      {measData.latest.total_recorded_parts} medidas registradas
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '6px' }}>
                  Nenhuma medição registrada ainda
                </div>
              )}
            </div>

            {/* Proteína hoje */}
            <div className="stat-card" onClick={() => onSelectTab('proteins')} style={{ cursor: 'pointer' }}>
              <div className="stat-header">
                <span>Proteína hoje</span>
                <Target size={17} color="var(--color-primary)" />
              </div>
              <div className="stat-value">
                {proteinData ? formatNum(proteinData.today_consumed, 0) : '--'}
                <small>/ {proteinData?.protein_goal || 150} g</small>
              </div>
              {proteinData && (
                <>
                  <div style={{ marginTop: '8px', marginBottom: '4px' }}>
                    <div style={{
                      height: '6px',
                      backgroundColor: 'var(--color-gray-light)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, proteinData.today_percent)}%`,
                        backgroundColor: proteinData.today_percent >= 100 ? 'var(--color-success)' : 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.7s ease'
                      }} />
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span>{proteinData.today_percent}% da meta</span>
                    {proteinData.today_remaining > 0 && (
                      <span style={{ color: 'var(--color-text-muted)' }}>• Restam {formatNum(proteinData.today_remaining, 0)}g</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Evolução */}
            <div className="stat-card" onClick={() => onSelectTab('evolution')} style={{ cursor: 'pointer' }}>
              <div className="stat-header">
                <span>Evolução</span>
                <TrendingUp size={17} color="var(--color-primary)" />
              </div>
              <div className="stat-value" style={{ fontSize: '1.8rem' }}>
                {trackingDays}
                <small>dias</small>
              </div>
              <div className="stat-footer" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                <span className="vt-badge vt-badge-neutral">{ws?.total_entries || 0} pesagens</span>
                <span className="vt-badge vt-badge-neutral">{measData?.entries?.length || 0} medições</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Weight Chart */}
      <div className="vt-card" style={{ marginBottom: '24px' }}>
        <WeightChart
          data={chartData}
          activePeriod={chartPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Measurements Summary + Insights Side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Medidas Summary */}
        <div className="vt-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Medidas <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(atual vs inicial)</span></h3>
            <button className="vt-btn vt-btn-ghost vt-btn-sm" onClick={() => onSelectTab('measurements')}>
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>
          {measData?.stats ? (
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Medida', 'Atual', 'Inicial', 'Dif.'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'left', fontSize: '0.75rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'abdomen', label: 'Abdômen' },
                  { key: 'waist', label: 'Cintura' },
                  { key: 'arm', label: 'Braço' },
                  { key: 'thigh', label: 'Coxa' },
                  { key: 'hip', label: 'Quadril' }
                ].map(({ key, label }) => {
                  const stat = measData.stats[key];
                  return stat ? (
                    <tr key={key} style={{ borderTop: '1px solid var(--color-gray-border)' }}>
                      <td style={{ padding: '8px' }}>{label}</td>
                      <td style={{ padding: '8px', fontWeight: 600 }}>{stat.current} cm</td>
                      <td style={{ padding: '8px', color: 'var(--color-text-muted)' }}>{stat.initial} cm</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          fontWeight: 600,
                          color: stat.diff < 0 ? 'var(--color-primary)' : stat.diff > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)'
                        }}>
                          {stat.diff > 0 ? '+' : ''}{stat.diff} cm
                        </span>
                      </td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Nenhuma medida registrada ainda. Registre sua primeira medição!
            </p>
          )}
        </div>

        {/* Insights */}
        <div className="vt-card" style={{ backgroundColor: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb size={18} color="var(--color-primary)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Insights do seu progresso</h3>
          </div>
          {insights.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0 }}>
              {insights.map((ins, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700, marginTop: '2px' }}>→</span>
                  {ins}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Continue registrando para receber insights personalizados sobre seu progresso!
            </p>
          )}
        </div>
      </div>

      {/* Protein 7-day bar chart snippet */}
      {proteinData?.last_7_days && proteinData.last_7_days.length > 0 && (
        <div className="vt-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Proteína — últimos 7 dias</h3>
            <button className="vt-btn vt-btn-ghost vt-btn-sm" onClick={() => onSelectTab('proteins')}>
              Ver detalhes <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
            {proteinData.last_7_days.map((day, idx) => {
              const maxPossible = proteinData.protein_goal * 1.2 || 180;
              const pct = day.total > 0 ? Math.min(100, (day.total / maxPossible) * 100) : 0;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%',
                    height: `${pct}%`,
                    backgroundColor: day.reachedGoal ? 'var(--color-primary)' : 'var(--color-primary-light)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: day.total > 0 ? '4px' : '0',
                    transition: 'height 0.5s ease'
                  }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{day.dayOfWeek}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', borderTop: '1px solid var(--color-gray-border)', paddingTop: '12px', fontSize: '0.825rem' }}>
            <span>Média 7 dias: <b>{proteinData.avg_7_days}g</b></span>
            <span>Média 30 dias: <b>{proteinData.avg_30_days}g</b></span>
            <span>Meta: <b>{proteinData.protein_goal}g</b></span>
          </div>
        </div>
      )}
    </div>
  );
}
