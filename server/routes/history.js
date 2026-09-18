import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { filter } = req.query; // 'all', 'weights', 'measurements', 'proteins', 'recipes'

  const historyItems = [];

  // 1. Weights
  if (!filter || filter === 'all' || filter === 'weights') {
    const weightsRes = await db.execute({
      sql: `
        SELECT id, date, weight, time, notes, created_at
        FROM weight_entries
        WHERE user_id = ?
      `,
      args: [userId]
    });
    const weights = weightsRes.rows;

    weights.forEach(w => {
      historyItems.push({
        id: `hist-w-${w.id}`,
        type: 'weight',
        category: 'Pesagens',
        title: 'Pesagem registrada',
        date: w.date,
        time: w.time || null,
        mainValue: `${w.weight.toFixed(1)} kg`,
        details: w.notes ? [w.notes] : ['Registro de peso diário'],
        created_at: w.created_at || w.date
      });
    });
  }

  // 2. Measurements
  if (!filter || filter === 'all' || filter === 'measurements') {
    const measurementsRes = await db.execute({
      sql: 'SELECT * FROM body_measurements WHERE user_id = ?',
      args: [userId]
    });
    const measurements = measurementsRes.rows;

    measurements.forEach(m => {
      const parts = [];
      if (m.abdomen) parts.push(`Abdômen: ${m.abdomen} cm`);
      if (m.waist) parts.push(`Cintura: ${m.waist} cm`);
      if (m.arm) parts.push(`Braço: ${m.arm} cm`);
      if (m.thigh) parts.push(`Coxa: ${m.thigh} cm`);
      if (m.hip) parts.push(`Quadril: ${m.hip} cm`);

      historyItems.push({
        id: `hist-m-${m.id}`,
        type: 'measurement',
        category: 'Medidas',
        title: 'Medidas registradas',
        date: m.date,
        time: null,
        mainValue: `${parts.length} medidas`,
        details: parts,
        created_at: m.created_at || m.date
      });
    });
  }

  // 3. Protein entries aggregated by date
  if (!filter || filter === 'all' || filter === 'proteins') {
    const settingsRes = await db.execute({ sql: 'SELECT protein_goal FROM user_settings WHERE user_id = ?', args: [userId] });
    const settings = settingsRes.rows[0];
    const goal = settings?.protein_goal || 150;

    const dailyProteinsRes = await db.execute({
      sql: `
        SELECT date, ROUND(SUM(calculated_protein), 1) as total, COUNT(*) as items_count
        FROM protein_entries
        WHERE user_id = ?
        GROUP BY date
      `,
      args: [userId]
    });
    const dailyProteins = dailyProteinsRes.rows;

    dailyProteins.forEach(p => {
      const percent = goal > 0 ? ((p.total / goal) * 100).toFixed(1) : 0;
      historyItems.push({
        id: `hist-p-${p.date}`,
        type: 'protein',
        category: 'Alimentação',
        title: 'Proteína diária',
        date: p.date,
        time: null,
        mainValue: `${p.total} g / ${goal} g`,
        details: [`${percent}% da meta alcançada (${p.items_count} alimentos)`],
        created_at: p.date
      });
    });
  }

  // 4. Recipes
  if (!filter || filter === 'all' || filter === 'recipes') {
    const recipesRes = await db.execute({
      sql: `
        SELECT r.id, r.name, r.category, r.created_at,
               COALESCE(SUM(ri.protein_amount), 0) / r.servings as prot_per_serving
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        WHERE r.user_id = ?
        GROUP BY r.id
      `,
      args: [userId]
    });
    const recipes = recipesRes.rows;

    recipes.forEach(r => {
      const dateStr = (r.created_at || '').split(' ')[0] || new Date().toISOString().split('T')[0];
      historyItems.push({
        id: `hist-r-${r.id}`,
        type: 'recipe',
        category: 'Receitas',
        title: 'Receita criada',
        date: dateStr,
        time: null,
        mainValue: r.name,
        details: [`${r.category} • ${Number(r.prot_per_serving.toFixed(1))}g proteína/porção`],
        created_at: r.created_at || dateStr
      });
    });
  }

  // Sort unified history: date DESC, created_at DESC
  historyItems.sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    return (b.created_at || '').localeCompare(a.created_at || '');
  });

  return res.json({ history: historyItems });
});

export default router;
