import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

export function getGreeting(name) {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Bom dia, ${name} ☀️`;
  if (hour >= 12 && hour < 18) return `Boa tarde, ${name} 🌿`;
  return `Boa noite, ${name} 🌙`;
}

router.get('/daily', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const greeting = getGreeting(req.user.name);

  const allPhrasesRes = await db.execute({
    sql: 'SELECT id, text FROM motivational_phrases WHERE active = 1',
    args: []
  });
  const allPhrases = allPhrasesRes.rows;

  if (allPhrases.length === 0) {
    return res.json({ greeting, phrase: 'Pequenos passos, grandes mudanças.', subtitle: 'Seu progresso acontece um dia de cada vez.' });
  }

  const lastHistoryRes = await db.execute({
    sql: 'SELECT phrase_id FROM user_motivation_history WHERE user_id = ? ORDER BY displayed_at DESC LIMIT 1',
    args: [userId]
  });
  const lastHistory = lastHistoryRes.rows[0];

  const availablePhrases = lastHistory ? allPhrases.filter(p => p.id !== lastHistory.phrase_id) : allPhrases;
  const phrasePool = availablePhrases.length > 0 ? availablePhrases : allPhrases;
  const selectedPhrase = phrasePool[Math.floor(Math.random() * phrasePool.length)];

  try {
    await db.execute({
      sql: 'INSERT INTO user_motivation_history (id, user_id, phrase_id, displayed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      args: [`umh-${crypto.randomUUID()}`, userId, selectedPhrase.id]
    });
  } catch (err) {
    console.error('Erro ao salvar histórico de motivação:', err);
  }

  return res.json({ greeting, phrase: selectedPhrase.text, subtitle: 'Seu progresso acontece um dia de cada vez.' });
});

export default router;
