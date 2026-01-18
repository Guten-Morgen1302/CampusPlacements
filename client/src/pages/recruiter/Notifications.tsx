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
  Users,
  Trophy,
  User,
  Settings,
  Trash2,
  Check,
  Filter,
  Building2,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function RecruiterNotifications() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'interview' | 'system'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Mock recruiter notifications data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'application',
      title: 'New Application Received',
      description: 'Priya Sharma applied for Senior Frontend Developer position',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
      jobTitle: 'Senior Frontend Developer',
      applicantName: 'Priya Sharma'
    },
    {
      id: '2', 
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Interview confirmed with Arjun Patel for Backend Engineer role',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      jobTitle: 'Backend Engineer',
      applicantName: 'Arjun Patel'
    },
    {
      id: '3',
      type: 'system',
      title: 'Job Posting Approved',
      description: 'Your Full Stack Developer job posting is now live',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      jobTitle: 'Full Stack Developer'
    },
    {
      id: '4',
      type: 'application',
      title: 'Application Withdrawn',
      description: 'Rahul Gupta withdrew application for DevOps Engineer',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      jobTitle: 'DevOps Engineer',
      applicantName: 'Rahul Gupta'
    },
    {
      id: '5',
      type: 'interview',
      title: 'Interview Feedback Due',
      description: 'Please submit feedback for Kavya Singh\'s interview',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
      jobTitle: 'UI/UX Designer',
      applicantName: 'Kavya Singh'
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    applicationAlerts: true,
    interviewReminders: true,
    systemUpdates: false
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
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
      title: "All Marked as Read",
      description: "All notifications marked as read.",
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification has been deleted.",
    });
  };

  const handleBulkAction = (action: 'read' | 'delete') => {
    if (action === 'read') {
      setNotifications(prev => prev.map(n => 
        selectedNotifications.includes(n.id) ? { ...n, read: true } : n
      ));
      toast({
        title: "Bulk Action Complete",
        description: `${selectedNotifications.length} notifications marked as read.`,
      });
    } else if (action === 'delete') {
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      toast({
        title: "Bulk Delete Complete",
        description: `${selectedNotifications.length} notifications deleted.`,
      });
    }
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = {
      className: `h-5 w-5 ${
        priority === 'high' ? 'text-red-400' : 
        priority === 'medium' ? 'text-yellow-400' : 
        'text-green-400'
      }`
    };

    switch (type) {
      case 'application': return <Users {...iconProps} />;
      case 'interview': return <Calendar {...iconProps} />;
      case 'system': return <Settings {...iconProps} />;
      default: return <Bell {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="dna-loader"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== 'recruiter' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Access Denied</CardTitle>
            <CardDescription>This page is only accessible to recruiters.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Navigation user={user as any} />
      
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-orbitron font-bold neon-text mb-2" data-testid="heading-notifications">
                  Recruiter Notifications
                </h1>
                <p className="text-muted-foreground">
                  Stay updated with applications, interviews, and system updates
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="glass-card">
                  <Bell className="h-4 w-4 mr-1" />
                  {unreadCount} unread
                </Badge>
                
                {unreadCount > 0 && (
                  <Button 
                    onClick={handleMarkAllAsRead}
                    variant="outline" 
                    size="sm"
                    className="glass-card"
                    data-testid="button-mark-all-read"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="notifications" className="w-full">
              <TabsList className="glass-card">
                <TabsTrigger value="notifications" data-testid="tab-notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="settings" data-testid="tab-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-6">
                {/* Filter Controls */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-neon-cyan">
                      <Filter className="h-5 w-5" />
                      Filter Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "all", label: "All", count: notifications.length },
                        { value: "unread", label: "Unread", count: unreadCount },
                        { value: "application", label: "Applications", count: notifications.filter(n => n.type === "application").length },
                        { value: "interview", label: "Interviews", count: notifications.filter(n => n.type === "interview").length },
                        { value: "system", label: "System", count: notifications.filter(n => n.type === "system").length }
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

                {/* Bulk Actions */}
                {selectedNotifications.length > 0 && (
                  <Card className="glass-card border-neon-cyan/30">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-neon-cyan font-medium">
                          {selectedNotifications.length} notifications selected
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkAction('read')}
                            data-testid="button-bulk-read"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark Read
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleBulkAction('delete')}
                            data-testid="button-bulk-delete"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notifications List */}
                <div className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <Card className="glass-card">
                      <CardContent className="pt-6 text-center">
                        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                          No notifications found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {filter === 'unread' ? 'All caught up! No unread notifications.' : 
                           filter === 'all' ? 'No notifications yet.' :
                           `No ${filter} notifications.`}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <Card 
                        key={notification.id} 
                        className={`glass-card transition-all duration-300 hover:border-neon-cyan/50 ${
                          !notification.read ? 'border-neon-purple/50 bg-neon-purple/5' : ''
                        }`}
                        data-testid={`notification-${notification.id}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <input
                                type="checkbox"
                                checked={selectedNotifications.includes(notification.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedNotifications(prev => [...prev, notification.id]);
                                  } else {
                                    setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                                  }
                                }}
                                className="mt-1"
                                data-testid={`checkbox-notification-${notification.id}`}
                              />
                              
                              <div className="flex items-center gap-2 mt-1">
                                {getNotificationIcon(notification.type, notification.priority)}
                                <Badge 
                                  variant="outline" 
                                  className={getPriorityColor(notification.priority)}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <CardTitle className={`text-lg ${!notification.read ? 'text-neon-cyan' : ''}`}>
                                  {notification.title}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {notification.description}
                                </CardDescription>
                                
                                {/* Additional context for recruiter notifications */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {notification.jobTitle && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Briefcase className="h-3 w-3 mr-1" />
                                      {notification.jobTitle}
                                    </Badge>
                                  )}
                                  {notification.applicantName && (
                                    <Badge variant="secondary" className="text-xs">
                                      <User className="h-3 w-3 mr-1" />
                                      {notification.applicantName}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              <div className="flex gap-1">
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-8 w-8 p-0 hover:bg-neon-cyan/10"
                                    data-testid={`button-mark-read-${notification.id}`}
                                  >
                                    <CheckCircle className="h-4 w-4 text-neon-cyan" />
                                  </Button>
                                )}
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(notification.id)}
                                  className="h-8 w-8 p-0 hover:bg-red-500/10"
                                  data-testid={`button-delete-${notification.id}`}
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan">Notification Preferences</CardTitle>
                    <CardDescription>
                      Customize how you receive recruitment notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <div className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </div>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, emailNotifications: checked }))
                          }
                          data-testid="switch-email"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Push Notifications</Label>
                          <div className="text-sm text-muted-foreground">
                            Receive browser push notifications
                          </div>
                        </div>
                        <Switch
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, pushNotifications: checked }))
                          }
                          data-testid="switch-push"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Application Alerts</Label>
                          <div className="text-sm text-muted-foreground">
                            Get notified when candidates apply to your jobs
                          </div>
                        </div>
                        <Switch
                          checked={settings.applicationAlerts}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, applicationAlerts: checked }))
                          }
                          data-testid="switch-applications"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Interview Reminders</Label>
                          <div className="text-sm text-muted-foreground">
                            Reminders for scheduled interviews and feedback
                          </div>
                        </div>
                        <Switch
                          checked={settings.interviewReminders}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, interviewReminders: checked }))
                          }
                          data-testid="switch-interviews"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">System Updates</Label>
                          <div className="text-sm text-muted-foreground">
                            Platform updates and maintenance notifications
                          </div>
                        </div>
                        <Switch
                          checked={settings.systemUpdates}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, systemUpdates: checked }))
                          }
                          data-testid="switch-system"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-black hover:from-neon-purple hover:to-neon-pink"
                      data-testid="button-save-settings"
                    >
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );

  function formatTimestamp(timestamp: Date) {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}