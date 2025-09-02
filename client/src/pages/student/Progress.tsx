import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BookOpen,
  Users,
  Trophy,
  Flame,
  Star,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface SkillProgress {
  skill: string;
  level: number;
  experience: number;
  maxExperience: number;
  endorsements: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skillsProgress, setSkillsProgress] = useState<SkillProgress[]>([]);
  const [stats, setStats] = useState({
    resumeScore: 85,
    interviewScore: 72,
    learningStreak: 7,
    totalPoints: 2450,
    rank: 12,
    totalUsers: 156
  });

  useEffect(() => {
    // Mock achievements data
    setAchievements([
      {
        id: "1",
        title: "First Resume Upload",
        description: "Upload your first resume to the platform",
        icon: "📄",
        earned: true,
        earnedAt: "2024-01-15"
      },
      {
        id: "2", 
        title: "Interview Rookie",
        description: "Complete your first mock interview",
        icon: "🎤",
        earned: true,
        earnedAt: "2024-01-18"
      },
      {
        id: "3",
        title: "Networking Ninja",
        description: "Connect with 10+ recruiters",
        icon: "🤝",
        earned: false,
        progress: 6,
        maxProgress: 10
      },
      {
        id: "4",
        title: "Learning Streak Master",
        description: "Maintain a 30-day learning streak",
        icon: "🔥",
        earned: false,
        progress: 7,
        maxProgress: 30
      },
      {
        id: "5",
        title: "Application Pro",
        description: "Submit 25 job applications",
        icon: "📋",
        earned: false,
        progress: 12,
        maxProgress: 25
      },
      {
        id: "6",
        title: "Skill Master",
        description: "Reach level 5 in any skill",
        icon: "⚡",
        earned: true,
        earnedAt: "2024-01-20"
      }
    ]);

    // Mock skills progress
    setSkillsProgress([
      { skill: "React", level: 4, experience: 850, maxExperience: 1000, endorsements: 3 },
      { skill: "Node.js", level: 3, experience: 620, maxExperience: 750, endorsements: 2 },
      { skill: "TypeScript", level: 3, experience: 500, maxExperience: 750, endorsements: 1 },
      { skill: "Python", level: 2, experience: 380, maxExperience: 500, endorsements: 4 },
      { skill: "AWS", level: 2, experience: 220, maxExperience: 500, endorsements: 0 },
      { skill: "Docker", level: 1, experience: 150, maxExperience: 250, endorsements: 1 }
    ]);
  }, []);

  const getSkillColor = (level: number) => {
    if (level >= 5) return "text-neon-yellow";
    if (level >= 4) return "text-neon-green";
    if (level >= 3) return "text-neon-cyan";
    if (level >= 2) return "text-neon-purple";
    return "text-neon-pink";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-neon-green";
    if (percentage >= 70) return "bg-neon-cyan";
    if (percentage >= 50) return "bg-neon-purple";
    return "bg-neon-pink";
  };

  return (
    <div className="min-h-screen relative" data-testid="progress-page">
      <Navigation user={user} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
              Progress & Achievements
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your journey, celebrate milestones, and see how you stack up against peers.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300" data-testid="stat-total-points">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-cyan flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-cyan">{stats.totalPoints.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground mt-1">+120 this week</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300" data-testid="stat-rank">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-purple flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Current Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-purple">#{stats.rank}</div>
                <p className="text-sm text-muted-foreground mt-1">of {stats.totalUsers} students</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-pink/20 hover:border-neon-pink/40 transition-all duration-300" data-testid="stat-streak">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-pink flex items-center">
                  <Flame className="h-5 w-5 mr-2" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-pink">{stats.learningStreak} days</div>
                <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-green/20 hover:border-neon-green/40 transition-all duration-300" data-testid="stat-achievements">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-green flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neon-green">
                  {achievements.filter(a => a.earned).length}/{achievements.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Unlocked</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6" data-testid="overview-tab">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Progress Summary */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2" />
                      Progress Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Resume Optimization</span>
                        <span className="text-sm text-neon-cyan">{stats.resumeScore}%</span>
                      </div>
                      <Progress value={stats.resumeScore} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Interview Readiness</span>
                        <span className="text-sm text-neon-purple">{stats.interviewScore}%</span>
                      </div>
                      <Progress value={stats.interviewScore} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-sm text-neon-green">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Networking Score</span>
                        <span className="text-sm text-neon-pink">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-purple font-orbitron flex items-center">
                      <Award className="h-6 w-6 mr-2" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border/20">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{achievement.title}</h4>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                    <Clock className="h-6 w-6 mr-2" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Completed mock interview", time: "2 hours ago", points: 50 },
                      { action: "Updated resume", time: "1 day ago", points: 25 },
                      { action: "Applied to 3 jobs", time: "2 days ago", points: 75 },
                      { action: "Earned 'Skill Master' badge", time: "3 days ago", points: 100 },
                      { action: "Connected with recruiter", time: "1 week ago", points: 30 }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/20">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className="text-neon-green">
                          +{activity.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6" data-testid="achievements-tab">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`glass-card transition-all duration-300 ${
                      achievement.earned 
                        ? 'border-neon-green/40 bg-neon-green/5' 
                        : 'border-border/20 opacity-75'
                    }`}
                    data-testid={`achievement-${achievement.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{achievement.icon}</div>
                        {achievement.earned && (
                          <CheckCircle className="h-6 w-6 text-neon-green" />
                        )}
                      </div>
                      <CardTitle className={achievement.earned ? "text-neon-green" : "text-muted-foreground"}>
                        {achievement.title}
                      </CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {achievement.earned ? (
                        <Badge variant="secondary" className="text-neon-green">
                          Earned {achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}
                        </Badge>
                      ) : achievement.progress !== undefined && achievement.maxProgress ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                      ) : (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6" data-testid="skills-tab">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    Skill Progression
                  </CardTitle>
                  <CardDescription>
                    Level up your skills through practice and endorsements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {skillsProgress.map((skill, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h4 className={`font-semibold ${getSkillColor(skill.level)}`}>
                              {skill.skill}
                            </h4>
                            <Badge variant="secondary" className={getSkillColor(skill.level)}>
                              Level {skill.level}
                            </Badge>
                            {skill.endorsements > 0 && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {skill.endorsements} endorsements
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {skill.experience}/{skill.maxExperience} XP
                          </span>
                        </div>
                        <Progress 
                          value={(skill.experience / skill.maxExperience) * 100} 
                          className="h-3"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6" data-testid="leaderboard-tab">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-purple font-orbitron flex items-center">
                    <Trophy className="h-6 w-6 mr-2" />
                    Student Leaderboard
                  </CardTitle>
                  <CardDescription>
                    See how you rank among your peers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: "Aadhya Krishnan", points: 3250, badge: "🥇" },
                      { rank: 2, name: "Rohan Mehta", points: 3120, badge: "🥈" },
                      { rank: 3, name: "Ananya Verma", points: 2980, badge: "🥉" },
                      { rank: 4, name: "Vikram Joshi", points: 2850, badge: "" },
                      { rank: 5, name: "Shreya Nair", points: 2720, badge: "" },
                      { rank: 6, name: "Karthik Iyer", points: 2680, badge: "" },
                      { rank: 7, name: "Pooja Desai", points: 2590, badge: "" },
                      { rank: 8, name: "Meera Reddy", points: 2520, badge: "" },
                      { rank: 9, name: "Aditya Kapoor", points: 2480, badge: "" },
                      { rank: 10, name: "Diya Agarwal", points: 2460, badge: "" },
                      { rank: 11, name: "Arjun Malhotra", points: 2455, badge: "" },
                      { rank: 12, name: `${user?.firstName} ${user?.lastName}`, points: 2450, badge: "", isCurrentUser: true }
                    ].map((student) => (
                      <div 
                        key={student.rank} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                          student.isCurrentUser 
                            ? 'bg-neon-cyan/10 border-neon-cyan/40' 
                            : 'bg-background/50 border-border/20'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            student.rank <= 3 ? 'bg-gradient-to-r from-neon-yellow to-neon-orange text-black' :
                            student.isCurrentUser ? 'bg-neon-cyan text-black' : 'bg-muted text-muted-foreground'
                          }`}>
                            {student.badge || student.rank}
                          </div>
                          <div>
                            <p className={`font-semibold ${student.isCurrentUser ? 'text-neon-cyan' : ''}`}>
                              {student.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.points.toLocaleString()} points
                            </p>
                          </div>
                        </div>
                        {student.isCurrentUser && (
                          <Badge variant="secondary" className="text-neon-cyan">
                            You
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}