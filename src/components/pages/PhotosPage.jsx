import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';

export function PhotosPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadNotes, setUploadNotes] = useState('');
  const [frontalBase64, setFrontalBase64] = useState(null);
  const [lateralBase64, setLateralBase64] = useState(null);
  const [backBase64, setBackBase64] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  const headers = { 'Authorization': `Bearer ${token}` };

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/photos', { headers });
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, [token]);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return showToast('A imagem deve ter no máximo 3MB.', 'error');
    
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!frontalBase64 && !lateralBase64 && !backBase64) {
      return showToast('Selecione pelo menos uma foto.', 'error');
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: uploadDate,
          frontal_url: frontalBase64,
          lateral_url: lateralBase64,
          back_url: backBase64,
          notes: uploadNotes
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showToast('Fotos salvas com sucesso!');
      setShowUploadModal(false);
      
      // Reset form
      setFrontalBase64(null);
      setLateralBase64(null);
      setBackBase64(null);
      setUploadNotes('');
      setUploadDate(new Date().toISOString().split('T')[0]);
      
      loadPhotos();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar fotos.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/photos/${deletingId}`, { method: 'DELETE', headers });
      if (res.ok) {
        showToast('Fotos excluídas com sucesso.');
        setPhotos(photos.filter(p => p.id !== deletingId));
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch {
      showToast('Erro ao excluir fotos.', 'error');
    }
    setDeletingId(null);
  };

  const PhotoBox = ({ label, base64, setter, id }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        {label}
      </label>
      <div 
        onClick={() => document.getElementById(id).click()}
        style={{ 
          border: '2px dashed var(--color-gray-border)', 
          borderRadius: 'var(--radius-md)', 
          height: '180px',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: 'var(--color-card-muted)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {base64 ? (
          <img src={base64} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            <ImageIcon size={24} color="var(--color-text-muted)" style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Adicionar</span>
          </>
        )}
        <input 
          type="file" 
          id={id} 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={(e) => handleFileChange(e, setter)}
        />
      </div>
      {base64 && (
        <button 
          onClick={() => setter(null)}
          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.8rem', cursor: 'pointer', alignSelf: 'center' }}
        >
          Remover
        </button>
      )}
    </div>
  );

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Fotos da Evolução
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Acompanhe suas mudanças no espelho</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="vt-btn vt-btn-primary">
          <Camera size={18} /> Novo Registro
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando fotos...</div>
      ) : photos.length === 0 ? (
        <EmptyState 
          icon={Camera} 
          title="Nenhuma foto de evolução" 
          description="Tire fotos de frente, lado e costas para acompanhar suas mudanças ao longo do tempo."
          actionLabel="Adicionar primeira foto"
          onAction={() => setShowUploadModal(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {photos.map(group => {
            const dateStr = group.date.split('-').reverse().join('/');
            return (
              <div key={group.id} className="vt-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{dateStr}</h3>
                  <button 
                    onClick={() => setDeletingId(group.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {group.frontal_url && (
                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>Frente</p>
                      <img src={group.frontal_url} alt="Frente" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} />
                    </div>
                  )}
                  {group.lateral_url && (
                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>Lado</p>
                      <img src={group.lateral_url} alt="Lado" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} />
                    </div>
                  )}
                  {group.back_url && (
                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px', textAlign: 'center' }}>Costas</p>
                      <img src={group.back_url} alt="Costas" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} />
                    </div>
                  )}
                </div>
                {group.notes && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>Notas:</span> {group.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="vt-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Novo Registro Fotográfico</h2>
            
            <div className="vt-form-group">
              <label className="vt-label">Data</label>
              <input type="date" className="vt-input" value={uploadDate} onChange={e => setUploadDate(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <PhotoBox label="Frente" base64={frontalBase64} setter={setFrontalBase64} id="upload-frontal" />
              <PhotoBox label="Lado" base64={lateralBase64} setter={setLateralBase64} id="upload-lateral" />
              <PhotoBox label="Costas" base64={backBase64} setter={setBackBase64} id="upload-back" />
            </div>

            <div className="vt-form-group">
              <label className="vt-label">Notas (Opcional)</label>
              <textarea 
                className="vt-input" 
                rows="3" 
                placeholder="Ex: Como você se sentiu hoje, mudanças notadas..."
                value={uploadNotes}
                onChange={e => setUploadNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowUploadModal(false)} className="vt-btn vt-btn-outline" disabled={saving}>Cancelar</button>
              <button onClick={handleUpload} className="vt-btn vt-btn-primary" disabled={saving || (!frontalBase64 && !lateralBase64 && !backBase64)}>
                {saving ? 'Salvando...' : 'Salvar Fotos'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Excluir registro?"
        message="Esta ação não pode ser desfeita. As fotos deste dia serão permanentemente removidas."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        confirmText="Excluir"
      />
    </div>
  );
}
