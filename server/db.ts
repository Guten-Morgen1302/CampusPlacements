import dotenv from 'dotenv';
dotenv.config();
import * as schema from "@shared/schema";
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Determine database type and connect accordingly
const dbUrl = process.env.DATABASE_URL;

let db: any;

if (dbUrl.startsWith('file:') || dbUrl.endsWith('.db')) {
  // SQLite database
  console.log('✅ Using SQLite database:', dbUrl);
  
  const sqliteFile = dbUrl.replace('file:', '');
  const sqlite = new Database(sqliteFile);
  sqlite.pragma('foreign_keys = ON');
  db = drizzleSqlite(sqlite, { schema });
} else {
  // PostgreSQL database
  console.log('✅ Using PostgreSQL database');
  
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' || dbUrl.includes('neon.tech') || dbUrl.includes('amazonaws.com') ? {
      rejectUnauthorized: false
    } : false,
  });
  
  db = drizzlePostgres(pool, { schema });
}

export { db };