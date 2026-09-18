import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

// GET all weight entries and summary
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { period } = req.query; // 7d, 30d, 3m, 6m, 1y, all

  const settingsRes = await db.execute({ sql: 'SELECT initial_weight, tracking_start_date FROM user_settings WHERE user_id = ?', args: [userId] });
  const settings = settingsRes.rows[0];

  const allEntriesRes = await db.execute({
    sql: 'SELECT * FROM weight_entries WHERE user_id = ? ORDER BY date ASC, time ASC, created_at ASC',
    args: [userId]
  });
  const allEntries = allEntriesRes.rows;

  if (allEntries.length === 0) {
    return res.json({
      entries: [],
      summary: {
        current_weight: null,
        initial_weight: settings?.initial_weight || null,
        total_variation: 0,
        percentage_variation: 0,
        total_entries: 0,
        first_date: null,
        last_date: null
      }
    });
  }

  const initialWeight = settings?.initial_weight || allEntries[0].weight;
  const currentWeight = allEntries[allEntries.length - 1].weight;
  const totalDiff = currentWeight - initialWeight;
  const totalPercent = initialWeight > 0 ? (totalDiff / initialWeight) * 100 : 0;

  const enrichedEntries = allEntries.map((entry, idx) => {
    const prevWeight = idx > 0 ? allEntries[idx - 1].weight : entry.weight;
    const diffFromPrev = idx > 0 ? Number((entry.weight - prevWeight).toFixed(2)) : 0;
    const diffFromInitial = Number((entry.weight - initialWeight).toFixed(2));
    const percentFromInitial = initialWeight > 0 ? Number(((diffFromInitial / initialWeight) * 100).toFixed(1)) : 0;

    return {
      ...entry,
      diff_from_prev: diffFromPrev,
      diff_from_initial: diffFromInitial,
      percent_from_initial: percentFromInitial
    };
  });

  let filteredForChart = enrichedEntries;
  if (period && period !== 'all') {
    const now = new Date();
    let daysToSubtract = 3650;
    if (period === '7d') daysToSubtract = 7;
    else if (period === '30d') daysToSubtract = 30;
    else if (period === '3m') daysToSubtract = 90;
    else if (period === '6m') daysToSubtract = 180;
    else if (period === '1y') daysToSubtract = 365;

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToSubtract);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    filteredForChart = enrichedEntries.filter(e => e.date >= cutoffStr);
  }

  const historyList = [...enrichedEntries].reverse();

  return res.json({
    entries: historyList,
    chartData: filteredForChart,
    summary: {
      current_weight: Number(currentWeight.toFixed(1)),
      initial_weight: Number(initialWeight.toFixed(1)),
      total_variation: Number(totalDiff.toFixed(1)),
      percentage_variation: Number(totalPercent.toFixed(1)),
      total_entries: allEntries.length,
      first_date: allEntries[0].date,
      last_date: allEntries[allEntries.length - 1].date
    }
  });
});

// POST new weight entry
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, weight, time, notes } = req.body;

  if (!date) return res.status(400).json({ error: 'A data da pesagem é obrigatória.' });

  const numWeight = parseFloat(weight);
  if (!numWeight || numWeight <= 0 || isNaN(numWeight)) {
    return res.status(400).json({ error: 'O peso deve ser um valor numérico positivo.' });
  }

  const id = `weight-${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: 'INSERT INTO weight_entries (id, user_id, date, weight, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, userId, date, Number(numWeight.toFixed(2)), time || null, notes ? notes.trim() : null]
    });

    const settingsRes = await db.execute({ sql: 'SELECT initial_weight FROM user_settings WHERE user_id = ?', args: [userId] });
    const settings = settingsRes.rows[0];
    
    if (!settings || settings.initial_weight === null) {
      await db.execute({
        sql: 'UPDATE user_settings SET initial_weight = ?, tracking_start_date = ? WHERE user_id = ?',
        args: [numWeight, date, userId]
      });
    }

    const createdRes = await db.execute({ sql: 'SELECT * FROM weight_entries WHERE id = ?', args: [id] });
    return res.status(201).json({
      message: 'Pesagem registrada com sucesso.',
      entry: createdRes.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao salvar pesagem.' });
  }
});

// PUT update weight entry
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date, weight, time, notes } = req.body;

  const existingRes = await db.execute({ sql: 'SELECT id FROM weight_entries WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Registro não encontrado.' });

  const numWeight = parseFloat(weight);
  if (!numWeight || numWeight <= 0) return res.status(400).json({ error: 'Informe um peso válido maior que zero.' });

  try {
    await db.execute({
      sql: 'UPDATE weight_entries SET date = ?, weight = ?, time = ?, notes = ? WHERE id = ? AND user_id = ?',
      args: [date, Number(numWeight.toFixed(2)), time || null, notes ? notes.trim() : null, id, userId]
    });

    const updatedRes = await db.execute({ sql: 'SELECT * FROM weight_entries WHERE id = ?', args: [id] });
    return res.json({ message: 'Pesagem atualizada com sucesso.', entry: updatedRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar pesagem.' });
  }
});

// DELETE weight entry
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existingRes = await db.execute({ sql: 'SELECT id FROM weight_entries WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Registro não encontrado.' });

  try {
    await db.execute({ sql: 'DELETE FROM weight_entries WHERE id = ? AND user_id = ?', args: [id, userId] });
    return res.json({ message: 'Pesagem excluída com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir pesagem.' });
  }
});

export default router;
