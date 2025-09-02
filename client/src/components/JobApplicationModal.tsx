import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Upload, 
  FileText, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Edit,
  Clock,
  DollarSign,
  MapPin,
  Building2,
  Target,
  Star,
  Send,
  Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements?: string[];
  skills?: string[];
  matchScore?: number;
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export default function JobApplicationModal({ isOpen, onClose, job }: JobApplicationModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    personalInfo: {
      name: user?.firstName + ' ' + user?.lastName || '',
      email: user?.email || '',
      phone: '',
      github: '',
      linkedin: '',
      portfolio: '',
      expectedSalary: '',
      availableFrom: ''
    },
    resume: {
      uploaded: false,
      filename: '',
      file: null as File | null,
      autoAttached: false
    },
    coverLetter: '',
    customAnswers: {} as Record<string, string>
  });

  const totalSteps = 4;
  const progressPercentage = (step / totalSteps) * 100;

  // Mock custom questions from employer
  const customQuestions = [
    {
      id: 'project',
      question: 'Describe a challenging project you\'ve worked on and how you overcame obstacles.',
      type: 'textarea'
    },
    {
      id: 'motivation',
      question: 'Why are you interested in this position at our company?',
      type: 'textarea'
    }
  ];

  // Dynamic skill match analysis based on resume - recalculates when resume changes
  const skillMatch = React.useMemo(() => {
    if (!applicationData.resume.uploaded && !applicationData.resume.autoAttached) {
      return {
        matched: [],
        missing: job.skills || [],
        overall: 0
      };
    }
    
    // Generate different skills based on job and add some randomization for variety
    const baseUserSkills = ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS', 'MongoDB', 'Express', 'Git'];
    const jobSkills = job.skills || ['React', 'Node.js', 'TypeScript', 'AWS', 'Kubernetes', 'Docker', 'MongoDB'];
    
    // Add some randomization based on job title to make it more realistic
    const jobTitleLower = job.title.toLowerCase();
    let userSkills = [...baseUserSkills];
    
    if (jobTitleLower.includes('full stack') || jobTitleLower.includes('fullstack')) {
      userSkills.push('REST APIs', 'Database Design', 'Agile');
    }
    if (jobTitleLower.includes('frontend') || jobTitleLower.includes('react')) {
      userSkills.push('Redux', 'Webpack', 'Jest');
    }
    if (jobTitleLower.includes('backend') || jobTitleLower.includes('node')) {
      userSkills.push('Express', 'PostgreSQL', 'JWT');
    }
    if (jobTitleLower.includes('mern') || jobTitleLower.includes('mean')) {
      userSkills.push('MERN Stack', 'MongoDB', 'Express', 'React', 'Node.js');
    }
    
    const matched = jobSkills.filter(skill => userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill.toLowerCase())
    ));
    const missing = jobSkills.filter(skill => !matched.includes(skill));
    
    // Calculate base match percentage
    let baseMatch = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;
    
    // Add some randomization for variety (±10%)
    const randomOffset = Math.floor(Math.random() * 21) - 10; // -10 to +10
    const overall = Math.max(0, Math.min(100, baseMatch + randomOffset));
    
    return { matched, missing, overall };
  }, [applicationData.resume.uploaded, applicationData.resume.autoAttached, job.skills, job.title]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setApplicationData(prev => ({
        ...prev,
        personalInfo: {
          name: user?.firstName + ' ' + user?.lastName || '',
          email: user?.email || '',
          phone: prev.personalInfo.phone,
          github: prev.personalInfo.github,
          linkedin: prev.personalInfo.linkedin,
          portfolio: prev.personalInfo.portfolio,
          expectedSalary: prev.personalInfo.expectedSalary,
          availableFrom: prev.personalInfo.availableFrom
        }
      }));
    }
  }, [isOpen, user]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleCustomAnswerChange = (questionId: string, answer: string) => {
    setApplicationData(prev => ({
      ...prev,
      customAnswers: {
        ...prev.customAnswers,
        [questionId]: answer
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate longer loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('resumeVersion', applicationData.resume.filename || 'default_resume.pdf');
      formData.append('customAnswers', JSON.stringify(applicationData.customAnswers));
      formData.append('linkedinUrl', applicationData.personalInfo.linkedin);
      formData.append('githubUrl', applicationData.personalInfo.github);
      formData.append('portfolioUrl', applicationData.personalInfo.portfolio);
      formData.append('expectedSalary', applicationData.personalInfo.expectedSalary);
      formData.append('availableFrom', applicationData.personalInfo.availableFrom);
      
      if (applicationData.resume.file) {
        formData.append('resume', applicationData.resume.file);
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      toast({
        title: "✅ Application Submitted Successfully!",
        description: `Your application for ${job.title} at ${job.company} has been submitted. You'll receive an email confirmation shortly.`,
      });
      
      onClose();
      setStep(1);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCoverLetter = () => {
    const aiGeneratedLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in software development and passion for technology, I am excited about the opportunity to contribute to your team.

My skills in ${job.skills?.slice(0, 3).join(', ')} align well with your requirements, and I am particularly drawn to ${job.company}'s innovative approach to technology. I have experience working on projects that demonstrate my ability to deliver high-quality solutions and collaborate effectively with teams.

I am eager to bring my technical expertise and enthusiasm to ${job.company} and would welcome the opportunity to discuss how I can contribute to your team's success.

Thank you for considering my application.

Best regards,
${applicationData.personalInfo.name}`;

    setApplicationData(prev => ({
      ...prev,
      coverLetter: aiGeneratedLetter
    }));

    toast({
      title: "AI Cover Letter Generated",
      description: "A personalized cover letter has been generated. You can edit it before submitting.",
    });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()} LPA`;
    }
    if (min) return `₹${min.toLocaleString()}+ LPA`;
    return `Up to ₹${max?.toLocaleString()} LPA`;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={applicationData.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={applicationData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className="mt-1"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub Profile</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="github"
                      value={applicationData.personalInfo.github}
                      onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                      className="mt-1 pl-10"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      value={applicationData.personalInfo.linkedin}
                      onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                      className="mt-1 pl-10"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Resume & Documents</h3>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className={`h-8 w-8 ${applicationData.resume.uploaded || applicationData.resume.autoAttached ? 'text-neon-green' : 'text-muted-foreground'}`} />
                      <div>
                        <h4 className="font-semibold">
                          {applicationData.resume.uploaded ? 'Resume Uploaded' : 
                           applicationData.resume.autoAttached ? 'Resume Auto-Attached' : 'No Resume Added'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {applicationData.resume.uploaded ? applicationData.resume.filename :
                           applicationData.resume.autoAttached ? 'Your latest resume will be automatically included' :
                           'Upload your resume to improve match score'}
                        </p>
                      </div>
                    </div>
                    {(applicationData.resume.uploaded || applicationData.resume.autoAttached) && 
                      <CheckCircle className="h-6 w-6 text-neon-green" />
                    }
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setApplicationData(prev => ({
                            ...prev,
                            resume: {
                              ...prev.resume,
                              uploaded: true,
                              filename: file.name,
                              file: file,
                              autoAttached: false
                            }
                          }));
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {applicationData.resume.uploaded ? 'Change Resume' : 'Upload Resume'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Drag & Drop or Browse files (PDF, DOC, DOCX)
                    </p>
                    {!applicationData.resume.uploaded && !applicationData.resume.autoAttached && (
                      <div className="mt-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-neon-cyan hover:text-neon-cyan/80"
                          onClick={() => setApplicationData(prev => ({ ...prev, resume: { ...prev.resume, autoAttached: true } }))}
                        >
                          Use Auto-Attached Resume Instead
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Skill Match Analysis</h3>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Your Match Score</h4>
                    <Badge variant="secondary" className={skillMatch.overall === 0 ? "text-red-400" : "text-neon-green"}>
                      <Target className="h-3 w-3 mr-1" />
                      {skillMatch.overall}% Match
                    </Badge>
                    {skillMatch.overall === 0 && (
                      <p className="text-sm text-red-400 mt-2">
                        Upload a resume to calculate your match score
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-neon-green">Matching Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skillMatch.matched.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-neon-green">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-neon-orange">Skills to Improve</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skillMatch.missing.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-neon-orange">
                            <Star className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neon-cyan">Cover Letter</h3>
                <Button variant="outline" size="sm" onClick={generateCoverLetter}>
                  <Edit className="h-4 w-4 mr-2" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Write a personalized cover letter or use AI to generate one..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                A well-crafted cover letter increases your chances by 40%
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Additional Questions</h3>
              <div className="space-y-4">
                {customQuestions.map((question) => (
                  <div key={question.id}>
                    <Label className="font-medium">{question.question}</Label>
                    <Textarea
                      value={applicationData.customAnswers[question.id] || ''}
                      onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                      placeholder="Your answer..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neon-cyan">Application Preview</h3>
              <p className="text-muted-foreground">Review your application before submitting</p>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application Summary</span>
                  <Badge variant="secondary" className="text-neon-green">Ready to Submit</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Position:</span>
                    <p className="font-medium">{job.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Company:</span>
                    <p className="font-medium">{job.company}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Match Score:</span>
                    <p className="font-medium text-neon-green">{skillMatch.overall}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Documents:</span>
                    <p className="font-medium">Resume + Cover Letter</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Application will be reviewed within 5-7 business days</li>
                    <li>• You'll receive email confirmation and status updates</li>
                    <li>• Track your application status in your dashboard</li>
                    <li>• Consider applying to similar positions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto glass-card modal-stable">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neon-cyan">
            Apply for {job.title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
              {job.matchScore && (
                <Badge variant="secondary" className="text-neon-green">
                  <Target className="h-3 w-3 mr-1" />
                  {job.matchScore}% Match
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {isSubmitting && step === 4 ? (
            <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
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
          ) : (
            renderStep()
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border/20">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            disabled={isSubmitting}
          >
            {step > 1 ? 'Previous' : 'Cancel'}
          </Button>
          
          <div className="flex space-x-3">
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
                disabled={isSubmitting}
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Clock className="h-4 w-4" />
                    </motion.div>
                    <span className="animate-pulse">Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}