import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { initial_weight, protein_goal, tracking_start_date, personal_goal } = req.body;

  const parsedWeight = initial_weight ? parseFloat(initial_weight) : null;
  const parsedProteinGoal = protein_goal ? parseFloat(protein_goal) : 150;
  const startDate = tracking_start_date || new Date().toISOString().split('T')[0];

  try {
    await db.execute({
      sql: `
        UPDATE user_settings
        SET initial_weight = ?,
            protein_goal = ?,
            tracking_start_date = ?,
            personal_goal = ?,
            onboarding_completed = 1
        WHERE user_id = ?
      `,
      args: [parsedWeight, parsedProteinGoal, startDate, personal_goal || null, userId]
    });

    if (parsedWeight && parsedWeight > 0) {
      const existingWeightRes = await db.execute({ sql: 'SELECT id FROM weight_entries WHERE user_id = ?', args: [userId] });
      const existingWeight = existingWeightRes.rows[0];
      
      if (!existingWeight) {
        await db.execute({
          sql: `
            INSERT INTO weight_entries (id, user_id, date, weight, time, notes)
            VALUES (?, ?, ?, ?, '08:00', 'Pesagem inicial do acompanhamento')
          `,
          args: [`weight-${crypto.randomUUID()}`, userId, startDate, parsedWeight]
        });
      }
    }

    const updatedSettingsRes = await db.execute({ sql: 'SELECT * FROM user_settings WHERE user_id = ?', args: [userId] });
    const updatedSettings = updatedSettingsRes.rows[0];

    return res.json({
      message: 'Onboarding concluído com sucesso!',
      settings: updatedSettings
    });
  } catch (err) {
    console.error('Erro no onboarding:', err);
    return res.status(500).json({ error: 'Erro ao salvar informações de onboarding.' });
  }
});

export default router;
