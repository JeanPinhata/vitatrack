import React, { useState, useEffect, useCallback } from 'react';
import { Ruler, Plus, Pencil, Trash2, TrendingDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../../contexts/ToastContext';

const formatDate = (d) => {
  if (!d) return '--';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

const MEASURE_LABELS = {
  abdomen: 'Abdômen',
  waist: 'Cintura',
  arm: 'Braço',
  thigh: 'Coxa',
  hip: 'Quadril'
};

export function MeasurementsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    abdomen: '', waist: '', arm: '', thigh: '', hip: '', notes: ''
  });

  const headers = { 'Authorization': `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/measurements', { headers });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditEntry(null);
    setForm({ date: new Date().toISOString().split('T')[0], abdomen: '', waist: '', arm: '', thigh: '', hip: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditEntry(entry);
    setForm({
      date: entry.date,
      abdomen: entry.abdomen || '',
      waist: entry.waist || '',
      arm: entry.arm || '',
      thigh: entry.thigh || '',
      hip: entry.hip || '',
      notes: entry.notes || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const hasAny = ['abdomen', 'waist', 'arm', 'thigh', 'hip'].some(k => form[k] && parseFloat(form[k]) > 0);
    if (!hasAny) return showToast('Preencha pelo menos uma medida para salvar.', 'error');

    setSaving(true);
    try {
      const method = editEntry ? 'PUT' : 'POST';
      const url = editEntry ? `/api/measurements/${editEntry.id}` : '/api/measurements';
      const res = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast(editEntry ? 'Medidas atualizadas com sucesso.' : 'Medidas registradas com sucesso.');
      setShowModal(false);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar medidas.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/measurements/${deleteEntry.id}`, { method: 'DELETE', headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast('Medidas excluídas com sucesso.');
      setDeleteEntry(null);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao excluir medidas.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Medidas Corporais</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Acompanhe as mudanças no seu corpo em centímetros</p>
        </div>
        <button onClick={openAdd} className="vt-btn vt-btn-primary">
          <Plus size={18} /> Nova medição
        </button>
      </div>

      {/* Stats Cards per measurement */}
      {data?.stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {Object.entries(MEASURE_LABELS).map(([key, label]) => {
            const s = data.stats[key];
            if (!s) return null;
            return (
              <div key={key} className="stat-card">
                <div className="stat-header">
                  <span>{label}</span>
                  <TrendingDown size={16} color={s.diff < 0 ? 'var(--color-primary)' : s.diff > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)'} />
                </div>
                <div className="stat-value" style={{ fontSize: '1.6rem' }}>
                  {s.current} <small>cm</small>
                </div>
                <div style={{ marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="vt-badge" style={{ backgroundColor: s.diff < 0 ? 'var(--color-primary-tint)' : s.diff > 0 ? 'var(--color-warning-bg)' : 'var(--color-gray-lighter)', color: s.diff < 0 ? 'var(--color-primary)' : s.diff > 0 ? 'var(--color-warning)' : 'var(--color-text-secondary)', fontSize: '0.72rem' }}>
                    {s.diff > 0 ? '+' : ''}{s.diff} cm ({s.diff > 0 ? '+' : ''}{s.percent}%)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  <span>Inicial: {s.initial} cm</span>
                  <span>Menor: {s.min} cm</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando...</div>
      ) : data?.entries?.length > 0 ? (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px' }}>Histórico de medições</h3>
          <div className="vt-table-wrapper">
            <table className="vt-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Abdômen</th>
                  <th>Cintura</th>
                  <th>Braço</th>
                  <th>Coxa</th>
                  <th>Quadril</th>
                  <th>Obs.</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map(entry => (
                  <tr key={entry.id}>
                    <td style={{ fontWeight: 600 }}>{formatDate(entry.date)}</td>
                    {['abdomen', 'waist', 'arm', 'thigh', 'hip'].map(k => (
                      <td key={k}>{entry[k] ? `${entry[k]} cm` : '—'}</td>
                    ))}
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{entry.notes || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(entry)} className="vt-btn vt-btn-ghost vt-btn-sm" style={{ padding: '6px' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteEntry(entry)} className="vt-btn vt-btn-ghost vt-btn-sm" style={{ padding: '6px', color: 'var(--color-danger)' }}>
                          <Trash2 size={14} />
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
          icon={Ruler}
          title="Nenhuma medição registrada"
          description="Registre suas medidas corporais para acompanhar as mudanças no seu corpo com o tempo."
          actionLabel="Registrar medição"
          onAction={openAdd}
        />
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editEntry ? 'Editar medição' : 'Nova medição'}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Todos os campos de medida são opcionais — preencha apenas os que quiser registrar.
        </p>
        <div className="vt-form-group">
          <label className="vt-label" htmlFor="m-date">Data</label>
          <input id="m-date" type="date" className="vt-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Object.entries(MEASURE_LABELS).map(([key, label]) => (
            <div className="vt-form-group" key={key} style={{ marginBottom: 0 }}>
              <label className="vt-label" htmlFor={`m-${key}`}>{label} (cm)</label>
              <input id={`m-${key}`} type="number" step="0.5" min="1" className="vt-input" placeholder="0.0" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="vt-form-group" style={{ marginTop: '12px' }}>
          <label className="vt-label" htmlFor="m-notes">Observações (opcional)</label>
          <textarea id="m-notes" className="vt-textarea" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Alguma observação importante..." />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={() => setShowModal(false)} className="vt-btn vt-btn-secondary" disabled={saving}>Cancelar</button>
          <button onClick={handleSave} className="vt-btn vt-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : editEntry ? 'Atualizar medidas' : 'Salvar medidas'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteEntry}
        onClose={() => setDeleteEntry(null)}
        onConfirm={handleDelete}
        message={`Deseja excluir o registro de medidas de ${deleteEntry ? formatDate(deleteEntry.date) : ''}?`}
        loading={deleting}
      />
    </div>
  );
}
