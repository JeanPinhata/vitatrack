import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDatabase } from './db.js';
import { runSeed } from './seed.js';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import motivationRoutes from './routes/motivation.js';
import weightsRoutes from './routes/weights.js';
import measurementsRoutes from './routes/measurements.js';
import foodsRoutes from './routes/foods.js';
import proteinsRoutes from './routes/proteins.js';
import recipesRoutes from './routes/recipes.js';
import historyRoutes from './routes/history.js';
import photosRoutes from './routes/photos.js';
import profileRoutes from './routes/profile.js';
import waterRoutes from './routes/water.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB tables and seed demo data
await initDatabase();
await runSeed();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/motivation', motivationRoutes);
app.use('/api/weights', weightsRoutes);
app.use('/api/measurements', measurementsRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/proteins', proteinsRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/water', waterRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'VitaTrack API',
    time: new Date().toISOString()
  });
});

// Serve frontend in production build if dist exists
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      next();
    }
  });
});

app.listen(PORT, () => {
  console.log(`VitaTrack API rodando com sucesso em http://localhost:${PORT}`);
});
