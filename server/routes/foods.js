import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

// GET all foods (system default + user's custom foods)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const foodsRes = await db.execute({
    sql: `
      SELECT id, user_id, name, category, reference_amount, reference_unit, protein_amount,
             CASE WHEN user_id IS NULL THEN 0 ELSE 1 END as is_custom
      FROM foods
      WHERE user_id IS NULL OR user_id = ?
      ORDER BY is_custom DESC, name ASC
    `,
    args: [userId]
  });

  return res.json({ foods: foodsRes.rows });
});

// POST create custom food
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, category, reference_amount, reference_unit, protein_amount } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'O nome do alimento é obrigatório.' });
  }

  const refAmt = parseFloat(reference_amount) || 100;
  const protAmt = parseFloat(protein_amount);

  if (isNaN(protAmt) || protAmt < 0) {
    return res.status(400).json({ error: 'Informe uma quantidade válida de proteína (>= 0).' });
  }

  const id = `food-${crypto.randomUUID()}`;

  try {
    await db.execute({
      sql: `
        INSERT INTO foods (id, user_id, name, category, reference_amount, reference_unit, protein_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        userId,
        name.trim(),
        category ? category.trim() : 'Personalizados',
        refAmt,
        reference_unit ? reference_unit.trim() : 'g',
        Number(protAmt.toFixed(1))
      ]
    });

    const createdRes = await db.execute({
      sql: 'SELECT * FROM foods WHERE id = ?',
      args: [id]
    });
    
    return res.status(201).json({
      message: 'Alimento personalizado cadastrado com sucesso.',
      food: { ...createdRes.rows[0], is_custom: 1 }
    });
  } catch (err) {
    console.error('Erro ao cadastrar alimento:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar alimento.' });
  }
});

export default router;
