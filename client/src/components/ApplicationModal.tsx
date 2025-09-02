import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Upload, 
  FileText, 
  Star, 
  Sparkles, 
  CheckCircle, 
  Mail, 
  Github,
  Linkedin,
  MapPin,
  Phone,
  Calendar,
  Target,
  Eye,
  Edit
} from "lucide-react";
import type { Job, User, StudentProfile } from "@shared/schema";

const applicationSchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  resumeFile: z.any().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  customAnswers: z.record(z.string()).optional(),
  expectedSalary: z.number().min(0).optional(),
  availableFrom: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

interface ApplicationModalProps {
  job: Job;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function ApplicationModal({ job, user, isOpen, onClose, onSuccess }: ApplicationModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterAI, setCoverLetterAI] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch student profile
  const { data: profile } = useQuery<StudentProfile>({
    queryKey: ['/api/student/profile'],
    enabled: isOpen && user.role === 'student',
  });

  const steps: ApplicationStep[] = [
    { id: 'profile', title: 'Profile Information', description: 'Review and update your details', completed: false },
    { id: 'resume', title: 'Resume & Links', description: 'Upload resume and add profile links', completed: false },
    { id: 'cover-letter', title: 'Cover Letter', description: 'Write or generate your cover letter', completed: false },
    { id: 'skills', title: 'Skill Matching', description: 'Review your skill compatibility', completed: false },
    { id: 'questions', title: 'Additional Questions', description: 'Answer employer questions', completed: false },
    { id: 'preview', title: 'Review & Submit', description: 'Final review before submission', completed: false },
  ];

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      customAnswers: {},
      expectedSalary: undefined,
      availableFrom: "",
    },
  });

  // Calculate skill match percentage
  const calculateSkillMatch = () => {
    if (!profile?.skills || !job.skills) return 0;
    const profileSkills = profile.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const matchedSkills = jobSkills.filter(skill => 
      profileSkills.some(pSkill => pSkill.includes(skill) || skill.includes(pSkill))
    );
    return Math.round((matchedSkills.length / jobSkills.length) * 100);
  };

  // Generate AI cover letter
  const generateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      // Simulate AI generation with a template
      const template = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in ${profile?.degree || 'technology'} and experience in ${profile?.skills?.slice(0, 3).join(', ') || 'software development'}, I am excited about the opportunity to contribute to your team.

I am passionate about technology and eager to apply my skills in a professional environment. My technical skills align well with your requirements, particularly in ${job.skills?.slice(0, 2).join(' and ') || 'the required technologies'}.

I am particularly drawn to ${job.company} because of your innovative approach and commitment to excellence. I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${user.firstName} ${user.lastName}`;
      
      setCoverLetterAI(template);
      form.setValue('coverLetter', template);
      toast({
        title: "Cover Letter Generated",
        description: "AI has generated a personalized cover letter for you. Feel free to edit it.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate cover letter. Please write one manually.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Submit application
  const submitApplicationMutation = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('coverLetter', data.coverLetter);
      formData.append('linkedinUrl', data.linkedinUrl || '');
      formData.append('githubUrl', data.githubUrl || '');
      formData.append('portfolioUrl', data.portfolioUrl || '');
      formData.append('expectedSalary', data.expectedSalary?.toString() || '');
      formData.append('availableFrom', data.availableFrom || '');
      formData.append('customAnswers', JSON.stringify(data.customAnswers || {}));
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      return response.json();
    },
    onSuccess: () => {
      console.log("Application submission successful - calling onSuccess callback");
      toast({
        title: "Application Submitted! 🎉",
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: ApplicationForm) => {
    submitApplicationMutation.mutate(data);
  };

  const skillMatch = calculateSkillMatch();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Apply for {job.title}
                </h2>
                <p className="text-muted-foreground">
                  {job.company} • {job.location} • ₹{job.salaryMin}-{job.salaryMax} LPA
                </p>
                <div className="flex items-center mt-2">
                  <Target className="h-4 w-4 text-neon-green mr-2" />
                  <span className="text-neon-green font-semibold">
                    {skillMatch}% Match
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                      ${index <= currentStep 
                        ? 'bg-neon-cyan text-background' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        flex-1 h-0.5 mx-2
                        ${index < currentStep ? 'bg-neon-cyan' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">{steps[currentStep]?.title}</p>
                <p className="text-xs text-muted-foreground">{steps[currentStep]?.description}</p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile Information Step */}
                  {currentStep === 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-neon-green mr-2" />
                          Profile Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Full Name</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md">
                              {user.email}
                            </div>
                          </div>
                          <div>
                            <Label>College</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md">
                              {profile?.college || 'Not provided'}
                            </div>
                          </div>
                          <div>
                            <Label>Degree</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md">
                              {profile?.degree || 'Not specified'}
                            </div>
                          </div>
                        </div>
                        {profile?.branch && (
                          <div>
                            <Label>Branch</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md">
                              {profile.branch}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Resume & Links Step */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                            Resume Upload
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div
                            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-neon-cyan transition-colors cursor-pointer"
                            onClick={() => document.getElementById('resume-upload')?.click()}
                          >
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">
                              {resumeFile ? resumeFile.name : 'Upload your resume'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Drag & drop or click to browse (PDF, DOC, DOCX)
                            </p>
                            <input
                              id="resume-upload"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Profile Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Linkedin className="h-4 w-4 mr-2" />
                                  LinkedIn URL
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://linkedin.com/in/username" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="githubUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Github className="h-4 w-4 mr-2" />
                                  GitHub URL
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://github.com/username" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="portfolioUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Star className="h-4 w-4 mr-2" />
                                  Portfolio URL
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://yourportfolio.com" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Cover Letter Step */}
                  {currentStep === 2 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-green-500 mr-2" />
                            Cover Letter
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generateCoverLetter}
                            disabled={isGeneratingCoverLetter}
                            className="cyber-btn-secondary"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {isGeneratingCoverLetter ? 'Generating...' : 'AI Generate'}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="coverLetter"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Write a compelling cover letter explaining why you're perfect for this role..."
                                  className="min-h-[300px] resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          {form.watch('coverLetter')?.length || 0} characters (minimum 50 required)
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Skills Matching Step */}
                  {currentStep === 3 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="h-5 w-5 text-neon-green mr-2" />
                          Skill Compatibility Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-neon-green mb-2">
                            {skillMatch}%
                          </div>
                          <p className="text-muted-foreground">Overall Match Score</p>
                          <Progress value={skillMatch} className="mt-4" />
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-4">Required Skills Analysis</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {job.skills?.map((skill) => {
                              const hasSkill = profile?.skills?.some(pSkill => 
                                pSkill.toLowerCase().includes(skill.toLowerCase()) || 
                                skill.toLowerCase().includes(pSkill.toLowerCase())
                              );
                              return (
                                <div key={skill} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                  <span>{skill}</span>
                                  <Badge variant={hasSkill ? "default" : "secondary"}>
                                    {hasSkill ? "✓ Match" : "Learn"}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {profile?.skills && (
                          <div>
                            <h4 className="font-semibold mb-4">Your Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Additional Questions Step */}
                  {currentStep === 4 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="expectedSalary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expected Salary (LPA)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                  placeholder="e.g., 800000"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="availableFrom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Available From</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Sample custom questions */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">Employer Questions</h4>
                          <div>
                            <Label>Why are you interested in this role?</Label>
                            <Textarea
                              placeholder="Describe what excites you about this opportunity..."
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Describe a project you're proud of</Label>
                            <Textarea
                              placeholder="Tell us about a project that showcases your skills..."
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Preview Step */}
                  {currentStep === 5 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Eye className="h-5 w-5 text-purple-500 mr-2" />
                          Application Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Applying for:</h4>
                          <p className="text-lg">{job.title} at {job.company}</p>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Cover Letter Preview:</h4>
                          <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">
                              {form.watch('coverLetter')?.substring(0, 200)}...
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Resume:</h4>
                            <p className="text-sm text-muted-foreground">
                              {resumeFile ? resumeFile.name : 'No resume uploaded'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Match Score:</h4>
                            <p className="text-lg font-bold text-neon-green">
                              {skillMatch}%
                            </p>
                          </div>
                        </div>

                        <div className="bg-neon-cyan/10 border border-neon-cyan/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-neon-cyan mb-2">Next Steps:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• You'll receive a confirmation email</li>
                            <li>• {job.company} typically responds in 5-7 business days</li>
                            <li>• You can track your application status in your dashboard</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="cyber-btn"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitApplicationMutation.isPending}
                      className="cyber-btn"
                    >
                      {submitApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}