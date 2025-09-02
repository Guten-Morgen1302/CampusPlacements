import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Users, 
  ExternalLink,
  Medal,
  Code,
  Zap,
  Target,
  Clock,
  Star,
  Github,
  Globe
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Contest {
  id: string;
  name: string;
  type: "hackathon" | "coding-contest" | "design-contest" | "data-science";
  platform: string;
  status: "upcoming" | "ongoing" | "completed";
  startDate: string;
  endDate: string;
  participants?: number;
  prize?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  technologies?: string[];
  description: string;
  registrationUrl?: string;
  isRegistered?: boolean;
}

interface Achievement {
  id: string;
  contestId: string;
  contestName: string;
  rank: number;
  participants: number;
  prize?: string;
  date: string;
  projectUrl?: string;
  githubUrl?: string;
  description: string;
  technologies: string[];
}

export default function HackathonTracker() {
  const { user } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<"all" | "hackathon" | "coding-contest" | "design-contest" | "data-science">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    contestName: "",
    rank: "",
    participants: "",
    prize: "",
    date: "",
    projectUrl: "",
    githubUrl: "",
    description: "",
    technologies: ""
  });

  useEffect(() => {
    // Mock contests data
    setContests([
      {
        id: "1",
        name: "DevPost Global Hackathon 2024",
        type: "hackathon",
        platform: "DevPost",
        status: "upcoming",
        startDate: "2024-02-15",
        endDate: "2024-02-17",
        participants: 5000,
        prize: "$50,000",
        difficulty: "intermediate",
        technologies: ["React", "Node.js", "AI/ML"],
        description: "Build innovative solutions using cutting-edge technology. Focus on AI, blockchain, and social impact.",
        registrationUrl: "https://devpost.com/hackathon",
        isRegistered: true
      },
      {
        id: "2",
        name: "MLH Local Hack Day",
        type: "hackathon",
        platform: "MLH",
        status: "ongoing",
        startDate: "2024-02-01",
        endDate: "2024-02-03",
        participants: 200,
        prize: "$5,000",
        difficulty: "beginner",
        technologies: ["Python", "JavaScript", "APIs"],
        description: "24-hour local hackathon focused on beginner-friendly projects and community building.",
        registrationUrl: "https://mlh.io/event",
        isRegistered: false
      },
      {
        id: "3",
        name: "Google Code Jam",
        type: "coding-contest",
        platform: "Google",
        status: "upcoming",
        startDate: "2024-03-10",
        endDate: "2024-03-10",
        participants: 50000,
        difficulty: "advanced",
        description: "Annual algorithmic programming contest. Test your problem-solving skills against the world's best programmers.",
        registrationUrl: "https://codingcompetitions.withgoogle.com"
      },
      {
        id: "4",
        name: "NASA Space Apps Challenge",
        type: "hackathon",
        platform: "NASA",
        status: "completed",
        startDate: "2024-01-20",
        endDate: "2024-01-22",
        participants: 15000,
        prize: "Recognition + Mentorship",
        difficulty: "intermediate",
        technologies: ["Python", "Data Science", "APIs"],
        description: "International hackathon solving real-world space and Earth challenges using NASA's open data.",
        isRegistered: true
      }
    ]);

    // Mock achievements data
    setAchievements([
      {
        id: "1",
        contestId: "4",
        contestName: "NASA Space Apps Challenge 2023",
        rank: 12,
        participants: 15000,
        prize: "Global Finalist",
        date: "2023-10-15",
        projectUrl: "https://spaceapps.nasa.gov/project",
        githubUrl: "https://github.com/user/nasa-project",
        description: "Developed an AI-powered satellite imagery analysis tool for tracking deforestation in real-time.",
        technologies: ["Python", "TensorFlow", "React", "NASA APIs"]
      },
      {
        id: "2",
        contestId: "local-1",
        contestName: "University Tech Fest 2023",
        rank: 2,
        participants: 150,
        prize: "$2,000",
        date: "2023-11-20",
        githubUrl: "https://github.com/user/tech-fest-project",
        description: "Built a sustainable campus management system with IoT integration and energy optimization.",
        technologies: ["React", "Node.js", "IoT", "MongoDB"]
      },
      {
        id: "3",
        contestId: "online-1",
        contestName: "HackerRank Algorithm Contest",
        rank: 45,
        participants: 2000,
        date: "2023-12-05",
        description: "Solved complex algorithmic challenges focusing on dynamic programming and graph theory.",
        technologies: ["C++", "Algorithms", "Data Structures"]
      }
    ]);
  }, []);

  const filteredContests = contests.filter(contest => {
    if (filter !== "all" && contest.type !== filter) return false;
    if (statusFilter !== "all" && contest.status !== statusFilter) return false;
    return true;
  });

  const handleRegister = (contest: Contest) => {
    setContests(prev => prev.map(c => 
      c.id === contest.id ? { ...c, isRegistered: true } : c
    ));
    toast({
      title: "Registration Successful",
      description: `You're now registered for ${contest.name}`,
    });
  };

  const handleAddAchievement = () => {
    if (!newAchievement.contestName || !newAchievement.rank || !newAchievement.participants) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }

    const achievement: Achievement = {
      id: Date.now().toString(),
      contestId: "custom",
      contestName: newAchievement.contestName,
      rank: parseInt(newAchievement.rank),
      participants: parseInt(newAchievement.participants),
      prize: newAchievement.prize || undefined,
      date: newAchievement.date,
      projectUrl: newAchievement.projectUrl || undefined,
      githubUrl: newAchievement.githubUrl || undefined,
      description: newAchievement.description,
      technologies: newAchievement.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    setAchievements(prev => [achievement, ...prev]);
    setIsAddDialogOpen(false);
    setNewAchievement({
      contestName: "",
      rank: "",
      participants: "",
      prize: "",
      date: "",
      projectUrl: "",
      githubUrl: "",
      description: "",
      technologies: ""
    });

    toast({
      title: "Achievement Added",
      description: "Your contest achievement has been added to your portfolio.",
    });
  };

  const getStatusColor = (status: Contest["status"]) => {
    switch (status) {
      case "upcoming": return "text-neon-cyan";
      case "ongoing": return "text-neon-green";
      case "completed": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: Contest["difficulty"]) => {
    switch (difficulty) {
      case "beginner": return "text-neon-green";
      case "intermediate": return "text-neon-purple";
      case "advanced": return "text-neon-pink";
      default: return "text-muted-foreground";
    }
  };

  const getRankColor = (rank: number, total: number) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 5) return "text-neon-yellow";
    if (percentage <= 10) return "text-neon-green";
    if (percentage <= 25) return "text-neon-cyan";
    return "text-neon-purple";
  };

  return (
    <div className="min-h-screen relative" data-testid="hackathon-tracker-page">
      <Navigation user={user} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
              Hackathon & Contest Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your participation in hackathons and coding contests. 
              Showcase your achievements and discover new opportunities.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-neon-cyan/20" data-testid="stat-total-contests">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-cyan flex items-center text-sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  Total Contests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-cyan">{achievements.length}</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-purple/20" data-testid="stat-best-rank">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-purple flex items-center text-sm">
                  <Medal className="h-4 w-4 mr-2" />
                  Best Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-purple">
                  #{Math.min(...achievements.map(a => a.rank))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-green/20" data-testid="stat-upcoming">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-green flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-green">
                  {contests.filter(c => c.status === "upcoming").length}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-neon-pink/20" data-testid="stat-registered">
              <CardHeader className="pb-2">
                <CardTitle className="text-neon-pink flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Registered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neon-pink">
                  {contests.filter(c => c.isRegistered).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Contests */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neon-cyan font-orbitron">Available Contests</h2>
                <div className="flex space-x-2">
                  <Select value={filter} onValueChange={(value: any) => setFilter(value)} data-testid="select-type-filter">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hackathon">Hackathons</SelectItem>
                      <SelectItem value="coding-contest">Coding Contests</SelectItem>
                      <SelectItem value="design-contest">Design Contests</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)} data-testid="select-status-filter">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4" data-testid="contests-list">
                {filteredContests.map((contest) => (
                  <Card key={contest.id} className="glass-card hover:border-neon-cyan/30 transition-all duration-300" data-testid={`contest-${contest.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-neon-cyan mb-2">{contest.name}</CardTitle>
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className={getStatusColor(contest.status)}>
                              {contest.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {contest.type.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(contest.difficulty)}>
                              {contest.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(contest.startDate).toLocaleDateString()} - {new Date(contest.endDate).toLocaleDateString()}
                            </div>
                            {contest.participants && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {contest.participants.toLocaleString()} participants
                              </div>
                            )}
                          </div>
                        </div>
                        {contest.prize && (
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Prize</div>
                            <div className="font-semibold text-neon-green">{contest.prize}</div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{contest.description}</p>
                      {contest.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {contest.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        {contest.isRegistered ? (
                          <Badge variant="secondary" className="text-neon-green">
                            <Star className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRegister(contest)}
                            disabled={contest.status === "completed"}
                            data-testid={`button-register-${contest.id}`}
                          >
                            Register
                          </Button>
                        )}
                        {contest.registrationUrl && (
                          <Button size="sm" variant="outline" asChild data-testid={`button-view-${contest.id}`}>
                            <a href={contest.registrationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Details
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neon-purple font-orbitron">Your Achievements</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-add-achievement">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Contest Achievement</DialogTitle>
                      <DialogDescription>
                        Add your participation or win in hackathons and coding contests to your portfolio.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contest-name">Contest Name *</Label>
                        <Input
                          id="contest-name"
                          value={newAchievement.contestName}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, contestName: e.target.value }))}
                          placeholder="e.g., NASA Space Apps Challenge"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newAchievement.date}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rank">Your Rank *</Label>
                        <Input
                          id="rank"
                          type="number"
                          value={newAchievement.rank}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, rank: e.target.value }))}
                          placeholder="e.g., 1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="participants">Total Participants *</Label>
                        <Input
                          id="participants"
                          type="number"
                          value={newAchievement.participants}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, participants: e.target.value }))}
                          placeholder="e.g., 500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="prize">Prize/Recognition</Label>
                        <Input
                          id="prize"
                          value={newAchievement.prize}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, prize: e.target.value }))}
                          placeholder="e.g., $1000, Winner, Finalist"
                        />
                      </div>
                      <div>
                        <Label htmlFor="technologies">Technologies Used</Label>
                        <Input
                          id="technologies"
                          value={newAchievement.technologies}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, technologies: e.target.value }))}
                          placeholder="React, Node.js, Python (comma-separated)"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                          id="description"
                          value={newAchievement.description}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of your project or solution..."
                          className="min-h-[80px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-url">Project URL</Label>
                        <Input
                          id="project-url"
                          value={newAchievement.projectUrl}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, projectUrl: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="github-url">GitHub URL</Label>
                        <Input
                          id="github-url"
                          value={newAchievement.githubUrl}
                          onChange={(e) => setNewAchievement(prev => ({ ...prev, githubUrl: e.target.value }))}
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAchievement} data-testid="button-save-achievement">
                        Add Achievement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4" data-testid="achievements-list">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="glass-card" data-testid={`achievement-${achievement.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-neon-purple mb-2">{achievement.contestName}</CardTitle>
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="secondary" className={getRankColor(achievement.rank, achievement.participants)}>
                              <Medal className="h-3 w-3 mr-1" />
                              Rank #{achievement.rank}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              of {achievement.participants.toLocaleString()} participants
                            </div>
                            {achievement.prize && (
                              <Badge variant="outline" className="text-neon-green">
                                {achievement.prize}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                      {achievement.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {achievement.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        {achievement.projectUrl && (
                          <Button size="sm" variant="outline" asChild data-testid={`button-project-${achievement.id}`}>
                            <a href={achievement.projectUrl} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3 w-3 mr-1" />
                              View Project
                            </a>
                          </Button>
                        )}
                        {achievement.githubUrl && (
                          <Button size="sm" variant="outline" asChild data-testid={`button-github-${achievement.id}`}>
                            <a href={achievement.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {achievements.length === 0 && (
                <Card className="glass-card text-center py-12">
                  <CardContent>
                    <Target className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start participating in contests and hackathons to build your portfolio!
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Achievement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}