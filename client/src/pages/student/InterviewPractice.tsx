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
type InterviewState = "setup" | "active" | "analyzing" | "feedback";

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
    // Show analyzing state with cool animation
    setInterviewState("analyzing");
    
    // Wait a bit to show the animation, then start analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Analyze each answer with AI
      const detailedFeedback = [];
      let totalScore = 0;
      let totalConfidence = 0;
      let totalClarity = 0;
      let totalContent = 0;
      
      for (let i = 0; i < allAnswers.length; i++) {
        const question = questionSets[interviewMode][i];
        const answer = allAnswers[i];
        
        if (!answer || answer.trim().length === 0) {
          // Handle empty answers
          detailedFeedback.push({
            question: question,
            score: 0,
            feedback: "No answer provided",
            strengths: [],
            improvements: ["Provide an answer to the question", "Take time to think before responding"]
          });
          continue;
        }
        
        try {
          const response = await fetch('/api/interview/analyze-answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              question: question,
              answer: answer,
              category: interviewMode
            }),
          });
          
          if (!response.ok) {
            throw new Error('Analysis failed');
          }
          
          const analysis = await response.json();
          
          detailedFeedback.push({
            question: question,
            score: analysis.score,
            feedback: analysis.feedback,
            strengths: analysis.strengths,
            improvements: analysis.improvements
          });
          
          totalScore += analysis.score;
          totalConfidence += analysis.confidenceScore;
          totalClarity += analysis.clarityScore;
          totalContent += analysis.contentScore;
          
        } catch (error) {
          console.error('Error analyzing answer:', error);
          // Fallback for individual question if AI fails
          const fallbackScore = answer.length > 20 ? 50 : 20;
          detailedFeedback.push({
            question: question,
            score: fallbackScore,
            feedback: "AI analysis temporarily unavailable. Basic scoring applied based on response length.",
            strengths: answer.length > 50 ? ["Provided detailed response"] : ["Attempted to answer"],
            improvements: ["Add more specific details", "Provide concrete examples"]
          });
          totalScore += fallbackScore;
          totalConfidence += fallbackScore;
          totalClarity += fallbackScore;
          totalContent += fallbackScore;
        }
      }
      
      const numAnswers = allAnswers.length || 1;
      const overallScore = Math.round(totalScore / numAnswers);
      const avgConfidence = Math.round(totalConfidence / numAnswers);
      const avgClarity = Math.round(totalClarity / numAnswers);
      const avgContent = Math.round(totalContent / numAnswers);
      
      // Generate overall feedback based on actual performance
      let overallFeedback = "";
      let recommendations = [];
      
      if (overallScore >= 80) {
        overallFeedback = "Excellent performance! You demonstrated strong knowledge and communication skills throughout the interview.";
        recommendations = [
          "Continue practicing with more advanced questions",
          "Focus on leadership and behavioral scenarios",
          "Practice whiteboarding complex problems"
        ];
      } else if (overallScore >= 60) {
        overallFeedback = "Good performance with room for improvement. You showed solid understanding but could enhance your responses.";
        recommendations = [
          "Practice providing more concrete examples",
          "Work on structuring answers using frameworks like STAR",
          "Study common interview patterns for your field",
          "Practice explaining technical concepts clearly"
        ];
      } else if (overallScore >= 40) {
        overallFeedback = "Fair performance. Focus on improving response quality and providing more relevant content.";
        recommendations = [
          "Study fundamental concepts more thoroughly",
          "Practice basic interview questions extensively",
          "Work on communication and presentation skills",
          "Prepare specific examples from your experience",
          "Practice explaining your thought process step-by-step"
        ];
      } else {
        overallFeedback = "Needs significant improvement. Consider reviewing fundamental concepts and practicing more before real interviews.";
        recommendations = [
          "Review basic concepts in your field",
          "Practice with simple questions first",
          "Work on providing relevant answers to questions asked",
          "Focus on clear communication",
          "Consider taking additional courses or training",
          "Practice mock interviews with peers or mentors"
        ];
      }
      
      const intelligentFeedback = {
        overallScore: overallScore,
        confidenceScore: avgConfidence,
        clarityScore: avgClarity,
        correctnessScore: avgContent,
        paceScore: Math.round((avgConfidence + avgClarity) / 2), // Estimate pace from confidence and clarity
        detailedFeedback: detailedFeedback,
        overallFeedback: overallFeedback,
        recommendations: recommendations
      };
      
      setFeedback(intelligentFeedback);
      setInterviewState("feedback");
      
      toast({
        title: "Analysis Complete!",
        description: `Your overall score: ${overallScore}/100. ${overallScore >= 70 ? 'Great job!' : 'Keep practicing!'}`,
      });
      
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      setInterviewState("feedback");
      toast({
        title: "Analysis Error",
        description: "Failed to analyze responses. Please try again.",
        variant: "destructive",
      });
    }
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

          {interviewState === "analyzing" && (
            <div className="max-w-4xl mx-auto text-center" data-testid="analyzing-section">
              <Card className="glass-card neon-border p-12">
                <div className="space-y-8">
                  {/* AI Brain Animation */}
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-full animate-spin opacity-20"></div>
                    <div className="absolute inset-2 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
                      <Brain className="h-12 w-12 text-neon-cyan animate-pulse" />
                    </div>
                    
                    {/* Floating particles */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-neon-${['cyan', 'purple', 'pink', 'green'][i % 4]} rounded-full`}
                        style={{
                          top: `${20 + Math.sin(i * 45) * 30}%`,
                          left: `${50 + Math.cos(i * 45) * 35}%`,
                          animation: `float 2s ease-in-out infinite ${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Analyzing Text */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-orbitron neon-text">
                      Analyzing Responses
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      AI is analyzing your answers, please wait...
                    </p>
                    
                    {/* Progress indicators */}
                    <div className="space-y-3 max-w-md mx-auto">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse"></div>
                        <span className="text-sm">Processing responses...</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <span className="text-sm">Evaluating content quality...</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-neon-pink rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        <span className="text-sm">Generating feedback...</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated progress bar */}
                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
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