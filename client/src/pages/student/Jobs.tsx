import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import JobApplicationModal from "@/components/JobApplicationModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign,
  Users,
  Heart,
  ExternalLink,
  Filter,
  TrendingUp,
  Target,
  Sparkles,
  Briefcase,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type JobType = "full-time" | "part-time" | "internship" | "contract";
type SortBy = "relevance" | "date" | "salary" | "company";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  matchScore?: number;
  isBookmarked?: boolean;
  applicants?: number;
}

// Mock job data with AI matching scores
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Google Inc.",
    location: "Mountain View, CA",
    type: "full-time",
    salaryMin: 120000,
    salaryMax: 180000,
    description: "We're looking for a passionate Senior Software Engineer to join our growing team. You'll work on cutting-edge technology and help build scalable applications that serve millions of users.",
    requirements: ["5+ years experience", "React/Node.js expertise", "System design knowledge"],
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    postedDate: "2 days ago",
    matchScore: 95,
    isBookmarked: false,
    applicants: 45
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "Microsoft",
    location: "Remote",
    type: "full-time",
    salaryMin: 80000,
    salaryMax: 120000,
    description: "Join our innovative startup and help build the next generation of web applications. We value creativity, collaboration, and continuous learning.",
    requirements: ["3+ years React experience", "UI/UX design skills", "Agile methodology"],
    skills: ["React", "JavaScript", "CSS", "Figma", "Git"],
    postedDate: "1 week ago",
    matchScore: 88,
    isBookmarked: true,
    applicants: 23
  },
  {
    id: "3",
    title: "Software Engineering Intern",
    company: "Apple Inc.",
    location: "Cupertino, CA",
    type: "internship",
    salaryMin: 6000,
    salaryMax: 8000,
    description: "Summer internship program for students passionate about technology. Work on real projects with mentorship from senior engineers.",
    requirements: ["Computer Science student", "Programming experience", "Problem-solving skills"],
    skills: ["Python", "Java", "Data Structures", "Algorithms"],
    postedDate: "3 days ago",
    matchScore: 82,
    isBookmarked: false,
    applicants: 156
  },
  {
    id: "4",
    title: "Full Stack Developer",
    company: "Amazon",
    location: "Seattle, WA",
    type: "full-time",
    salaryMin: 90000,
    salaryMax: 140000,
    description: "Build end-to-end solutions in a fast-paced environment. Work with modern technologies and contribute to products used by thousands of customers.",
    requirements: ["4+ years full-stack experience", "Database design", "API development"],
    skills: ["React", "Node.js", "MongoDB", "Express", "Docker"],
    postedDate: "5 days ago",
    matchScore: 91,
    isBookmarked: false,
    applicants: 67
  },
  {
    id: "5",
    title: "Machine Learning Engineer",
    company: "Meta AI",
    location: "Menlo Park, CA",
    type: "full-time",
    salaryMin: 130000,
    salaryMax: 200000,
    description: "Join our AI team to develop cutting-edge machine learning models. Work on challenging problems in computer vision and natural language processing.",
    requirements: ["ML/AI expertise", "Python proficiency", "Research experience"],
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas"],
    postedDate: "1 day ago",
    matchScore: 75,
    isBookmarked: false,
    applicants: 89
  },
  {
    id: "6",
    title: "Software Development Engineer",
    company: "Infosys",
    location: "Bangalore, India",
    type: "full-time",
    salaryMin: 800000,
    salaryMax: 1200000,
    description: "Join our global delivery team and work on innovative solutions for Fortune 500 clients. Great opportunity for fresh graduates.",
    requirements: ["Computer Science degree", "Strong programming skills", "Team collaboration"],
    skills: ["Java", "Spring Boot", "React", "MySQL", "Agile"],
    postedDate: "4 days ago",
    matchScore: 87,
    isBookmarked: false,
    applicants: 234
  },
  {
    id: "7",
    title: "Data Scientist",
    company: "Tata Consultancy Services",
    location: "Mumbai, India",
    type: "full-time",
    salaryMin: 900000,
    salaryMax: 1500000,
    description: "Work on cutting-edge AI/ML projects for global clients. Be part of our digital transformation initiatives.",
    requirements: ["Masters in Data Science", "Python expertise", "Statistical modeling"],
    skills: ["Python", "R", "TensorFlow", "SQL", "Tableau"],
    postedDate: "6 days ago",
    matchScore: 79,
    isBookmarked: true,
    applicants: 156
  }
];

// Job Card Component
function JobCard({ job, onApply, onBookmark, formatSalary, getMatchScoreColor }: { 
  job: Job; 
  onApply: (job: Job) => void; 
  onBookmark: (jobId: string) => void;
  formatSalary: (min?: number, max?: number) => string;
  getMatchScoreColor: (score?: number) => string;
}) {
  return (
    <Card className="glass-card hover:border-neon-cyan/30 transition-all duration-300" data-testid={`job-card-${job.id}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
            <p className="text-muted-foreground">{job.company} • {job.location}</p>
          </div>
          <div className="text-right">
            {job.matchScore && (
              <div className="text-2xl font-bold text-neon-cyan mb-1">
                {job.matchScore}%
              </div>
            )}
            <Badge variant="secondary">{job.type}</Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Posted {job.postedDate} • {job.applicants} applicants
          </div>
          <Button 
            onClick={() => onApply(job)} 
            className="bg-neon-cyan hover:bg-neon-cyan/80"
            data-testid={`button-apply-${job.id}`}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Jobs() {
  // Always call all hooks in the same order
  const { user, isAuthenticated, isLoading } = useAuth();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<JobType | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Fetch jobs using React Query
  const { data: jobs = mockJobs, isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: async () => {
      console.log('Fetching jobs with React Query...');
      const response = await fetch('/api/jobs', {
        headers: {
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });
      
      console.log('Jobs API response:', response.status, response.ok);
      
      if (!response.ok) {
        console.log('API response not ok, using mock data');
        return mockJobs;
      }
      
      const jobsData = await response.json();
      console.log('Jobs data received:', jobsData.length, 'jobs');
      const transformedJobs = jobsData.map((job: any) => ({
        ...job,
        requirements: job.requirements || [],
        skills: job.skills || [],
        matchScore: job.matchPercentage || Math.floor(Math.random() * 40) + 60,
        postedDate: job.postedDate || new Date(job.createdAt || Date.now()).toLocaleDateString(),
        applicants: job.applicants || Math.floor(Math.random() * 200) + 10,
        isBookmarked: false
      }));
      console.log('Jobs state updated with API data');
      return transformedJobs;
    },
    staleTime: 0, // Always fresh data
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });


  // Filter and sort jobs
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          return (b.matchScore || 0) - (a.matchScore || 0);
        case "date":
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case "salary":
          return (b.salaryMax || 0) - (a.salaryMax || 0);
        case "company":
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, typeFilter, sortBy]);

  // Utility functions
  const handleBookmark = useCallback((jobId: string) => {
    setFilteredJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
    toast({
      title: "Bookmark Updated",
      description: "Job bookmark status updated.",
    });
  }, []);

  const handleApply = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  }, []);

  const formatSalary = useCallback((min?: number, max?: number) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max) {
      if (min < 20000) {
        return `$${min.toLocaleString()} - $${max.toLocaleString()}/month`;
      }
      return `$${min.toLocaleString()} - $${max.toLocaleString()}/year`;
    }
    if (min) return `$${min.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  }, []);

  const getMatchScoreColor = useCallback((score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-neon-green";
    if (score >= 80) return "text-neon-cyan";
    if (score >= 70) return "text-neon-purple";
    return "text-neon-pink";
  }, []);

  // Determine if we should show content
  const shouldShowContent = useMemo(() => {
    if (!isAuthenticated || !user) {
      console.log('Not authenticated - showing mock data');
      return true; // Allow loading mock data if not authenticated
    }
    return user.role === 'student';
  }, [isAuthenticated, user]);

  // Loading state
  if (isLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dna-loader"></div>
      </div>
    );
  }

  // Non-student users
  if (!shouldShowContent) {
    return null;
  }

  return (
    <div className="min-h-screen relative" data-testid="jobs-page">
      <Navigation user={user ? {
        ...user,
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role
      } : {
        id: 'demo-user',
        email: 'demo@student.com',
        firstName: 'Demo',
        lastName: 'Student',
        role: 'student' as const
      }} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
              Job Recommendations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered job matching using hybrid recommendation system with 
              Matrix Factorization and Sentence-BERT embeddings.
            </p>
          </div>

          {/* Filters */}
          <Card className="glass-card mb-8" data-testid="filters-section">
            <CardHeader>
              <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                <Filter className="h-6 w-6 mr-2" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, companies, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10"
                    data-testid="input-location"
                  />
                </div>

                <Select value={typeFilter} onValueChange={(value: JobType | "all") => setTypeFilter(value)} data-testid="select-job-type">
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)} data-testid="select-sort">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Match Score
                      </div>
                    </SelectItem>
                    <SelectItem value="date">Most Recent</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                    <SelectItem value="company">Company A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">
                {filteredJobs.length} Jobs Found
              </h2>
              {sortBy === "relevance" && (
                <Badge variant="secondary" className="text-neon-cyan">
                  <Target className="h-3 w-3 mr-1" />
                  AI Matched
                </Badge>
              )}
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onBookmark={handleBookmark}
                formatSalary={formatSalary}
                getMatchScoreColor={getMatchScoreColor}
              />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No jobs found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setTypeFilter("all");
                }} 
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}