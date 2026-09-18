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

export default router;
