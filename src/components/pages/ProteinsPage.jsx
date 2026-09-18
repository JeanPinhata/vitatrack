import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, Trash2, Search, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../../contexts/ToastContext';

const MEAL_ORDER = ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia', 'Outro'];

const formatDate = (d) => {
  if (!d) return '--';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

export function ProteinsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [dayData, setDayData] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [form, setForm] = useState({ date: today, meal_type: 'Almoço', quantity: '' });
  const [calculatedProtein, setCalculatedProtein] = useState(0);

  const headers = { 'Authorization': `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dayRes, dashRes, foodRes] = await Promise.all([
        fetch(`/api/proteins?date=${selectedDate}`, { headers }),
        fetch(`/api/proteins/dashboard?date=${today}`, { headers }),
        fetch('/api/foods', { headers })
      ]);
      const [d, dash, f] = await Promise.all([dayRes.json(), dashRes.json(), foodRes.json()]);
      setDayData(d);
      setDashData(dash);
      setFoods(f.foods || []);
    } catch {}
    setLoading(false);
  }, [token, selectedDate]);

  useEffect(() => { load(); }, [load]);

  // Recalculate protein when food or quantity changes
  useEffect(() => {
    if (selectedFood && form.quantity) {
      const qty = parseFloat(form.quantity) || 0;
      const calc = (qty / selectedFood.reference_amount) * selectedFood.protein_amount;
      setCalculatedProtein(Number(calc.toFixed(1)));
    } else {
      setCalculatedProtein(0);
    }
  }, [selectedFood, form.quantity]);

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const openAdd = () => {
    setSelectedFood(null);
    setFoodSearch('');
    setForm({ date: selectedDate, meal_type: 'Almoço', quantity: '' });
    setCalculatedProtein(0);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedFood) return showToast('Selecione um alimento.', 'error');
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) return showToast('Informe uma quantidade válida.', 'error');

    setSaving(true);
    try {
      const payload = {
        date: form.date,
        meal_type: form.meal_type,
        food_id: selectedFood.id,
        food_name: selectedFood.name,
        quantity: qty,
        reference_amount: selectedFood.reference_amount,
        protein_amount: selectedFood.protein_amount
      };
      const res = await fetch('/api/proteins', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('Alimento adicionado ao seu dia com sucesso.');
      setShowModal(false);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/proteins/${deleteItem.id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('Alimento removido com sucesso.');
      setDeleteItem(null);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao remover.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const progressPercent = dayData ? Math.min(100, dayData.percent) : 0;

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Proteínas</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Acompanhe sua ingestão diária de proteínas</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="vt-input"
            style={{ width: 'auto' }}
          />
          <button onClick={openAdd} className="vt-btn vt-btn-primary">
            <Plus size={18} /> Adicionar alimento
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {/* Daily Progress */}
        <div className="stat-card" style={{ gridColumn: 'span 1' }}>
          <div className="stat-header"><span>Proteína {selectedDate === today ? 'hoje' : formatDate(selectedDate)}</span></div>
          <div className="stat-value">
            {dayData ? dayData.total_consumed : '--'} <small>/ {dayData?.protein_goal || '--'}g</small>
          </div>
          <div style={{ margin: '10px 0 6px' }}>
            <div style={{ height: '8px', backgroundColor: 'var(--color-gray-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: progressPercent >= 100 ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.7s ease' }} />
            </div>
          </div>
          <div className="stat-footer" style={{ flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
            <span>{dayData?.percent}% da meta</span>
            {dayData?.remaining > 0 && <span style={{ color: 'var(--color-text-muted)' }}>Restam {dayData.remaining}g para sua meta</span>}
          </div>
        </div>

        {dashData && [
          { label: 'Média 7 dias', value: `${dashData.avg_7_days}g`, sub: 'Média diária' },
          { label: 'Média 30 dias', value: `${dashData.avg_30_days}g`, sub: 'Média mensal' },
          { label: 'Meta atingida', value: `${dashData.met_goal_count}/${dashData.active_days_count}`, sub: 'Dias no mês' }
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-header"><span>{c.label}</span></div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{c.value}</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Meals breakdown */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando...</div>
      ) : dayData?.meals?.filter(m => m.items.length > 0).length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {MEAL_ORDER.map(mealName => {
            const meal = dayData.meals.find(m => m.meal === mealName);
            if (!meal || meal.items.length === 0) return null;
            return (
              <div key={mealName} className="vt-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{mealName}</h3>
                  <span className="vt-badge vt-badge-success" style={{ fontSize: '0.8rem' }}>{meal.totalProtein}g de proteína</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {meal.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-gray-border)' }}>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.food_name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.quantity}g</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>{item.calculated_protein}g</span>
                        <button onClick={() => setDeleteItem(item)} className="vt-btn vt-btn-ghost vt-btn-sm" style={{ padding: '4px', color: 'var(--color-danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="Nenhum alimento registrado neste dia"
          description="Adicione alimentos para acompanhar sua ingestão diária de proteína."
          actionLabel="Adicionar alimento"
          onAction={openAdd}
        />
      )}

      {/* Protein 30-day heatmap */}
      {dashData?.last_30_days && (
        <div className="vt-card" style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px' }}>Histórico de 30 dias</h3>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {dashData.last_30_days.map((day, idx) => {
              const opacity = day.total === 0 ? 0.1 : Math.min(1, day.total / (dashData.protein_goal * 1.2));
              return (
                <div
                  key={idx}
                  title={`${day.date}: ${day.total}g`}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '5px',
                    backgroundColor: day.total === 0 ? 'var(--color-gray-light)' : day.reachedGoal ? 'var(--color-primary)' : `rgba(38, 112, 88, ${Math.max(0.2, opacity)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    color: day.total > 0 ? 'white' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {day.day}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-primary)', display: 'inline-block' }} /> Meta atingida
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(38,112,88,0.4)', display: 'inline-block' }} /> Parcial
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-gray-light)', display: 'inline-block' }} /> Sem registro
            </span>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Adicionar alimento" maxWidth="560px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="vt-form-group" style={{ marginBottom: 0 }}>
              <label className="vt-label" htmlFor="p-date">Data</label>
              <input id="p-date" type="date" className="vt-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="vt-form-group" style={{ marginBottom: 0 }}>
              <label className="vt-label" htmlFor="p-meal">Refeição</label>
              <select id="p-meal" className="vt-select" value={form.meal_type} onChange={e => setForm({ ...form, meal_type: e.target.value })}>
                {MEAL_ORDER.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Food search */}
          <div className="vt-form-group" style={{ marginBottom: 0 }}>
            <label className="vt-label">Alimento</label>
            {selectedFood ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-tint)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{selectedFood.name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{selectedFood.protein_amount}g prot / {selectedFood.reference_amount}{selectedFood.reference_unit}</p>
                </div>
                <button onClick={() => { setSelectedFood(null); setCalculatedProtein(0); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="vt-input"
                  placeholder="Buscar alimento..."
                  value={foodSearch}
                  onChange={e => setFoodSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            )}

            {/* Food list dropdown */}
            {!selectedFood && foodSearch && (
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-md)', marginTop: '4px', backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-md)' }}>
                {filteredFoods.length > 0 ? filteredFoods.slice(0, 20).map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => { setSelectedFood(f); setFoodSearch(''); }}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--color-gray-border)', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-soft)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{f.name} {f.is_custom ? <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>• personalizado</span> : null}</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{f.protein_amount}g/{f.reference_amount}{f.reference_unit}</span>
                  </button>
                )) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Nenhum alimento encontrado</div>
                )}
              </div>
            )}
          </div>

          <div className="vt-form-group" style={{ marginBottom: 0 }}>
            <label className="vt-label" htmlFor="p-qty">Quantidade (g)</label>
            <input
              id="p-qty"
              type="number"
              step="5"
              min="1"
              className="vt-input"
              placeholder={`Referência: ${selectedFood?.reference_amount || 100}g`}
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
            />
          </div>

          {/* Real-time protein calculation */}
          {selectedFood && form.quantity && (
            <div style={{ backgroundColor: 'var(--color-primary-tint)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Proteína calculada:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {calculatedProtein}g
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setShowModal(false)} className="vt-btn vt-btn-secondary" disabled={saving}>Cancelar</button>
          <button onClick={handleSave} className="vt-btn vt-btn-primary" disabled={saving || !selectedFood}>
            {saving ? 'Adicionando...' : 'Adicionar ao dia'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        message={`Deseja remover "${deleteItem?.food_name}" do seu registro de ${formatDate(deleteItem?.date)}?`}
        confirmText="Remover"
        loading={deleting}
      />
    </div>
  );
}
