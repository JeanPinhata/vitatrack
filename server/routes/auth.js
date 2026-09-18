import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { hashPassword, comparePassword, generateToken, authenticateToken } from '../auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Por favor, informe seu nome completo.' });
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Por favor, informe um e-mail válido.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'A confirmação de senha não confere com a senha digitada.' });
  }

  try {
    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE LOWER(email) = LOWER(?)', args: [email.trim()] });
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado. Faça login para acessar.' });
    }

    const userId = `user-${crypto.randomUUID()}`;
    const passwordHash = hashPassword(password);

    await db.execute({
      sql: `INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)`,
      args: [userId, name.trim(), email.trim().toLowerCase(), passwordHash]
    });

    await db.execute({
      sql: `INSERT INTO user_settings (user_id, initial_weight, protein_goal, tracking_start_date, weight_unit, measurement_unit, onboarding_completed)
            VALUES (?, NULL, 150, CURRENT_DATE, 'kg', 'cm', 0)`,
      args: [userId]
    });

    const user = { id: userId, name: name.trim(), email: email.trim().toLowerCase(), avatar_url: null };
    const token = generateToken(user);

    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      token,
      user,
      settings: {
        protein_goal: 150,
        weight_unit: 'kg',
        measurement_unit: 'cm',
        onboarding_completed: 0
      }
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ error: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha o e-mail e a senha.' });
  }

  try {
    const userRes = await db.execute({ sql: 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)', args: [email.trim()] });
    const user = userRes.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const valid = comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const settingsRes = await db.execute({ sql: 'SELECT * FROM user_settings WHERE user_id = ?', args: [user.id] });
    const settings = settingsRes.rows[0] || {
      protein_goal: 150,
      weight_unit: 'kg',
      measurement_unit: 'cm',
      onboarding_completed: 0
    };

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url
    };

    const token = generateToken(safeUser);

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: safeUser,
      settings
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// Get current user profile & settings
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const settingsRes = await db.execute({ sql: 'SELECT * FROM user_settings WHERE user_id = ?', args: [req.user.id] });
    const settings = settingsRes.rows[0] || {
      protein_goal: 150,
      weight_unit: 'kg',
      measurement_unit: 'cm',
      onboarding_completed: 0
    };

    return res.json({
      user: req.user,
      settings
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Informe um e-mail válido para recuperação.' });
  }

  return res.json({
    message: 'Se o e-mail informado estiver cadastrado em nossa base, você receberá as instruções de redefinição de senha em instantes.'
  });
});

export default router;
