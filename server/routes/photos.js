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

  const formattedPhotos = photosRes.rows.map(row => {
    let parsedImages = [];
    if (row.images_json) {
      try { parsedImages = JSON.parse(row.images_json); } catch(e) {}
    } else {
      if (row.frontal_url) parsedImages.push({ id: crypto.randomUUID(), label: 'Frente', url: row.frontal_url });
      if (row.lateral_url) parsedImages.push({ id: crypto.randomUUID(), label: 'Lado', url: row.lateral_url });
      if (row.back_url) parsedImages.push({ id: crypto.randomUUID(), label: 'Costas', url: row.back_url });
    }
    return { ...row, images: parsedImages };
  });

  return res.json({ photos: formattedPhotos });
});

router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, frontal_url, lateral_url, back_url, notes, images } = req.body;

  if (!date) return res.status(400).json({ error: 'A data do registro fotográfico é obrigatória.' });

  let finalImages = images;
  if (!finalImages) {
    finalImages = [];
    if (frontal_url) finalImages.push({ id: crypto.randomUUID(), label: 'Frente', url: frontal_url });
    if (lateral_url) finalImages.push({ id: crypto.randomUUID(), label: 'Lado', url: lateral_url });
    if (back_url) finalImages.push({ id: crypto.randomUUID(), label: 'Costas', url: back_url });
  }

  if (!finalImages || finalImages.length === 0) {
    return res.status(400).json({ error: 'Forneça pelo menos uma foto para salvar o registro.' });
  }

  const id = `photo-${crypto.randomUUID()}`;
  const imagesJsonStr = JSON.stringify(finalImages);

  try {
    await db.execute({
      sql: 'INSERT INTO progress_photos (id, user_id, date, frontal_url, lateral_url, back_url, notes, images_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, userId, date, frontal_url || null, lateral_url || null, back_url || null, notes ? notes.trim() : null, imagesJsonStr]
    });

    const createdRes = await db.execute({ sql: 'SELECT * FROM progress_photos WHERE id = ?', args: [id] });
    
    // Add images parsed back for the response
    const createdPhoto = createdRes.rows[0];
    let parsedImages = [];
    try { parsedImages = JSON.parse(createdPhoto.images_json); } catch(e) {}
    createdPhoto.images = parsedImages;

    return res.status(201).json({ message: 'Fotos de progresso salvas com sucesso.', photo: createdPhoto });
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
