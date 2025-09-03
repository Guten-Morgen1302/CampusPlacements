import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  uuid,
  bigint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("student"), // student, recruiter, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student profiles
export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  college: varchar("college"),
  degree: varchar("degree"),
  branch: varchar("branch"),
  graduationYear: integer("graduation_year"),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  skills: jsonb("skills").$type<string[]>().default([]),
  resume: text("resume"), // File path or URL
  resumeScore: integer("resume_score").default(0),
  interviewScore: integer("interview_score").default(0),
  learningStreak: integer("learning_streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recruiter profiles
export const recruiterProfiles = pgTable("recruiter_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  company: varchar("company").notNull(),
  position: varchar("position"),
  department: varchar("department"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job postings
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  recruiterId: varchar("recruiter_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location"),
  type: varchar("type").notNull(), // full-time, part-time, internship
  salaryMin: bigint("salary_min", { mode: "number" }),
  salaryMax: bigint("salary_max", { mode: "number" }),
  description: text("description"),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  skills: jsonb("skills").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job applications
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  jobId: uuid("job_id").notNull().references(() => jobs.id),
  status: varchar("status").notNull().default("applied"), // applied, screening, interview, hired, rejected
  coverLetter: text("cover_letter"),
  resumeVersion: text("resume_version"),
  resumeFile: text("resume_file"), // Path to uploaded resume file
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  portfolioUrl: text("portfolio_url"),
  expectedSalary: bigint("expected_salary", { mode: "number" }),
  availableFrom: varchar("available_from"),
  customAnswers: jsonb("custom_answers").$type<Record<string, string>>(),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interview sessions
export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // mock, real
  jobId: uuid("job_id").references(() => jobs.id),
  questions: jsonb("questions").$type<Array<{question: string, answer: string, score: number}>>().default([]),
  overallScore: integer("overall_score"),
  confidenceScore: integer("confidence_score"),
  clarityScore: integer("clarity_score"),
  paceScore: integer("pace_score"),
  feedback: text("feedback"),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume analyses
export const resumeAnalyses = pgTable("resume_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  resumeVersion: text("resume_version").notNull(),
  overallScore: integer("overall_score"),
  keywordScore: integer("keyword_score"),
  formatScore: integer("format_score"),
  skillsCoverage: integer("skills_coverage"),
  suggestions: jsonb("suggestions").$type<string[]>().default([]),
  missingSkills: jsonb("missing_skills").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Virtual job fair events
export const jobFairEvents = pgTable("job_fair_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job fair participants
export const jobFairParticipants = pgTable("job_fair_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => jobFairEvents.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull(), // student, recruiter
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Chat messages for real-time communication
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").references(() => users.id),
  eventId: uuid("event_id").references(() => jobFairEvents.id),
  message: text("message").notNull(),
  type: varchar("type").notNull().default("text"), // text, file, system
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements and gamification
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // badge, streak, milestone
  title: varchar("title").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  recruiterProfile: one(recruiterProfiles, {
    fields: [users.id],
    references: [recruiterProfiles.userId],
  }),
  jobs: many(jobs),
  applications: many(applications),
  interviewSessions: many(interviewSessions),
  resumeAnalyses: many(resumeAnalyses),
  achievements: many(userAchievements),
  sentMessages: many(chatMessages, { relationName: "sender" }),
  receivedMessages: many(chatMessages, { relationName: "receiver" }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  recruiter: one(users, {
    fields: [jobs.recruiterId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  student: one(users, {
    fields: [applications.studentId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecruiterProfileSchema = createInsertSchema(recruiterProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  updatedAt: true,
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions).omit({
  id: true,
  createdAt: true,
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type RecruiterProfile = typeof recruiterProfiles.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InterviewSession = typeof interviewSessions.$inferSelect;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type JobFairEvent = typeof jobFairEvents.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type InsertRecruiterProfile = z.infer<typeof insertRecruiterProfileSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
