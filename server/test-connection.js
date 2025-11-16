// Quick database connection test
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Config:', {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database successfully!');
    
    // Test query
    const result = await client.query('SELECT COUNT(*) FROM food_items');
    console.log(`✅ Food items count: ${result.rows[0].count}`);
    
    // Test all tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('✅ Tables found:', tables.rows.map(r => r.table_name).join(', '));
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed!');
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testConnection();

