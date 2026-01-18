import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Mic, 
  Flame, 
  FileText,
  Zap,
  Brain,
  Video,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Trophy,
  Bell,
  Send
} from 'lucide-react';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';
import ApplicationModal from './ApplicationModal';

interface HeroDashboardProps {
  user: User;
}

interface DashboardData {
  resumeScore: number;
  jobMatches: number;
  interviewScore: number;
  learningStreak: number;
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  matchPercentage: number;
  type?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
  recruiterId?: string;
  isActive?: boolean;
}

export default function HeroDashboard({ user }: HeroDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [animatedScores, setAnimatedScores] = useState({
    resumeScore: 0,
    jobMatches: 0,
    interviewScore: 0,
    learningStreak: 0
  });
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingJobId, setSubmittingJobId] = useState<string | null>(null);

  // Fetch dashboard data with caching
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery<DashboardData>({
    queryKey: ['/api/student/dashboard'],
    enabled: user.role === 'student',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch job recommendations with caching
  const { data: jobs = [], isLoading: isJobsLoading } = useQuery<JobMatch[]>({
    queryKey: ['/api/jobs'],
    enabled: user.role === 'student',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Apply to job mutation
  const applyToJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          jobId: jobId,
          coverLetter: 'I am interested in this position and would like to apply.',
          resumeVersion: 'current'
        })
      });
      if (!response.ok) {
        throw new Error('Failed to apply to job');
      }
      return response.json();
    },
    onSuccess: (data, jobId) => {
      const job = jobs.find(j => j.id === jobId);
      toast({
        title: "Application Submitted!",
        description: `Your application for ${job?.title} has been submitted successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle applying to a job - Show the application modal
  const handleApplyToJob = (job: JobMatch) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  // Handle successful application submission - Show animation
  const handleApplicationSuccess = (job: any) => {
    console.log("HeroDashboard: handleApplicationSuccess called for job:", job?.title);
    setShowApplicationModal(false);
    setSelectedJob(null);
    setIsSubmitting(true);
    
    // Show submission animation
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
        duration: 3000,
      });
      
      // Refresh job data after successful application
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/student/dashboard'] });
    }, 3000);
  };

  // Handle unauthorized errors
  useEffect(() => {
    if (dashboardError && isUnauthorizedError(dashboardError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [dashboardError, toast]);

  // Optimized animation - simple and fast  
  useEffect(() => {
    if (dashboardData) {
      setAnimatedScores(dashboardData);
    }
  }, [dashboardData]);

  // Quick actions
  const quickActions = [
    {
      icon: Briefcase,
      label: 'Cover Letter Generator',
      action: () => setLocation('/student/cover-letter'),
      color: 'from-neon-cyan to-neon-blue'
    },
    {
      icon: TrendingUp,
      label: 'Job Recommendations', 
      action: () => setLocation('/student/jobs'),
      color: 'from-neon-purple to-neon-pink'
    },
    {
      icon: Video,
      label: 'Virtual Job Fair',
      action: () => setLocation('/student/job-fair'),
      color: 'from-neon-pink to-neon-purple'
    },
    {
      icon: BarChart3,
      label: 'Progress Tracking',
      action: () => setLocation('/student/progress'),
      color: 'from-neon-green to-neon-cyan'
    },
    {
      icon: Zap,
      label: 'Skill Gap Analyzer',
      action: () => setLocation('/student/skill-gap'),
      color: 'from-neon-cyan to-neon-blue'
    },
    {
      icon: Trophy,
      label: 'Hackathon Tracker',
      action: () => setLocation('/student/hackathons'), 
      color: 'from-neon-purple to-neon-pink'
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => setLocation('/student/notifications'),
      color: 'from-neon-pink to-neon-purple'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const generateCoverLetter = () => {
    toast({
      title: "AI Cover Letter Generator",
      description: "Feature coming soon! Stay tuned for AI-powered cover letters.",
    });
  };

  if (isDashboardLoading) {
    return (
      <section id="dashboard" className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        <div className="dna-loader"></div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div 
          className="text-center mb-12 floating"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
            Welcome back, <span className="neon-text glitch" data-testid="text-user-name">{user.firstName || 'Student'}</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">Your placement journey continues...</p>
        </motion.div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Resume Score Card */}
          <motion.div 
            className="glass-card neon-border p-6 card-3d floating hover-lift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="progress-ring w-24 h-24" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="var(--neon-cyan)" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (animatedScores.resumeScore / 100) * 251.2}
                    className="progress-ring-circle transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold neon-text" data-testid="score-resume">
                    {animatedScores.resumeScore}
                  </span>
                </div>
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-2">Resume Score</h3>
              <p className="text-sm text-muted-foreground">ATS Optimized</p>
            </div>
          </motion.div>

          {/* Job Matches Card */}
          <motion.div 
            className="glass-card neon-border p-6 card-3d floating hover-lift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
                <Briefcase className="text-2xl text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-2">Job Matches</h3>
              <p className="text-3xl font-bold neon-text mb-2" data-testid="count-job-matches">
                {animatedScores.jobMatches}
              </p>
              <p className="text-sm text-muted-foreground">New opportunities</p>
            </div>
          </motion.div>

          {/* Interview Practice Card */}
          <motion.div 
            className="glass-card neon-border p-6 card-3d floating hover-lift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center">
                <Mic className="text-2xl text-black" />
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-2">Interview Ready</h3>
              <p className="text-3xl font-bold neon-text mb-2" data-testid="score-interview">
                {animatedScores.interviewScore}%
              </p>
              <p className="text-sm text-muted-foreground">Confidence Level</p>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div 
            className="glass-card neon-border p-6 card-3d floating hover-lift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple flex items-center justify-center">
                <Flame className="text-2xl text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-2">Learning Streak</h3>
              <p className="text-3xl font-bold neon-text mb-2" data-testid="count-learning-streak">
                {animatedScores.learningStreak}
              </p>
              <p className="text-sm text-muted-foreground">Days active</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Job Recommendations */}
          <div className="lg:col-span-2 glass-card neon-border p-6 hover-lift">
            <h3 className="font-orbitron font-bold text-xl mb-6 neon-text">🔥 Hot Job Matches</h3>
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mx-auto"
                  >
                    <Send className="h-16 w-16 text-neon-cyan" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-neon-cyan">Submitting Your Application</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      📄 Processing resume and documents...
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      🔍 Analyzing skill compatibility...
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      ✉️ Sending to recruiter...
                    </motion.p>
                  </div>
                  <div className="w-64 mx-auto">
                    <Progress value={66} className="h-2" />
                  </div>
                </motion.div>
              </div>
            ) : isJobsLoading ? (
              <div className="flex justify-center py-8">
                <div className="dna-loader"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No job matches found. Complete your profile to get better recommendations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(jobs as JobMatch[]).slice(0, 3).map((job: JobMatch, index: number) => (
                  <motion.div 
                    key={job.id}
                    className="glass-card p-4 border border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    data-testid={`job-card-${job.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center">
                          <Briefcase className="text-white text-lg" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg" data-testid={`job-title-${job.id}`}>{job.title}</h4>
                          <p className="text-muted-foreground" data-testid={`job-details-${job.id}`}>
                            {job.company} • {job.location} • ₹{job.salaryMin}-{job.salaryMax} LPA
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-sm font-semibold">
                          {Math.floor(Math.random() * 20) + 80}% Match
                        </span>
                        <Button 
                          className="cyber-btn text-xs"
                          data-testid={`button-apply-${job.id}`}
                          onClick={() => handleApplyToJob(job)}
                          disabled={isSubmitting}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card neon-border p-6 hover-lift">
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">⚡ Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Button 
                      className="w-full cyber-btn justify-start"
                      onClick={action.action}
                      data-testid={`button-${action.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Skill Progress */}
            <div className="glass-card neon-border p-6 hover-lift">
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">🚀 Skill Progress</h3>
              <div className="space-y-4">
                {[
                  { skill: 'React.js', progress: 85, color: 'from-neon-cyan to-neon-blue' },
                  { skill: 'Python', progress: 78, color: 'from-neon-purple to-neon-pink' },
                  { skill: 'System Design', progress: 65, color: 'from-neon-green to-neon-cyan' }
                ].map((item, index) => (
                  <motion.div 
                    key={item.skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm" data-testid={`skill-${item.skill.toLowerCase().replace('.', '').replace(' ', '-')}`}>
                        {item.skill}
                      </span>
                      <span className="text-sm neon-text" data-testid={`progress-${item.skill.toLowerCase().replace('.', '').replace(' ', '-')}`}>
                        {item.progress}%
                      </span>
                    </div>
                    <Progress value={item.progress} className="h-2 bg-gray-700">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </Progress>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <ApplicationModal
          job={selectedJob as any}
          user={user}
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
          onSuccess={() => handleApplicationSuccess(selectedJob)}
        />
      )}
    </section>
  );
}
