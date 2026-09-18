import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vitatrack-secret-wellness-key-2026';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login para continuar.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user exists in db
    const userRes = await db.execute({ sql: 'SELECT id, name, email, avatar_url FROM users WHERE id = ?', args: [decoded.id] });
    const user = userRes.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sessão expirada ou inválida. Por favor, entre novamente.' });
  }
}
