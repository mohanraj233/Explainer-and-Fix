const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function init() {
  console.log('Initializing tables in Neon PostgreSQL...');
  
  // 1. Create enum type if not exists
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE patch_status AS ENUM ('pending_approval', 'approved', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // 2. Create ai_explanations
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_explanations (
      id SERIAL PRIMARY KEY,
      finding_id VARCHAR(128) NOT NULL,
      provider VARCHAR(128) NOT NULL,
      prompt_version VARCHAR(64) NOT NULL,
      client_explanation TEXT NOT NULL,
      developer_guidance TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // 3. Create ai_patches
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_patches (
      id SERIAL PRIMARY KEY,
      finding_id VARCHAR(128) NOT NULL,
      patch_diff TEXT NOT NULL,
      status patch_status NOT NULL DEFAULT 'pending_approval',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // 4. Create ai_messages
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_messages (
      id SERIAL PRIMARY KEY,
      finding_id VARCHAR(128) NOT NULL,
      sender VARCHAR(64) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // 5. Create retests
  await pool.query(`
    CREATE TABLE IF NOT EXISTS retests (
      id SERIAL PRIMARY KEY,
      finding_id VARCHAR(128) NOT NULL,
      scanner_run_id VARCHAR(128) NOT NULL,
      result VARCHAR(128) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const res = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('ai_explanations', 'ai_patches', 'ai_messages', 'retests');
  `);

  console.log('Verified tables in Neon database:', res.rows.map(r => r.table_name));
  await pool.end();
  console.log('Database initialization completed successfully!');
}

init().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

