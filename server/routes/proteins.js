import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

const MEAL_ORDER = ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia', 'Outro'];

// GET entries for a specific date + daily summary
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date || new Date().toISOString().split('T')[0];

  const settingsRes = await db.execute({ sql: 'SELECT protein_goal FROM user_settings WHERE user_id = ?', args: [userId] });
  const settings = settingsRes.rows[0];
  const proteinGoal = settings?.protein_goal || 150;

  const entriesRes = await db.execute({
    sql: 'SELECT * FROM protein_entries WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
    args: [userId, date]
  });
  const entries = entriesRes.rows;

  const mealsMap = {};
  MEAL_ORDER.forEach(m => { mealsMap[m] = { meal: m, items: [], totalProtein: 0 }; });

  let totalConsumed = 0;
  entries.forEach(entry => {
    const meal = entry.meal_type || 'Outro';
    if (!mealsMap[meal]) mealsMap[meal] = { meal, items: [], totalProtein: 0 };
    mealsMap[meal].items.push(entry);
    mealsMap[meal].totalProtein = Number((mealsMap[meal].totalProtein + entry.calculated_protein).toFixed(1));
    totalConsumed += entry.calculated_protein;
  });

  totalConsumed = Number(totalConsumed.toFixed(1));
  const remaining = Number(Math.max(0, proteinGoal - totalConsumed).toFixed(1));
  const percent = proteinGoal > 0 ? Number(((totalConsumed / proteinGoal) * 100).toFixed(1)) : 0;

  return res.json({ date, protein_goal: proteinGoal, total_consumed: totalConsumed, remaining, percent, meals: Object.values(mealsMap), entries });
});

// GET dashboard statistics
router.get('/dashboard', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const today = req.query.date || new Date().toISOString().split('T')[0];

  const settingsRes = await db.execute({ sql: 'SELECT protein_goal FROM user_settings WHERE user_id = ?', args: [userId] });
  const settings = settingsRes.rows[0];
  const proteinGoal = settings?.protein_goal || 150;

  const dailyTotalsRes = await db.execute({
    sql: `SELECT date, ROUND(SUM(calculated_protein), 1) as total
          FROM protein_entries WHERE user_id = ? AND date >= date(?, '-30 day')
          GROUP BY date ORDER BY date ASC`,
    args: [userId, today]
  });
  const dailyTotals = dailyTotalsRes.rows;

  const totalsMap = {};
  dailyTotals.forEach(d => { totalsMap[d.date] = d.total; });

  const todayConsumed = totalsMap[today] || 0;
  const todayRemaining = Number(Math.max(0, proteinGoal - todayConsumed).toFixed(1));
  const todayPercent = proteinGoal > 0 ? Number(((todayConsumed / proteinGoal) * 100).toFixed(1)) : 0;

  const last7Days = [];
  let sum7 = 0, count7 = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const val = totalsMap[dStr] || 0;
    last7Days.push({ date: dStr, dayOfWeek: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), total: val, reachedGoal: val >= proteinGoal });
    if (val > 0) { sum7 += val; count7++; }
  }

  const last30Days = [];
  let sum30 = 0, count30 = 0, daysMetGoal = 0;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const val = totalsMap[dStr] || 0;
    const reached = val >= proteinGoal;
    last30Days.push({ date: dStr, day: d.getDate(), total: val, reachedGoal: reached });
    if (val > 0) { sum30 += val; count30++; if (reached) daysMetGoal++; }
  }

  return res.json({
    protein_goal: proteinGoal,
    today_consumed: todayConsumed, today_remaining: todayRemaining, today_percent: todayPercent,
    avg_7_days: count7 > 0 ? Number((sum7 / count7).toFixed(1)) : 0,
    avg_30_days: count30 > 0 ? Number((sum30 / count30).toFixed(1)) : 0,
    met_goal_count: daysMetGoal, active_days_count: count30,
    met_in_14_days: last30Days.slice(-14).filter(d => d.reachedGoal).length,
    last_7_days: last7Days, last_30_days: last30Days
  });
});

// POST add protein entry
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, meal_type, food_id, food_name, quantity, reference_amount, protein_amount } = req.body;

  if (!date) return res.status(400).json({ error: 'Data é obrigatória.' });
  if (!meal_type) return res.status(400).json({ error: 'Selecione a refeição.' });
  if (!food_name || !food_name.trim()) return res.status(400).json({ error: 'O nome do alimento é obrigatório.' });

  const qty = parseFloat(quantity);
  if (!qty || qty <= 0 || isNaN(qty)) return res.status(400).json({ error: 'Informe uma quantidade válida maior que zero.' });

  const refAmt = parseFloat(reference_amount) || 100;
  const protAmt = parseFloat(protein_amount) || 0;
  const calculatedProtein = Number(((qty / refAmt) * protAmt).toFixed(1));
  const id = `prot-${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: 'INSERT INTO protein_entries (id, user_id, date, meal_type, food_id, food_name, quantity, reference_amount, protein_amount, calculated_protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, userId, date, meal_type, food_id || null, food_name.trim(), Number(qty.toFixed(1)), refAmt, protAmt, calculatedProtein]
    });

    const createdRes = await db.execute({ sql: 'SELECT * FROM protein_entries WHERE id = ?', args: [id] });
    return res.status(201).json({ message: 'Alimento adicionado ao seu dia com sucesso.', entry: createdRes.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao salvar registro de proteína.' });
  }
});

// DELETE protein entry
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existingRes = await db.execute({ sql: 'SELECT id FROM protein_entries WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Registro de proteína não encontrado.' });

  try {
    await db.execute({ sql: 'DELETE FROM protein_entries WHERE id = ? AND user_id = ?', args: [id, userId] });
    return res.json({ message: 'Alimento removido com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir alimento.' });
  }
});

export default router;
