import React, { useState, useEffect, useCallback } from 'react';
import { Scale, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { WeightChart } from '../charts/WeightChart';
import { useToast } from '../../contexts/ToastContext';

const formatDate = (d) => {
  if (!d) return '--';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

export function WeightsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('all');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], weight: '', time: '', notes: '' });

  const headers = { 'Authorization': `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weights?period=${chartPeriod}`, { headers });
      const json = await res.json();
      setData(json);
      setChartData(json.chartData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, chartPeriod]);

  useEffect(() => { load(); }, [load]);

  const handlePeriodChange = async (period) => {
    setChartPeriod(period);
    try {
      const res = await fetch(`/api/weights?period=${period}`, { headers });
      const json = await res.json();
      setChartData(json.chartData || []);
    } catch {}
  };

  const openAdd = () => {
    setEditEntry(null);
    setForm({ date: new Date().toISOString().split('T')[0], weight: '', time: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditEntry(entry);
    setForm({ date: entry.date, weight: String(entry.weight), time: entry.time || '', notes: entry.notes || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.weight || parseFloat(form.weight) <= 0) {
      return showToast('Informe um peso válido maior que zero.', 'error');
    }
    setSaving(true);
    try {
      const method = editEntry ? 'PUT' : 'POST';
      const url = editEntry ? `/api/weights/${editEntry.id}` : '/api/weights';
      const res = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast(editEntry ? 'Pesagem atualizada com sucesso.' : 'Pesagem registrada com sucesso.');
      setShowModal(false);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar pesagem.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/weights/${deleteEntry.id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('Pesagem excluída com sucesso.');
      setDeleteEntry(null);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao excluir pesagem.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const ws = data?.summary;

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Pesagens</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Acompanhe sua evolução de peso ao longo do tempo</p>
        </div>
        <button onClick={openAdd} className="vt-btn vt-btn-primary">
          <Plus size={18} /> Nova pesagem
        </button>
      </div>

      {/* Summary Cards */}
      {ws && ws.total_entries > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Peso atual', value: `${ws.current_weight?.toFixed(1)} kg`, sub: `Registrado em ${formatDate(ws.last_date)}` },
            { label: 'Peso inicial', value: `${ws.initial_weight?.toFixed(1)} kg`, sub: `Em ${formatDate(ws.first_date)}` },
            { label: 'Variação total', value: `${ws.total_variation > 0 ? '+' : ''}${ws.total_variation?.toFixed(1)} kg`, sub: `${ws.percentage_variation > 0 ? '+' : ''}${ws.percentage_variation?.toFixed(1)}%`, color: ws.total_variation < 0 ? 'var(--color-primary)' : ws.total_variation > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' },
            { label: 'Registros', value: ws.total_entries, sub: 'pesagens' }
          ].map(card => (
            <div key={card.label} className="stat-card">
              <div className="stat-header"><span>{card.label}</span></div>
              <div className="stat-value" style={{ fontSize: '1.6rem', color: card.color || 'var(--color-text-main)' }}>
                {card.value}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="vt-card" style={{ marginBottom: '24px' }}>
          <WeightChart data={chartData} activePeriod={chartPeriod} onPeriodChange={handlePeriodChange} />
        </div>
      )}

      {/* History Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando...</div>
      ) : data?.entries?.length > 0 ? (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px' }}>Histórico de pesagens</h3>
          <div className="vt-table-wrapper">
            <table className="vt-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Peso</th>
                  <th>Var. anterior</th>
                  <th>Var. inicial</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry, idx) => (
                  <tr key={entry.id}>
                    <td>{formatDate(entry.date)}</td>
                    <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>{entry.weight.toFixed(1)} kg</td>
                    <td>
                      {entry.diff_from_prev !== 0 ? (
                        <span style={{ color: entry.diff_from_prev < 0 ? 'var(--color-primary)' : 'var(--color-warning)', fontWeight: 500 }}>
                          {entry.diff_from_prev > 0 ? '+' : ''}{entry.diff_from_prev.toFixed(1)} kg
                        </span>
                      ) : <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                    </td>
                    <td>
                      {entry.diff_from_initial !== 0 ? (
                        <span style={{ color: entry.diff_from_initial < 0 ? 'var(--color-primary)' : 'var(--color-warning)', fontWeight: 500 }}>
                          {entry.diff_from_initial > 0 ? '+' : ''}{entry.diff_from_initial.toFixed(1)} kg
                        </span>
                      ) : <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      {entry.notes || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(entry)} className="vt-btn vt-btn-ghost vt-btn-sm" style={{ padding: '6px' }} title="Editar">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteEntry(entry)} className="vt-btn vt-btn-ghost vt-btn-sm" style={{ padding: '6px', color: 'var(--color-danger)' }} title="Excluir">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Scale}
          title="Nenhuma pesagem registrada ainda"
          description="Registre sua primeira pesagem para começar a acompanhar sua evolução de peso."
          actionLabel="Registrar pesagem"
          onAction={openAdd}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editEntry ? 'Editar pesagem' : 'Nova pesagem'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="w-date">Data</label>
            <input id="w-date" type="date" className="vt-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="w-weight">Peso (kg)</label>
            <input id="w-weight" type="number" step="0.1" min="1" className="vt-input" placeholder="Ex.: 82.4" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="w-time">Horário (opcional)</label>
            <input id="w-time" type="time" className="vt-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          </div>
          <div className="vt-form-group">
            <label className="vt-label" htmlFor="w-notes">Observações (opcional)</label>
            <textarea id="w-notes" className="vt-textarea" rows={3} placeholder="Como você está se sentindo hoje?" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <div className="vt-modal-footer" style={{ paddingTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowModal(false)} className="vt-btn vt-btn-secondary" disabled={saving}>Cancelar</button>
          <button onClick={handleSave} className="vt-btn vt-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : editEntry ? 'Atualizar pesagem' : 'Registrar pesagem'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteEntry}
        onClose={() => setDeleteEntry(null)}
        onConfirm={handleDelete}
        message={`Deseja excluir o registro de ${deleteEntry ? deleteEntry.weight?.toFixed(1) + ' kg' : ''} em ${deleteEntry ? formatDate(deleteEntry.date) : ''}?`}
        loading={deleting}
      />
    </div>
  );
}
