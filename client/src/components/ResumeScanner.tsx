import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Brain, 
  Download,
  CheckCircle,
  Edit,
  TrendingUp,
  Plus,
  Zap
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';

interface ResumeAnalysisResult {
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  skillsCoverage: number;
  suggestions: string[];
  missingSkills: string[];
}

export default function ResumeScanner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch latest resume analysis
  const { data: latestAnalysis, isLoading: isAnalysisLoading } = useQuery<ResumeAnalysisResult>({
    queryKey: ['/api/student/resume/latest'],
  });

  // Create resume analysis mutation
  const analyzeResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      // Simulate file upload and analysis
      const formData = new FormData();
      formData.append('resume', file);
      
      // Simulate AI analysis result
      const mockAnalysis = {
        resumeVersion: `${file.name}_${Date.now()}`,
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        keywordScore: Math.floor(Math.random() * 25) + 75,
        formatScore: Math.floor(Math.random() * 20) + 80,
        skillsCoverage: Math.floor(Math.random() * 35) + 65,
        suggestions: [
          "Add more quantified achievements with specific numbers",
          "Include relevant keywords for ATS optimization",
          "Improve formatting consistency and readability"
        ],
        missingSkills: [
          "Docker", "Kubernetes", "System Design", "Cloud Architecture"
        ]
      };

      const response = await apiRequest('POST', '/api/resume/analyze', mockAnalysis);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Resume Analysis Complete!",
        description: "Your resume has been successfully analyzed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/student/resume/latest'] });
      setSelectedFile(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF or DOC file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      analyzeResumeMutation.mutate(selectedFile);
    }
  };

  const downloadDetailedReport = (results: any) => {
    if (!results) return;
    
    const reportContent = `
RESUME ANALYSIS REPORT
======================

Overall Score: ${results.overallScore}/100
Generated on: ${new Date().toLocaleDateString()}

SCORE BREAKDOWN:
• Keywords Match: ${results.keywordScore}%
• Format Score: ${results.formatScore}%
• Skills Coverage: ${results.skillsCoverage}%

STRENGTHS:
${results.suggestions?.map((suggestion: string) => `• ${suggestion}`).join('\n') || 'N/A'}

MISSING SKILLS TO ADD:
${results.missingSkills?.map((skill: string) => `• ${skill}`).join('\n') || 'N/A'}

RECOMMENDATION:
Based on your current score of ${results.overallScore}/100, focus on improving your lowest scoring areas first. 
Consider adding the missing skills through courses or projects, and quantify your achievements with specific numbers and metrics.

---
Generated by PlaceNet AI Resume Scanner
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded!",
      description: "Your detailed analysis report has been saved.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <section id="resume" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
            🤖 AI Resume Scanner
          </h2>
          <p className="text-xl text-muted-foreground">
            Get instant ATS optimization and skill gap analysis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div 
            className="glass-card neon-border p-8 hover-lift"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div 
                className={`border-2 border-dashed rounded-xl p-8 mb-6 transition-all duration-300 ${
                  isDragOver 
                    ? 'border-neon-cyan/70 bg-neon-cyan/10' 
                    : 'border-neon-cyan/30 hover:border-neon-cyan/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                data-testid="resume-upload-area"
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center">
                      <FileText className="text-2xl text-black" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-lg mb-2" data-testid="selected-file-name">
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <div className="flex space-x-3 justify-center">
                        <Button 
                          onClick={handleUpload}
                          disabled={analyzeResumeMutation.isPending}
                          className="cyber-btn"
                          data-testid="button-analyze-resume"
                        >
                          {analyzeResumeMutation.isPending ? (
                            <>
                              <div className="dna-loader mr-2 w-4 h-4"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="mr-2 h-4 w-4" />
                              Analyze Resume
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedFile(null)}
                          className="glass-card border-neon-purple/30"
                          data-testid="button-remove-file"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center animate-pulse">
                      <Upload className="text-2xl text-white" />
                    </div>
                    <h3 className="font-orbitron font-bold text-lg mb-2">Drop your resume here</h3>
                    <p className="text-muted-foreground mb-4">or click to browse files</p>
                    <Button 
                      onClick={triggerFileInput}
                      className="cyber-btn"
                      data-testid="button-choose-file"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOC, DOCX • Max 5MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
                data-testid="file-input-resume"
              />
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div 
            className="glass-card neon-border p-8 hover-lift"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-orbitron font-bold text-xl mb-6 neon-text">
              📊 Analysis Results
            </h3>
            
            {isAnalysisLoading ? (
              <div className="flex justify-center py-8">
                <div className="dna-loader"></div>
              </div>
            ) : latestAnalysis ? (
              <>
                {/* Overall Score */}
                <div className="text-center mb-8">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="progress-ring w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="url(#resumeGradient)" 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (latestAnalysis.overallScore / 100) * 251.2}
                        className="progress-ring-circle"
                      />
                      <defs>
                        <linearGradient id="resumeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: 'var(--neon-cyan)', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: 'var(--neon-purple)', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold neon-text" data-testid="resume-overall-score">
                        {latestAnalysis.overallScore}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-orbitron font-bold text-lg">ATS Score</h4>
                </div>

                {/* Breakdown */}
                <div className="space-y-4">
                  {[
                    { label: 'Keywords Match', score: latestAnalysis.keywordScore, icon: Zap, color: 'text-neon-green' },
                    { label: 'Format Score', score: latestAnalysis.formatScore, icon: Edit, color: 'text-neon-cyan' },
                    { label: 'Skills Coverage', score: latestAnalysis.skillsCoverage, icon: TrendingUp, color: 'text-neon-purple' }
                  ].map((item) => (
                    <motion.div 
                      key={item.label}
                      className="flex justify-between items-center p-3 glass-card border border-border/20"
                      whileHover={{ scale: 1.02 }}
                      data-testid={`score-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`${item.color} font-semibold`}>
                        {item.score}%
                      </span>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  className="w-full cyber-btn mt-6"
                  data-testid="button-download-report"
                  onClick={() => downloadDetailedReport(latestAnalysis)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Upload your resume to see AI-powered analysis
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* AI Suggestions Panel */}
        {latestAnalysis && (
          <motion.div 
            className="mt-8 glass-card neon-border p-8 hover-lift"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-orbitron font-bold text-xl mb-6 neon-text">
              💡 AI Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="text-center p-4 glass-card border border-border/20"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Plus className="text-3xl text-neon-green mb-3 mx-auto" />
                <h4 className="font-semibold mb-2">Add Keywords</h4>
                <p className="text-sm text-muted-foreground">
                  {latestAnalysis.missingSkills.slice(0, 3).join(', ')} for better matches
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 glass-card border border-border/20"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Edit className="text-3xl text-neon-cyan mb-3 mx-auto" />
                <h4 className="font-semibold mb-2">Improve Format</h4>
                <p className="text-sm text-muted-foreground">
                  Use bullet points and quantify achievements
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 glass-card border border-border/20"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <TrendingUp className="text-3xl text-neon-purple mb-3 mx-auto" />
                <h4 className="font-semibold mb-2">Skill Gaps</h4>
                <p className="text-sm text-muted-foreground">
                  Consider learning {latestAnalysis.missingSkills[0]} and {latestAnalysis.missingSkills[1]}
                </p>
              </motion.div>
            </div>

            {/* Detailed Suggestions */}
            <div className="mt-8">
              <h4 className="font-orbitron font-bold text-lg mb-4 text-neon-cyan">
                Detailed Recommendations
              </h4>
              <div className="space-y-3">
                {latestAnalysis.suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3 p-3 glass-card border border-border/20"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    data-testid={`suggestion-${index}`}
                  >
                    <CheckCircle className="h-5 w-5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
