import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroDashboard from "@/components/HeroDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Target, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Award,
  Clock,
  Users,
  BarChart3,
  Trophy,
  Zap,
  Bell,
  Briefcase,
  Video,
  UserCheck
} from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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

    if (user && user.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "This page is only for students.",
        variant: "destructive",
      });
      if (user.role === 'recruiter') {
        window.location.href = "/recruiter";
      } else if (user.role === 'admin') {
        window.location.href = "/admin";
      }
    }
  }, [isAuthenticated, isLoading, user, toast]);

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

  // Mock data for dashboard
  const stats = {
    resumeScore: 85,
    interviewScore: 72,
    learningStreak: 7,
    applications: 12
  };

  const quickActions = [
    { title: "Cover Letter Generator", description: "Generate personalized cover letters", icon: Briefcase, href: "/student/cover-letter", colorClass: "border-neon-cyan/20 hover:border-neon-cyan/40", iconClass: "text-neon-cyan" },
    { title: "Job Recommendations", description: "Find perfect job matches", icon: TrendingUp, href: "/student/jobs", colorClass: "border-neon-purple/20 hover:border-neon-purple/40", iconClass: "text-neon-purple" },
    { title: "Virtual Job Fair", description: "Connect with recruiters live", icon: Video, href: "/student/job-fair", colorClass: "border-neon-pink/20 hover:border-neon-pink/40", iconClass: "text-neon-pink" },
    { title: "Alumni Connect", description: "Connect with alumni for mentorship", icon: UserCheck, href: "/student/alumni-connect", colorClass: "border-neon-green/20 hover:border-neon-green/40", iconClass: "text-neon-green" },
    { title: "Progress Tracking", description: "Track your career progress", icon: BarChart3, href: "/student/progress", colorClass: "border-neon-green/20 hover:border-neon-green/40", iconClass: "text-neon-green" },
    { title: "Skill Gap Analyzer", description: "Identify and bridge skill gaps", icon: Zap, href: "/student/skill-gap", colorClass: "border-neon-cyan/20 hover:border-neon-cyan/40", iconClass: "text-neon-cyan" },
    { title: "Hackathon Tracker", description: "Find and track hackathons", icon: Trophy, href: "/student/hackathons", colorClass: "border-neon-purple/20 hover:border-neon-purple/40", iconClass: "text-neon-purple" },
    { title: "Notifications", description: "View your notifications", icon: Bell, href: "/student/notifications", colorClass: "border-neon-pink/20 hover:border-neon-pink/40", iconClass: "text-neon-pink" }
  ];

  console.log("Quick Actions Count:", quickActions.length);
  console.log("Alumni Connect item:", quickActions.find(a => a.title === "Alumni Connect"));

  const recentActivities = [
    { type: "resume", title: "Resume analyzed", time: "2 hours ago", score: 85 },
    { type: "interview", title: "Mock interview completed", time: "1 day ago", score: 78 },
    { type: "application", title: "Applied to Software Engineer at Google", time: "2 days ago" },
    { type: "achievement", title: "Earned 'Interview Pro' badge", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen relative" data-testid="student-dashboard">
      <Navigation user={{
        ...user,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }} />
      
      <main className="pt-24 pb-10">
        <HeroDashboard user={user} />
        
        {/* Statistics Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-200" data-testid="card-resume-score">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-cyan">Resume Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-cyan">{stats.resumeScore}%</div>
                <Progress value={stats.resumeScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-200" data-testid="card-interview-score">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-purple">Interview Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-purple">{stats.interviewScore}%</div>
                <Progress value={stats.interviewScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-pink/20 hover:border-neon-pink/40 transition-all duration-200" data-testid="card-learning-streak">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-pink">Learning Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-pink">{stats.learningStreak} days</div>
                <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-green/20 hover:border-neon-green/40 transition-all duration-200" data-testid="card-applications">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-green">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-green">{stats.applications}</div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neon-cyan mb-6 font-orbitron">⚡ Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className={`glass-card ${action.colorClass} transition-all duration-200 cursor-pointer group h-full`} data-testid={`action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <action.icon className={`h-8 w-8 ${action.iconClass} group-hover:scale-105 transition-transform duration-200`} />
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-card" data-testid="recent-activity">
              <CardHeader>
                <CardTitle className="text-neon-cyan font-orbitron">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-background/50 border border-border/20">
                      <div className="flex-shrink-0">
                        {activity.type === 'resume' && <GraduationCap className="h-5 w-5 text-neon-cyan" />}
                        {activity.type === 'interview' && <Target className="h-5 w-5 text-neon-purple" />}
                        {activity.type === 'application' && <BookOpen className="h-5 w-5 text-neon-pink" />}
                        {activity.type === 'achievement' && <Award className="h-5 w-5 text-neon-green" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                      {activity.score && (
                        <Badge variant="secondary" className="ml-auto">
                          {activity.score}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="glass-card" data-testid="upcoming-deadlines">
              <CardHeader>
                <CardTitle className="text-neon-purple font-orbitron">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-background/50 border border-border/20">
                    <Calendar className="h-5 w-5 text-neon-purple" />
                    <div>
                      <p className="text-sm font-medium">Google Interview</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-background/50 border border-border/20">
                    <Calendar className="h-5 w-5 text-neon-pink" />
                    <div>
                      <p className="text-sm font-medium">Application Deadline - Microsoft</p>
                      <p className="text-xs text-muted-foreground">In 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-background/50 border border-border/20">
                    <Calendar className="h-5 w-5 text-neon-green" />
                    <div>
                      <p className="text-sm font-medium">Virtual Job Fair</p>
                      <p className="text-xs text-muted-foreground">Next week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}