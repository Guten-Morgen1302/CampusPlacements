import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@shared/schema';
import path from 'path';

const dbPath = './dev.db';

console.log('🔧 Initializing SQLite database...');

// Create or open database
const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite, { schema });

try {
  // Create all tables from schema
  console.log('📝 Creating tables from Drizzle schema...');
  
  // Create tables using raw sqlite commands
  console.log('ℹ️  Creating tables...');
  
  // Create users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      first_name TEXT,
      last_name TEXT,
      profile_image_url TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Create student_profiles table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS student_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      college TEXT,
      degree TEXT,
      branch TEXT,
      graduation_year INTEGER,
      cgpa REAL,
      skills TEXT,
      resume TEXT,
      resume_score INTEGER DEFAULT 0,
      interview_score INTEGER DEFAULT 0,
      learning_streak INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  
  // Create recruiter_profiles table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS recruiter_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      company TEXT NOT NULL,
      position TEXT,
      department TEXT,
      verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  
  // Create jobs table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      recruiter_id TEXT NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      type TEXT NOT NULL,
      salary_min INTEGER,
      salary_max INTEGER,
      description TEXT,
      requirements TEXT,
      skills TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(recruiter_id) REFERENCES users(id)
    );
  `);
  
  // Create applications table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      job_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'applied',
      cover_letter TEXT,
      resume_version TEXT,
      resume_file TEXT,
      linkedin_url TEXT,
      github_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );
  `);
  
  // Create interview_sessions table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS interview_sessions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      recruiter_id TEXT NOT NULL,
      job_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      scheduled_at DATETIME,
      duration_minutes INTEGER,
      notes TEXT,
      feedback TEXT,
      score INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(recruiter_id) REFERENCES users(id),
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );
  `);
  
  // Create resume_analyses table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS resume_analyses (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      strengths TEXT,
      improvements TEXT,
      suggestions TEXT,
      analysis_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES users(id)
    );
  `);
  
  // Create chat_messages table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id)
    );
  `);
  
  // Create job_fair_events table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS job_fair_events (
      id TEXT PRIMARY KEY,
      recruiter_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      location TEXT,
      max_participants INTEGER,
      current_participants INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(recruiter_id) REFERENCES users(id)
    );
  `);
  
  // Create job_fair_participants table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS job_fair_participants (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(event_id) REFERENCES job_fair_events(id),
      FOREIGN KEY(student_id) REFERENCES users(id)
    );
  `);
  
  // Create user_achievements table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      achievement_type TEXT NOT NULL,
      description TEXT,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  
  // Create sessions table for express-session
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expire INTEGER NOT NULL
    );
  `);
  
  console.log('✅ All tables created successfully');

  console.log('✅ SQLite database initialized successfully at', dbPath);
  sqlite.close();
  process.exit(0);
} catch (error) {
  console.error('❌ Error initializing database:', error);
  sqlite.close();
  process.exit(1);
}
