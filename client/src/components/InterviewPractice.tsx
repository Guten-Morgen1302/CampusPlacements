import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff,
  Play,
  Pause,
  SkipForward,
  Bot,
  Brain,
  Volume2,
  Camera,
  CameraOff,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FeedbackScores {
  confidence: number;
  clarity: number;
  pace: number;
  content: number;
}

interface SessionStats {
  questionsAnswered: number;
  totalQuestions: number;
  timeElapsed: number;
  averageScore: number;
}

export default function InterviewPractice() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackScores>({
    confidence: 0,
    clarity: 0,
    pace: 0,
    content: 0
  });
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    questionsAnswered: 0,
    totalQuestions: 10,
    timeElapsed: 0,
    averageScore: 0
  });

  // Mock questions data
  const [questions] = useState<InterviewQuestion[]>([
    {
      id: '1',
      question: 'Tell me about a challenging project you worked on and how you overcame the obstacles.',
      category: 'Behavioral',
      difficulty: 'medium'
    },
    {
      id: '2',
      question: 'How would you design a system to handle millions of concurrent users?',
      category: 'Technical',
      difficulty: 'hard'
    },
    {
      id: '3',
      question: 'Describe a time when you had to work with a difficult team member.',
      category: 'Behavioral',
      difficulty: 'easy'
    },
    {
      id: '4',
      question: 'Explain the difference between REST and GraphQL APIs.',
      category: 'Technical',
      difficulty: 'medium'
    },
    {
      id: '5',
      question: 'What are your long-term career goals and how does this position fit into them?',
      category: 'Career',
      difficulty: 'easy'
    }
  ]);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create interview session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest('POST', '/api/interviews', sessionData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Interview Session Saved",
        description: "Your practice session has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/student/interviews'] });
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
        title: "Session Save Failed",
        description: "Failed to save interview session.",
        variant: "destructive",
      });
    },
  });

  // Session timer effect
  useEffect(() => {
    if (sessionActive && !isPaused) {
      sessionTimerRef.current = setInterval(() => {
        setSessionStats(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [sessionActive, isPaused]);

  // Real-time feedback simulation
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setFeedback({
          confidence: Math.floor(Math.random() * 30) + 70,
          clarity: Math.floor(Math.random() * 25) + 75,
          pace: Math.floor(Math.random() * 20) + 80,
          content: Math.floor(Math.random() * 35) + 65
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused]);

  const startSession = async () => {
    try {
      if (videoEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
      
      setSessionActive(true);
      setCurrentQuestionIndex(0);
      setSessionStats(prev => ({
        ...prev,
        questionsAnswered: 0,
        timeElapsed: 0,
        averageScore: 0
      }));
      
      // Simulate AI asking first question
      setTimeout(() => {
        setIsAISpeaking(true);
        setTimeout(() => setIsAISpeaking(false), 3000);
      }, 1000);

      toast({
        title: "Interview Started",
        description: "AI interviewer is ready. Good luck!",
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access for better experience.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly and take your time.",
      });
    } catch (error) {
      toast({
        title: "Mic Access Denied",
        description: "Please enable microphone access.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Simulate processing feedback
      setTimeout(() => {
        const averageScore = Math.floor((feedback.confidence + feedback.clarity + feedback.pace + feedback.content) / 4);
        setSessionStats(prev => ({
          ...prev,
          questionsAnswered: prev.questionsAnswered + 1,
          averageScore: Math.floor((prev.averageScore * prev.questionsAnswered + averageScore) / (prev.questionsAnswered + 1))
        }));
        
        toast({
          title: "Response Recorded",
          description: `Great job! Your confidence score: ${feedback.confidence}%`,
        });
      }, 1000);
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
    if (isRecording) {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.pause();
      } else {
        mediaRecorderRef.current?.resume();
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsRecording(false);
      
      // Simulate AI asking next question
      setTimeout(() => {
        setIsAISpeaking(true);
        setTimeout(() => setIsAISpeaking(false), 2500);
      }, 500);
    } else {
      endSession();
    }
  };

  const endSession = () => {
    setSessionActive(false);
    setIsRecording(false);
    setIsPaused(false);
    
    // Stop all streams
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    // Dynamic feedback arrays for randomization
    const possibleFeedbacks = [
      "Good technical understanding but needs more concrete examples",
      "Strong conceptual knowledge with clear communication", 
      "Solid foundation but could be more detailed in explanations",
      "Great problem-solving approach with room for optimization",
      "Clear reasoning but consider discussing edge cases more",
      "Excellent structure but add more real-world context",
      "Good pace and confidence, enhance technical depth"
    ];

    const overallFeedbacks = [
      "Strong technical knowledge with good communication skills.",
      "Excellent problem-solving approach with clear delivery.",
      "Good foundation with clear reasoning and structure.",
      "Confident delivery with solid understanding.",
      "Clear communication with logical approach.",
      "Strong conceptual grasp with room for growth.",
      "Good pace and structure with technical depth."
    ];

    // Generate random overall scores
    const dynamicOverallScore = Math.floor(Math.random() * 25) + 75; // 75-100
    const dynamicConfidence = Math.floor(Math.random() * 30) + 70; // 70-100
    const dynamicClarity = Math.floor(Math.random() * 25) + 75; // 75-100
    const dynamicPace = Math.floor(Math.random() * 20) + 80; // 80-100

    // Save session data with randomized results
    const sessionData = {
      type: 'mock',
      questions: questions.slice(0, sessionStats.questionsAnswered + 1).map((q, index) => ({
        question: q.question,
        answer: 'Audio recorded', // In real implementation, this would be transcribed
        score: Math.floor(Math.random() * 30) + 70, // 70-100 random score each time
        feedback: possibleFeedbacks[Math.floor(Math.random() * possibleFeedbacks.length)],
        category: q.category
      })),
      overallScore: dynamicOverallScore,
      confidenceScore: dynamicConfidence,
      clarityScore: dynamicClarity,
      paceScore: dynamicPace,
      overallFeedback: overallFeedbacks[Math.floor(Math.random() * overallFeedbacks.length)],
      duration: sessionStats.timeElapsed
    };

    createSessionMutation.mutate(sessionData);

    toast({
      title: "Interview Completed!",
      description: `You answered ${sessionStats.questionsAnswered} questions with ${sessionStats.averageScore}% average score.`,
    });
  };

  const restartSession = () => {
    endSession();
    setTimeout(() => startSession(), 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const difficultyColor = {
    easy: 'text-neon-green',
    medium: 'text-neon-cyan',
    hard: 'text-neon-pink'
  };

  return (
    <section id="interview" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
            🎯 AI Interview Practice
          </h2>
          <p className="text-xl text-muted-foreground">
            Practice with AI interviewer and get instant feedback
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Interviewer & Video */}
          <div className="lg:col-span-2 glass-card neon-border p-8 hover-lift">
            <div className="aspect-video bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
              {videoEnabled && sessionActive ? (
                <video 
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover rounded-xl"
                  data-testid="video-student"
                />
              ) : (
                <>
                  {/* AI Avatar */}
                  <motion.div 
                    className="w-32 h-32 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center"
                    animate={{ 
                      scale: isAISpeaking ? [1, 1.1, 1] : 1,
                      rotate: isAISpeaking ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: isAISpeaking ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <Bot className="text-4xl text-white" />
                  </motion.div>
                  
                  {/* Floating particles around AI */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-neon-cyan rounded-full"
                      style={{
                        top: `${25 + Math.sin(i * 60) * 25}%`,
                        left: `${50 + Math.cos(i * 60) * 30}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* Speaking indicator */}
              <AnimatePresence>
                {isAISpeaking && (
                  <motion.div 
                    className="absolute bottom-4 left-4 flex items-center space-x-2 glass-card px-3 py-2 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-neon-green rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-sm" data-testid="ai-speaking-indicator">AI Speaking...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording indicator */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div 
                    className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-full border border-red-500/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-red-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-sm text-red-300" data-testid="recording-indicator">Recording</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls overlay */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className="glass-card border-neon-cyan/30"
                  data-testid="button-toggle-video"
                >
                  {videoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="glass-card border-neon-purple/30"
                  data-testid="button-toggle-audio"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Question Display */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestionIndex}
                className="glass-card border border-border/20 p-6 mb-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-orbitron font-bold text-lg neon-text">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h3>
                  {currentQuestion && (
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${difficultyColor[currentQuestion.difficulty]}`}>
                        {currentQuestion.difficulty.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {currentQuestion.category}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-foreground text-lg" data-testid="current-question">
                  {currentQuestion?.question || "Click 'Start Interview' to begin!"}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!sessionActive ? (
                <Button 
                  onClick={startSession}
                  className="cyber-btn text-lg px-8 py-3"
                  data-testid="button-start-interview"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Interview
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`cyber-btn ${isRecording ? 'bg-red-500/20 border-red-500/30' : ''}`}
                    disabled={isPaused}
                    data-testid="button-toggle-recording"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="mr-2 h-5 w-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-5 w-5" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={pauseSession}
                    className="cyber-btn"
                    data-testid="button-pause-interview"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  
                  <Button 
                    onClick={nextQuestion}
                    className="cyber-btn"
                    disabled={currentQuestionIndex >= questions.length - 1}
                    data-testid="button-next-question"
                  >
                    <SkipForward className="mr-2 h-5 w-5" />
                    Next Question
                  </Button>
                  
                  <Button 
                    onClick={restartSession}
                    variant="outline"
                    className="glass-card border-neon-purple/30"
                    data-testid="button-restart-interview"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Restart
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Real-time Feedback & Stats */}
          <div className="space-y-6">
            {/* Real-time Feedback */}
            <motion.div 
              className="glass-card neon-border p-6 hover-lift"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">
                📈 Real-time Feedback
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Confidence', score: feedback.confidence, color: 'from-neon-green to-neon-cyan' },
                  { label: 'Clarity', score: feedback.clarity, color: 'from-neon-cyan to-neon-blue' },
                  { label: 'Pace', score: feedback.pace, color: 'from-neon-purple to-neon-pink' },
                  { label: 'Content', score: feedback.content, color: 'from-neon-pink to-neon-purple' }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm" data-testid={`feedback-${item.label.toLowerCase()}-label`}>
                        {item.label}
                      </span>
                      <span className="text-sm neon-text" data-testid={`feedback-${item.label.toLowerCase()}-score`}>
                        {item.score}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <motion.div 
                          className={`h-3 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${item.score}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Session Stats */}
            <motion.div 
              className="glass-card neon-border p-6 hover-lift"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">
                ⏱️ Session Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Questions Answered</span>
                  <span className="neon-text font-semibold" data-testid="stat-questions-answered">
                    {sessionStats.questionsAnswered}/{sessionStats.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time Elapsed</span>
                  <span className="neon-text font-semibold" data-testid="stat-time-elapsed">
                    {formatTime(sessionStats.timeElapsed)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Score</span>
                  <span className="neon-text font-semibold" data-testid="stat-average-score">
                    {sessionStats.averageScore}%
                  </span>
                </div>
                <div className="pt-3 border-t border-border/20">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="h-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                      style={{ width: `${(sessionStats.questionsAnswered / sessionStats.totalQuestions) * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(sessionStats.questionsAnswered / sessionStats.totalQuestions) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Progress
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Live Tips */}
            <motion.div 
              className="glass-card neon-border p-6 hover-lift"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">
                💡 Live Tips
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Camera, tip: "Maintain eye contact with the camera", color: "text-neon-green" },
                  { icon: Volume2, tip: "Speak clearly and at a moderate pace", color: "text-neon-cyan" },
                  { icon: Brain, tip: "Take your time to think before answering", color: "text-neon-purple" },
                  { icon: Trophy, tip: "Use the STAR method for behavioral questions", color: "text-neon-pink" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    data-testid={`tip-${index}`}
                  >
                    <item.icon className={`${item.color} mt-1 h-4 w-4 flex-shrink-0`} />
                    <span>{item.tip}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
