import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { authenticateToken } from '../auth.js';

const router = express.Router();

// GET all recipes
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { category, search, maxTime, minProtein } = req.query;

  let sql = `
    SELECT r.*, COALESCE(SUM(ri.protein_amount), 0) as total_protein
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    WHERE r.user_id = ?
  `;
  const args = [userId];

  if (category && category !== 'Todas') { sql += ' AND r.category = ?'; args.push(category); }
  if (search && search.trim()) { sql += ' AND LOWER(r.name) LIKE ?'; args.push(`%${search.trim().toLowerCase()}%`); }
  if (maxTime) { sql += ' AND r.preparation_time <= ?'; args.push(parseInt(maxTime)); }
  sql += ' GROUP BY r.id ORDER BY r.created_at DESC';

  const recipesRes = await db.execute({ sql, args });
  let recipes = recipesRes.rows.map(r => {
    const totalProt = Number(parseFloat(r.total_protein || 0).toFixed(1));
    const servings = r.servings || 1;
    return { ...r, total_protein: totalProt, protein_per_serving: Number((totalProt / servings).toFixed(1)) };
  });

  if (minProtein) {
    const minVal = parseFloat(minProtein);
    recipes = recipes.filter(r => r.protein_per_serving >= minVal);
  }

  return res.json({ recipes });
});

// GET recipe by ID with ingredients
router.get('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const recipeRes = await db.execute({ sql: 'SELECT * FROM recipes WHERE id = ? AND user_id = ?', args: [id, userId] });
  const recipe = recipeRes.rows[0];
  if (!recipe) return res.status(404).json({ error: 'Receita não encontrada.' });

  const ingredientsRes = await db.execute({ sql: 'SELECT * FROM recipe_ingredients WHERE recipe_id = ?', args: [id] });
  const ingredients = ingredientsRes.rows;

  const totalProtein = ingredients.reduce((sum, ing) => sum + (ing.protein_amount || 0), 0);
  const servings = recipe.servings || 1;

  return res.json({
    recipe: {
      ...recipe,
      total_protein: Number(totalProtein.toFixed(1)),
      protein_per_serving: Number((totalProtein / servings).toFixed(1)),
      ingredients
    }
  });
});

// POST create new recipe
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, category, preparation_time, servings, instructions, image_url, notes, ingredients } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ error: 'O nome da receita é obrigatório.' });

  const prepTime = parseInt(preparation_time) || 15;
  const numServings = parseInt(servings) || 1;
  const recipeId = `recipe-${crypto.randomUUID()}`;

  const defaultImages = [
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
  ];
  const finalImage = image_url || defaultImages[Math.floor(Math.random() * defaultImages.length)];

  try {
    await db.execute({
      sql: 'INSERT INTO recipes (id, user_id, name, category, preparation_time, servings, instructions, image_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [recipeId, userId, name.trim(), category ? category.trim() : 'Geral', prepTime, numServings, instructions ? instructions.trim() : '', finalImage, notes ? notes.trim() : '']
    });

    let totalProt = 0;
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const ing of ingredients) {
        if (ing.food_name && ing.food_name.trim()) {
          const qty = parseFloat(ing.quantity) || 100;
          const prot = parseFloat(ing.protein_amount) || 0;
          totalProt += prot;
          await db.execute({
            sql: 'INSERT INTO recipe_ingredients (id, recipe_id, food_id, food_name, quantity, unit, protein_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [`ing-${crypto.randomUUID()}`, recipeId, ing.food_id || null, ing.food_name.trim(), qty, ing.unit || 'g', Number(prot.toFixed(1))]
          });
        }
      }
    }

    const createdRes = await db.execute({ sql: 'SELECT * FROM recipes WHERE id = ?', args: [recipeId] });
    const createdIngredientsRes = await db.execute({ sql: 'SELECT * FROM recipe_ingredients WHERE recipe_id = ?', args: [recipeId] });

    return res.status(201).json({
      message: 'Receita criada com sucesso.',
      recipe: {
        ...createdRes.rows[0],
        total_protein: Number(totalProt.toFixed(1)),
        protein_per_serving: Number((totalProt / numServings).toFixed(1)),
        ingredients: createdIngredientsRes.rows
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao cadastrar receita.' });
  }
});

// PUT update recipe
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, category, preparation_time, servings, instructions, image_url, notes, ingredients } = req.body;

  const existingRes = await db.execute({ sql: 'SELECT id FROM recipes WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Receita não encontrada.' });

  const prepTime = parseInt(preparation_time) || 15;
  const numServings = parseInt(servings) || 1;

  try {
    await db.execute({
      sql: 'UPDATE recipes SET name = ?, category = ?, preparation_time = ?, servings = ?, instructions = ?, image_url = ?, notes = ? WHERE id = ? AND user_id = ?',
      args: [name.trim(), category ? category.trim() : 'Geral', prepTime, numServings, instructions ? instructions.trim() : '', image_url, notes ? notes.trim() : '', id, userId]
    });

    await db.execute({ sql: 'DELETE FROM recipe_ingredients WHERE recipe_id = ?', args: [id] });

    let totalProt = 0;
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const ing of ingredients) {
        if (ing.food_name && ing.food_name.trim()) {
          const qty = parseFloat(ing.quantity) || 100;
          const prot = parseFloat(ing.protein_amount) || 0;
          totalProt += prot;
          await db.execute({
            sql: 'INSERT INTO recipe_ingredients (id, recipe_id, food_id, food_name, quantity, unit, protein_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [`ing-${crypto.randomUUID()}`, id, ing.food_id || null, ing.food_name.trim(), qty, ing.unit || 'g', Number(prot.toFixed(1))]
          });
        }
      }
    }

    return res.json({ message: 'Receita atualizada com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar receita.' });
  }
});

// DELETE recipe
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existingRes = await db.execute({ sql: 'SELECT id FROM recipes WHERE id = ? AND user_id = ?', args: [id, userId] });
  if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Receita não encontrada.' });

  try {
    await db.execute({ sql: 'DELETE FROM recipes WHERE id = ? AND user_id = ?', args: [id, userId] });
    return res.json({ message: 'Receita excluída com sucesso.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir receita.' });
  }
});

// POST seed 20 extra recipes
router.post('/seed-extra', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  
  const extraRecipes = [
    { name: 'Panqueca de Banana Fit', cat: 'Café da Manhã', t: 10, img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=80', ins: 'Amasse 1 banana, misture com 2 ovos e 2 colheres de aveia. Doure na frigideira.', ings: [{n:'Banana', q:1, u:'unid', p:1}, {n:'Ovo', q:2, u:'unid', p:12}, {n:'Aveia', q:20, u:'g', p:3}] },
    { name: 'Omelete de Espinafre', cat: 'Café da Manhã', t: 10, img: 'https://images.unsplash.com/photo-1510693209569-873b22b1fa4e?w=500&auto=format&fit=crop&q=80', ins: 'Bata 3 ovos com espinafre picado e sal. Frite até dourar.', ings: [{n:'Ovo', q:3, u:'unid', p:18}, {n:'Espinafre', q:50, u:'g', p:1.5}] },
    { name: 'Crepioca de Queijo Branco', cat: 'Lanche', t: 5, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80', ins: 'Misture 1 ovo com 2 colheres de goma de tapioca. Recheie com queijo branco.', ings: [{n:'Ovo', q:1, u:'unid', p:6}, {n:'Tapioca', q:30, u:'g', p:0}, {n:'Queijo Branco', q:50, u:'g', p:8}] },
    { name: 'Bolo de Caneca Whey', cat: 'Lanche', t: 5, img: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=500&auto=format&fit=crop&q=80', ins: 'Misture 1 scoop de whey, 1 ovo, 1 colher de cacau e fermento. Micro-ondas 1 minuto.', ings: [{n:'Whey Protein', q:30, u:'g', p:24}, {n:'Ovo', q:1, u:'unid', p:6}, {n:'Cacau', q:10, u:'g', p:2}] },
    { name: 'Frango com Batata Doce', cat: 'Almoço', t: 30, img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&auto=format&fit=crop&q=80', ins: 'Grelhe o frango. Cozinhe e asse a batata doce com azeite e alecrim.', ings: [{n:'Peito de Frango', q:150, u:'g', p:45}, {n:'Batata Doce', q:100, u:'g', p:2}] },
    { name: 'Salmão Assado', cat: 'Jantar', t: 25, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80', ins: 'Tempere o salmão com limão e sal. Asse por 20 min a 200°C.', ings: [{n:'Salmão', q:150, u:'g', p:30}, {n:'Brócolis', q:100, u:'g', p:3}] },
    { name: 'Salada com Atum', cat: 'Almoço', t: 10, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80', ins: 'Misture folhas verdes, tomate, pepino e atum em lata escorrido.', ings: [{n:'Atum', q:120, u:'g', p:28}, {n:'Folhas', q:100, u:'g', p:1}] },
    { name: 'Strogonoff Saudável', cat: 'Almoço', t: 20, img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb43f?w=500&auto=format&fit=crop&q=80', ins: 'Frango em cubos, molho de tomate natural e creme de ricota ao invés de creme de leite.', ings: [{n:'Frango', q:150, u:'g', p:45}, {n:'Creme Ricota', q:30, u:'g', p:3}] },
    { name: 'Macarrão de Abobrinha', cat: 'Jantar', t: 15, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80', ins: 'Corte a abobrinha em tiras e refogue com carne moída magra.', ings: [{n:'Patinho Moído', q:150, u:'g', p:40}, {n:'Abobrinha', q:200, u:'g', p:2}] },
    { name: 'Mousse de Chocolate Fit', cat: 'Doce', t: 15, img: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=500&auto=format&fit=crop&q=80', ins: 'Bata abacate maduro, cacau em pó e um pouco de mel.', ings: [{n:'Abacate', q:100, u:'g', p:2}, {n:'Cacau', q:15, u:'g', p:3}] },
    { name: 'Brigadeiro de Whey', cat: 'Doce', t: 10, img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=80', ins: 'Whey sabor chocolate, cacau e leite em pó desnatado com água até dar ponto.', ings: [{n:'Whey Chocolate', q:30, u:'g', p:24}, {n:'Leite em Pó', q:15, u:'g', p:5}] },
    { name: 'Mingau de Aveia Proteico', cat: 'Café da Manhã', t: 10, img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=80', ins: 'Cozinhe aveia com leite e depois misture 1 scoop de whey.', ings: [{n:'Aveia', q:30, u:'g', p:4}, {n:'Whey', q:30, u:'g', p:24}, {n:'Leite', q:200, u:'ml', p:6}] },
    { name: 'Torta de Frango de Frigideira', cat: 'Almoço', t: 15, img: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=500&auto=format&fit=crop&q=80', ins: 'Massa de ovo e aveia, recheada com frango desfiado.', ings: [{n:'Frango Desfiado', q:100, u:'g', p:30}, {n:'Ovo', q:2, u:'unid', p:12}] },
    { name: 'Smoothie de Frutas Vermelhas', cat: 'Lanche', t: 5, img: 'https://images.unsplash.com/photo-1553530666-ba11a90a2bf9?w=500&auto=format&fit=crop&q=80', ins: 'Bata morangos congelados, leite e whey de baunilha.', ings: [{n:'Morangos', q:100, u:'g', p:1}, {n:'Whey Baunilha', q:30, u:'g', p:24}] },
    { name: 'Pizza Fit de Rap10', cat: 'Jantar', t: 10, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80', ins: 'Rap10 integral, molho de tomate, frango e mussarela light.', ings: [{n:'Rap10', q:1, u:'unid', p:3}, {n:'Frango', q:50, u:'g', p:15}, {n:'Queijo Light', q:30, u:'g', p:8}] },
    { name: 'Iogurte com Chia e Frutas', cat: 'Café da Manhã', t: 5, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80', ins: 'Iogurte desnatado, 1 colher de chia e frutas picadas.', ings: [{n:'Iogurte Natural', q:170, u:'g', p:15}, {n:'Chia', q:10, u:'g', p:2}] },
    { name: 'Escondidinho de Mandioca com Carne', cat: 'Almoço', t: 40, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80', ins: 'Purê de mandioca por cima de patinho moído refogado.', ings: [{n:'Patinho', q:150, u:'g', p:40}, {n:'Mandioca', q:150, u:'g', p:2}] },
    { name: 'Cheesecake Fit de Morango', cat: 'Doce', t: 30, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', ins: 'Base de aveia, recheio de ricota e whey com geleia 0 açúcar.', ings: [{n:'Ricota', q:100, u:'g', p:12}, {n:'Whey Baunilha', q:30, u:'g', p:24}] },
    { name: 'Hambúrguer Caseiro Fit', cat: 'Jantar', t: 20, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', ins: 'Molde a carne moída, grelhe. Use pão integral e muita salada.', ings: [{n:'Carne Moída Magra', q:150, u:'g', p:40}, {n:'Pão Integral', q:1, u:'unid', p:5}] },
    { name: 'Sorvete de Banana e Cacau', cat: 'Doce', t: 5, img: 'https://images.unsplash.com/photo-1556910110-a5a63dfd3938?w=500&auto=format&fit=crop&q=80', ins: 'Bata 2 bananas congeladas com 1 colher de cacau no processador.', ings: [{n:'Banana', q:2, u:'unid', p:2}, {n:'Cacau', q:15, u:'g', p:3}] },
  ];

  try {
    for (const r of extraRecipes) {
      const recipeId = `recipe-${crypto.randomUUID()}`;
      await db.execute({
        sql: 'INSERT INTO recipes (id, user_id, name, category, preparation_time, servings, instructions, image_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [recipeId, userId, r.name, r.cat, r.t, 1, r.ins, r.img, 'Receita sugerida']
      });

      for (const ing of r.ings) {
        await db.execute({
          sql: 'INSERT INTO recipe_ingredients (id, recipe_id, food_name, quantity, unit, protein_amount) VALUES (?, ?, ?, ?, ?, ?)',
          args: [`ing-${crypto.randomUUID()}`, recipeId, ing.n, ing.q, ing.u, ing.p]
        });
      }
    }
    return res.json({ message: '20 novas receitas foram adicionadas com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao adicionar receitas.' });
  }
});

export default router;
