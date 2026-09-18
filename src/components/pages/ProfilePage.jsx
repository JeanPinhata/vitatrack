import React, { useState } from 'react';
import { User, Lock, Download, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function ProfilePage() {
  const { user, settings, token, updateUser, updateSettings, logout } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    protein_goal: settings?.protein_goal || 150,
    weight_unit: settings?.weight_unit || 'kg',
    measurement_unit: settings?.measurement_unit || 'cm',
    personal_goal: settings?.personal_goal || ''
  });

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      updateUser(data.user);
      updateSettings(data.settings);
      showToast('Perfil atualizado com sucesso.');
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passForm.newPassword.length < 6) return showToast('A nova senha deve ter pelo menos 6 caracteres.', 'error');
    if (passForm.newPassword !== passForm.confirmPassword) return showToast('As senhas não conferem.', 'error');
    setSaving(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers,
        body: JSON.stringify(passForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Senha alterada com sucesso.');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message || 'Erro ao alterar senha.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await fetch(`/api/profile/export?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const filename = format === 'csv' ? 'vitatrack-exportacao.csv' : 'vitatrack-exportacao.json';

      if (format === 'csv') {
        const text = await res.text();
        const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
      } else {
        const json = await res.json();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
      }
      showToast(`Dados exportados em ${format.toUpperCase()} com sucesso.`);
    } catch {
      showToast('Erro ao exportar dados.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/profile/account', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Conta excluída com sucesso. Até mais!');
      setTimeout(logout, 1500);
    } catch (err) {
      showToast(err.message || 'Erro ao excluir conta.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const TABS = [
    { key: 'profile', label: 'Meu Perfil', icon: User },
    { key: 'password', label: 'Alterar Senha', icon: Lock },
    { key: 'settings', label: 'Configurações', icon: User }
  ];

  return (
    <div className="page-body">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Perfil & Configurações</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Gerencie seus dados pessoais e preferências</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* User card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="vt-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) return showToast('A imagem deve ter no máximo 2MB.', 'error');
                const reader = new FileReader();
                reader.onload = async () => {
                  try {
                    const res = await fetch('/api/profile/avatar', {
                      method: 'PUT',
                      headers,
                      body: JSON.stringify({ avatar_url: reader.result })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    updateUser({ ...user, avatar_url: reader.result });
                    showToast('Foto atualizada com sucesso!');
                  } catch (err) {
                    showToast(err.message || 'Erro ao atualizar foto.', 'error');
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <div
              onClick={() => document.getElementById('avatar-upload').click()}
              style={{ cursor: 'pointer', position: 'relative', width: '80px', height: '80px', margin: '0 auto 14px' }}
              title="Clique para trocar a foto"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--color-primary-light)', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: '0', right: '0',
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: 'var(--color-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', border: '2px solid white'
              }}>✎</div>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{user?.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
            <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Meta de proteína</p>
              <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{settings?.protein_goal || 150}g/dia</p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="vt-card" style={{ padding: '8px' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: tab === t.key ? 'var(--color-primary-tint)' : 'transparent',
                    color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: tab === t.key ? 600 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '2px'
                  }}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          {tab === 'profile' && (
            <div className="vt-card">
              <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Informações pessoais</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="vt-form-group" style={{ marginBottom: 0 }}>
                  <label className="vt-label">Nome completo</label>
                  <input type="text" className="vt-input" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div className="vt-form-group" style={{ marginBottom: 0 }}>
                  <label className="vt-label">E-mail</label>
                  <input type="email" className="vt-input" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                </div>
                <div className="vt-form-group" style={{ marginBottom: 0 }}>
                  <label className="vt-label">Meta de proteína (g/dia)</label>
                  <input type="number" min="30" max="500" className="vt-input" value={profileForm.protein_goal} onChange={e => setProfileForm({ ...profileForm, protein_goal: e.target.value })} />
                </div>
                <div className="vt-form-group" style={{ marginBottom: 0 }}>
                  <label className="vt-label">Unidade de peso</label>
                  <select className="vt-select" value={profileForm.weight_unit} onChange={e => setProfileForm({ ...profileForm, weight_unit: e.target.value })}>
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="lb">Libras (lb)</option>
                  </select>
                </div>
              </div>
              <div className="vt-form-group" style={{ marginTop: '14px', marginBottom: 0 }}>
                <label className="vt-label">Objetivo pessoal (privado)</label>
                <textarea className="vt-textarea" rows={3} value={profileForm.personal_goal} onChange={e => setProfileForm({ ...profileForm, personal_goal: e.target.value })} placeholder="Seu objetivo de vida..." />
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSaveProfile} className="vt-btn vt-btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Salvando...' : 'Salvar perfil'}
                </button>
              </div>
            </div>
          )}

          {tab === 'password' && (
            <div className="vt-card">
              <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Alterar senha</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { id: 'curr', label: 'Senha atual', field: 'currentPassword', show: showCurrentPass, setShow: setShowCurrentPass },
                  { id: 'new', label: 'Nova senha', field: 'newPassword', show: showNewPass, setShow: setShowNewPass },
                  { id: 'conf', label: 'Confirmar nova senha', field: 'confirmPassword', show: showNewPass, setShow: setShowNewPass }
                ].map(item => (
                  <div className="vt-form-group" key={item.id} style={{ marginBottom: 0 }}>
                    <label className="vt-label" htmlFor={item.id}>{item.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id={item.id}
                        type={item.show ? 'text' : 'password'}
                        className="vt-input"
                        value={passForm[item.field]}
                        onChange={e => setPassForm({ ...passForm, [item.field]: e.target.value })}
                        style={{ paddingRight: '44px' }}
                      />
                      <button type="button" onClick={() => item.setShow(!item.show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                        {item.show ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSavePassword} className="vt-btn vt-btn-primary" disabled={saving}>
                  {saving ? 'Alterando...' : 'Alterar senha'}
                </button>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Export */}
              <div className="vt-card">
                <h3 style={{ fontWeight: 600, marginBottom: '14px' }}>Exportar meus dados</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Baixe todos os seus dados pessoais em formato CSV (para planilhas) ou JSON completo.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleExport('csv')} className="vt-btn vt-btn-secondary">
                    <Download size={16} /> Exportar CSV
                  </button>
                  <button onClick={() => handleExport('json')} className="vt-btn vt-btn-secondary">
                    <Download size={16} /> Exportar JSON
                  </button>
                </div>
              </div>

              {/* Logout */}
              <div className="vt-card">
                <h3 style={{ fontWeight: 600, marginBottom: '14px' }}>Sair da conta</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                  Você será desconectado e redirecionado para a tela de login.
                </p>
                <button onClick={logout} className="vt-btn vt-btn-secondary">Sair da conta</button>
              </div>

              {/* Danger Zone */}
              <div className="vt-card" style={{ borderColor: 'rgba(192, 57, 43, 0.3)', backgroundColor: 'rgba(253, 232, 232, 0.2)' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-danger)' }}>Excluir minha conta</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Esta ação é <b>permanente e irreversível</b>. Todos os seus registros de pesagens, medidas, alimentos e receitas serão excluídos definitivamente.
                </p>
                <button onClick={() => setShowDeleteConfirm(true)} className="vt-btn vt-btn-danger vt-btn-sm">
                  <Trash2 size={15} /> Excluir minha conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir conta permanentemente"
        message="Esta ação é irreversível. Todos os seus dados, histórico, medidas, pesagens e receitas serão excluídos para sempre. Tem certeza?"
        confirmText="Sim, excluir minha conta"
        loading={deleting}
      />
    </div>
  );
}
