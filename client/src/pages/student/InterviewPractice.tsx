import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Square, 
  Mic, 
  MicOff,
  MessageSquare,
  Brain,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type InterviewMode = "technical" | "behavioral" | "hr" | "custom";
type InterviewState = "setup" | "active" | "feedback";

export default function InterviewPractice() {
  const { user } = useAuth();
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("technical");
  const [interviewState, setInterviewState] = useState<InterviewState>("setup");
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);

  const questionSets = {
    technical: [
      "Explain the difference between let, const, and var in JavaScript.",
      "What is the time complexity of searching in a binary search tree?",
      "How would you implement a rate limiter for an API?",
      "Explain the concept of closure in programming.",
      "What are the differences between SQL and NoSQL databases?"
    ],
    behavioral: [
      "Tell me about a time when you had to work with a difficult team member.",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "How do you handle stress and pressure in tight deadlines?",
      "Give an example of when you had to learn a new technology quickly.",
      "Tell me about a time when you failed and what you learned from it."
    ],
    hr: [
      "Why are you interested in this position?",
      "Where do you see yourself in 5 years?",
      "What are your greatest strengths and weaknesses?",
      "Why are you leaving your current job?",
      "What motivates you to do your best work?"
    ],
    custom: []
  };

  const startInterview = () => {
    setInterviewState("active");
    setQuestionIndex(0);
    setAnswers([]);
    setCurrentQuestion(questionSets[interviewMode][0]);
    
    toast({
      title: "Interview Started",
      description: "Good luck! Take your time to think before answering.",
    });
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");
    
    if (questionIndex < questionSets[interviewMode].length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questionSets[interviewMode][nextIndex]);
    } else {
      // Interview completed, generate feedback
      generateFeedback(newAnswers);
    }
  };

  const generateFeedback = async (allAnswers: string[]) => {
    setInterviewState("feedback");
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dynamic AI feedback that changes every time
    const possibleFeedbacks = [
      "Good technical understanding but needs more concrete examples",
      "Strong conceptual knowledge with clear communication",
      "Solid foundation but could be more detailed in explanations",
      "Great problem-solving approach with room for optimization",
      "Clear reasoning but consider discussing edge cases more",
      "Excellent structure but add more real-world context",
      "Good pace and confidence, enhance technical depth"
    ];

    const possibleStrengths = [
      "Clear explanation", "Good structure", "Confident delivery", "Strong technical foundation",
      "Logical reasoning", "Good examples", "Clear communication", "Thoughtful approach",
      "Well-organized response", "Strong problem-solving", "Good pace", "Relevant experience"
    ];

    const possibleImprovements = [
      "Add real-world examples", "Be more specific about implementation",
      "Discuss edge cases", "Mention time/space complexity",
      "Provide more context", "Use concrete numbers/metrics",
      "Elaborate on challenges faced", "Explain decision-making process",
      "Add technical details", "Structure using STAR method"
    ];

    const overallFeedbacks = [
      "Strong technical knowledge with good communication skills. Focus on providing more concrete examples.",
      "Excellent problem-solving approach. Consider slowing down slightly for better clarity.",
      "Good foundation with clear reasoning. Work on adding more specific implementation details.",
      "Confident delivery with solid understanding. Enhance responses with real-world applications.",
      "Clear communication with logical structure. Add more quantifiable achievements and metrics.",
      "Strong conceptual grasp with room for deeper technical exploration.",
      "Good pace and structure. Focus on providing more detailed explanations with examples."
    ];

    const allRecommendations = [
      "Practice explaining concepts with real-world examples",
      "Work on structuring answers using the STAR method",
      "Practice common algorithm questions with complexity analysis",
      "Improve confidence by practicing more behavioral questions",
      "Focus on quantifying achievements with specific numbers",
      "Practice whiteboarding and system design problems",
      "Work on explaining technical concepts to non-technical audiences",
      "Practice handling follow-up questions and clarifications",
      "Develop better examples from your project experience",
      "Focus on storytelling techniques for behavioral questions",
      "Practice time management during technical problems",
      "Work on explaining trade-offs in technical decisions"
    ];

    const mockFeedback = {
      overallScore: Math.floor(Math.random() * 25) + 75, // 75-100
      confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-100  
      clarityScore: Math.floor(Math.random() * 25) + 75, // 75-100
      correctnessScore: Math.floor(Math.random() * 30) + 70, // 70-100
      paceScore: Math.floor(Math.random() * 20) + 80, // 80-100
      detailedFeedback: questionSets[interviewMode].slice(0, allAnswers.length).map((question, index) => ({
        question: question,
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        feedback: possibleFeedbacks[Math.floor(Math.random() * possibleFeedbacks.length)],
        strengths: possibleStrengths.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 2), // 2-4 random strengths
        improvements: possibleImprovements.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 2) // 2-4 random improvements
      })),
      overallFeedback: overallFeedbacks[Math.floor(Math.random() * overallFeedbacks.length)],
      recommendations: allRecommendations.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 4) // 4-7 random recommendations
    };
    
    setFeedback(mockFeedback);
    
    toast({
      title: "Feedback Generated",
      description: `Overall score: ${mockFeedback.overallScore}/100`,
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Voice analysis will be included in feedback" : "AI will analyze your speech patterns",
    });
  };

  return (
    <div className="min-h-screen relative" data-testid="interview-practice-page">
      <Navigation user={user} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
              AI Interview Practice
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practice with adaptive AI interviews, get real-time feedback on confidence, 
              clarity, and correctness with instant analysis.
            </p>
          </div>

          {interviewState === "setup" && (
            <div className="max-w-2xl mx-auto">
              <Card className="glass-card" data-testid="setup-section">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    Interview Setup
                  </CardTitle>
                  <CardDescription>
                    Choose your interview type and get ready for AI-powered practice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Interview Type</label>
                    <Select value={interviewMode} onValueChange={(value: InterviewMode) => setInterviewMode(value)} data-testid="select-interview-type">
                      <SelectTrigger>
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Interview</SelectItem>
                        <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                        <SelectItem value="hr">HR Interview</SelectItem>
                        <SelectItem value="custom">Custom Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg border border-border/20">
                      <MessageSquare className="h-8 w-8 text-neon-cyan mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">AI Questions</h4>
                      <p className="text-xs text-muted-foreground">Adaptive questioning</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg border border-border/20">
                      <Brain className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">Real-time Analysis</h4>
                      <p className="text-xs text-muted-foreground">Instant feedback</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg border border-border/20">
                      <Award className="h-8 w-8 text-neon-pink mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">Performance Score</h4>
                      <p className="text-xs text-muted-foreground">Detailed metrics</p>
                    </div>
                  </div>

                  <Button
                    onClick={startInterview}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
                    data-testid="button-start-interview"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Interview
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {interviewState === "active" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Question Section */}
              <Card className="glass-card" data-testid="question-section">
                <CardHeader>
                  <CardTitle className="text-neon-purple font-orbitron flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageSquare className="h-6 w-6 mr-2" />
                      Question {questionIndex + 1} of {questionSets[interviewMode].length}
                    </span>
                    <Badge variant="secondary">{interviewMode}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-background/50 rounded-lg border border-border/20">
                      <p className="text-lg leading-relaxed">{currentQuestion}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Take your time</span>
                      </div>
                      <Button
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        data-testid="button-toggle-recording"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Section */}
              <Card className="glass-card" data-testid="answer-section">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron">Your Answer</CardTitle>
                  <CardDescription>
                    Type your response or use voice recording
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      className="min-h-[200px] resize-none"
                      data-testid="textarea-answer"
                    />

                    <div className="flex space-x-3">
                      <Button
                        onClick={nextQuestion}
                        disabled={!currentAnswer.trim()}
                        className="flex-1"
                        data-testid="button-next-question"
                      >
                        {questionIndex < questionSets[interviewMode].length - 1 ? "Next Question" : "Finish Interview"}
                      </Button>
                      <Button variant="outline" size="icon" data-testid="button-skip">
                        <Square className="h-4 w-4" />
                      </Button>
                    </div>

                    <Progress 
                      value={((questionIndex + 1) / questionSets[interviewMode].length) * 100} 
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {interviewState === "feedback" && feedback && (
            <div className="space-y-8" data-testid="feedback-section">
              {/* Overall Score */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron text-center">
                    Interview Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-neon-cyan mb-2">
                      {feedback.overallScore}/100
                    </div>
                    <p className="text-muted-foreground">Overall Performance Score</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-purple">{feedback.confidenceScore}</div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-pink">{feedback.clarityScore}</div>
                      <p className="text-sm text-muted-foreground">Clarity</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{feedback.correctnessScore}</div>
                      <p className="text-sm text-muted-foreground">Correctness</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-yellow">{feedback.paceScore}</div>
                      <p className="text-sm text-muted-foreground">Pace</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Feedback */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-purple font-orbitron flex items-center">
                      <TrendingUp className="h-6 w-6 mr-2" />
                      Question-by-Question Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {feedback.detailedFeedback.map((item: any, index: number) => (
                        <div key={index} className="p-4 bg-background/50 rounded-lg border border-border/20">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">Question {index + 1}</h4>
                            <Badge variant="secondary">{item.score}/100</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.feedback}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <h5 className="text-xs font-semibold text-neon-green mb-1">Strengths</h5>
                              <ul className="text-xs space-y-1">
                                {item.strengths.map((strength: string, i: number) => (
                                  <li key={i} className="text-muted-foreground">• {strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-neon-pink mb-1">Improvements</h5>
                              <ul className="text-xs space-y-1">
                                {item.improvements.map((improvement: string, i: number) => (
                                  <li key={i} className="text-muted-foreground">• {improvement}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                      <Lightbulb className="h-6 w-6 mr-2" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-border/20">
                        <h4 className="font-semibold text-sm mb-2">Overall Feedback</h4>
                        <p className="text-sm text-muted-foreground">{feedback.overallFeedback}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3">Next Steps</h4>
                        <div className="space-y-2">
                          {feedback.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <BookOpen className="h-4 w-4 text-neon-cyan flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={() => setInterviewState("setup")} variant="outline" data-testid="button-new-interview">
                  <Play className="h-4 w-4 mr-2" />
                  New Interview
                </Button>
                <Button className="bg-gradient-to-r from-neon-cyan to-neon-purple" data-testid="button-save-session">
                  <Award className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}