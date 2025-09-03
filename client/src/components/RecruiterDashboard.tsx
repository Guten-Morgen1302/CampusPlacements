import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus,
  Search,
  Calendar,
  Download,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  Filter,
  Eye,
  MessageSquare,
  Video,
  CheckCircle,
  XCircle,
  Sparkles,
  Settings,
  Edit,
  Trash2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import type { User, Job, Application } from '@shared/schema';
import JobPostingForm from './JobPostingForm';
import ApplicationViewModal from './ApplicationViewModal';
import DriveEventManager from './DriveEventManager';
import ExportReports from './ExportReports';
import BoothManagement from './BoothManagement';

interface RecruiterDashboardProps {
  user: User;
}

interface CandidateApplication extends Application {
  studentName?: string;
  studentEmail?: string;
  matchPercentage?: number;
  skills?: string[];
  cgpa?: number;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    skills?: string[];
  };
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
  };
}

interface RecruitmentMetrics {
  totalApplications: number;
  interviewRate: number;
  hireRate: number;
  avgTimeToHire: number;
}

export default function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [aiRecommendationsEnabled, setAiRecommendationsEnabled] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch recruiter's jobs with immediate updates
  const { data: jobs = [], isLoading: isJobsLoading, error: jobsError } = useQuery<Job[]>({
    queryKey: ['/api/recruiter/jobs'],
    enabled: user.role === 'recruiter' || user.role === 'admin',
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: true, // Refetch when window gets focus
  });

  // Fetch recruitment metrics with faster loading
  const { data: metrics, isLoading: isMetricsLoading } = useQuery<RecruitmentMetrics>({
    queryKey: ['/api/recruiter/metrics'],
    enabled: user.role === 'recruiter' || user.role === 'admin',
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Fetch applications for the recruiter
  const { data: recruiterApplications = [], isLoading: isApplicationsLoading } = useQuery<CandidateApplication[]>({
    queryKey: ['/api/recruiter/applications'],
    enabled: user.role === 'recruiter' || user.role === 'admin',
    staleTime: 0, // Always fresh data for immediate UI updates
    refetchOnWindowFocus: true,
  });

  // Delete job mutation with optimistic updates
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 404) {
          // Job already deleted, treat as success
          return { message: "Job already deleted" };
        }
        throw new Error('Failed to delete job');
      }
      return response.json();
    },
    onMutate: async (jobId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/recruiter/jobs'] });
      
      // Snapshot the previous value
      const previousJobs = queryClient.getQueryData(['/api/recruiter/jobs']);
      
      // Optimistically update to remove the job
      queryClient.setQueryData(['/api/recruiter/jobs'], (old: Job[] | undefined) => {
        return old ? old.filter(job => job.id !== jobId) : [];
      });
      
      // Return a context object with the snapshotted value
      return { previousJobs };
    },
    onError: (err, jobId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousJobs) {
        queryClient.setQueryData(['/api/recruiter/jobs'], context.previousJobs);
      }
      toast({
        title: "Error",
        description: "Failed to delete job posting.",
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      toast({
        title: "Job Deleted",
        description: "Job posting has been successfully deleted.",
      });
      
      // Force hard refresh of all job-related caches
      await queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      await queryClient.refetchQueries({ queryKey: ['/api/recruiter/jobs'] });
    },
    onSettled: async () => {
      // Always do a hard refetch to ensure UI is in sync with database
      await queryClient.invalidateQueries({ queryKey: ['/api/recruiter/jobs'] });
      await queryClient.refetchQueries({ queryKey: ['/api/recruiter/jobs'] });
    }
  });

  // Handle job deletion
  const handleDeleteJob = (job: Job) => {
    console.log('Delete button clicked for job:', job.title, job.id);
    if (confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      console.log('User confirmed deletion, calling mutation...');
      deleteJobMutation.mutate(job.id);
    } else {
      console.log('User cancelled deletion');
    }
  };

  // Handle job editing
  const handleEditJob = (job: Job) => {
    console.log('Edit button clicked for job:', job.title, job.id);
    setEditingJob(job);
    setShowJobForm(true);
  };

  // Handle application viewing
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  // Group applications by status from real data
  console.log('=== RENDER: Current recruiterApplications data ===', recruiterApplications);
  console.log('=== RENDER: Applications loading state ===', isApplicationsLoading);
  
  const applicationsByStatus = recruiterApplications.reduce((acc, app) => {
    const status = app.status as keyof typeof acc;
    console.log(`Processing app ${app.id} with status: ${status}`);
    if (!acc[status]) acc[status] = [];
    acc[status].push(app);
    return acc;
  }, {
    applied: [] as CandidateApplication[],
    screening: [] as CandidateApplication[],
    interview: [] as CandidateApplication[],
    hired: [] as CandidateApplication[],
    rejected: [] as CandidateApplication[]
  });
  console.log('=== RENDER: Final applicationsByStatus ===', applicationsByStatus);

  // Legacy mock data structure for compatibility (will be replaced by real data)
  const legacyApplications = {
    applied: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        studentId: 'student1',
        jobId: 'job1',
        status: 'applied',
        coverLetter: 'I am excited to apply for this position...',
        resumeVersion: 'resume_v1.pdf',
        studentName: 'Arjun Sharma',
        studentEmail: 'arjun@example.com',
        matchPercentage: aiRecommendationsEnabled ? 95 : 85,
        skills: ['React', 'Node.js', 'TypeScript'],
        cgpa: 8.5,
        appliedAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        studentId: 'student2',
        jobId: 'job1',
        status: 'applied',
        coverLetter: 'Dear hiring manager...',
        resumeVersion: 'resume_v2.pdf',
        studentName: 'Priya Patel',
        studentEmail: 'priya@example.com',
        matchPercentage: aiRecommendationsEnabled ? 88 : 78,
        skills: ['Python', 'Django', 'AWS'],
        cgpa: 9.1,
        appliedAt: new Date(),
        updatedAt: new Date()
      }
    ],
    screening: [
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        studentId: 'student3',
        jobId: 'job1',
        status: 'screening',
        coverLetter: 'Looking forward to contributing...',
        resumeVersion: 'resume_v3.pdf',
        studentName: 'Rahul Kumar',
        studentEmail: 'rahul@example.com',
        matchPercentage: aiRecommendationsEnabled ? 92 : 82,
        skills: ['Java', 'Spring Boot', 'Microservices'],
        cgpa: 8.8,
        appliedAt: new Date(),
        updatedAt: new Date()
      }
    ],
    interview: [
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        studentId: 'student4',
        jobId: 'job1',
        status: 'interview',
        coverLetter: 'Passionate about design and development...',
        resumeVersion: 'resume_v4.pdf',
        studentName: 'Sneha Reddy',
        studentEmail: 'sneha@example.com',
        matchPercentage: aiRecommendationsEnabled ? 90 : 80,
        skills: ['UI/UX', 'Figma', 'React'],
        cgpa: 8.7,
        appliedAt: new Date(),
        updatedAt: new Date()
      }
    ],
    hired: [
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        studentId: 'student5',
        jobId: 'job1',
        status: 'hired',
        coverLetter: 'Experienced in DevOps practices...',
        resumeVersion: 'resume_v5.pdf',
        studentName: 'Vikash Singh',
        studentEmail: 'vikash@example.com',
        matchPercentage: aiRecommendationsEnabled ? 94 : 84,
        skills: ['DevOps', 'Docker', 'Kubernetes'],
        cgpa: 9.0,
        appliedAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PUT', `/api/applications/${id}/status`, { status });
      return await response.json();
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['/api/recruiter/applications'] });
      
      // Snapshot the previous value
      const previousApplications = queryClient.getQueryData(['/api/recruiter/applications']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['/api/recruiter/applications'], (old: CandidateApplication[] | undefined) => {
        if (!old) return old;
        return old.map(app => 
          app.id === id ? { ...app, status } : app
        );
      });
      
      console.log(`Optimistically updated application ${id} to status: ${status}`);
      
      // Return a context object with the snapshotted value
      return { previousApplications };
    },
    onSuccess: async (_, { status, id }) => {
      console.log(`Application ${id} status updated to ${status} - backend confirmed`);
      
      // Don't invalidate cache since optimistic update is already correct
      // Only invalidate metrics which don't affect the pipeline display
      await queryClient.invalidateQueries({ queryKey: ['/api/recruiter/metrics'] });
      
      toast({
        title: "Status Updated", 
        description: `Application moved to ${status}`,
      });
    },
    onError: (error, { id }, context) => {
      // Rollback optimistic update on error
      if (context?.previousApplications) {
        queryClient.setQueryData(['/api/recruiter/applications'], context.previousApplications);
      }
      
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Update Failed",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (jobsError && isUnauthorizedError(jobsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [jobsError, toast]);

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    console.log(`Updating candidate ${candidateId} to status: ${newStatus}`);
    console.log('Current applications before update:', recruiterApplications);
    // Use the API to update application status
    updateApplicationMutation.mutate({ id: candidateId, status: newStatus });
  };

  const skillsData = [
    { skill: 'React', demand: 'Hot 🔥', color: 'border-neon-cyan/30' },
    { skill: 'Python', demand: 'High', color: 'border-neon-purple/30' },
    { skill: 'AWS', demand: 'Rising', color: 'border-neon-green/30' },
    { skill: 'Docker', demand: 'Medium', color: 'border-neon-pink/30' },
    { skill: 'Node.js', demand: 'Stable', color: 'border-neon-blue/30' },
    { skill: 'Vue', demand: 'Low', color: 'border-border/20' }
  ];

  return (
    <section id="recruiter" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
            🎯 Recruiter Command Center
          </h2>
          <p className="text-xl text-muted-foreground">
            AI-powered talent acquisition dashboard with full feature suite
          </p>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
            <TabsTrigger value="jobs">Job Management</TabsTrigger>
            <TabsTrigger value="booth">Company Booth</TabsTrigger>
            <TabsTrigger value="events">Drive & Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-6">
            {/* AI Enhancement Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-orbitron font-bold text-2xl neon-text">
                🚀 Candidate Pipeline
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-neon-cyan" />
                  <span className="text-sm">AI Enhanced Matching</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiRecommendationsEnabled(!aiRecommendationsEnabled)}
                    className={`${aiRecommendationsEnabled ? 'border-neon-cyan text-neon-cyan' : ''}`}
                    data-testid="button-toggle-ai"
                  >
                    {aiRecommendationsEnabled ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {Object.entries(applicationsByStatus).map(([status, candidates], columnIndex) => {
                const statusConfig = {
                  applied: { color: 'neon-cyan', count: candidates.length },
                  screening: { color: 'neon-purple', count: candidates.length },
                  interview: { color: 'neon-green', count: candidates.length },
                  hired: { color: 'neon-pink', count: candidates.length },
                  rejected: { color: 'red-500', count: candidates.length }
                };

                return (
                  <motion.div 
                    key={status}
                    className="glass-card neon-border p-4 hover-lift min-h-[400px]"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-orbitron font-bold text-lg capitalize">
                        {status}
                      </h4>
                      <Badge 
                        className={`bg-${statusConfig[status as keyof typeof statusConfig]?.color || 'gray-500'}/20 text-${statusConfig[status as keyof typeof statusConfig]?.color || 'gray-500'}`}
                        data-testid={`count-${status}`}
                      >
                        {statusConfig[status as keyof typeof statusConfig]?.count || candidates.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {(candidates as CandidateApplication[]).map((candidate: CandidateApplication, index: number) => (
                        <motion.div 
                          key={candidate.id}
                          className="glass-card p-3 border border-border/20 hover:border-neon-cyan/30 transition-all duration-300 cursor-pointer group"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          data-testid={`candidate-card-${candidate.id}`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center text-xs font-bold text-black">
                              {candidate.student?.firstName?.charAt(0) || 'N'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-sm truncate" data-testid={`candidate-name-${candidate.id}`}>
                                {candidate.student?.firstName} {candidate.student?.lastName}
                              </h5>
                              <p className="text-xs text-muted-foreground truncate">
                                Applied: {new Date(candidate.appliedAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {candidate.student?.skills?.slice(0, 2).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(candidate.student?.skills?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(candidate.student?.skills?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-semibold ${
                              aiRecommendationsEnabled 
                                ? 'text-neon-cyan' 
                                : 'text-neon-green'
                            }`}>
                              {candidate.status.toUpperCase()}
                              {aiRecommendationsEnabled && (
                                <Sparkles className="inline h-3 w-3 ml-1" />
                              )}
                            </span>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0" 
                                data-testid={`button-view-${candidate.id}`}
                                onClick={() => handleViewApplication(candidate)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" data-testid={`button-chat-${candidate.id}`}>
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Quick action buttons */}
                          <div className="mt-3 flex space-x-2 text-xs">
                            {status === 'applied' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(candidate.id, 'screening')}
                                className="cyber-btn flex-1 text-xs py-1"
                                data-testid={`button-screen-${candidate.id}`}
                              >
                                Screen
                              </Button>
                            )}
                            {status === 'screening' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStatusChange(candidate.id, 'interview')}
                                  className="cyber-btn flex-1 text-xs py-1"
                                  data-testid={`button-interview-${candidate.id}`}
                                >
                                  Interview
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStatusChange(candidate.id, 'applied')}
                                  variant="outline"
                                  className="glass-card border-red-500/30 flex-1 text-xs py-1"
                                  data-testid={`button-reject-${candidate.id}`}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            {status === 'interview' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStatusChange(candidate.id, 'hired')}
                                  className="cyber-btn flex-1 text-xs py-1"
                                  data-testid={`button-hire-${candidate.id}`}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Hire
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="glass-card border-neon-purple/30 flex-1 text-xs py-1"
                                  data-testid={`button-schedule-${candidate.id}`}
                                >
                                  <Video className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-orbitron font-bold text-2xl neon-text">
                💼 Job Management
              </h3>
              <Button 
                onClick={() => setShowJobForm(true)}
                className="cyber-btn"
                data-testid="button-post-new-job"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>

            {/* Active Jobs List */}
            {isJobsLoading ? (
              <div className="flex justify-center py-8">
                <div className="dna-loader"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.length === 0 ? (
                  <Card className="glass-card neon-border col-span-full">
                    <CardContent className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start by posting your first job to attract talented candidates
                      </p>
                      <Button 
                        onClick={() => setShowJobForm(true)}
                        className="cyber-btn"
                      >
                        Post Your First Job
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  jobs.map((job: Job) => (
                    <Card key={job.id} className="glass-card neon-border hover-lift">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{job.title}</h4>
                            <p className="text-muted-foreground">{job.company}</p>
                          </div>
                          <Badge className={job.isActive ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20'}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Posted {new Date(job.createdAt || '').toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2 relative z-10">
                            <button 
                              type="button"
                              onClick={() => {
                                console.log('EDIT CLICKED - Job:', job.title);
                                handleEditJob(job);
                              }}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-colors flex items-center justify-center"
                              data-testid={`button-edit-job-${job.id}`}
                              disabled={deleteJobMutation.isPending}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                console.log('DELETE CLICKED - Job:', job.title);
                                handleDeleteJob(job);
                              }}
                              className="px-3 py-1 text-sm border border-red-300 rounded hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center disabled:opacity-50"
                              data-testid={`button-delete-job-${job.id}`}
                              disabled={deleteJobMutation.isPending}
                            >
                              {deleteJobMutation.isPending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="booth" className="space-y-6">
            <BoothManagement />
          </TabsContent>


          <TabsContent value="events" className="space-y-6">
            <DriveEventManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analytics Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card neon-border p-6 hover-lift">
                  <h3 className="font-orbitron font-bold text-xl mb-6 neon-text">
                    📊 Recruitment Analytics
                  </h3>
                  
                  {isMetricsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="dna-loader"></div>
                    </div>
                  ) : (
                    <>
                      {/* Metrics Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                          { label: 'Total Applications', value: metrics?.totalApplications || 156, testId: 'metric-applications' },
                          { label: 'Interview Rate', value: `${metrics?.interviewRate || 23}%`, testId: 'metric-interview-rate' },
                          { label: 'Hire Rate', value: `${metrics?.hireRate || 8}%`, testId: 'metric-hire-rate' },
                          { label: 'Days to Hire', value: metrics?.avgTimeToHire || 15, testId: 'metric-time-to-hire' }
                        ].map((metric, index) => (
                          <motion.div 
                            key={metric.label}
                            className="text-center glass-card p-4 border border-border/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className="text-2xl font-bold neon-text" data-testid={metric.testId}>
                              {metric.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {metric.label}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Skill Heatmap */}
                      <div>
                        <h4 className="font-orbitron font-bold text-lg mb-4 neon-text">
                          🔥 Skill Demand Heatmap
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {skillsData.map((item, index) => (
                            <motion.div 
                              key={item.skill}
                              className={`text-center p-3 glass-card border ${item.color}`}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.05 }}
                              data-testid={`skill-${item.skill.toLowerCase()}`}
                            >
                              <div className="text-sm font-semibold">{item.skill}</div>
                              <div className="text-xs text-neon-cyan">{item.demand}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </div>

              {/* Export Reports */}
              <div>
                <ExportReports />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Posting Form Modal */}
        {showJobForm && (
          <JobPostingForm 
            editingJob={editingJob}
            onClose={() => {
              setShowJobForm(false);
              setEditingJob(null);
            }}
            onSuccess={() => {
              setShowJobForm(false);
              setEditingJob(null);
              queryClient.invalidateQueries({ queryKey: ['/api/recruiter/jobs'] });
              queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
            }}
          />
        )}

        {/* Application View Modal */}
        {showApplicationModal && selectedApplication && (
          <ApplicationViewModal
            application={selectedApplication}
            isOpen={showApplicationModal}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedApplication(null);
            }}
          />
        )}
      </div>
    </section>
  );
}