import {
  users,
  studentProfiles,
  recruiterProfiles,
  jobs,
  applications,
  interviewSessions,
  resumeAnalyses,
  jobFairEvents,
  chatMessages,
  userAchievements,
  type User,
  type UpsertUser,
  type StudentProfile,
  type RecruiterProfile,
  type Job,
  type Application,
  type InterviewSession,
  type ResumeAnalysis,
  type JobFairEvent,
  type ChatMessage,
  type UserAchievement,
  type InsertStudentProfile,
  type InsertRecruiterProfile,
  type InsertJob,
  type InsertApplication,
  type InsertInterviewSession,
  type InsertResumeAnalysis,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, count, avg, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  setUserRole(id: string, role: string): Promise<User>;
  
  // Student operations
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  updateStudentProfile(userId: string, updates: Partial<InsertStudentProfile>): Promise<StudentProfile>;
  
  // Recruiter operations
  createRecruiterProfile(profile: InsertRecruiterProfile): Promise<RecruiterProfile>;
  getRecruiterProfile(userId: string): Promise<RecruiterProfile | undefined>;
  
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJobs(filters?: { company?: string; location?: string; skills?: string[] }): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  getJobsByRecruiter(recruiterId: string): Promise<Job[]>;
  updateJob(id: string, job: InsertJob): Promise<Job>;
  deleteJob(id: string): Promise<void>;
  
  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByStudent(studentId: string): Promise<Application[]>;
  getApplicationsByJob(jobId: string): Promise<Application[]>;
  getApplicationsByRecruiter(recruiterId: string): Promise<Application[]>;
  updateApplicationStatus(id: string, status: string): Promise<Application>;
  
  // Interview operations
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSessionsByStudent(studentId: string): Promise<InterviewSession[]>;
  
  // Resume analysis operations
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  getLatestResumeAnalysis(studentId: string): Promise<ResumeAnalysis | undefined>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(senderId: string, receiverId: string): Promise<ChatMessage[]>;
  
  // Analytics operations
  getRecruitmentMetrics(recruiterId: string): Promise<{
    totalApplications: number;
    interviewRate: number;
    hireRate: number;
    avgTimeToHire: number;
  }>;
  
  getStudentDashboardData(studentId: string): Promise<{
    resumeScore: number;
    jobMatches: number;
    interviewScore: number;
    learningStreak: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // First try to insert
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error: any) {
      // If email already exists, find and return the existing user
      if (error.code === '23505' && error.constraint === 'users_email_unique') {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, userData.email!));
        
        if (existingUser) {
          // Update the existing user with new data
          const [updatedUser] = await db
            .update(users)
            .set({
              firstName: userData.firstName,
              lastName: userData.lastName,
              profileImageUrl: userData.profileImageUrl,
              updatedAt: new Date(),
            })
            .where(eq(users.email, userData.email!))
            .returning();
          return updatedUser;
        }
      }
      throw error;
    }
  }

  async setUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const [studentProfile] = await db
      .insert(studentProfiles)
      .values(profile as any)
      .returning();
    return studentProfile;
  }

  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async updateStudentProfile(userId: string, updates: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const updateData = { ...updates, updatedAt: new Date() } as any;
    const [profile] = await db
      .update(studentProfiles)
      .set(updateData)
      .where(eq(studentProfiles.userId, userId))
      .returning();
    return profile;
  }

  async createRecruiterProfile(profile: InsertRecruiterProfile): Promise<RecruiterProfile> {
    const [recruiterProfile] = await db
      .insert(recruiterProfiles)
      .values([profile])
      .returning();
    return recruiterProfile;
  }

  async getRecruiterProfile(userId: string): Promise<RecruiterProfile | undefined> {
    const [profile] = await db
      .select()
      .from(recruiterProfiles)
      .where(eq(recruiterProfiles.userId, userId));
    return profile;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db
      .insert(jobs)
      .values(job as any)
      .returning();
    return newJob;
  }

  async getJobs(filters?: { company?: string; location?: string; skills?: string[] }): Promise<Job[]> {
    let baseQuery = db.select().from(jobs);
    let conditions = [eq(jobs.isActive, true)];
    
    if (filters?.company) {
      conditions.push(like(jobs.company, `%${filters.company}%`));
    }
    
    const query = baseQuery.where(and(...conditions));
    return await query.orderBy(desc(jobs.createdAt));
  }

  async getJobById(id: string): Promise<Job | undefined> {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id));
    return job;
  }

  async getJobsByRecruiter(recruiterId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.recruiterId, recruiterId))
      .orderBy(desc(jobs.createdAt));
  }

  async updateJob(id: string, jobData: InsertJob): Promise<Job> {
    const updateData = { ...jobData, updatedAt: new Date() } as any;
    const [updatedJob] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: string): Promise<void> {
    // First delete any applications for this job
    await db
      .delete(applications)
      .where(eq(applications.jobId, id));
    
    // Then delete the job itself
    await db
      .delete(jobs)
      .where(eq(jobs.id, id));
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application as any)
      .returning();
    return newApplication;
  }

  async getApplicationsByStudent(studentId: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.studentId, studentId))
      .orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByRecruiter(recruiterId: string): Promise<any[]> {
    // Return applications with student and job data for better UI experience
    const applicationData = await db
      .select({
        id: applications.id,
        studentId: applications.studentId,
        jobId: applications.jobId,
        status: applications.status,
        coverLetter: applications.coverLetter,
        resumeFile: applications.resumeFile,
        linkedinUrl: applications.linkedinUrl,
        githubUrl: applications.githubUrl,
        portfolioUrl: applications.portfolioUrl,
        expectedSalary: applications.expectedSalary,
        availableFrom: applications.availableFrom,
        customAnswers: applications.customAnswers,
        appliedAt: applications.appliedAt,
        updatedAt: applications.updatedAt,
        student: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          skills: studentProfiles.skills
        },
        job: {
          id: jobs.id,
          title: jobs.title,
          company: jobs.company,
          location: jobs.location
        }
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(users, eq(applications.studentId, users.id))
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .where(eq(jobs.recruiterId, recruiterId))
      .orderBy(desc(applications.appliedAt));
    
    return applicationData;
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession> {
    const [newSession] = await db
      .insert(interviewSessions)
      .values(session as any)
      .returning();
    return newSession;
  }

  async getInterviewSessionsByStudent(studentId: string): Promise<InterviewSession[]> {
    return await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.studentId, studentId))
      .orderBy(desc(interviewSessions.createdAt));
  }

  async createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const [newAnalysis] = await db
      .insert(resumeAnalyses)
      .values(analysis as any)
      .returning();
    return newAnalysis;
  }

  async getLatestResumeAnalysis(studentId: string): Promise<ResumeAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(resumeAnalyses)
      .where(eq(resumeAnalyses.studentId, studentId))
      .orderBy(desc(resumeAnalyses.createdAt))
      .limit(1);
    return analysis;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getChatMessages(senderId: string, receiverId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(
        or(
          and(eq(chatMessages.senderId, senderId), eq(chatMessages.receiverId, receiverId)),
          and(eq(chatMessages.senderId, receiverId), eq(chatMessages.receiverId, senderId))
        )
      )
      .orderBy(chatMessages.createdAt);
  }

  async getRecruitmentMetrics(recruiterId: string): Promise<{
    totalApplications: number;
    interviewRate: number;
    hireRate: number;
    avgTimeToHire: number;
  }> {
    const recruiterJobs = await this.getJobsByRecruiter(recruiterId);
    const jobIds = recruiterJobs.map(job => job.id);
    
    if (jobIds.length === 0) {
      return { totalApplications: 0, interviewRate: 0, hireRate: 0, avgTimeToHire: 0 };
    }

    const totalApplications = await db
      .select({ count: count() })
      .from(applications)
      .where(sql`${applications.jobId} = ANY(${jobIds})`);

    const interviewApplications = await db
      .select({ count: count() })
      .from(applications)
      .where(
        and(
          sql`${applications.jobId} = ANY(${jobIds})`,
          eq(applications.status, 'interview')
        )
      );

    const hiredApplications = await db
      .select({ count: count() })
      .from(applications)
      .where(
        and(
          sql`${applications.jobId} = ANY(${jobIds})`,
          eq(applications.status, 'hired')
        )
      );

    const total = totalApplications[0]?.count || 0;
    const interviews = interviewApplications[0]?.count || 0;
    const hired = hiredApplications[0]?.count || 0;

    return {
      totalApplications: total,
      interviewRate: total > 0 ? (interviews / total) * 100 : 0,
      hireRate: total > 0 ? (hired / total) * 100 : 0,
      avgTimeToHire: 15, // Placeholder calculation
    };
  }

  async getStudentDashboardData(studentId: string): Promise<{
    resumeScore: number;
    jobMatches: number;
    interviewScore: number;
    learningStreak: number;
  }> {
    const [latestResume, studentProfile, recentInterviews] = await Promise.all([
      this.getLatestResumeAnalysis(studentId),
      this.getStudentProfile(studentId),
      this.getInterviewSessionsByStudent(studentId)
    ]);

    const avgInterviewScore = recentInterviews.length > 0
      ? recentInterviews.reduce((sum, session) => sum + (session.overallScore || 0), 0) / recentInterviews.length
      : 0;

    // Calculate job matches based on student skills
    const allJobs = await this.getJobs();
    const studentSkills = studentProfile?.skills || [];
    const jobMatches = allJobs.filter(job => {
      const jobSkills = job.skills || [];
      return jobSkills.some(skill => studentSkills.includes(skill));
    }).length;

    return {
      resumeScore: latestResume?.overallScore || 0,
      jobMatches,
      interviewScore: Math.round(avgInterviewScore),
      learningStreak: studentProfile?.learningStreak || 0,
    };
  }
}

export const storage = new DatabaseStorage();
