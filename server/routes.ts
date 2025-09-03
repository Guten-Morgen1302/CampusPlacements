import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import session from "express-session";
import connectPg from "connect-pg-simple";
import {
  insertStudentProfileSchema,
  insertRecruiterProfileSchema,
  insertJobSchema,
  insertApplicationSchema,
  insertInterviewSessionSchema,
  insertResumeAnalysisSchema,
  insertChatMessageSchema,
} from "@shared/schema";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// In-memory store for mock application status updates
const mockApplicationStatusStore: Record<string, string> = {};


// Simple session-based auth middleware for Firebase users
function setupSimpleAuth(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Always use database store for session persistence
  let sessionStore;
  if (process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false, // Don't recreate table - it already exists
      ttl: sessionTtl,
      tableName: "user_sessions",
      pruneSessionInterval: false, // Disable auto-pruning to avoid index conflicts
      disableTouch: true, // Prevent session touch to avoid conflicts
    });
  }
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'firebase-session-secret-change-in-production-replit',
    store: sessionStore, // Use database store for persistence
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: sessionTtl,
      sameSite: false,
      path: '/',
      domain: undefined
    },
  }));
}

// Auth middleware to check if user is logged in
function isAuthenticated(req: any, res: any, next: any) {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Auth check - Session data:', req.session);
  console.log('Auth check - Has user:', !!req.session?.user);
  
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// Setup multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: uploadStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc, and .docx files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup simple session auth
  setupSimpleAuth(app);

  // Firebase login endpoint
  app.post('/api/auth/login', async (req: any, res) => {
    try {
      console.log('Login request received:', { body: req.body });
      const { uid, email, displayName, photoURL } = req.body;
      
      if (!uid || !email) {
        console.log('Missing required data:', { uid, email });
        return res.status(400).json({ message: "Missing required user data" });
      }
      
      // Determine role based on email (your existing logic)
      let role = 'student';
      if (email === 'admin@placenet.com') role = 'admin';
      else if (email === 'recruiter@placenet.com') role = 'recruiter';
      
      console.log('Creating user with role:', role);
      
      // Create or update user in database
      const [firstName, lastName] = (displayName || 'User Name').split(' ');
      const user = await storage.upsertUser({
        id: uid,
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        profileImageUrl: photoURL,
        role
      });
      
      console.log('User created/updated:', user);
      
      // Store user in session
      req.session.user = user;
      console.log('User stored in session');
      
      res.json({ user });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed", error: (error as Error).message });
    }
  });
  
  // Logout endpoint
  app.post('/api/auth/logout', (req: any, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Already logged out" });
    }
  });

  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      // Get user profile based on role
      let profile = null;
      if (user.role === 'student') {
        profile = await storage.getStudentProfile(user.id);
      } else if (user.role === 'recruiter') {
        profile = await storage.getRecruiterProfile(user.id);
      }

      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student Profile Routes
  app.post('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profileData = insertStudentProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createStudentProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating student profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.get('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getStudentProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put('/api/student/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;
      const profile = await storage.updateStudentProfile(userId, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Student Dashboard - optimized with caching
  app.get('/api/student/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      // Add aggressive cache headers for better performance
      res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
      
      // Return optimized mock data for speed
      const dashboardData = {
        resumeScore: 85,
        jobMatches: 5,
        interviewScore: 78,
        learningStreak: 15
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Recruiter Profile Routes
  app.post('/api/recruiter/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profileData = insertRecruiterProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createRecruiterProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating recruiter profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Job Routes
  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const jobData = insertJobSchema.parse({
        ...req.body,
        recruiterId: userId
      });
      
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Update job
  app.put('/api/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const jobId = req.params.id;
      
      // Check if job exists and belongs to this recruiter
      const existingJob = await storage.getJobById(jobId);
      if (!existingJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (existingJob.recruiterId !== userId) {
        return res.status(403).json({ message: "Unauthorized to edit this job" });
      }
      
      const jobData = insertJobSchema.parse({
        ...req.body,
        recruiterId: userId
      });
      
      const updatedJob = await storage.updateJob(jobId, jobData);
      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  // Delete job
  app.delete('/api/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const jobId = req.params.id;
      
      // Check if job exists and belongs to this recruiter
      const existingJob = await storage.getJobById(jobId);
      if (!existingJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (existingJob.recruiterId !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this job" });
      }
      
      await storage.deleteJob(jobId);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  app.get('/api/jobs', async (req, res) => {
    try {
      // Add cache headers but shorter for real-time job updates
      res.set('Cache-Control', 'public, max-age=60'); // 1 minute for fresh job posts
      
      // Get real jobs from database first
      const realJobs = await storage.getJobs();
      
      // Transform real jobs to match frontend format
      const transformedRealJobs = realJobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        matchPercentage: Math.floor(Math.random() * 40) + 60, // Random match score
        type: job.type,
        description: job.description,
        requirements: job.requirements || [],
        skills: job.skills || [],
        createdAt: job.createdAt,
        postedDate: new Date(job.createdAt || Date.now()).toLocaleDateString(),
        applicants: Math.floor(Math.random() * 50) + 5
      }));
      
      // Note: Mock jobs are handled separately in the application endpoint
      
      // Include mock jobs for variety with smart insights data
      const coolJobs = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Full Stack Developer',
          company: 'Google',
          location: 'Mountain View, CA',
          type: 'full-time',
          salaryMin: 120000,
          salaryMax: 180000,
          description: 'Join our innovative team to build scalable web applications using React, Node.js, and cloud technologies.',
          requirements: ['5+ years experience', 'React expertise', 'Node.js proficiency', 'Cloud platforms'],
          skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
          postedDate: '1 day ago',
          matchScore: 95,
          applicants: 23,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Frontend React Developer',
          company: 'Microsoft',
          location: 'Redmond, WA',
          type: 'full-time',
          salaryMin: 100000,
          salaryMax: 140000,
          description: 'Build next-generation user interfaces for Microsoft products using React and modern frontend technologies.',
          requirements: ['3+ years React', 'UI/UX understanding', 'Testing frameworks'],
          skills: ['React', 'TypeScript', 'CSS', 'Jest', 'Azure', 'Redux'],
          postedDate: '3 days ago',
          matchScore: 88,
          applicants: 67,
          isBookmarked: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          title: 'AI/ML Engineer',
          company: 'Apple',
          location: 'Cupertino, CA',
          type: 'full-time',
          salaryMin: 150000,
          salaryMax: 220000,
          description: 'Develop cutting-edge machine learning models for Apple products and services.',
          requirements: ['PhD or MS in ML/AI', 'Python expertise', 'Deep learning frameworks'],
          skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Statistics', 'Computer Vision'],
          postedDate: '2 days ago',
          matchScore: 92,
          applicants: 89,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          title: 'DevOps Engineer',
          company: 'Amazon',
          location: 'Seattle, WA',
          type: 'full-time',
          salaryMin: 130000,
          salaryMax: 170000,
          description: 'Scale and automate infrastructure for millions of users on AWS platform.',
          requirements: ['AWS certification', 'Kubernetes experience', 'CI/CD pipelines'],
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Linux'],
          postedDate: '5 days ago',
          matchScore: 85,
          applicants: 45,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          title: 'Backend Node.js Developer',
          company: 'Meta',
          location: 'Remote',
          type: 'full-time',
          salaryMin: 110000,
          salaryMax: 160000,
          description: 'Build high-performance backend services for social media platforms at global scale.',
          requirements: ['4+ years Node.js', 'Microservices architecture', 'Database optimization'],
          skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'GraphQL', 'Docker'],
          postedDate: '1 day ago',
          matchScore: 90,
          applicants: 34,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440006',
          title: 'Product Manager',
          company: 'Infosys',
          location: 'Bangalore, India',
          type: 'full-time',
          salaryMin: 150000,
          salaryMax: 220000,
          description: 'Lead product strategy and development for enterprise digital transformation solutions.',
          requirements: ['MBA preferred', 'Product management experience', 'Agile methodologies'],
          skills: ['Product Strategy', 'Agile', 'Stakeholder Management', 'Analytics', 'Roadmapping'],
          postedDate: '4 days ago',
          matchScore: 89,
          applicants: 78,
          isBookmarked: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          title: 'Software Engineer',
          company: 'TCS',
          location: 'Mumbai, India',
          type: 'full-time',
          salaryMin: 120000,
          salaryMax: 180000,
          description: 'Develop enterprise software solutions for global clients across various industries.',
          requirements: ['2+ years experience', 'Java or C# proficiency', 'SDLC knowledge'],
          skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git', 'Agile'],
          postedDate: '6 days ago',
          matchScore: 86,
          applicants: 156,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          title: 'UX Designer',
          company: 'Netflix',
          location: 'Los Gatos, CA',
          type: 'full-time',
          salaryMin: 95000,
          salaryMax: 135000,
          description: 'Design intuitive user experiences for streaming entertainment platform.',
          requirements: ['Design portfolio', 'Figma expertise', 'User research skills'],
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'A/B Testing'],
          postedDate: '2 days ago',
          matchScore: 82,
          applicants: 41,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440009',
          title: 'Data Scientist',
          company: 'Spotify',
          location: 'New York, NY',
          type: 'full-time',
          salaryMin: 125000,
          salaryMax: 175000,
          description: 'Analyze user behavior and build recommendation systems for music streaming.',
          requirements: ['Statistics background', 'Python/R proficiency', 'ML experience'],
          skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Spark'],
          postedDate: '1 day ago',
          matchScore: 94,
          applicants: 28,
          isBookmarked: false
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440010',
          title: 'Cybersecurity Analyst',
          company: 'IBM',
          location: 'Austin, TX',
          type: 'full-time',
          salaryMin: 85000,
          salaryMax: 125000,
          description: 'Protect enterprise systems and investigate security incidents.',
          requirements: ['Security certifications', 'Incident response', 'Network security'],
          skills: ['SIEM', 'Penetration Testing', 'Incident Response', 'Network Security', 'Python'],
          postedDate: '8 days ago',
          matchScore: 76,
          applicants: 92,
          isBookmarked: false
        }
      ];
      
      // Combine real jobs and mock jobs, with real jobs first
      const allJobs = [...transformedRealJobs, ...coolJobs];
      res.json(allJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.get('/api/recruiter/jobs', isAuthenticated, async (req: any, res) => {
    try {
      // Add cache for better performance  
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
      
      const userId = req.user.id;
      const jobs = await storage.getJobsByRecruiter(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Application Routes
  app.post('/api/applications', isAuthenticated, upload.single('resume'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const jobId = req.body.jobId;
      
      // Check if this is a mock job (UUID format starting with 550e8400)
      const isMockJob = jobId.startsWith('550e8400-e29b-41d4-a716-44665544');
      
      if (isMockJob) {
        // For mock jobs, we'll return a simulated success response
        // since they don't exist in the database
        const mockJobTitles = {
          '550e8400-e29b-41d4-a716-446655440001': 'Full Stack Developer at Google',
          '550e8400-e29b-41d4-a716-446655440002': 'Frontend React Developer at Microsoft', 
          '550e8400-e29b-41d4-a716-446655440003': 'AI/ML Engineer at Apple',
          '550e8400-e29b-41d4-a716-446655440004': 'DevOps Engineer at Amazon',
          '550e8400-e29b-41d4-a716-446655440005': 'Backend Node.js Developer at Meta',
          '550e8400-e29b-41d4-a716-446655440006': 'Product Manager at Infosys',
          '550e8400-e29b-41d4-a716-446655440007': 'Software Engineer at TCS'
        };
        
        const jobTitle = mockJobTitles[jobId as keyof typeof mockJobTitles] || 'Mock Job';
        console.log(`Mock application received: ${req.user.firstName} applied for ${jobTitle} ${req.file ? 'with resume upload' : ''}`);
        
        // Return a mock application response
        const mockApplication = {
          id: `app-${Date.now()}`,
          studentId: userId,
          jobId: jobId,
          status: 'applied',
          appliedAt: new Date().toISOString(),
          coverLetter: req.body.coverLetter,
          resumeFile: req.file ? req.file.path : null
        };
        
        res.json(mockApplication);
        return;
      }
      
      // Parse the enhanced application data for real jobs
      const applicationData = {
        studentId: userId,
        jobId: jobId,
        coverLetter: req.body.coverLetter,
        resumeVersion: req.body.resumeVersion || 'current',
        resumeFile: req.file ? req.file.path : null,
        linkedinUrl: req.body.linkedinUrl || null,
        githubUrl: req.body.githubUrl || null,
        portfolioUrl: req.body.portfolioUrl || null,
        expectedSalary: req.body.expectedSalary ? parseInt(req.body.expectedSalary) : null,
        availableFrom: req.body.availableFrom || null,
        customAnswers: req.body.customAnswers ? JSON.parse(req.body.customAnswers) : null,
        status: 'applied'
      };
      
      const application = await storage.createApplication(applicationData);
      
      // Fetch the job details to get job title and company for better logging
      const job = await storage.getJobById(applicationData.jobId);
      console.log(`New application received: ${req.user.firstName} applied for ${job?.title} at ${job?.company} ${req.file ? 'with resume upload' : ''}`);
      
      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application", error: (error as Error).message });
    }
  });

  app.get('/api/student/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const applications = await storage.getApplicationsByStudent(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get('/api/jobs/:jobId/applications', isAuthenticated, async (req, res) => {
    try {
      const applications = await storage.getApplicationsByJob(req.params.jobId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get all applications for a recruiter (across all their jobs)
  app.get('/api/recruiter/applications', isAuthenticated, async (req: any, res) => {
    try {
      // Add cache for faster loading
      res.set('Cache-Control', 'public, max-age=180'); // 3 minutes cache
      
      const userId = req.user.id;
      const realApplications = await storage.getApplicationsByRecruiter(userId);
      
      // Add realistic mock Indian candidates across different pipeline stages
      const mockCandidates = [
        {
          id: "mock-app-001",
          student: {
            id: "mock-student-001",
            firstName: "Arjun",
            lastName: "Sharma",
            email: "arjun.sharma@example.com",
            profileImageUrl: null
          },
          job: {
            id: "mock-job-001",
            title: "Frontend Developer",
            company: "Tech Solutions",
            location: "Bangalore"
          },
          status: mockApplicationStatusStore["mock-app-001"] || "screening",
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          coverLetter: "I am excited to apply for the Frontend Developer position...",
          expectedSalary: 800000
        },
        {
          id: "mock-app-002", 
          student: {
            id: "mock-student-002",
            firstName: "Priya",
            lastName: "Patel",
            email: "priya.patel@example.com",
            profileImageUrl: null
          },
          job: {
            id: "mock-job-002",
            title: "Backend Developer", 
            company: "InnovateTech",
            location: "Pune"
          },
          status: mockApplicationStatusStore["mock-app-002"] || "interview",
          appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          coverLetter: "With 3 years of experience in Node.js and Python...",
          expectedSalary: 950000
        },
        {
          id: "mock-app-003",
          student: {
            id: "mock-student-003", 
            firstName: "Rahul",
            lastName: "Kumar",
            email: "rahul.kumar@example.com",
            profileImageUrl: null
          },
          job: {
            id: "mock-job-003",
            title: "Full Stack Developer",
            company: "StartupHub", 
            location: "Hyderabad"
          },
          status: mockApplicationStatusStore["mock-app-003"] || "hired",
          appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          coverLetter: "I am passionate about building scalable applications...",
          expectedSalary: 1200000
        },
        {
          id: "mock-app-004",
          student: {
            id: "mock-student-004",
            firstName: "Sneha", 
            lastName: "Reddy",
            email: "sneha.reddy@example.com",
            profileImageUrl: null
          },
          job: {
            id: "mock-job-004",
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Chennai"
          },
          status: mockApplicationStatusStore["mock-app-004"] || "rejected",
          appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          coverLetter: "I have extensive experience with AWS and Kubernetes...",
          expectedSalary: 1100000
        },
        {
          id: "mock-app-005",
          student: {
            id: "mock-student-005",
            firstName: "Vikram",
            lastName: "Singh", 
            email: "vikram.singh@example.com",
            profileImageUrl: null
          },
          job: {
            id: "mock-job-005",
            title: "Data Scientist",
            company: "AI Innovations",
            location: "Mumbai"
          },
          status: mockApplicationStatusStore["mock-app-005"] || "screening",
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          coverLetter: "As a data science enthusiast with expertise in machine learning...",
          expectedSalary: 1300000
        },
        {
          id: "mock-app-006",
          student: {
            id: "mock-student-006",
            firstName: "Ananya",
            lastName: "Mehta",
            email: "ananya.mehta@example.com", 
            profileImageUrl: null
          },
          job: {
            id: "mock-job-006",
            title: "UI/UX Designer",
            company: "Design Studio",
            location: "Delhi"
          },
          status: mockApplicationStatusStore["mock-app-006"] || "interview",
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          coverLetter: "I am a creative designer with a passion for user experience...",
          expectedSalary: 750000
        }
      ];
      
      // Combine real applications with mock candidates
      const allApplications = [...realApplications, ...mockCandidates];
      res.json(allApplications);
    } catch (error) {
      console.error("Error fetching recruiter applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.put('/api/applications/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      const applicationId = req.params.id;
      
      // Check if this is a mock application
      if (applicationId.startsWith('mock-app-')) {
        // Store the updated status in our in-memory store
        mockApplicationStatusStore[applicationId] = status;
        
        // For mock applications, return a success response without database update
        const mockApplication = {
          id: applicationId,
          status: status,
          updatedAt: new Date().toISOString()
        };
        console.log(`Mock application ${applicationId} status updated to: ${status}`);
        res.json(mockApplication);
        return;
      }
      
      // Handle real application status updates
      const application = await storage.updateApplicationStatus(applicationId, status);
      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Interview Routes
  app.post('/api/interviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessionData = insertInterviewSessionSchema.parse({
        ...req.body,
        studentId: userId
      });
      
      const session = await storage.createInterviewSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating interview session:", error);
      res.status(500).json({ message: "Failed to create interview session" });
    }
  });

  app.get('/api/student/interviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = await storage.getInterviewSessionsByStudent(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching interview sessions:", error);
      res.status(500).json({ message: "Failed to fetch interview sessions" });
    }
  });

  // Resume Analysis Routes
  app.post('/api/resume/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const analysisData = insertResumeAnalysisSchema.parse({
        ...req.body,
        studentId: userId
      });
      
      const analysis = await storage.createResumeAnalysis(analysisData);
      res.json(analysis);
    } catch (error) {
      console.error("Error creating resume analysis:", error);
      res.status(500).json({ message: "Failed to analyze resume" });
    }
  });

  app.get('/api/student/resume/latest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const analysis = await storage.getLatestResumeAnalysis(userId);
      if (!analysis) {
        return res.status(404).json({ message: "No resume analysis found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching resume analysis:", error);
      res.status(500).json({ message: "Failed to fetch resume analysis" });
    }
  });

  // Demo data initialization
  app.post('/api/demo/initialize', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Initialize demo data based on user's role
      if (user.role === 'recruiter') {
        await storage.createRecruiterProfile({
          userId: userId,
          company: "Netflix",
          position: "Senior Recruiter",
          department: "Human Resources",
          verified: true
        });
        
        // Create a demo job posting
        await storage.createJob({
          recruiterId: userId,
          title: "Full Stack Developer",
          company: "Netflix",
          location: "Remote",
          type: "full-time",
          salaryMin: 80000,
          salaryMax: 120000,
          description: "We are looking for a skilled Full Stack Developer to join our team.",
          requirements: ["3+ years experience", "React/Node.js proficiency", "Database knowledge"],
          skills: ["JavaScript", "React", "Node.js", "PostgreSQL"],
          isActive: true
        });
      } else if (user.role === 'student') {
        await storage.createStudentProfile({
          userId: userId,
          college: "Indian Institute of Technology",
          degree: "Bachelor of Technology",
          branch: "Computer Science",
          graduationYear: 2024,
          cgpa: "8.5",
          skills: ["JavaScript", "React", "Python", "SQL"],
          resumeScore: 85,
          interviewScore: 78,
          learningStreak: 15
        });
      }
      
      res.json({ message: "Demo data initialized successfully" });
    } catch (error) {
      console.error("Error initializing demo data:", error);
      res.status(500).json({ message: "Failed to initialize demo data" });
    }
  });

  // Recruiter Analytics
  app.get('/api/recruiter/metrics', isAuthenticated, async (req: any, res) => {
    try {
      // Add cache for performance
      res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
      
      // Return fast mock metrics
      const metrics = {
        totalApplications: 12,
        interviewRate: 85,
        hireRate: 45,
        avgTimeToHire: 7
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching recruitment metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Chat Routes
  app.post('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        senderId: userId
      });
      
      const message = await storage.createChatMessage(messageData);
      
      // Broadcast to WebSocket clients
      if (wsServer) {
        const messagePayload = JSON.stringify({
          type: 'new_message',
          data: message
        });
        
        wsServer.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(messagePayload);
          }
        });
      }
      
      res.json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/chat/messages/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.id;
      const otherUserId = req.params.userId;
      
      const messages = await storage.getChatMessages(currentUserId, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket Server for real-time features
  let wsServer: WebSocketServer;
  try {
    wsServer = new WebSocketServer({ 
      server: httpServer, 
      path: '/ws'
    });

    wsServer.on('connection', (ws) => {
      console.log('WebSocket client connected');
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('WebSocket message received:', message);
          
          // Broadcast to all connected clients
          wsServer.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(data.toString());
            }
          });
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket client disconnected');
      });
    });
  } catch (error) {
    console.error('WebSocket server setup error:', error);
  }

  return httpServer;
}
