import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Connecting to database...');
    
    // Drop all existing tables
    console.log('🗑️  Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS job_fair_participants CASCADE;
      DROP TABLE IF EXISTS user_achievements CASCADE;
      DROP TABLE IF EXISTS chat_messages CASCADE;
      DROP TABLE IF EXISTS resume_analyses CASCADE;
      DROP TABLE IF EXISTS interview_sessions CASCADE;
      DROP TABLE IF EXISTS applications CASCADE;
      DROP TABLE IF EXISTS job_fair_events CASCADE;
      DROP TABLE IF EXISTS jobs CASCADE;
      DROP TABLE IF EXISTS recruiter_profiles CASCADE;
      DROP TABLE IF EXISTS student_profiles CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ All tables dropped');
    
    // Create sessions table
    console.log('📋 Creating tables...');
    await client.query(`
      CREATE TABLE sessions (
        sid varchar PRIMARY KEY,
        sess jsonb NOT NULL,
        expire timestamp NOT NULL
      )
    `);
    
    await client.query(`
      CREATE INDEX IDX_session_expire ON sessions (expire)
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE users (
        id varchar PRIMARY KEY,
        email varchar UNIQUE,
        first_name varchar,
        last_name varchar,
        profile_image_url varchar,
        role varchar NOT NULL DEFAULT 'student',
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create student_profiles table
    await client.query(`
      CREATE TABLE student_profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL REFERENCES users(id),
        college varchar,
        degree varchar,
        branch varchar,
        graduation_year integer,
        cgpa decimal(3, 2),
        skills jsonb DEFAULT '[]'::jsonb,
        resume text,
        resume_score integer DEFAULT 0,
        interview_score integer DEFAULT 0,
        learning_streak integer DEFAULT 0,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create recruiter_profiles table
    await client.query(`
      CREATE TABLE recruiter_profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL REFERENCES users(id),
        company varchar NOT NULL,
        position varchar,
        department varchar,
        verified boolean DEFAULT false,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create jobs table
    await client.query(`
      CREATE TABLE jobs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        recruiter_id varchar NOT NULL REFERENCES users(id),
        title varchar NOT NULL,
        company varchar NOT NULL,
        location varchar,
        type varchar NOT NULL,
        salary_min bigint,
        salary_max bigint,
        description text,
        requirements jsonb DEFAULT '[]'::jsonb,
        skills jsonb DEFAULT '[]'::jsonb,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create applications table
    await client.query(`
      CREATE TABLE applications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id varchar NOT NULL REFERENCES users(id),
        job_id uuid NOT NULL REFERENCES jobs(id),
        status varchar NOT NULL DEFAULT 'applied',
        cover_letter text,
        resume_version text,
        resume_file text,
        linkedin_url text,
        github_url text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create interview_sessions table
    await client.query(`
      CREATE TABLE interview_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id varchar NOT NULL REFERENCES users(id),
        recruiter_id varchar NOT NULL REFERENCES users(id),
        job_id uuid NOT NULL REFERENCES jobs(id),
        status varchar NOT NULL DEFAULT 'scheduled',
        scheduled_at timestamp,
        duration_minutes integer,
        notes text,
        feedback text,
        score integer,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create resume_analyses table
    await client.query(`
      CREATE TABLE resume_analyses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id varchar NOT NULL REFERENCES users(id),
        score integer NOT NULL,
        strengths jsonb,
        improvements jsonb,
        suggestions jsonb,
        analysis_data jsonb,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create chat_messages table
    await client.query(`
      CREATE TABLE chat_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id varchar NOT NULL REFERENCES users(id),
        receiver_id varchar NOT NULL REFERENCES users(id),
        message text NOT NULL,
        read boolean DEFAULT false,
        created_at timestamp DEFAULT now()
      )
    `);
    
    // Create job_fair_events table
    await client.query(`
      CREATE TABLE job_fair_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        recruiter_id varchar NOT NULL REFERENCES users(id),
        title varchar NOT NULL,
        description text,
        start_time timestamp NOT NULL,
        end_time timestamp NOT NULL,
        location varchar,
        max_participants integer,
        current_participants integer DEFAULT 0,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `);
    
    // Create job_fair_participants table
    await client.query(`
      CREATE TABLE job_fair_participants (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id uuid NOT NULL REFERENCES job_fair_events(id),
        student_id varchar NOT NULL REFERENCES users(id),
        joined_at timestamp DEFAULT now(),
        created_at timestamp DEFAULT now()
      )
    `);
    
    // Create user_achievements table
    await client.query(`
      CREATE TABLE user_achievements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar NOT NULL REFERENCES users(id),
        achievement_type varchar NOT NULL,
        description varchar,
        earned_at timestamp DEFAULT now(),
        created_at timestamp DEFAULT now()
      )
    `);
    
    console.log('✅ All database tables created successfully in new database!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
