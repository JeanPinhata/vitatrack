import crypto from 'node:crypto';
import { db, initDatabase } from './db.js';
import { hashPassword } from './auth.js';
import { fitRecipes } from './recipesData.js';

export async function runSeed() {
  await initDatabase();

  const phrases = [
    "Pequenos passos, grandes mudanças.",
    "Seu progresso acontece um dia de cada vez.",
    "Consistência vale mais do que perfeição.",
    "Cuide do processo. Os resultados vêm com o tempo.",
    "Hoje é mais uma oportunidade de cuidar de você.",
    "Não precisa ser perfeito. Precisa ser consistente.",
    "Cada registro conta.",
    "Seu único objetivo hoje é dar o próximo passo.",
    "Resultados são construídos nos dias comuns.",
    "Tenha paciência com o seu processo.",
    "Você não precisa correr. Precisa continuar.",
    "Olhe para trás e reconheça o quanto já avançou.",
    "Disciplina hoje, resultados amanhã."
  ];

  for (let i = 0; i < phrases.length; i++) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO motivational_phrases (id, text, active) VALUES (?, ?, 1)',
      args: [`phrase-${i + 1}`, phrases[i]]
    });
  }

  const globalFoods = [
    { name: 'Peito de Frango Grelhado', category: 'Carnes & Aves', ref: 100, unit: 'g', prot: 31.0 },
    { name: 'Ovos Cozidos / Mexidos', category: 'Ovos', ref: 100, unit: 'g', prot: 13.0 },
    { name: 'Patinho Moído Grelhado', category: 'Carnes & Aves', ref: 100, unit: 'g', prot: 32.0 },
    { name: 'Salmão Grelhado', category: 'Peixes & Frutos do Mar', ref: 100, unit: 'g', prot: 25.0 },
    { name: 'Filé de Tilápia', category: 'Peixes & Frutos do Mar', ref: 100, unit: 'g', prot: 26.0 },
    { name: 'Atum Sólido ao Natural', category: 'Peixes & Frutos do Mar', ref: 100, unit: 'g', prot: 26.0 },
    { name: 'Queijo Cottage Light', category: 'Laticínios', ref: 100, unit: 'g', prot: 12.0 },
    { name: 'Iogurte Grego Natural', category: 'Laticínios', ref: 100, unit: 'g', prot: 10.0 },
    { name: 'Creme de Ricota Light', category: 'Laticínios', ref: 100, unit: 'g', prot: 9.0 },
    { name: 'Queijo Minas Frescal', category: 'Laticínios', ref: 100, unit: 'g', prot: 14.0 },
    { name: 'Whey Protein Concentrado', category: 'Suplementos', ref: 30, unit: 'g', prot: 24.0 },
    { name: 'Tofu Firme', category: 'Vegetais & Leguminosas', ref: 100, unit: 'g', prot: 15.0 },
    { name: 'Feijão Carioca Cozido', category: 'Vegetais & Leguminosas', ref: 100, unit: 'g', prot: 5.0 },
    { name: 'Lentilha Cozida', category: 'Vegetais & Leguminosas', ref: 100, unit: 'g', prot: 9.0 },
    { name: 'Grão de Bico Cozido', category: 'Vegetais & Leguminosas', ref: 100, unit: 'g', prot: 8.5 },
    { name: 'Arroz Branco / Integral', category: 'Grãos & Cereais', ref: 100, unit: 'g', prot: 2.6 },
    { name: 'Aveia em Flocos', category: 'Grãos & Cereais', ref: 100, unit: 'g', prot: 14.0 },
    { name: 'Castanha-do-Pará', category: 'Oleaginosas', ref: 100, unit: 'g', prot: 18.0 }
  ];

  for (let idx = 0; idx < globalFoods.length; idx++) {
    const food = globalFoods[idx];
    await db.execute({
      sql: 'INSERT OR REPLACE INTO foods (id, user_id, name, category, reference_amount, reference_unit, protein_amount) VALUES (?, NULL, ?, ?, ?, ?, ?)',
      args: [`food-global-${idx + 1}`, food.name, food.category, food.ref, food.unit, food.prot]
    });
  }

  const marianaId = 'user-mariana-silva';
  const marianaEmail = 'mariana@vitatrack.com';
  const hashedPassword = hashPassword('senha123');

  const existingUserRes = await db.execute({ sql: 'SELECT id FROM users WHERE id = ?', args: [marianaId] });
  const existingUser = existingUserRes.rows[0];

  if (!existingUser) {
    await db.execute({
      sql: 'INSERT INTO users (id, name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?, ?)',
      args: [marianaId, 'Mariana Silva', marianaEmail, hashedPassword, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80']
    });

    await db.execute({
      sql: `INSERT INTO user_settings (user_id, initial_weight, protein_goal, tracking_start_date, personal_goal, weight_unit, measurement_unit, onboarding_completed)
            VALUES (?, 88.0, 150.0, '2026-07-01', 'Manter consistência, ganhar disposição e evoluir com autocuidado.', 'kg', 'cm', 1)`,
      args: [marianaId]
    });

    const weights = [
      { date: '2026-07-01', weight: 88.0, time: '07:30', notes: 'Início do acompanhamento no VitaTrack' },
      { date: '2026-07-08', weight: 87.4, time: '07:15', notes: 'Primeira semana consistente com hidratação' },
      { date: '2026-07-15', weight: 86.8, time: '07:40', notes: 'Boa adaptação à meta proteica' },
      { date: '2026-07-22', weight: 86.1, time: '07:20', notes: 'Mais energia no dia a dia' },
      { date: '2026-07-30', weight: 85.7, time: '07:30', notes: 'Fechando o primeiro mês com -2,3 kg' },
      { date: '2026-08-08', weight: 85.0, time: '07:15', notes: 'Roupas já vestindo com mais conforto' },
      { date: '2026-08-16', weight: 84.4, time: '07:35', notes: 'Caminhadas diárias mantidas' },
      { date: '2026-08-25', weight: 83.8, time: '07:20', notes: 'Constância nas refeições' },
      { date: '2026-09-01', weight: 83.2, time: '07:30', notes: 'Dois meses de processo' },
      { date: '2026-09-08', weight: 82.8, time: '07:15', notes: 'Ótima recuperação muscular' },
      { date: '2026-09-12', weight: 82.6, time: '07:20', notes: 'Sensação de leveza' },
      { date: '2026-09-15', weight: 82.4, time: '07:25', notes: 'Meta de 5,6 kg eliminados alcançada!' }
    ];

    for (const w of weights) {
      await db.execute({
        sql: 'INSERT INTO weight_entries (id, user_id, date, weight, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
        args: [`weight-${crypto.randomUUID()}`, marianaId, w.date, w.weight, w.time, w.notes]
      });
    }

    const measurements = [
      { date: '2026-07-01', abdomen: 101, waist: 96, arm: 34, thigh: 60, hip: 108, notes: 'Medições iniciais' },
      { date: '2026-07-25', abdomen: 99, waist: 94, arm: 33.5, thigh: 59, hip: 107, notes: 'Primeiro check de medidas' },
      { date: '2026-08-15', abdomen: 97, waist: 92.5, arm: 33, thigh: 58, hip: 106, notes: 'Meio do caminho' },
      { date: '2026-09-01', abdomen: 95.5, waist: 91, arm: 32.5, thigh: 57, hip: 105, notes: 'Cintura afinando bastante' },
      { date: '2026-09-15', abdomen: 94, waist: 90, arm: 32, thigh: 56, hip: 104, notes: 'Resultado incrível de 73 dias' }
    ];

    for (const m of measurements) {
      await db.execute({
        sql: 'INSERT INTO body_measurements (id, user_id, date, abdomen, waist, arm, thigh, hip, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [`meas-${crypto.randomUUID()}`, marianaId, m.date, m.abdomen, m.waist, m.arm, m.thigh, m.hip, m.notes]
      });
    }

    const proteinEntries = [
      { date: '2026-09-15', meal: 'Café da manhã', name: 'Ovos Cozidos / Mexidos', qty: 100, ref: 100, prot: 13.0, calc: 13.0 },
      { date: '2026-09-15', meal: 'Café da manhã', name: 'Iogurte Grego Natural', qty: 100, ref: 100, prot: 10.0, calc: 10.0 },
      { date: '2026-09-15', meal: 'Almoço', name: 'Peito de Frango Grelhado', qty: 150, ref: 100, prot: 31.0, calc: 46.5 },
      { date: '2026-09-15', meal: 'Lanche da tarde', name: 'Whey Protein Concentrado', qty: 30, ref: 30, prot: 24.0, calc: 24.0 },
      { date: '2026-09-15', meal: 'Jantar', name: 'Salmão Grelhado', qty: 100, ref: 100, prot: 25.0, calc: 25.0 },
      { date: '2026-09-18', meal: 'Café da manhã', name: 'Ovos Cozidos / Mexidos', qty: 100, ref: 100, prot: 13.0, calc: 13.0 },
      { date: '2026-09-18', meal: 'Café da manhã', name: 'Iogurte Grego Natural', qty: 100, ref: 100, prot: 10.0, calc: 10.0 },
      { date: '2026-09-18', meal: 'Almoço', name: 'Peito de Frango Grelhado', qty: 150, ref: 100, prot: 31.0, calc: 46.5 },
      { date: '2026-09-18', meal: 'Lanche da tarde', name: 'Whey Protein Concentrado', qty: 30, ref: 30, prot: 24.0, calc: 24.0 },
      { date: '2026-09-18', meal: 'Jantar', name: 'Filé de Tilápia', qty: 150, ref: 100, prot: 26.0, calc: 39.0 }
    ];

    for (let idx = 0; idx < proteinEntries.length; idx++) {
      const item = proteinEntries[idx];
      await db.execute({
        sql: 'INSERT INTO protein_entries (id, user_id, date, meal_type, food_id, food_name, quantity, reference_amount, protein_amount, calculated_protein) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?)',
        args: [`prot-seed-${idx}`, marianaId, item.date, item.meal, item.name, item.qty, item.ref, item.prot, item.calc]
      });
    }

    await db.execute({
      sql: 'INSERT INTO progress_photos (id, user_id, date, frontal_url, lateral_url, back_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: ['photo-1', marianaId, '2026-07-01',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
        'Registro fotográfico do primeiro dia'
      ]
    });
  }

  // Garante que TODOS os usuários existentes tenham as receitas fit.
  // INSERT OR IGNORE nunca duplica. Roda sempre que o servidor iniciar.
  const allUsersRes = await db.execute({ sql: 'SELECT id FROM users', args: [] });
  for (const userRow of allUsersRes.rows) {
    for (let rIdx = 0; rIdx < fitRecipes.length; rIdx++) {
      const r = fitRecipes[rIdx];
      const recipeId = `${r.id}-${userRow.id}`;
      await db.execute({
        sql: 'INSERT OR REPLACE INTO recipes (id, user_id, name, category, preparation_time, servings, instructions, image_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [recipeId, userRow.id, r.name, r.category, r.prep, r.servings, r.instructions, r.image_url, r.notes]
      });
      for (let iIdx = 0; iIdx < r.ingredients.length; iIdx++) {
        const ing = r.ingredients[iIdx];
        await db.execute({
          sql: 'INSERT OR REPLACE INTO recipe_ingredients (id, recipe_id, food_name, quantity, unit, protein_amount) VALUES (?, ?, ?, ?, ?, ?)',
          args: [`ing-${recipeId}-${iIdx}`, recipeId, ing.food_name, ing.quantity, ing.unit, ing.protein]
        });
      }
    }
  }

  console.log('Banco de dados inicializado e seed executado com sucesso!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed();
}
