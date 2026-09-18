import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

// Get water summary for a specific date
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const date = req.query.date || new Date().toISOString().split('T')[0];

  try {
    const entriesRes = await db.execute({
      sql: 'SELECT id, amount_ml, created_at FROM water_entries WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
      args: [userId, date]
    });
    
    const settingsRes = await db.execute({
      sql: 'SELECT water_goal FROM user_settings WHERE user_id = ?',
      args: [userId]
    });
    
    const total_ml = entriesRes.rows.reduce((sum, e) => sum + e.amount_ml, 0);
    const goal = settingsRes.rows[0]?.water_goal || 2500;

    return res.json({ date, total_ml, goal, entries: entriesRes.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar dados de hidratação.' });
  }
});

// Add water entry
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, amount_ml } = req.body;

  if (!date || !amount_ml || amount_ml <= 0) {
    return res.status(400).json({ error: 'Data e quantidade em ml são obrigatórios.' });
  }

  const id = `water-${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: 'INSERT INTO water_entries (id, user_id, date, amount_ml) VALUES (?, ?, ?, ?)',
      args: [id, userId, date, amount_ml]
    });

    const currentTotalRes = await db.execute({
      sql: 'SELECT SUM(amount_ml) as total FROM water_entries WHERE user_id = ? AND date = ?',
      args: [userId, date]
    });

    return res.status(201).json({ message: 'Registrado com sucesso!', total_ml: currentTotalRes.rows[0].total || 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao registrar água.' });
  }
});

// Delete water entry (undo)
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    await db.execute({ sql: 'DELETE FROM water_entries WHERE id = ? AND user_id = ?', args: [id, userId] });
    return res.json({ message: 'Registro removido com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover registro.' });
  }
});

export default router;
