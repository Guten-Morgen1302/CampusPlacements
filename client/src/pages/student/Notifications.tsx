import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  Briefcase,
  GraduationCap,
  Trophy,
  User,
  Settings,
  Trash2,
  Check,
  Filter
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "job" | "interview" | "achievement" | "reminder" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSettings {
  jobAlerts: boolean;
  interviewReminders: boolean;
  achievementUpdates: boolean;
  systemMessages: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
}

export default function Notifications() {
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    jobAlerts: true,
    interviewReminders: true,
    achievementUpdates: true,
    systemMessages: true,
    emailNotifications: false,
    pushNotifications: true,
    weeklyDigest: true
  });
  const [filter, setFilter] = useState<"all" | "unread" | "job" | "interview" | "achievement">("all");

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "job",
        title: "New Job Match Found!",
        message: "We found 3 new jobs that match your profile: Senior React Developer at Google, Full Stack Engineer at Microsoft, and Frontend Developer at Apple.",
        timestamp: "2024-02-01T10:30:00Z",
        read: false,
        priority: "high",
        actionUrl: "/student/jobs",
        actionText: "View Jobs"
      },
      {
        id: "2",
        type: "interview",
        title: "Interview Reminder",
        message: "You have a mock interview scheduled for tomorrow at 2:00 PM. Make sure to prepare your answers and test your camera/microphone.",
        timestamp: "2024-02-01T09:15:00Z",
        read: false,
        priority: "high",
        actionUrl: "/student/interview-practice",
        actionText: "Prepare"
      },
      {
        id: "3",
        type: "achievement",
        title: "Achievement Unlocked: Skill Master!",
        message: "Congratulations! You've reached level 5 in React. You're now in the top 10% of students on the platform.",
        timestamp: "2024-01-31T16:45:00Z",
        read: true,
        priority: "medium",
        actionUrl: "/student/progress",
        actionText: "View Progress"
      },
      {
        id: "4",
        type: "reminder",
        title: "Resume Optimization Due",
        message: "It's been 30 days since your last resume update. Consider refreshing it with your latest achievements and skills.",
        timestamp: "2024-01-31T14:20:00Z",
        read: false,
        priority: "medium",
        actionUrl: "/student/resume-scanner",
        actionText: "Update Resume"
      },
      {
        id: "5",
        type: "job",
        title: "Application Status Update",
        message: "Your application for Software Engineer at Google has moved to the next round. The recruiter will contact you within 2-3 business days.",
        timestamp: "2024-01-30T11:30:00Z",
        read: true,
        priority: "high"
      },
      {
        id: "6",
        type: "achievement",
        title: "7-Day Learning Streak!",
        message: "Amazing! You've maintained a 7-day learning streak. Keep up the great work to unlock the 30-day streak badge.",
        timestamp: "2024-01-30T09:00:00Z",
        read: true,
        priority: "low",
        actionUrl: "/student/progress",
        actionText: "View Streak"
      },
      {
        id: "7",
        type: "system",
        title: "Platform Update",
        message: "We've added new AI features to the interview practice tool, including voice analysis and real-time feedback. Try them out!",
        timestamp: "2024-01-29T15:00:00Z",
        read: false,
        priority: "low",
        actionUrl: "/student/interview-practice",
        actionText: "Try Now"
      },
      {
        id: "8",
        type: "job",
        title: "Job Fair Registration Open",
        message: "Tech Career Fair 2024 registration is now open! Connect with 50+ top companies and attend virtual interviews.",
        timestamp: "2024-01-29T10:00:00Z",
        read: true,
        priority: "medium",
        actionUrl: "/student/job-fair",
        actionText: "Register"
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "all") return true;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast({
      title: "Marked as Read",
      description: "Notification marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification has been deleted.",
    });
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "job": return <Briefcase className="h-5 w-5 text-neon-cyan" />;
      case "interview": return <Calendar className="h-5 w-5 text-neon-purple" />;
      case "achievement": return <Trophy className="h-5 w-5 text-neon-yellow" />;
      case "reminder": return <Clock className="h-5 w-5 text-neon-pink" />;
      case "system": return <Settings className="h-5 w-5 text-neon-green" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return "border-neon-pink/40 bg-neon-pink/5";
      case "medium": return "border-neon-purple/40 bg-neon-purple/5";
      case "low": return "border-border/20 bg-background/50";
      default: return "border-border/20 bg-background/50";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen relative" data-testid="notifications-page">
      <Navigation user={{
        ...user,
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role
      }} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold font-orbitron neon-text mb-2">
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Stay updated with jobs, achievements, and reminders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-neon-cyan">
                {unreadCount} unread
              </Badge>
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" data-testid="button-mark-all-read">
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6" data-testid="notifications-tab">
              {/* Filters */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "All", count: notifications.length },
                      { value: "unread", label: "Unread", count: unreadCount },
                      { value: "job", label: "Jobs", count: notifications.filter(n => n.type === "job").length },
                      { value: "interview", label: "Interviews", count: notifications.filter(n => n.type === "interview").length },
                      { value: "achievement", label: "Achievements", count: notifications.filter(n => n.type === "achievement").length }
                    ].map((filterOption) => (
                      <Button
                        key={filterOption.value}
                        variant={filter === filterOption.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(filterOption.value as typeof filter)}
                        data-testid={`filter-${filterOption.value}`}
                      >
                        {filterOption.label} ({filterOption.count})
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications List */}
              <div className="space-y-4" data-testid="notifications-list">
                {filteredNotifications.length === 0 ? (
                  <Card className="glass-card text-center py-12">
                    <CardContent>
                      <Bell className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
                      <p className="text-muted-foreground">
                        {filter === "unread" ? "All caught up! No unread notifications." : "No notifications to show."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`glass-card transition-all duration-300 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'border-l-4 border-l-neon-cyan' : ''
                      }`}
                      data-testid={`notification-${notification.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className={`font-semibold ${!notification.read ? 'text-neon-cyan' : ''}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge variant="outline" className="capitalize text-xs">
                                  {notification.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {notification.actionUrl && notification.actionText && (
                                  <Button size="sm" asChild data-testid={`button-action-${notification.id}`}>
                                    <a href={notification.actionUrl}>
                                      {notification.actionText}
                                    </a>
                                  </Button>
                                )}
                                {!notification.read && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    data-testid={`button-mark-read-${notification.id}`}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Mark Read
                                  </Button>
                                )}
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notification.id)}
                                className="text-red-400 hover:text-red-300"
                                data-testid={`button-delete-${notification.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6" data-testid="settings-tab">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-neon-purple font-orbitron flex items-center">
                    <Settings className="h-6 w-6 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize when and how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notification Types */}
                  <div>
                    <h4 className="font-semibold mb-4">Notification Types</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Briefcase className="h-4 w-4 text-neon-cyan" />
                          <div>
                            <Label htmlFor="job-alerts" className="font-medium">Job Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
                          </div>
                        </div>
                        <Switch
                          id="job-alerts"
                          checked={settings.jobAlerts}
                          onCheckedChange={(checked) => handleSettingChange('jobAlerts', checked)}
                          data-testid="switch-job-alerts"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-neon-purple" />
                          <div>
                            <Label htmlFor="interview-reminders" className="font-medium">Interview Reminders</Label>
                            <p className="text-sm text-muted-foreground">Reminders for upcoming interviews and practice sessions</p>
                          </div>
                        </div>
                        <Switch
                          id="interview-reminders"
                          checked={settings.interviewReminders}
                          onCheckedChange={(checked) => handleSettingChange('interviewReminders', checked)}
                          data-testid="switch-interview-reminders"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Trophy className="h-4 w-4 text-neon-yellow" />
                          <div>
                            <Label htmlFor="achievement-updates" className="font-medium">Achievement Updates</Label>
                            <p className="text-sm text-muted-foreground">Notifications about badges, streaks, and milestones</p>
                          </div>
                        </div>
                        <Switch
                          id="achievement-updates"
                          checked={settings.achievementUpdates}
                          onCheckedChange={(checked) => handleSettingChange('achievementUpdates', checked)}
                          data-testid="switch-achievement-updates"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-4 w-4 text-neon-green" />
                          <div>
                            <Label htmlFor="system-messages" className="font-medium">System Messages</Label>
                            <p className="text-sm text-muted-foreground">Platform updates and important announcements</p>
                          </div>
                        </div>
                        <Switch
                          id="system-messages"
                          checked={settings.systemMessages}
                          onCheckedChange={(checked) => handleSettingChange('systemMessages', checked)}
                          data-testid="switch-system-messages"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Methods */}
                  <div className="pt-6 border-t border-border/20">
                    <h4 className="font-semibold mb-4">Delivery Methods</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                          data-testid="switch-email-notifications"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                          data-testid="switch-push-notifications"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weekly-digest" className="font-medium">Weekly Digest</Label>
                          <p className="text-sm text-muted-foreground">Weekly summary of your progress and opportunities</p>
                        </div>
                        <Switch
                          id="weekly-digest"
                          checked={settings.weeklyDigest}
                          onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                          data-testid="switch-weekly-digest"
                        />
                      </div>
                    </div>
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