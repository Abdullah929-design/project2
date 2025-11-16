const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your Vercel frontend URL here after deployment
  // 'https://your-frontend.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins - update after Vercel deployment
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Fitness Tracker API 🚀');
});

// Food Database Endpoints
app.get('/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM food_items';
    let params = [];
    
    if (search) {
      query += ' WHERE name ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ' LIMIT 50';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User Meals Endpoints
app.get('/meals', async (req, res) => {
  try {
    const { date, user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const query = `
      SELECT um.*, fi.name as food_name, fi.serving_size 
      FROM user_meals um
      LEFT JOIN food_items fi ON um.food_id = fi.id
      WHERE um.user_id = $1 AND um.date = $2
      ORDER BY um.meal_type, um.created_at
    `;
    const result = await pool.query(query, [user_id, date || new Date().toISOString().split('T')[0]]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/meals', async (req, res) => {
  try {
    const { user_id, food_id, custom_name, servings, meal_type, date } = req.body;
    
    // Get nutrition info if using a food item
    let nutrition = {};
    if (food_id) {
      const foodRes = await pool.query('SELECT calories, carbs, protein, fat FROM food_items WHERE id = $1', [food_id]);
      if (foodRes.rows.length === 0) {
        return res.status(404).json({ error: 'Food item not found' });
      }
      const food = foodRes.rows[0];
      nutrition = {
        calories: Math.round(food.calories * servings),
        carbs: parseFloat((food.carbs * servings).toFixed(1)),
        protein: parseFloat((food.protein * servings).toFixed(1)),
        fat: parseFloat((food.fat * servings).toFixed(1))
      };
    }
    
    const result = await pool.query(
      `INSERT INTO user_meals 
       (user_id, food_id, custom_name, servings, meal_type, date, calories, carbs, protein, fat)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        user_id, 
        food_id, 
        custom_name, 
        servings || 1.0, 
        meal_type, 
        date || new Date().toISOString().split('T')[0],
        nutrition.calories,
        nutrition.carbs,
        nutrition.protein,
        nutrition.fat
      ]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM user_meals WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Nutrition Reports
app.get('/reports/daily', async (req, res) => {
  try {
    const { user_id, date } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get daily totals
    const totalsRes = await pool.query(
      `SELECT 
        SUM(calories) as total_calories,
        SUM(carbs) as total_carbs,
        SUM(protein) as total_protein,
        SUM(fat) as total_fat
       FROM user_meals
       WHERE user_id = $1 AND date = $2`,
      [user_id, date || new Date().toISOString().split('T')[0]]
    );
    
    // Get goals
    const goalsRes = await pool.query('SELECT * FROM user_goals WHERE user_id = $1', [user_id]);
    const goals = goalsRes.rows[0] || {};
    
    // Get meal breakdown
    const breakdownRes = await pool.query(
      `SELECT 
        meal_type,
        SUM(calories) as calories,
        SUM(carbs) as carbs,
        SUM(protein) as protein,
        SUM(fat) as fat
       FROM user_meals
       WHERE user_id = $1 AND date = $2
       GROUP BY meal_type`,
      [user_id, date || new Date().toISOString().split('T')[0]]
    );
    
    res.json({
      totals: totalsRes.rows[0] || {
        total_calories: 0,
        total_carbs: 0,
        total_protein: 0,
        total_fat: 0
      },
      goals,
      breakdown: breakdownRes.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User Goals Endpoints
app.get('/goals', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const result = await pool.query('SELECT * FROM user_goals WHERE user_id = $1', [user_id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/goals', async (req, res) => {
  try {
    const { user_id, daily_calories, daily_carbs, daily_protein, daily_fat } = req.body;
    
    const result = await pool.query(
      `INSERT INTO user_goals 
       (user_id, daily_calories, daily_carbs, daily_protein, daily_fat)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         daily_calories = EXCLUDED.daily_calories,
         daily_carbs = EXCLUDED.daily_carbs,
         daily_protein = EXCLUDED.daily_protein,
         daily_fat = EXCLUDED.daily_fat,
         updated_at = NOW()
       RETURNING *`,
      [user_id, daily_calories, daily_carbs, daily_protein, daily_fat]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});