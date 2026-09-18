import React, { useState, useEffect } from 'react';
import { History, Scale, Ruler, UtensilsCrossed, ChefHat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState } from '../ui/EmptyState';

const TYPE_CONFIG = {
  weight: { icon: Scale, color: '#267058', bg: '#EBF4F0', label: '⚖️' },
  measurement: { icon: Ruler, color: '#6366F1', bg: '#EEF2FF', label: '📏' },
  protein: { icon: UtensilsCrossed, color: '#D97706', bg: '#FEF3C7', label: '🥗' },
  recipe: { icon: ChefHat, color: '#EC4899', bg: '#FCE7F3', label: '🍲' }
};

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'weights', label: 'Pesagens' },
  { key: 'measurements', label: 'Medidas' },
  { key: 'proteins', label: 'Alimentação' },
  { key: 'recipes', label: 'Receitas' }
];

const formatDate = (d) => {
  if (!d) return '--';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

// Group items by date
const groupByDate = (items) => {
  const groups = {};
  items.forEach(item => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
};

export function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/history?filter=${filter}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setHistory(data.history || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [token, filter]);

  const grouped = groupByDate(history);

  return (
    <div className="page-body">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Histórico</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Todos os seus registros em uma linha do tempo</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`vt-btn vt-btn-sm ${filter === f.key ? 'vt-btn-primary' : 'vt-btn-secondary'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando histórico...</div>
      ) : grouped.length === 0 ? (
        <EmptyState
          icon={History}
          title="Nenhum registro encontrado"
          description="Seus registros de pesagens, medidas, alimentação e receitas aparecerão aqui em ordem cronológica."
        />
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div style={{
            position: 'absolute',
            left: '7px',
            top: '24px',
            bottom: '0',
            width: '2px',
            backgroundColor: 'var(--color-primary-light)',
            opacity: 0.5
          }} />

          {grouped.map(([date, items]) => (
            <div key={date} style={{ marginBottom: '28px', paddingLeft: '32px', position: 'relative' }}>
              {/* Date dot */}
              <div style={{
                position: 'absolute',
                left: '0',
                top: '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                border: '3px solid var(--color-bg)'
              }} />

              {/* Date label */}
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-tint)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                  {formatDate(date)}
                </span>
              </div>

              {/* Items for this date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map(item => {
                  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.weight;
                  return (
                    <div key={item.id} className="vt-card vt-card-compact" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: config.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}>
                        {config.label}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{item.title}</p>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: config.color }}>{item.mainValue}</span>
                        </div>
                        {item.details && item.details.length > 0 && (
                          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {item.details.map((d, i) => (
                              <p key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{d}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
