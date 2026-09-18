import React, { useState } from 'react';

export function WeightChart({ data = [], activePeriod = 'all', onPeriodChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const periods = [
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: '3m', label: '3 meses' },
    { key: '6m', label: '6 meses' },
    { key: '1y', label: '1 ano' },
    { key: 'all', label: 'Todo período' }
  ];

  if (!data || data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
        Nenhuma pesagem no período selecionado.
      </div>
    );
  }

  // Chart dimensions & coordinates
  const width = 800;
  const height = 280;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const weights = data.map(d => d.weight);
  const minW = Math.floor(Math.min(...weights) - 1.5);
  const maxW = Math.ceil(Math.max(...weights) + 1.5);
  const rangeW = maxW - minW || 1;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * plotWidth;
    const y = paddingTop + plotHeight - ((d.weight - minW) / rangeW) * plotHeight;
    return { ...d, x, y };
  });

  // Construct SVG path
  let pathD = '';
  points.forEach((p, i) => {
    if (i === 0) pathD += `M ${p.x} ${p.y}`;
    else {
      // Smooth cubic bezier curve between points
      const prev = points[i - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }
  });

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;

  // Format date helper: "15/09"
  const formatDateLabel = (dStr) => {
    if (!dStr) return '';
    const parts = dStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dStr;
  };

  // Y-axis grid ticks (4 ticks)
  const yTicks = [minW, minW + rangeW * 0.33, minW + rangeW * 0.66, maxW].map(v => Math.round(v));

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div style={{ width: '100%' }}>
      {/* Header controls with Period Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Evolução do peso</h3>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-primary-soft)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => onPeriodChange && onPeriodChange(p.key)}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: activePeriod === p.key ? 600 : 500,
                backgroundColor: activePeriod === p.key ? 'var(--color-card)' : 'transparent',
                color: activePeriod === p.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: activePeriod === p.key ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#267058" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#267058" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and labels */}
          {yTicks.map(val => {
            const y = paddingTop + plotHeight - ((val - minW) / rangeW) * plotHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--color-gray-border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--color-text-muted)"
                  fontFamily="Inter"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#weightGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#267058" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 7 : 4.5}
                fill={hoveredIndex === idx ? '#267058' : '#FFFFFF'}
                stroke="#267058"
                strokeWidth={hoveredIndex === idx ? 3 : 2}
                style={{ transition: 'all 0.15s ease' }}
              />
              {/* Invisible larger hit target */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
            </g>
          ))}

          {/* X Axis Labels (sample across points) */}
          {points.filter((_, i) => i === 0 || i === points.length - 1 || (points.length > 4 && i % Math.floor(points.length / 4) === 0)).map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-muted)"
              fontFamily="Inter"
            >
              {formatDateLabel(p.date)}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip matching moodboard card */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: 'translate(-50%, -120%)',
              backgroundColor: 'var(--color-text-main)',
              color: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'none',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              zIndex: 10,
              textAlign: 'center',
              animation: 'fadeIn 0.15s ease'
            }}
          >
            <div style={{ color: 'var(--color-primary-light)', fontSize: '0.725rem', marginBottom: '2px' }}>
              {formatDateLabel(hoveredPoint.date)}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {hoveredPoint.weight.toFixed(1)} kg
            </div>
            {hoveredPoint.diff_from_initial !== undefined && (
              <div style={{ fontSize: '0.725rem', opacity: 0.85 }}>
                {hoveredPoint.diff_from_initial <= 0 ? '' : '+'}{hoveredPoint.diff_from_initial} kg desde início
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
