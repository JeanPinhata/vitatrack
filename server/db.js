import { createClient } from '@libsql/client';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback for local development if Turso variables are not set
let dbUrl = process.env.TURSO_DATABASE_URL;
let dbAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'vitatrack.db');
  dbUrl = `file:${dbPath}`;
}

export const db = createClient({
  url: dbUrl,
  authToken: dbAuthToken
});

export async function initDatabase() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      initial_weight REAL,
      protein_goal REAL DEFAULT 150,
      tracking_start_date DATE,
      personal_goal TEXT,
      weight_unit TEXT DEFAULT 'kg',
      measurement_unit TEXT DEFAULT 'cm',
      onboarding_completed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS weight_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      weight REAL NOT NULL,
      time TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS body_measurements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      abdomen REAL,
      waist REAL,
      arm REAL,
      thigh REAL,
      hip REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      reference_amount REAL NOT NULL DEFAULT 100,
      reference_unit TEXT NOT NULL DEFAULT 'g',
      protein_amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS protein_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      meal_type TEXT NOT NULL,
      food_id TEXT REFERENCES foods(id) ON DELETE SET NULL,
      food_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      reference_amount REAL NOT NULL DEFAULT 100,
      protein_amount REAL NOT NULL,
      calculated_protein REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      preparation_time INTEGER NOT NULL DEFAULT 15,
      servings INTEGER NOT NULL DEFAULT 1,
      instructions TEXT,
      image_url TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id TEXT PRIMARY KEY,
      recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      food_id TEXT REFERENCES foods(id) ON DELETE SET NULL,
      food_name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'g',
      protein_amount REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS motivational_phrases (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_motivation_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      phrase_id TEXT NOT NULL REFERENCES motivational_phrases(id) ON DELETE CASCADE,
      displayed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS progress_photos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      frontal_url TEXT,
      lateral_url TEXT,
      back_url TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS water_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      amount_ml INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execute('ALTER TABLE user_settings ADD COLUMN water_goal INTEGER DEFAULT 2500');
  } catch (err) {
    if (!err.message.includes('duplicate column name')) {
      console.error('Info: water_goal column might already exist', err.message);
    }
  }

  try {
    await db.execute('ALTER TABLE progress_photos ADD COLUMN images_json TEXT');
  } catch (err) {
    if (!err.message.includes('duplicate column name')) {
      console.error('Info: images_json column might already exist', err.message);
    }
  }
}
