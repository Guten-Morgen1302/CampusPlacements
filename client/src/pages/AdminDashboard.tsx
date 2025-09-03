import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Building, TrendingUp, Activity, Settings, BarChart3, 
  Megaphone, Calendar, Database, Brain, UserPlus, FileText,
  Shield, Monitor, Bell, Search, Filter, Edit, Trash2,
  Download, Upload, RefreshCw, ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

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

    // Check if user has admin role
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "This page is only for administrators.",
        variant: "destructive",
      });
      // Redirect to appropriate dashboard based on role
      if (user.role === 'student') {
        window.location.href = "/student";
      } else if (user.role === 'recruiter') {
        window.location.href = "/recruiter";
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

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Navigation user={user as any} />
      
      <main className="pt-20 pb-10">
        {/* Admin Overview Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
              Admin Control Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage the entire PlaceNet ecosystem
            </p>
          </div>

          {/* Overview Stats - Keep as shown in image */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card neon-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-neon-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Recruiters</CardTitle>
                <Building className="h-4 w-4 text-neon-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Placements</CardTitle>
                <TrendingUp className="h-4 w-4 text-neon-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +24% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
                <Activity className="h-4 w-4 text-neon-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  System uptime
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Feature Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 glass-card p-1">
              <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2" data-testid="tab-content">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2" data-testid="tab-events">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2" data-testid="tab-system">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2" data-testid="tab-ai">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
            </TabsList>

            {/* User Management System */}
            <TabsContent value="users" className="mt-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="neon-text">🔧 User Management System</CardTitle>
                      <p className="text-muted-foreground">Manage users, roles, and permissions</p>
                    </div>
                    <Button className="neon-button" data-testid="button-add-user">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                        data-testid="input-search-users"
                      />
                    </div>
                    <Select defaultValue="all" data-testid="select-role-filter">
                      <SelectTrigger className="w-48 glass-input">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="recruiter">Recruiters</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="glass-button" data-testid="button-bulk-import">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import
                    </Button>
                  </div>

                  {/* User Management Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-cyan-500/10 border-cyan-500/20">
                      <h3 className="font-semibold text-cyan-300 mb-2">Role Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">Create/edit/delete users, change roles</p>
                      <Button size="sm" className="w-full" data-testid="button-manage-roles">
                        Manage Roles
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                      <h3 className="font-semibold text-purple-300 mb-2">Bulk Operations</h3>
                      <p className="text-sm text-muted-foreground mb-3">Import students from CSV, mass changes</p>
                      <Button size="sm" className="w-full" data-testid="button-bulk-operations">
                        Bulk Actions
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-orange-500/10 border-orange-500/20">
                      <h3 className="font-semibold text-orange-300 mb-2">Activity Monitoring</h3>
                      <p className="text-sm text-muted-foreground mb-3">Track login patterns, inactive accounts</p>
                      <Button size="sm" className="w-full" data-testid="button-activity-monitor">
                        View Activity
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-green-500/10 border-green-500/20">
                      <h3 className="font-semibold text-green-300 mb-2">Account Verification</h3>
                      <p className="text-sm text-muted-foreground mb-3">Approve/reject recruiter registrations</p>
                      <Button size="sm" className="w-full" data-testid="button-verify-accounts">
                        Verify Accounts
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Analytics & Reports */}
            <TabsContent value="analytics" className="mt-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="neon-text">📊 Enhanced Analytics & Reports</CardTitle>
                  <p className="text-muted-foreground">Advanced metrics and custom reports</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                      <h3 className="font-semibold text-blue-300 mb-2">Advanced Metrics</h3>
                      <p className="text-sm text-muted-foreground mb-3">Placement rates, salary trends, performance</p>
                      <Button size="sm" className="w-full" data-testid="button-advanced-metrics">
                        View Metrics
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-indigo-500/10 border-indigo-500/20">
                      <h3 className="font-semibold text-indigo-300 mb-2">Report Builder</h3>
                      <p className="text-sm text-muted-foreground mb-3">Custom reports with filters and export</p>
                      <Button size="sm" className="w-full" data-testid="button-report-builder">
                        Build Report
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-teal-500/10 border-teal-500/20">
                      <h3 className="font-semibold text-teal-300 mb-2">System Monitoring</h3>
                      <p className="text-sm text-muted-foreground mb-3">Server health, database performance</p>
                      <Button size="sm" className="w-full" data-testid="button-system-monitor">
                        <Monitor className="h-4 w-4 mr-1" />
                        Monitor
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-red-500/10 border-red-500/20">
                      <h3 className="font-semibold text-red-300 mb-2">Audit Logs</h3>
                      <p className="text-sm text-muted-foreground mb-3">Track admin actions, security events</p>
                      <Button size="sm" className="w-full" data-testid="button-audit-logs">
                        <Shield className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Management System */}
            <TabsContent value="content" className="mt-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="neon-text">📢 Content Management System</CardTitle>
                  <p className="text-muted-foreground">Manage announcements, resources, and news</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                      <h3 className="font-semibold text-yellow-300 mb-2">Announcements</h3>
                      <p className="text-sm text-muted-foreground mb-3">Platform-wide announcements with scheduling</p>
                      <Button size="sm" className="w-full" data-testid="button-manage-announcements">
                        <Megaphone className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-pink-500/10 border-pink-500/20">
                      <h3 className="font-semibold text-pink-300 mb-2">Training Calendar</h3>
                      <p className="text-sm text-muted-foreground mb-3">Workshops, seminars, placement drives</p>
                      <Button size="sm" className="w-full" data-testid="button-training-calendar">
                        <Calendar className="h-4 w-4 mr-1" />
                        Calendar
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
                      <h3 className="font-semibold text-emerald-300 mb-2">Resource Library</h3>
                      <p className="text-sm text-muted-foreground mb-3">Placement guides, interview tips</p>
                      <Button size="sm" className="w-full" data-testid="button-resource-library">
                        <FileText className="h-4 w-4 mr-1" />
                        Library
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-violet-500/10 border-violet-500/20">
                      <h3 className="font-semibold text-violet-300 mb-2">News & Updates</h3>
                      <p className="text-sm text-muted-foreground mb-3">Placement news, success stories</p>
                      <Button size="sm" className="w-full" data-testid="button-news-updates">
                        <Bell className="h-4 w-4 mr-1" />
                        Updates
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Event & Drive Management */}
            <TabsContent value="events" className="mt-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="neon-text">🎯 Event & Drive Management</CardTitle>
                  <p className="text-muted-foreground">Manage placement drives and events</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-cyan-500/10 border-cyan-500/20">
                      <h3 className="font-semibold text-cyan-300 mb-2">Drive Scheduler</h3>
                      <p className="text-sm text-muted-foreground mb-3">Create events, assign recruiters, set capacity</p>
                      <Button size="sm" className="w-full" data-testid="button-drive-scheduler">
                        Schedule Drive
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                      <h3 className="font-semibold text-purple-300 mb-2">Booth Allocation</h3>
                      <p className="text-sm text-muted-foreground mb-3">Manage virtual job fair spaces</p>
                      <Button size="sm" className="w-full" data-testid="button-booth-allocation">
                        Allocate Booths
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-orange-500/10 border-orange-500/20">
                      <h3 className="font-semibold text-orange-300 mb-2">Interview Slots</h3>
                      <p className="text-sm text-muted-foreground mb-3">Coordinate timing between users</p>
                      <Button size="sm" className="w-full" data-testid="button-interview-slots">
                        Manage Slots
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-green-500/10 border-green-500/20">
                      <h3 className="font-semibold text-green-300 mb-2">Auto Reminders</h3>
                      <p className="text-sm text-muted-foreground mb-3">Email/SMS for events, deadlines</p>
                      <Button size="sm" className="w-full" data-testid="button-auto-reminders">
                        Configure
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Configuration */}
            <TabsContent value="system" className="mt-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="neon-text">⚙️ System Configuration</CardTitle>
                  <p className="text-muted-foreground">Platform settings and integrations</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-blue-500/10 border-blue-500/20">
                      <h3 className="font-semibold text-blue-300 mb-2">Platform Settings</h3>
                      <p className="text-sm text-muted-foreground mb-3">Configure scoring, matching parameters</p>
                      <Button size="sm" className="w-full" data-testid="button-platform-settings">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-indigo-500/10 border-indigo-500/20">
                      <h3 className="font-semibold text-indigo-300 mb-2">Integrations</h3>
                      <p className="text-sm text-muted-foreground mb-3">Manage APIs, video calls, email services</p>
                      <Button size="sm" className="w-full" data-testid="button-integrations">
                        Manage APIs
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-teal-500/10 border-teal-500/20">
                      <h3 className="font-semibold text-teal-300 mb-2">Data Backup</h3>
                      <p className="text-sm text-muted-foreground mb-3">Automated backups, data export tools</p>
                      <Button size="sm" className="w-full" data-testid="button-data-backup">
                        <Database className="h-4 w-4 mr-1" />
                        Backup
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-red-500/10 border-red-500/20">
                      <h3 className="font-semibold text-red-300 mb-2">Security Controls</h3>
                      <p className="text-sm text-muted-foreground mb-3">Password policies, session timeouts</p>
                      <Button size="sm" className="w-full" data-testid="button-security-controls">
                        <Shield className="h-4 w-4 mr-1" />
                        Security
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Model Management */}
            <TabsContent value="ai" className="mt-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="neon-text">🤖 AI Model Management</CardTitle>
                  <p className="text-muted-foreground">Configure AI models and training data</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
                      <h3 className="font-semibold text-emerald-300 mb-2">Model Configuration</h3>
                      <p className="text-sm text-muted-foreground mb-3">Choose AI models for resume analysis</p>
                      <Button size="sm" className="w-full" data-testid="button-model-config">
                        <Brain className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-violet-500/10 border-violet-500/20">
                      <h3 className="font-semibold text-violet-300 mb-2">Training Data</h3>
                      <p className="text-sm text-muted-foreground mb-3">Upload job descriptions, placement patterns</p>
                      <Button size="sm" className="w-full" data-testid="button-training-data">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Data
                      </Button>
                    </Card>
                    
                    <Card className="p-4 bg-amber-500/10 border-amber-500/20">
                      <h3 className="font-semibold text-amber-300 mb-2">Performance Tuning</h3>
                      <p className="text-sm text-muted-foreground mb-3">Adjust algorithms, scoring weights</p>
                      <Button size="sm" className="w-full" data-testid="button-performance-tuning">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Tune Models
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}