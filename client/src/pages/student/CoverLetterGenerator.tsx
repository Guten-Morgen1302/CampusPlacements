import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy,
  RefreshCw,
  Target,
  Briefcase,
  User,
  Building2,
  Zap,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type CoverLetterTone = "professional" | "enthusiastic" | "formal" | "creative" | "technical";

export default function CoverLetterGenerator() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dna-loader"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'student') {
    return null;
  }
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  
  // Form data
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState<CoverLetterTone>("professional");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleGenerate = async () => {
    if (!jobTitle || !companyName || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title, company name, and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate dynamic cover letter based on user inputs
      const generateDynamicLetter = () => {
        const userSkills = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
        
        // Different openings based on tone
        const openings = {
          professional: "I am writing to express my interest in the ${jobTitle} position at ${companyName}.",
          enthusiastic: "I am thrilled to apply for the ${jobTitle} role at ${companyName}!",
          formal: "I respectfully submit my application for the ${jobTitle} position at ${companyName}.",
          creative: "Your ${jobTitle} opening at ${companyName} immediately caught my attention.",
          technical: "I am excited to apply my technical expertise to the ${jobTitle} position at ${companyName}."
        };

        // Analyze job description for key requirements
        const jobKeywords = jobDescription.toLowerCase();
        const relevantExperience = experience ? 
          `In my professional journey, ${experience}` : 
          `Through my experience in software development, I have developed strong problem-solving abilities and technical expertise.`;

        // Extract skills from job description if they match user skills
        const matchingSkills = userSkills.filter(skill => 
          jobKeywords.includes(skill.toLowerCase())
        );

        // Create skills showcase
        const skillsSection = userSkills.length > 0 ? 
          `My technical expertise includes ${userSkills.slice(0, 5).join(', ')}, which align well with your requirements.` :
          `I have experience with modern development technologies and am eager to apply my skills to this role.`;

        // Different closing styles
        const closings = {
          professional: "I would welcome the opportunity to discuss how my background and skills can contribute to ${companyName}'s continued success.",
          enthusiastic: "I'm excited about the possibility of bringing my passion and skills to the ${companyName} team!",
          formal: "I would be honored to contribute to ${companyName}'s objectives and look forward to your consideration.",
          creative: "I'm eager to bring fresh ideas and innovative solutions to ${companyName}'s challenges.",
          technical: "I look forward to discussing how my technical background can help ${companyName} achieve its engineering goals."
        };

        return `Dear Hiring Manager,

${openings[tone].replace('${jobTitle}', jobTitle).replace('${companyName}', companyName)}

${relevantExperience} I am particularly drawn to this opportunity because the role aligns perfectly with my career goals and technical interests.

Based on your job description, I can see that you're looking for someone who can contribute immediately to your team. Here's what I bring to the table:

${skillsSection}
${matchingSkills.length > 0 ? `\nI noticed that you specifically mentioned ${matchingSkills.slice(0, 3).join(', ')} in your requirements - these are areas where I have hands-on experience and can make an immediate impact.` : ''}

${jobDescription.length > 100 ? `Your job posting mentions several key areas that resonate with my background. ${jobDescription.includes('team') || jobDescription.includes('collaborate') ? 'I excel in collaborative environments and enjoy working with cross-functional teams.' : ''} ${jobDescription.includes('innovation') || jobDescription.includes('creative') ? 'I thrive on innovative challenges and creative problem-solving.' : ''} ${jobDescription.includes('leadership') || jobDescription.includes('lead') ? 'I have experience in leadership roles and mentoring fellow developers.' : ''}` : ''}

${additionalInfo ? `\n${additionalInfo}\n` : ''}${closings[tone].replace('${companyName}', companyName)}

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${user?.firstName || 'Your Name'} ${user?.lastName || ''}`
      };

      const dynamicLetter = generateDynamicLetter();

      setGeneratedLetter(dynamicLetter);
      
      toast({
        title: "Cover Letter Generated!",
        description: "Your personalized cover letter is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${companyName}-${jobTitle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Cover letter saved to your device.",
    });
  };

  const toneDescriptions = {
    professional: "Balanced and business-appropriate",
    enthusiastic: "Energetic and passionate",
    formal: "Traditional and conservative",
    creative: "Innovative and expressive",
    technical: "Focus on technical expertise"
  };

  return (
    <div className="min-h-screen relative" data-testid="cover-letter-generator-page">
      <Navigation user={{
        ...user,
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role
      }} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
              AI Cover Letter Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create personalized, job-specific cover letters with AI assistance. 
              Tailored to match job requirements and showcase your unique strengths.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="glass-card" data-testid="input-section">
              <CardHeader>
                <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                  <Sparkles className="h-6 w-6 mr-2" />
                  Job Information
                </CardTitle>
                <CardDescription>
                  Provide details about the job and your background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-title">Job Title *</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g., Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      data-testid="input-job-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Google Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      data-testid="input-company-name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="job-description">Job Description *</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[120px]"
                    data-testid="textarea-job-description"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Your Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your relevant work experience..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="textarea-experience"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Key Skills</Label>
                  <Input
                    id="skills"
                    placeholder="React, Node.js, Python, etc. (comma-separated)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    data-testid="input-skills"
                  />
                </div>

                <div>
                  <Label htmlFor="tone">Tone & Style</Label>
                  <Select value={tone} onValueChange={(value: CoverLetterTone) => setTone(value)} data-testid="select-tone">
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(toneDescriptions).map(([key, description]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col">
                            <span className="capitalize font-medium">{key}</span>
                            <span className="text-xs text-muted-foreground">{description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Any specific achievements, projects, or points you want to highlight..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[80px]"
                    data-testid="textarea-additional-info"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobTitle || !companyName || !jobDescription}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
                  data-testid="button-generate"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>

                {/* AI Features Info */}
                <div className="space-y-3 pt-4 border-t border-border/20">
                  <h4 className="font-semibold text-neon-purple">AI Features:</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-neon-green" />
                      <span>Job-specific keyword optimization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-neon-green" />
                      <span>Personalized content generation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-neon-green" />
                      <span>Professional tone adaptation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Letter Section */}
            <Card className="glass-card" data-testid="output-section">
              <CardHeader>
                <CardTitle className="text-neon-purple font-orbitron flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Generated Cover Letter
                </CardTitle>
                <CardDescription>
                  AI-generated personalized cover letter
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!generatedLetter ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Fill in the job information and click generate to create your personalized cover letter</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="generated-letter">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="secondary" className="text-neon-cyan">
                        AI Generated
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {tone} Tone
                      </Badge>
                    </div>

                    <div className="bg-background/50 rounded-lg p-6 border border-border/20 max-h-[600px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {generatedLetter}
                      </pre>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="flex items-center justify-center"
                        data-testid="button-copy"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="flex items-center justify-center"
                        data-testid="button-download"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={handleGenerate}
                        variant="outline"
                        className="flex items-center justify-center"
                        data-testid="button-regenerate"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          {generatedLetter && (
            <Card className="glass-card mt-8" data-testid="tips-section">
              <CardHeader>
                <CardTitle className="text-neon-cyan font-orbitron">Cover Letter Tips</CardTitle>
                <CardDescription>
                  How to make the most of your AI-generated cover letter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <User className="h-6 w-6 text-neon-cyan flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Personalize Further</h4>
                      <p className="text-sm text-muted-foreground">
                        Add specific examples from your experience that match the job requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-6 w-6 text-neon-purple flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Research the Company</h4>
                      <p className="text-sm text-muted-foreground">
                        Include specific details about the company's mission, values, or recent achievements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-6 w-6 text-neon-pink flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Proofread Carefully</h4>
                      <p className="text-sm text-muted-foreground">
                        Review for accuracy, spelling, and ensure all company and job details are correct.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}