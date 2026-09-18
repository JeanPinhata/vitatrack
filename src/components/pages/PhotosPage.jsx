import React, { useState, useEffect } from 'react';
import { Camera, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';

// Accept all common image formats incl iPhone HEIC/HEIF
const ACCEPT_STR = 'image/*,.heic,.heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif';
const MAX_SIZE_MB = 8;
const TARGET_MAX_DIM = 1200;
const JPEG_QUALITY = 0.82;

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = (ev) => {
      const src = ev.target.result;
      const img = new window.Image();
      img.onerror = () => resolve(src); // can't decode (e.g. HEIC on Android) — use raw
      img.onload = () => {
        let { width, height } = img;
        if (width > TARGET_MAX_DIM || height > TARGET_MAX_DIM) {
          const ratio = Math.min(TARGET_MAX_DIM / width, TARGET_MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function PhotosPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadNotes, setUploadNotes] = useState('');
  const [frontalBase64, setFrontalBase64] = useState(null);
  const [lateralBase64, setLateralBase64] = useState(null);
  const [backBase64, setBackBase64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const headers = { 'Authorization': `Bearer ${token}` };

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/photos', { headers });
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { loadPhotos(); }, [token]);

  const handleFileChange = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return showToast(`A imagem deve ter no máximo ${MAX_SIZE_MB}MB.`, 'error');
    }
    const compressed = await compressImage(file);
    if (!compressed) return showToast('Erro ao processar imagem. Tente outro formato.', 'error');
    setter(compressed);
    e.target.value = '';
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
        body: JSON.stringify({ date: uploadDate, frontal_url: frontalBase64, lateral_url: lateralBase64, back_url: backBase64, notes: uploadNotes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Fotos salvas com sucesso!');
      setShowUploadModal(false);
      setFrontalBase64(null); setLateralBase64(null); setBackBase64(null);
      setUploadNotes('');
      setUploadDate(new Date().toISOString().split('T')[0]);
      loadPhotos();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar fotos.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/photos/${deletingId}`, { method: 'DELETE', headers });
      if (res.ok) { showToast('Fotos excluídas.'); setPhotos(photos.filter(p => p.id !== deletingId)); }
      else throw new Error('Erro ao excluir');
    } catch { showToast('Erro ao excluir fotos.', 'error'); }
    setDeletingId(null);
  };

  const PhotoBox = ({ label, base64, setter, id }) => (
    <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        {label}
      </label>
      <div
        onClick={() => document.getElementById(id).click()}
        style={{
          border: `2px dashed ${base64 ? 'var(--color-primary-light)' : 'var(--color-gray-border)'}`,
          borderRadius: 'var(--radius-md)',
          minHeight: '150px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: base64 ? 'transparent' : 'var(--color-card-muted)',
          overflow: 'hidden', position: 'relative',
          transition: 'border-color 0.2s'
        }}
      >
        {base64 ? (
          <img src={base64} alt={label} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
        ) : (
          <>
            <Upload size={22} color="var(--color-text-muted)" style={{ marginBottom: '6px' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '0 8px' }}>Clique para selecionar</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>JPG, PNG, HEIC…</span>
          </>
        )}
        <input type="file" id={id} accept={ACCEPT_STR} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, setter)} />
      </div>
      {base64 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => setLightbox({ src: base64, label })} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Ver</button>
          <button onClick={() => setter(null)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.8rem', cursor: 'pointer' }}>Remover</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>📸 Fotos da Evolução</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Acompanhe suas mudanças ao longo do tempo</p>
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
          description="Aceita JPG, PNG, HEIC (iPhone), WebP, GIF, BMP e TIFF. Tire fotos de frente, lado e costas para acompanhar suas mudanças."
          actionLabel="Adicionar primeira foto"
          onAction={() => setShowUploadModal(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {photos.map(group => {
            const dateStr = group.date.split('-').reverse().join('/');
            return (
              <div key={group.id} className="vt-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '14px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{dateStr}</h3>
                  <button onClick={() => setDeletingId(group.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Excluir">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {group.frontal_url && (
                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox({ src: group.frontal_url, label: 'Frente' })}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '6px', textAlign: 'center' }}>Frente</p>
                      <img src={group.frontal_url} alt="Frente" style={{ width: '100%', borderRadius: 'var(--radius-md)', display: 'block' }} />
                    </div>
                  )}
                  {group.lateral_url && (
                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox({ src: group.lateral_url, label: 'Lado' })}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '6px', textAlign: 'center' }}>Lado</p>
                      <img src={group.lateral_url} alt="Lado" style={{ width: '100%', borderRadius: 'var(--radius-md)', display: 'block' }} />
                    </div>
                  )}
                  {group.back_url && (
                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox({ src: group.back_url, label: 'Costas' })}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '6px', textAlign: 'center' }}>Costas</p>
                      <img src={group.back_url} alt="Costas" style={{ width: '100%', borderRadius: 'var(--radius-md)', display: 'block' }} />
                    </div>
                  )}
                </div>
                {group.notes && (
                  <div style={{ marginTop: '14px', padding: '12px', backgroundColor: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="vt-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Novo Registro Fotográfico</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ marginBottom: '16px', padding: '10px 14px', backgroundColor: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              ✅ <b>JPG, PNG, HEIC/HEIF (iPhone), WebP, GIF, BMP, TIFF</b> — até {MAX_SIZE_MB}MB por foto (reduzida automaticamente)
            </div>

            <div className="vt-form-group">
              <label className="vt-label">Data</label>
              <input type="date" className="vt-input" value={uploadDate} onChange={e => setUploadDate(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <PhotoBox label="Frente" base64={frontalBase64} setter={setFrontalBase64} id="upload-frontal" />
              <PhotoBox label="Lado" base64={lateralBase64} setter={setLateralBase64} id="upload-lateral" />
              <PhotoBox label="Costas" base64={backBase64} setter={setBackBase64} id="upload-back" />
            </div>

            <div className="vt-form-group">
              <label className="vt-label">Notas (Opcional)</label>
              <textarea className="vt-input" rows="2" placeholder="Ex: Como você se sentiu hoje, mudanças notadas..." value={uploadNotes} onChange={e => setUploadNotes(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowUploadModal(false)} className="vt-btn vt-btn-secondary" disabled={saving}>Cancelar</button>
              <button onClick={handleUpload} className="vt-btn vt-btn-primary" disabled={saving || (!frontalBase64 && !lateralBase64 && !backBase64)}>
                {saving ? 'Salvando...' : 'Salvar Fotos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setLightbox(null)}
        >
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <X size={20} /> Fechar
            </button>
            <p style={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginBottom: '8px', fontSize: '0.85rem' }}>{lightbox.label}</p>
            <img src={lightbox.src} alt={lightbox.label} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 'var(--radius-md)', objectFit: 'contain', display: 'block' }} />
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
