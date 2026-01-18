import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, Building, TrendingUp, Activity, Megaphone, 
  Bell, CircleDot, AlertTriangle, CheckCircle, XCircle, 
  UserX, UserCheck, Send, Wifi, Database, Server, MonitorIcon
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'login' | 'registration' | 'application' | 'system';
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  lastLogin: string;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  server: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  websocket: 'healthy' | 'warning' | 'error';
}

interface Stats {
  totalUsers: number;
  activeToday: number;
  totalApplications: number;
  systemUptime: number;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const activityEndRef = useRef<HTMLDivElement>(null);

  // Real-time activity feed
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'login',
      user: 'arjun.sharma@iitb.ac.in',
      action: 'User logged in successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    },
    {
      id: '2', 
      type: 'application',
      user: 'priya.patel@gmail.com',
      action: 'Applied to Software Engineer position',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      status: 'success'
    },
    {
      id: '3',
      type: 'registration',
      user: 'rohit.kumar@tcs.com', 
      action: 'New recruiter registration pending',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'warning'
    }
  ]);

  // User management
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Arjun Sharma', email: 'arjun.sharma@iitb.ac.in', role: 'student', status: 'active', lastLogin: '2 minutes ago' },
    { id: '2', name: 'Kavya Reddy', email: 'kavya.reddy@infosys.com', role: 'recruiter', status: 'active', lastLogin: '1 hour ago' },
    { id: '3', name: 'Aadhya Singh', email: 'aadhya.singh@nitd.ac.in', role: 'student', status: 'disabled', lastLogin: '2 days ago' }
  ]);

  // Animated stats 
  const [stats, setStats] = useState<Stats>({
    totalUsers: 2847,
    activeToday: 342,
    totalApplications: 1234,
    systemUptime: 99.8
  });

  // System health indicators
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    server: 'healthy', 
    api: 'healthy',
    websocket: 'healthy'
  });

  // Announcement broadcaster
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  });

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

    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "This page is only for administrators.",
        variant: "destructive",
      });
      if (user.role === 'student') {
        window.location.href = "/student";
      } else if (user.role === 'recruiter') {
        window.location.href = "/recruiter";
      }
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('Admin WebSocket connected');
          setSystemHealth(prev => ({ ...prev, websocket: 'healthy' }));
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'activity') {
              const newActivity: ActivityItem = {
                id: Date.now().toString(),
                type: data.activityType,
                user: data.user,
                action: data.action,
                timestamp: new Date().toISOString(),
                status: data.status || 'success'
              };
              
              setActivities(prev => [newActivity, ...prev.slice(0, 49)]);
            }
            
            if (data.type === 'stats_update') {
              setStats(prev => ({ ...prev, ...data.stats }));
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        wsRef.current.onclose = () => {
          console.log('Admin WebSocket disconnected');
          setSystemHealth(prev => ({ ...prev, websocket: 'warning' }));
          // Reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = () => {
          setSystemHealth(prev => ({ ...prev, websocket: 'error' }));
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setSystemHealth(prev => ({ ...prev, websocket: 'error' }));
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, user]);

  // Auto-scroll activity feed
  useEffect(() => {
    activityEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activities]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random activity simulation
      const activityTypes = ['login', 'registration', 'application', 'system'] as const;
      const users = ['arjun.sharma@iitb.ac.in', 'priya.patel@gmail.com', 'rohit.kumar@wipro.com', 'admin@placenet.com'];
      const actions = [
        'User logged in successfully',
        'Applied to Software Engineer position', 
        'Updated profile information',
        'Downloaded resume',
        'System backup completed'
      ];

      const randomActivity: ActivityItem = {
        id: Date.now().toString(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.9 ? 'warning' : 'success'
      };

      setActivities(prev => [randomActivity, ...prev.slice(0, 49)]);

      // Update stats occasionally
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          activeToday: prev.activeToday + Math.floor(Math.random() * 3),
          totalApplications: prev.totalApplications + Math.floor(Math.random() * 2)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUserToggle = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' }
        : u
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Updated",
      description: `${user?.name} has been ${user?.status === 'active' ? 'disabled' : 'enabled'}`,
    });
  };

  const handleBroadcastAnnouncement = () => {
    if (!announcement.title || !announcement.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Broadcast via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'announcement',
        title: announcement.title,
        message: announcement.message,
        priority: announcement.priority,
        timestamp: new Date().toISOString()
      }));
    }

    toast({
      title: "Announcement Sent",
      description: `Broadcasted "${announcement.title}" to all users`,
    });

    setAnnouncement({ title: '', message: '', priority: 'normal' });
    setAnnouncementOpen(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return CircleDot;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return Users;
      case 'registration': return UserCheck;
      case 'application': return Building;
      case 'system': return Activity;
      default: return Bell;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dna-loader"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Navigation user={user as any} />
      
      <main className="pt-20 pb-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
              Admin Control Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time system monitoring and management
            </p>
          </div>

          {/* Animated Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card neon-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-neon-cyan animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-count-up">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-neon-green animate-bounce" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-count-up">{stats.activeToday}</div>
                <p className="text-xs text-muted-foreground">
                  Live users online
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <TrendingUp className="h-4 w-4 text-neon-purple animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-count-up">{stats.totalApplications.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +24% this month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <CheckCircle className="h-4 w-4 text-neon-orange animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-count-up">{stats.systemUptime}%</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Real-time Activity Feed */}
            <div className="lg:col-span-1">
              <Card className="glass-card neon-border h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-neon-cyan animate-pulse" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 overflow-y-auto px-4 pb-4 space-y-2">
                    {activities.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg bg-background/20 border border-white/10 animate-slide-in">
                          <IconComponent className={`h-4 w-4 mt-1 ${
                            activity.status === 'success' ? 'text-green-400' :
                            activity.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.action}</p>
                            <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={activityEndRef} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick User Actions & System Health */}
            <div className="lg:col-span-2 space-y-6">
              {/* System Health Indicators */}
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MonitorIcon className="h-5 w-5 text-neon-green" />
                    System Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(systemHealth).map(([key, status]) => {
                      const IconComponent = getHealthIcon(status);
                      return (
                        <div key={key} className="flex items-center gap-2 p-3 rounded-lg bg-background/20 border border-white/10">
                          <IconComponent className={`h-5 w-5 ${getHealthColor(status)} animate-pulse`} />
                          <div>
                            <p className="text-sm font-medium capitalize">{key === 'websocket' ? 'WebSocket' : key}</p>
                            <p className={`text-xs ${getHealthColor(status)} capitalize`}>{status}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick User Actions */}
              <Card className="glass-card neon-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-neon-purple" />
                    Quick User Management
                  </CardTitle>
                  <Dialog open={announcementOpen} onOpenChange={setAnnouncementOpen}>
                    <DialogTrigger asChild>
                      <Button className="neon-button">
                        <Megaphone className="h-4 w-4 mr-2" />
                        Broadcast
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card">
                      <DialogHeader>
                        <DialogTitle className="neon-text">Broadcast Announcement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={announcement.title}
                            onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Announcement title..."
                            className="glass-input"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            value={announcement.message}
                            onChange={(e) => setAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Your announcement message..."
                            className="glass-input"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleBroadcastAnnouncement} className="flex-1 neon-button">
                            <Send className="h-4 w-4 mr-2" />
                            Send to All Users
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/20 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            user.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email} • {user.role}</p>
                            <p className="text-xs text-muted-foreground">Last: {user.lastLogin}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {user.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserToggle(user.id)}
                            className="glass-button"
                          >
                            {user.status === 'active' ? (
                              <UserX className="h-3 w-3" />
                            ) : (
                              <UserCheck className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}