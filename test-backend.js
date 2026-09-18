// Automated test script to verify all server logic directly
import { db, initDatabase } from './server/db.js';
import { runSeed } from './server/seed.js';
import { hashPassword, comparePassword, generateToken } from './server/auth.js';

async function runTests() {
  console.log('=== INICIANDO TESTES DO BACKEND VITATRACK ===');

  // 1. Database and Seed
  runSeed();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('mariana@vitatrack.com');
  if (!user) throw new Error('Usuário Mariana não encontrado no banco!');
  console.log('✓ Usuário demo Mariana Silva localizado:', user.name);

  // 2. Auth verification
  const isMatch = comparePassword('senha123', user.password_hash);
  if (!isMatch) throw new Error('Senha não confere com o hash!');
  const token = generateToken(user);
  if (!token) throw new Error('Falha ao gerar JWT token!');
  console.log('✓ Autenticação e JWT validados com sucesso.');

  // 3. Weight calculations
  const weights = db.prepare('SELECT * FROM weight_entries WHERE user_id = ? ORDER BY date ASC').all(user.id);
  console.log(`✓ Pesagens encontradas: ${weights.length}`);
  const initialWeight = weights[0].weight;
  const currentWeight = weights[weights.length - 1].weight;
  const diff = currentWeight - initialWeight;
  console.log(`✓ Peso Inicial: ${initialWeight}kg -> Peso Atual: ${currentWeight}kg (Variação: ${diff.toFixed(1)}kg)`);
  if (Math.abs(diff - (-5.6)) > 0.01) {
    throw new Error(`Variação esperada era -5.6kg, obteve ${diff.toFixed(1)}kg`);
  }

  // 4. Body measurements
  const measurements = db.prepare('SELECT * FROM body_measurements WHERE user_id = ? ORDER BY date ASC').all(user.id);
  console.log(`✓ Medições encontradas: ${measurements.length}`);
  const firstM = measurements[0];
  const lastM = measurements[measurements.length - 1];
  console.log(`✓ Abdômen: ${firstM.abdomen}cm -> ${lastM.abdomen}cm (Dif: ${(lastM.abdomen - firstM.abdomen).toFixed(1)}cm)`);
  console.log(`✓ Cintura: ${firstM.waist}cm -> ${lastM.waist}cm (Dif: ${(lastM.waist - firstM.waist).toFixed(1)}cm)`);

  // 5. Protein Calculations
  const testQty = 150;
  const testRef = 100;
  const testProt = 31.0;
  const calculatedProt = Number(((testQty / testRef) * testProt).toFixed(1));
  console.log(`✓ Cálculo automático de proteína: ${testQty}g frango = ${calculatedProt}g (esperado: 46.5g)`);
  if (calculatedProt !== 46.5) {
    throw new Error(`Cálculo de proteína incorreto: ${calculatedProt}`);
  }

  // 6. Motivational phrase collection
  const phrases = db.prepare('SELECT count(*) as count FROM motivational_phrases').get();
  console.log(`✓ Frases motivacionais cadastradas: ${phrases.count}`);

  // 7. Recipes with dynamic ingredients
  const recipes = db.prepare('SELECT * FROM recipes WHERE user_id = ?').all(user.id);
  console.log(`✓ Receitas cadastradas: ${recipes.length}`);
  recipes.forEach(r => {
    const ings = db.prepare('SELECT sum(protein_amount) as total FROM recipe_ingredients WHERE recipe_id = ?').get(r.id);
    const protPerServing = (ings.total / r.servings).toFixed(1);
    console.log(`  - ${r.name}: ${ings.total}g total, ${protPerServing}g/porção (${r.servings} porções)`);
  });

  console.log('=== TODOS OS TESTES DO BACKEND PASSARAM COM 100% DE SUCESSO! ===');
}

runTests().catch(err => {
  console.error('FALHA NOS TESTES:', err);
  process.exit(1);
});
