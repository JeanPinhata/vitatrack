import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Plus, Trash2, Clock, Search, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../../contexts/ToastContext';

const CATEGORIES = ['Todas', 'Café da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Sobremesa'];

export function RecipesPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [deleteRecipe, setDeleteRecipe] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [foods, setFoods] = useState([]);
  const [editRecipe, setEditRecipe] = useState(null);

  const [form, setForm] = useState({
    name: '', category: 'Geral', preparation_time: '15', servings: '2',
    instructions: '', notes: '', image_url: '', ingredients: []
  });
  const [ingSearch, setIngSearch] = useState('');
  const [showIngSearch, setShowIngSearch] = useState(false);

  const headers = { 'Authorization': `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'Todas') params.set('category', category);
      if (search) params.set('search', search);

      const [rRes, fRes] = await Promise.all([
        fetch(`/api/recipes?${params}`, { headers }),
        fetch('/api/foods', { headers })
      ]);
      const [rData, fData] = await Promise.all([rRes.json(), fRes.json()]);
      setRecipes(rData.recipes || []);
      setFoods(fData.foods || []);
    } catch {}
    setLoading(false);
  }, [token, category, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditRecipe(null);
    setForm({ name: '', category: 'Café da Manhã', preparation_time: '15', servings: '2', instructions: '', notes: '', image_url: '', ingredients: [] });
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditRecipe(r);
    setForm({
      name: r.name || '',
      category: r.category || 'Geral',
      preparation_time: String(r.preparation_time || 15),
      servings: String(r.servings || 2),
      instructions: r.instructions || '',
      notes: r.notes || '',
      image_url: r.image_url || '',
      ingredients: (r.ingredients || []).map(i => ({ ...i }))
    });
    setShowForm(true);
  };

  const addIngredient = (food) => {
    setForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        food_id: food.id,
        food_name: food.name,
        quantity: food.reference_amount,
        unit: food.reference_unit,
        protein_amount: food.protein_amount,
        reference_amount: food.reference_amount
      }]
    }));
    setIngSearch('');
    setShowIngSearch(false);
  };

  const updateIngredient = (idx, field, value) => {
    setForm(prev => {
      const ings = [...prev.ingredients];
      ings[idx] = { ...ings[idx], [field]: value };
      // Recalculate protein for this ingredient based on quantity
      if (field === 'quantity') {
        const qty = parseFloat(value) || 0;
        const ref = ings[idx].reference_amount || 100;
        const baseProt = ings[idx].protein_amount / (ings[idx].quantity / ref || 1);
        // Just store proportional protein
        ings[idx].protein_amount = Number(((qty / ref) * (ings[idx].protein_amount / (parseFloat(ings[idx].quantity) / ref || 1))).toFixed(1));
      }
      return { ...prev, ingredients: ings };
    });
  };

  const removeIngredient = (idx) => {
    setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));
  };

  const totalProtein = form.ingredients.reduce((sum, ing) => sum + (parseFloat(ing.protein_amount) || 0), 0);
  const protPerServing = form.servings > 0 ? (totalProtein / parseFloat(form.servings)).toFixed(1) : 0;

  const handleSave = async () => {
    if (!form.name.trim()) return showToast('Informe o nome da receita.', 'error');
    setSaving(true);
    try {
      const method = editRecipe ? 'PUT' : 'POST';
      const url = editRecipe ? `/api/recipes/${editRecipe.id}` : '/api/recipes';
      const payload = { ...form, ingredients: form.ingredients };
      const res = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast(editRecipe ? 'Receita atualizada com sucesso.' : 'Receita criada com sucesso.');
      setShowForm(false);
      load();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar receita.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRecipe) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/recipes/${deleteRecipe.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      showToast('Receita excluída com sucesso.');
      setDeleteRecipe(null);
      setShowDetail(null);
      load();
    } catch {
      showToast('Erro ao excluir receita.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredFoodsForIng = foods.filter(f =>
    f.name.toLowerCase().includes(ingSearch.toLowerCase()) &&
    !form.ingredients.find(i => i.food_id === f.id)
  );

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Receitas</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Suas receitas preferidas com cálculo automático de proteína</p>
        </div>
        <button onClick={openAdd} className="vt-btn vt-btn-primary">
          <Plus size={18} /> Nova receita
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input type="text" className="vt-input" placeholder="Buscar receita..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`vt-btn vt-btn-sm ${category === cat ? 'vt-btn-primary' : 'vt-btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Carregando receitas...</div>
      ) : recipes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="vt-card"
              style={{ cursor: 'pointer', padding: 0, overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onClick={() => setShowDetail(recipe)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            >

              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{recipe.category}</p>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.3 }}>{recipe.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {recipe.preparation_time} min
                  </span>
                  <span className="vt-badge vt-badge-success" style={{ fontSize: '0.75rem' }}>
                    {recipe.protein_per_serving}g prot/porção
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  {recipe.servings} porções • {recipe.total_protein}g prot total
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ChefHat}
          title="Nenhuma receita encontrada"
          description="Crie suas receitas favoritas e calcule automaticamente a proteína por porção."
          actionLabel="Criar receita"
          onAction={openAdd}
        />
      )}

      {/* Recipe Detail Modal */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title={showDetail?.name || ''} maxWidth="620px">
        {showDetail && (
          <div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="vt-badge vt-badge-neutral">{showDetail.category}</span>
              <span className="vt-badge vt-badge-neutral"><Clock size={13} /> {showDetail.preparation_time} min</span>
              <span className="vt-badge vt-badge-neutral">{showDetail.servings} porções</span>
              <span className="vt-badge vt-badge-success">{showDetail.protein_per_serving}g prot/porção</span>
            </div>
            {showDetail.instructions && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Modo de preparo</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>{showDetail.instructions}</p>
              </div>
            )}
            {showDetail.notes && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>💡 {showDetail.notes}</p>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-gray-border)', paddingTop: '16px' }}>
              <button onClick={() => { setShowDetail(null); openEdit(showDetail); }} className="vt-btn vt-btn-secondary vt-btn-sm">Editar</button>
              <button onClick={() => setDeleteRecipe(showDetail)} className="vt-btn vt-btn-danger vt-btn-sm">Excluir</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editRecipe ? 'Editar receita' : 'Nova receita'} maxWidth="680px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          <div className="vt-form-group" style={{ marginBottom: 0 }}>
            <label className="vt-label">Nome da receita</label>
            <input type="text" className="vt-input" placeholder="Ex.: Frango cremoso com ricota" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="vt-form-group" style={{ marginBottom: 0 }}>
              <label className="vt-label">Categoria</label>
              <select className="vt-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter(c => c !== 'Todas').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="vt-form-group" style={{ marginBottom: 0 }}>
              <label className="vt-label">Tempo (min)</label>
              <input type="number" min="5" className="vt-input" value={form.preparation_time} onChange={e => setForm({ ...form, preparation_time: e.target.value })} />
            </div>
            <div className="vt-form-group" style={{ marginBottom: 0 }}>
              <label className="vt-label">Porções</label>
              <input type="number" min="1" className="vt-input" value={form.servings} onChange={e => setForm({ ...form, servings: e.target.value })} />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="vt-label" style={{ marginBottom: 0 }}>Ingredientes</label>
              <button type="button" onClick={() => setShowIngSearch(!showIngSearch)} className="vt-btn vt-btn-secondary vt-btn-sm">
                <Plus size={14} /> Adicionar
              </button>
            </div>

            {showIngSearch && (
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                <input autoFocus type="text" className="vt-input" placeholder="Buscar alimento..." value={ingSearch} onChange={e => setIngSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
                {ingSearch && (
                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-md)', marginTop: '4px', backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-md)', position: 'relative', zIndex: 5 }}>
                    {filteredFoodsForIng.slice(0, 15).map(f => (
                      <button key={f.id} type="button" onClick={() => addIngredient(f)}
                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--color-gray-border)', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-soft)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span>{f.name}</span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{f.protein_amount}g/{f.reference_amount}g</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {form.ingredients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {form.ingredients.map((ing, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-soft)' }}>
                    <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{ing.food_name}</span>
                    <input
                      type="number"
                      step="5"
                      min="1"
                      value={ing.quantity}
                      onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                      className="vt-input"
                      style={{ width: '80px', padding: '6px 8px' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', minWidth: '22px' }}>{ing.unit}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', minWidth: '50px' }}>{ing.protein_amount}g prot</span>
                    <button type="button" onClick={() => removeIngredient(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', fontWeight: 600, padding: '8px 12px', backgroundColor: 'var(--color-primary-tint)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                  <span>Total: {totalProtein.toFixed(1)}g proteína</span>
                  <span>Por porção: {protPerServing}g</span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px', border: '1px dashed var(--color-gray-border)', borderRadius: 'var(--radius-md)' }}>
                Adicione ingredientes para calcular a proteína automaticamente
              </p>
            )}
          </div>

          <div className="vt-form-group" style={{ marginBottom: 0 }}>
            <label className="vt-label">Modo de preparo</label>
            <textarea className="vt-textarea" rows={4} placeholder="Descreva o passo a passo..." value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
          </div>
          <div className="vt-form-group" style={{ marginBottom: 0 }}>
            <label className="vt-label">Observações (opcional)</label>
            <input type="text" className="vt-input" placeholder="Dicas extras..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={() => setShowForm(false)} className="vt-btn vt-btn-secondary" disabled={saving}>Cancelar</button>
          <button onClick={handleSave} className="vt-btn vt-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : editRecipe ? 'Atualizar receita' : 'Criar receita'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteRecipe}
        onClose={() => setDeleteRecipe(null)}
        onConfirm={handleDelete}
        message={`Deseja excluir a receita "${deleteRecipe?.name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
}
