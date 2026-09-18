import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const photosRes = await db.execute({
    sql: 'SELECT * FROM progress_photos WHERE user_id = ? ORDER BY date ASC, created_at ASC',
    args: [userId]
  });

  return res.json({ photos: photosRes.rows });
});

router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, frontal_url, lateral_url, back_url, notes } = req.body;

  if (!date) return res.status(400).json({ error: 'A data do registro fotográfico é obrigatória.' });
  if (!frontal_url && !lateral_url && !back_url) return res.status(400).json({ error: 'Forneça pelo menos uma foto para salvar o registro.' });

  const id = `photo-${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: 'INSERT INTO progress_photos (id, user_id, date, frontal_url, lateral_url, back_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [id, userId, date, frontal_url || null, lateral_url || null, back_url || null, notes ? notes.trim() : null]
    });

    const createdRes = await db.execute({ sql: 'SELECT * FROM progress_photos WHERE id = ?', args: [id] });
    return res.status(201).json({ message: 'Fotos de progresso salvas com sucesso.', photo: createdRes.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao salvar fotos de progresso.' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    await db.execute({ sql: 'DELETE FROM progress_photos WHERE id = ? AND user_id = ?', args: [id, userId] });
    return res.json({ message: 'Registro de fotos excluído com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir fotos.' });
  }
});

export default router;
