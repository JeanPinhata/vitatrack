import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

// GET all measurements and stats
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const entriesRes = await db.execute({
    sql: 'SELECT * FROM body_measurements WHERE user_id = ? ORDER BY date ASC, created_at ASC',
    args: [userId]
  });
  const entries = entriesRes.rows;

  if (entries.length === 0) {
    return res.json({ entries: [], stats: null, latest: null });
  }

  const parts = ['abdomen', 'waist', 'arm', 'thigh', 'hip'];
  const stats = {};

  parts.forEach(part => {
    const validValues = entries
      .filter(e => e[part] !== null && e[part] !== undefined && e[part] > 0)
      .map(e => ({ date: e.date, val: e[part] }));

    if (validValues.length > 0) {
      const initial = validValues[0].val;
      const current = validValues[validValues.length - 1].val;
      const diff = Number((current - initial).toFixed(1));
      const percent = initial > 0 ? Number(((diff / initial) * 100).toFixed(1)) : 0;
      const values = validValues.map(v => v.val);
      stats[part] = { initial, current, diff, percent, min: Math.min(...values), max: Math.max(...values), history: validValues };
    } else {
      stats[part] = null;
    }
  });

  const latest = entries[entries.length - 1];
  return res.json({
    entries: [...entries].reverse(),
    chronologicalEntries: entries,
    stats,
    latest: { ...latest, total_recorded_parts: parts.filter(p => latest[p] !== null && latest[p] > 0).length }
  });
});

// GET compare measurements between two dates
router.get('/compare', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { start, end } = req.query;

  const allMeasurementsRes = await db.execute({
    sql: 'SELECT * FROM body_measurements WHERE user_id = ? ORDER BY date ASC',
    args: [userId]
  });
  const allMeasurements = allMeasurementsRes.rows;

  const allWeightsRes = await db.execute({
    sql: 'SELECT * FROM weight_entries WHERE user_id = ? ORDER BY date ASC',
    args: [userId]
  });
  const allWeights = allWeightsRes.rows;

  if (allMeasurements.length === 0) {
    return res.json({ comparison: [], dates: { start: null, end: null } });
  }

  let startDate = start || allMeasurements[0].date;
  let endDate = end || allMeasurements[allMeasurements.length - 1].date;

  const startMeas = allMeasurements.find(m => m.date >= startDate) || allMeasurements[0];
  const endMeas = [...allMeasurements].reverse().find(m => m.date <= endDate) || allMeasurements[allMeasurements.length - 1];
  const startWeight = allWeights.find(w => w.date >= startDate) || (allWeights.length > 0 ? allWeights[0] : null);
  const endWeight = [...allWeights].reverse().find(w => w.date <= endDate) || (allWeights.length > 0 ? allWeights[allWeights.length - 1] : null);

  const partsConfig = [
    { key: 'weight', label: 'Peso', unit: 'kg', startVal: startWeight?.weight, endVal: endWeight?.weight },
    { key: 'abdomen', label: 'Abdômen', unit: 'cm', startVal: startMeas?.abdomen, endVal: endMeas?.abdomen },
    { key: 'waist', label: 'Cintura', unit: 'cm', startVal: startMeas?.waist, endVal: endMeas?.waist },
    { key: 'arm', label: 'Braço', unit: 'cm', startVal: startMeas?.arm, endVal: endMeas?.arm },
    { key: 'thigh', label: 'Coxa', unit: 'cm', startVal: startMeas?.thigh, endVal: endMeas?.thigh },
    { key: 'hip', label: 'Quadril', unit: 'cm', startVal: startMeas?.hip, endVal: endMeas?.hip }
  ];

  const comparison = partsConfig.map(p => {
    const s = p.startVal != null ? Number(p.startVal) : null;
    const e = p.endVal != null ? Number(p.endVal) : null;
    const diff = (s !== null && e !== null) ? Number((e - s).toFixed(1)) : null;
    const percent = (s && diff !== null) ? Number(((diff / s) * 100).toFixed(1)) : null;
    return { key: p.key, label: p.label, unit: p.unit, initial: s, current: e, difference: diff, percent };
  });

  return res.json({
    dates: { requested_start: startDate, requested_end: endDate, actual_start: startMeas.date, actual_end: endMeas.date },
    comparison
  });
});

// POST new measurement
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, abdomen, waist, arm, thigh, hip, notes } = req.body;

  if (!date) return res.status(400).json({ error: 'A data da medição é obrigatória.' });

  const parseOrNull = val => (val && !isNaN(val) && parseFloat(val) > 0) ? Number(parseFloat(val).toFixed(1)) : null;
  const id = `meas-${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: 'INSERT INTO body_measurements (id, user_id, date, abdomen, waist, arm, thigh, hip, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, userId, date, parseOrNull(abdomen), parseOrNull(waist), parseOrNull(arm), parseOrNull(thigh), parseOrNull(hip), notes ? notes.trim() : null]
    });

    const createdRes = await db.execute({ sql: 'SELECT * FROM body_measurements WHERE id = ?', args: [id] });
    return res.status(201).json({ message: 'Medidas registradas com sucesso.', entry: createdRes.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao registrar medição.' });
  }
});

// PUT update measurement
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date, abdomen, waist, arm, thigh, hip, notes } = req.body;

  const existingRes = await db.execute({ sql: 'SELECT id FROM body_measurements WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Registro de medidas não encontrado.' });

  const parseOrNull = val => (val && !isNaN(val) && parseFloat(val) > 0) ? Number(parseFloat(val).toFixed(1)) : null;

  try {
    await db.execute({
      sql: 'UPDATE body_measurements SET date = ?, abdomen = ?, waist = ?, arm = ?, thigh = ?, hip = ?, notes = ? WHERE id = ? AND user_id = ?',
      args: [date, parseOrNull(abdomen), parseOrNull(waist), parseOrNull(arm), parseOrNull(thigh), parseOrNull(hip), notes ? notes.trim() : null, id, userId]
    });

    const updatedRes = await db.execute({ sql: 'SELECT * FROM body_measurements WHERE id = ?', args: [id] });
    return res.json({ message: 'Medidas atualizadas com sucesso.', entry: updatedRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar medição.' });
  }
});

// DELETE measurement
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existingRes = await db.execute({ sql: 'SELECT id FROM body_measurements WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Registro de medidas não encontrado.' });

  try {
    await db.execute({ sql: 'DELETE FROM body_measurements WHERE id = ? AND user_id = ?', args: [id, userId] });
    return res.json({ message: 'Medidas excluídas com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir medição.' });
  }
});

export default router;
