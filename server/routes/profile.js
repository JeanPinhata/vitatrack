import express from 'express';
import { db } from '../db.js';
import { authenticateToken, hashPassword, comparePassword } from '../auth.js';

const router = express.Router();

// Update profile details and wellness settings
router.put('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, email, protein_goal, weight_unit, measurement_unit, personal_goal } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ error: 'O nome é obrigatório.' });
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'E-mail inválido.' });

  const existingRes = await db.execute({ sql: 'SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id != ?', args: [email.trim(), userId] });
  if (existingRes.rows.length > 0) {
    return res.status(400).json({ error: 'Este e-mail já está sendo utilizado por outra conta.' });
  }

  try {
    await db.execute({ sql: 'UPDATE users SET name = ?, email = ? WHERE id = ?', args: [name.trim(), email.trim().toLowerCase(), userId] });

    const protGoal = parseFloat(protein_goal) || 150;
    await db.execute({
      sql: 'UPDATE user_settings SET protein_goal = ?, weight_unit = ?, measurement_unit = ?, personal_goal = ? WHERE user_id = ?',
      args: [protGoal, weight_unit || 'kg', measurement_unit || 'cm', personal_goal || null, userId]
    });

    const updatedUserRes = await db.execute({ sql: 'SELECT id, name, email, avatar_url FROM users WHERE id = ?', args: [userId] });
    const updatedSettingsRes = await db.execute({ sql: 'SELECT * FROM user_settings WHERE user_id = ?', args: [userId] });

    return res.json({ message: 'Perfil atualizado com sucesso.', user: updatedUserRes.rows[0], settings: updatedSettingsRes.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar dados do perfil.' });
  }
});

// Update avatar
router.put('/avatar', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { avatar_url } = req.body;

  if (!avatar_url) return res.status(400).json({ error: 'Nenhuma imagem fornecida.' });

  try {
    await db.execute({ sql: 'UPDATE users SET avatar_url = ? WHERE id = ?', args: [avatar_url, userId] });
    return res.json({ message: 'Foto atualizada com sucesso.', avatar_url });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar foto.' });
  }
});

// Update password
router.put('/password', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Preencha a senha atual e a nova senha.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
  if (newPassword !== confirmPassword) return res.status(400).json({ error: 'A confirmação da nova senha não confere.' });

  const userRes = await db.execute({ sql: 'SELECT password_hash FROM users WHERE id = ?', args: [userId] });
  const user = userRes.rows[0];

  if (!user || !comparePassword(currentPassword, user.password_hash)) {
    return res.status(400).json({ error: 'A senha atual está incorreta.' });
  }

  const newHash = hashPassword(newPassword);
  await db.execute({ sql: 'UPDATE users SET password_hash = ? WHERE id = ?', args: [newHash, userId] });
  return res.json({ message: 'Senha alterada com sucesso.' });
});

// Export all user data
router.get('/export', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const format = req.query.format || 'json';

  const userRes = await db.execute({ sql: 'SELECT id, name, email, created_at FROM users WHERE id = ?', args: [userId] });
  const user = userRes.rows[0];

  const settingsRes = await db.execute({ sql: 'SELECT * FROM user_settings WHERE user_id = ?', args: [userId] });
  const settings = settingsRes.rows[0];

  const weightsRes = await db.execute({ sql: 'SELECT date, weight, time, notes FROM weight_entries WHERE user_id = ? ORDER BY date ASC', args: [userId] });
  const weights = weightsRes.rows;

  const measurementsRes = await db.execute({ sql: 'SELECT date, abdomen, waist, arm, thigh, hip, notes FROM body_measurements WHERE user_id = ? ORDER BY date ASC', args: [userId] });
  const measurements = measurementsRes.rows;

  const proteinEntriesRes = await db.execute({ sql: 'SELECT date, meal_type, food_name, quantity, protein_amount, calculated_protein FROM protein_entries WHERE user_id = ? ORDER BY date ASC', args: [userId] });
  const proteinEntries = proteinEntriesRes.rows;

  const recipesRes = await db.execute({ sql: 'SELECT name, category, preparation_time, servings, instructions, notes FROM recipes WHERE user_id = ?', args: [userId] });
  const recipes = recipesRes.rows;

  if (format === 'csv') {
    let csv = '--- PESAGENS ---\nData,Peso (kg),Horario,Observacoes\n';
    weights.forEach(w => {
      const notes = (w.notes || '').replace(/"/g, '""');
      csv += '"' + w.date + '",' + w.weight + ',"' + (w.time || '') + '","' + notes + '"\n';
    });

    csv += '\n--- MEDIDAS CORPORAIS ---\nData,Abdomen,Cintura,Braco,Coxa,Quadril,Observacoes\n';
    measurements.forEach(m => {
      const notes = (m.notes || '').replace(/"/g, '""');
      csv += '"' + m.date + '",' + (m.abdomen || '') + ',' + (m.waist || '') + ',' + (m.arm || '') + ',' + (m.thigh || '') + ',' + (m.hip || '') + ',"' + notes + '"\n';
    });

    csv += '\n--- PROTEINA ---\nData,Refeicao,Alimento,Quantidade,Proteina\n';
    proteinEntries.forEach(p => {
      csv += '"' + p.date + '","' + p.meal_type + '","' + p.food_name + '",' + p.quantity + ',' + p.calculated_protein + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="vitatrack-exportacao.csv"');
    return res.send('\uFEFF' + csv);
  }

  return res.json({ app: 'VitaTrack', version: '1.0.0', export_date: new Date().toISOString(), user, settings, weights, measurements, proteinEntries, recipes });
});

// Delete account
router.delete('/account', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [userId] });
    return res.json({ message: 'Sua conta e todos os dados foram excluídos com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir conta.' });
  }
});

export default router;
