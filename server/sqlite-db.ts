import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'dev.db');

// Create or connect to SQLite database
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log(`✅ Connected to SQLite database at ${dbPath}`);

// Initialize tables if they don't exist
export function initializeDatabase() {
  try {
    // Sessions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions(expire);
    `);

    // Users table
    db.exec(`
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

    // Student profiles
    db.exec(`
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

    // Recruiter profiles
    db.exec(`
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

    // Jobs table
    db.exec(`
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

    // Applications table
    db.exec(`
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

    // Interview sessions
    db.exec(`
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

    // Resume analyses
    db.exec(`
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

    // Chat messages
    db.exec(`
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

    // Job fair events
    db.exec(`
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

    // Job fair participants
    db.exec(`
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

    // User achievements
    db.exec(`
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

    console.log('✅ All database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export default db;
