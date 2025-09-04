import dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for localhost development
const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });