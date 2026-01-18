import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users,
  Search,
  Eye,
  MessageSquare,
  Star,
  Target,
  TrendingUp,
  Code,
  BookOpen,
  Award,
  Filter,
  X,
  Send,
  RefreshCw,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  studentProfile?: {
    college: string;
    degree: string;
    branch: string;
    graduationYear: number;
    cgpa: number;
    skills: string[];
    resumeScore: number;
    interviewScore: number;
    learningStreak: number;
  };
  applications?: Array<{
    id: string;
    jobTitle: string;
    company: string;
    status: string;
    appliedAt: string;
  }>;
  skillMatch?: number;
  resumeScore?: number;
  interviewPerformance?: number;
}

interface FeedbackItem {
  id: string;
  studentId: string;
  message: string;
  type: 'improvement' | 'praise' | 'suggestion';
  timestamp: string;
  recruiterId: string;
}

export default function StudentPortalView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'improvement' | 'praise' | 'suggestion'>('improvement');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [filters, setFilters] = useState({
    resumeScore: '',
    skillMatch: '',
    interviewPerformance: '',
    college: '',
    branch: ''
  });

  // Fetch students data
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['/api/recruiter/students'],
    queryFn: async () => {
      const response = await apiRequest('/api/recruiter/students');
      return response as StudentProfile[];
    },
  });

  // Send feedback mutation
  const sendFeedbackMutation = useMutation({
    mutationFn: async (data: { studentId: string; message: string; type: string }) => {
      return await fetch('/api/recruiter/feedback', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Feedback Sent",
        description: "Your feedback has been sent to the student.",
      });
      setShowFeedbackModal(false);
      setFeedbackText('');
      setSelectedStudent(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter students based on search and filters
  const filteredStudents = students.filter((student: StudentProfile) => {
    const matchesSearch = !searchQuery || 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentProfile?.college?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      (!filters.resumeScore || (student.studentProfile?.resumeScore || 0) >= parseInt(filters.resumeScore)) &&
      (!filters.skillMatch || (student.skillMatch || 0) >= parseInt(filters.skillMatch)) &&
      (!filters.interviewPerformance || (student.studentProfile?.interviewScore || 0) >= parseInt(filters.interviewPerformance)) &&
      (!filters.college || student.studentProfile?.college?.toLowerCase().includes(filters.college.toLowerCase())) &&
      (!filters.branch || student.studentProfile?.branch?.toLowerCase().includes(filters.branch.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  const handleStudentSelect = (studentId: string) => {
    if (comparisonMode) {
      setSelectedStudents(prev => 
        prev.includes(studentId) 
          ? prev.filter(id => id !== studentId)
          : prev.length < 3 ? [...prev, studentId] : prev
      );
    } else {
      setSelectedStudent(studentId);
    }
  };

  const handleSendFeedback = () => {
    if (!selectedStudent || !feedbackText.trim()) return;
    
    sendFeedbackMutation.mutate({
      studentId: selectedStudent,
      message: feedbackText,
      type: feedbackType
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 60) return 'text-neon-cyan';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const renderStudentCard = (student: StudentProfile, isComparison = false) => (
    <motion.div
      key={student.id}
      className={`glass-card neon-border p-6 hover-lift cursor-pointer transition-all ${
        selectedStudents.includes(student.id) ? 'ring-2 ring-neon-cyan' :
        selectedStudent === student.id ? 'ring-2 ring-neon-purple' : ''
      } ${isComparison ? 'h-full' : ''}`}
      onClick={() => handleStudentSelect(student.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      data-testid={`student-card-${student.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg neon-text">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {comparisonMode && (
            <Badge variant={selectedStudents.includes(student.id) ? "default" : "outline"}>
              {selectedStudents.includes(student.id) ? 'Selected' : 'Select'}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudent(student.id);
              setShowFeedbackModal(true);
            }}
            data-testid={`feedback-button-${student.id}`}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Academic Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">College</p>
          <p className="text-sm font-medium">{student.studentProfile?.college || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Branch</p>
          <p className="text-sm font-medium">{student.studentProfile?.branch || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">CGPA</p>
          <p className="text-sm font-medium">{student.studentProfile?.cgpa || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Graduation</p>
          <p className="text-sm font-medium">{student.studentProfile?.graduationYear || 'N/A'}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(student.studentProfile?.resumeScore || 0)}`}>
            {student.studentProfile?.resumeScore || 0}
          </div>
          <p className="text-xs text-muted-foreground">Resume Score</p>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(student.skillMatch || 0)}`}>
            {student.skillMatch || 0}%
          </div>
          <p className="text-xs text-muted-foreground">Skill Match</p>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(student.studentProfile?.interviewScore || 0)}`}>
            {student.studentProfile?.interviewScore || 0}
          </div>
          <p className="text-xs text-muted-foreground">Interview</p>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Top Skills</p>
        <div className="flex flex-wrap gap-1">
          {(student.studentProfile?.skills || []).slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {(student.studentProfile?.skills?.length || 0) > 4 && (
            <Badge variant="outline" className="text-xs">
              +{(student.studentProfile?.skills?.length || 0) - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Learning Streak */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-neon-cyan" />
          <span className="text-sm">
            {student.studentProfile?.learningStreak || 0} day streak
          </span>
        </div>
        <Badge variant={getScoreBadgeVariant(student.studentProfile?.resumeScore || 0)}>
          {student.studentProfile?.resumeScore || 0 >= 80 ? 'Top Performer' :
           student.studentProfile?.resumeScore || 0 >= 60 ? 'Strong Candidate' : 'Developing'}
        </Badge>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold neon-text font-orbitron">
            🔥 Student Portal View
          </h2>
          <p className="text-muted-foreground">
            View student profiles exactly as they see them • Provide feedback • Compare candidates
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={comparisonMode ? "default" : "outline"}
            onClick={() => {
              setComparisonMode(!comparisonMode);
              setSelectedStudents([]);
              setSelectedStudent(null);
            }}
            data-testid="comparison-mode-toggle"
          >
            <Users className="h-4 w-4 mr-2" />
            {comparisonMode ? 'Exit Comparison' : 'Compare Mode'}
          </Button>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/recruiter/students'] })}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <Card className="glass-card neon-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="student-search"
                />
              </div>
            </div>
            <Select value={filters.resumeScore} onValueChange={(value) => setFilters(prev => ({ ...prev, resumeScore: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Resume Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Scores</SelectItem>
                <SelectItem value="80">80+ (Excellent)</SelectItem>
                <SelectItem value="60">60+ (Good)</SelectItem>
                <SelectItem value="40">40+ (Average)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.skillMatch} onValueChange={(value) => setFilters(prev => ({ ...prev, skillMatch: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Skill Match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Matches</SelectItem>
                <SelectItem value="80">80%+ Match</SelectItem>
                <SelectItem value="60">60%+ Match</SelectItem>
                <SelectItem value="40">40%+ Match</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="College"
              value={filters.college}
              onChange={(e) => setFilters(prev => ({ ...prev, college: e.target.value }))}
            />
            <Input
              placeholder="Branch"
              value={filters.branch}
              onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
            />
          </div>
          {Object.values(filters).some(Boolean) && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {filteredStudents.length} students match your filters
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ resumeScore: '', skillMatch: '', interviewPerformance: '', college: '', branch: '' })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Mode Status */}
      {comparisonMode && (
        <Card className="glass-card border-neon-cyan">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-neon-cyan" />
                <span className="font-medium text-neon-cyan">
                  Comparison Mode Active
                </span>
                <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                  {selectedStudents.length}/3 selected
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {selectedStudents.length > 1 && (
                  <Button size="sm" variant="default">
                    <Eye className="h-4 w-4 mr-2" />
                    Compare Selected
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedStudents([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="dna-loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredStudents.map((student: StudentProfile) => renderStudentCard(student))}
          </AnimatePresence>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="glass-card neon-border p-6 w-full max-w-md m-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold neon-text">Send Feedback</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFeedbackModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Select value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="improvement">💡 Improvement Suggestion</SelectItem>
                  <SelectItem value="praise">⭐ Praise</SelectItem>
                  <SelectItem value="suggestion">📝 General Suggestion</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Type your feedback here..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                data-testid="feedback-textarea"
              />
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendFeedback}
                  disabled={!feedbackText.trim() || sendFeedbackMutation.isPending}
                  data-testid="send-feedback-button"
                >
                  {sendFeedbackMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Feedback
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}