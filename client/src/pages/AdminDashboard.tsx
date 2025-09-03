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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Users, Building, TrendingUp, Activity, Settings, BarChart3, 
  Megaphone, Calendar, Database, Brain, UserPlus, FileText,
  Shield, Monitor, Bell, Search, Filter, Edit, Trash2,
  Download, Upload, RefreshCw, ChevronRight, Eye, Plus,
  Save, AlertTriangle, CheckCircle, XCircle, Mail, Phone
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  
  // User Management State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [users, setUsers] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", role: "student", status: "active", lastLogin: "2025-01-01" },
    { id: "2", name: "Jane Smith", email: "jane@company.com", role: "recruiter", status: "pending", lastLogin: "2025-01-02" },
    { id: "3", name: "Admin User", email: "admin@placenet.com", role: "admin", status: "active", lastLogin: "2025-01-03" }
  ]);
  
  // Analytics State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("placement");
  const [dateRange, setDateRange] = useState("last30");
  
  // Content Management State
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: "1", title: "Winter Placement Drive", content: "Applications open for winter placements", status: "active", scheduledDate: "2025-01-15" },
    { id: "2", title: "Resume Workshop", content: "Attend our resume building workshop", status: "scheduled", scheduledDate: "2025-01-20" }
  ]);
  
  // Event Management State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [events, setEvents] = useState([
    { id: "1", name: "Tech Placement Drive", company: "TechCorp", date: "2025-01-25", status: "scheduled", capacity: 100, registered: 45 },
    { id: "2", name: "Finance Job Fair", company: "FinanceInc", date: "2025-02-01", status: "active", capacity: 150, registered: 89 }
  ]);
  
  // System Configuration State
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    matchingThreshold: [75],
    sessionTimeout: [30],
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    maxFileSize: [10]
  });
  
  // AI Model State
  const [aiModelModalOpen, setAiModelModalOpen] = useState(false);
  const [aiModels, setAiModels] = useState([
    { id: "1", name: "Resume Analyzer v2.1", type: "BERT", status: "active", accuracy: 94.2, lastTrained: "2025-01-01" },
    { id: "2", name: "Job Matcher v1.8", type: "Collaborative Filtering", status: "training", accuracy: 87.5, lastTrained: "2024-12-28" }
  ]);

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
                    <Select value={selectedRole} onValueChange={setSelectedRole} data-testid="select-role-filter">
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="glass-button" data-testid="button-bulk-import">
                          <Upload className="h-4 w-4 mr-2" />
                          Bulk Import
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card max-w-md">
                        <DialogHeader>
                          <DialogTitle className="neon-text">Bulk Import Users</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Upload CSV File</Label>
                            <Input type="file" accept=".csv" className="glass-input" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>CSV format: email,firstName,lastName,role</p>
                            <p>Example: john@example.com,John,Doe,student</p>
                          </div>
                          <Button className="w-full neon-button">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Users
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Users Table */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>User Directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users
                            .filter(user => selectedRole === "all" || user.role === selectedRole)
                            .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(user => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge className={`
                                  ${user.role === 'student' ? 'bg-neon-cyan/20 text-neon-cyan' : ''}
                                  ${user.role === 'recruiter' ? 'bg-neon-purple/20 text-neon-purple' : ''}
                                  ${user.role === 'admin' ? 'bg-neon-green/20 text-neon-green' : ''}
                                `}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.lastLogin}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" data-testid={`button-edit-user-${user.id}`}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" data-testid={`button-delete-user-${user.id}`}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* User Management Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-cyan-500/10 border-cyan-500/20">
                      <h3 className="font-semibold text-cyan-300 mb-2">Role Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">Create/edit/delete users, change roles</p>
                      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-manage-roles">
                            Manage Roles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-md">
                          <DialogHeader>
                            <DialogTitle className="neon-text">User Role Management</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>User Email</Label>
                              <Input placeholder="user@example.com" className="glass-input" />
                            </div>
                            <div>
                              <Label>New Role</Label>
                              <Select>
                                <SelectTrigger className="glass-input">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="recruiter">Recruiter</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Button className="flex-1 neon-button">
                                <Save className="h-4 w-4 mr-2" />
                                Update Role
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                    
                    <Card className="p-4 bg-purple-500/10 border-purple-500/20">
                      <h3 className="font-semibold text-purple-300 mb-2">Bulk Operations</h3>
                      <p className="text-sm text-muted-foreground mb-3">Import students from CSV, mass changes</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-bulk-operations">
                            Bulk Actions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Bulk Operations</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Button className="w-full neon-button">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Bulk Add Users
                              </Button>
                              <Button className="w-full" variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Mass Role Change
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Button className="w-full" variant="outline">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Bulk Email
                              </Button>
                              <Button className="w-full" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export Users
                              </Button>
                            </div>
                            <div>
                              <Label>Select Users</Label>
                              <Textarea placeholder="Enter user emails separated by commas..." className="glass-input" rows={4} />
                            </div>
                            <Button className="w-full neon-button">
                              Execute Bulk Action
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                    
                    <Card className="p-4 bg-orange-500/10 border-orange-500/20">
                      <h3 className="font-semibold text-orange-300 mb-2">Activity Monitoring</h3>
                      <p className="text-sm text-muted-foreground mb-3">Track login patterns, inactive accounts</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-activity-monitor">
                            View Activity
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">User Activity Monitor</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <Card className="p-3 text-center">
                                <p className="text-sm text-muted-foreground">Active Today</p>
                                <p className="text-2xl font-bold text-green-400">247</p>
                              </Card>
                              <Card className="p-3 text-center">
                                <p className="text-sm text-muted-foreground">Inactive 7+ Days</p>
                                <p className="text-2xl font-bold text-yellow-400">89</p>
                              </Card>
                              <Card className="p-3 text-center">
                                <p className="text-sm text-muted-foreground">Never Logged In</p>
                                <p className="text-2xl font-bold text-red-400">23</p>
                              </Card>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Recent Login Activity</h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {[...Array(8)].map((_, i) => (
                                  <div key={i} className="flex justify-between items-center p-2 rounded bg-background/20">
                                    <span className="text-sm">user{i+1}@example.com</span>
                                    <span className="text-sm text-muted-foreground">{i+1} hours ago</span>
                                    <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                    
                    <Card className="p-4 bg-green-500/10 border-green-500/20">
                      <h3 className="font-semibold text-green-300 mb-2">Account Verification</h3>
                      <p className="text-sm text-muted-foreground mb-3">Approve/reject recruiter registrations</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-verify-accounts">
                            Verify Accounts
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Account Verification</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-4 mb-4">
                              <Badge className="bg-yellow-500/20 text-yellow-400">3 Pending</Badge>
                              <Badge className="bg-green-500/20 text-green-400">12 Approved Today</Badge>
                              <Badge className="bg-red-500/20 text-red-400">2 Rejected</Badge>
                            </div>
                            <div className="space-y-3">
                              {[1,2,3].map((i) => (
                                <Card key={i} className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">TechCorp Recruiter {i}</h5>
                                      <p className="text-sm text-muted-foreground">recruiter{i}@techcorp.com</p>
                                      <p className="text-xs text-muted-foreground">Company: TechCorp Inc.</p>
                                      <p className="text-xs text-muted-foreground">Applied: Jan {i}, 2025</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approve
                                      </Button>
                                      <Button size="sm" variant="outline" className="text-red-400 hover:bg-red-500/20">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-advanced-metrics">
                            View Metrics
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Advanced Metrics Dashboard</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4">
                              <h4 className="font-semibold text-cyan-300">Placement Rate</h4>
                              <p className="text-2xl font-bold">85.2%</p>
                              <p className="text-sm text-green-400">+12% vs last semester</p>
                            </Card>
                            <Card className="p-4">
                              <h4 className="font-semibold text-purple-300">Avg. Salary</h4>
                              <p className="text-2xl font-bold">₹8.5L</p>
                              <p className="text-sm text-green-400">+18% vs last year</p>
                            </Card>
                            <Card className="p-4">
                              <h4 className="font-semibold text-orange-300">Top Recruiters</h4>
                              <p className="text-sm">TCS, Infosys, Wipro</p>
                              <p className="text-sm text-muted-foreground">Most active this month</p>
                            </Card>
                            <Card className="p-4">
                              <h4 className="font-semibold text-green-300">Success Rate</h4>
                              <p className="text-2xl font-bold">92.8%</p>
                              <p className="text-sm text-green-400">Interview to offer ratio</p>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                    
                    <Card className="p-4 bg-indigo-500/10 border-indigo-500/20">
                      <h3 className="font-semibold text-indigo-300 mb-2">Report Builder</h3>
                      <p className="text-sm text-muted-foreground mb-3">Custom reports with filters and export</p>
                      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-report-builder">
                            Build Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Custom Report Builder</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Report Type</Label>
                              <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger className="glass-input">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="placement">Placement Report</SelectItem>
                                  <SelectItem value="recruiter">Recruiter Performance</SelectItem>
                                  <SelectItem value="student">Student Analytics</SelectItem>
                                  <SelectItem value="salary">Salary Trends</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Date Range</Label>
                              <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="glass-input">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="last7">Last 7 days</SelectItem>
                                  <SelectItem value="last30">Last 30 days</SelectItem>
                                  <SelectItem value="last90">Last 90 days</SelectItem>
                                  <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Button className="flex-1 neon-button">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                    
                    <Card className="p-4 bg-teal-500/10 border-teal-500/20">
                      <h3 className="font-semibold text-teal-300 mb-2">System Monitoring</h3>
                      <p className="text-sm text-muted-foreground mb-3">Server health, database performance</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-system-monitor">
                            <Monitor className="h-4 w-4 mr-1" />
                            Monitor
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">System Health Monitor</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card className="p-3">
                                <h4 className="font-semibold text-green-400 mb-2">Server Status</h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span>CPU Usage:</span><span className="text-green-400">23%</span></div>
                                  <div className="flex justify-between"><span>Memory:</span><span className="text-green-400">45%</span></div>
                                  <div className="flex justify-between"><span>Uptime:</span><span className="text-green-400">15d 4h</span></div>
                                </div>
                              </Card>
                              <Card className="p-3">
                                <h4 className="font-semibold text-blue-400 mb-2">Database</h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span>Connections:</span><span className="text-blue-400">12/100</span></div>
                                  <div className="flex justify-between"><span>Query Time:</span><span className="text-blue-400">23ms</span></div>
                                  <div className="flex justify-between"><span>Storage:</span><span className="text-blue-400">2.4GB</span></div>
                                </div>
                              </Card>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">API Response Times</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between p-2 rounded bg-background/20">
                                  <span>/api/auth</span><span className="text-green-400">45ms</span>
                                </div>
                                <div className="flex justify-between p-2 rounded bg-background/20">
                                  <span>/api/jobs</span><span className="text-green-400">67ms</span>
                                </div>
                                <div className="flex justify-between p-2 rounded bg-background/20">
                                  <span>/api/applications</span><span className="text-yellow-400">124ms</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                    
                    <Card className="p-4 bg-red-500/10 border-red-500/20">
                      <h3 className="font-semibold text-red-300 mb-2">Audit Logs</h3>
                      <p className="text-sm text-muted-foreground mb-3">Track admin actions, security events</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-audit-logs">
                            <Shield className="h-4 w-4 mr-1" />
                            View Logs
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Security Audit Logs</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-2 mb-4">
                              <Button size="sm" variant="outline">All Events</Button>
                              <Button size="sm" variant="outline">Login Events</Button>
                              <Button size="sm" variant="outline">Admin Actions</Button>
                              <Button size="sm" variant="outline">Security Alerts</Button>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="p-3 rounded bg-background/20">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-sm font-medium">
                                        {i % 3 === 0 ? 'Admin Login' : i % 3 === 1 ? 'User Role Changed' : 'Failed Login Attempt'}
                                      </p>
                                      <p className="text-xs text-muted-foreground">admin@placenet.com</p>
                                    </div>
                                    <div className="text-right">
                                      <Badge className={i % 3 === 2 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                                        {i % 3 === 2 ? 'Alert' : 'Success'}
                                      </Badge>
                                      <p className="text-xs text-muted-foreground mt-1">{i+1} hours ago</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={announcementModalOpen} onOpenChange={setAnnouncementModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-manage-announcements">
                            <Megaphone className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Announcement Manager</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Title</Label>
                                <Input placeholder="Announcement title" className="glass-input" />
                              </div>
                              <div>
                                <Label>Schedule Date</Label>
                                <Input type="datetime-local" className="glass-input" />
                              </div>
                            </div>
                            <div>
                              <Label>Content</Label>
                              <Textarea placeholder="Announcement content..." className="glass-input" rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Switch id="email-notify" />
                                <Label htmlFor="email-notify">Email Notification</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="sms-notify" />
                                <Label htmlFor="sms-notify">SMS Notification</Label>
                              </div>
                            </div>
                            <Button className="w-full neon-button">
                              <Megaphone className="h-4 w-4 mr-2" />
                              Create Announcement
                            </Button>
                            
                            {/* Existing Announcements */}
                            <div className="mt-6">
                              <h4 className="font-semibold mb-2">Recent Announcements</h4>
                              {announcements.map(announcement => (
                                <Card key={announcement.id} className="p-3 mb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">{announcement.title}</h5>
                                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                                      <p className="text-xs text-muted-foreground mt-1">Scheduled: {announcement.scheduledDate}</p>
                                    </div>
                                    <Badge className={announcement.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                      {announcement.status}
                                    </Badge>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-drive-scheduler">
                            Schedule Drive
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Placement Drive Scheduler</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Event Name</Label>
                                <Input placeholder="Tech Placement Drive" className="glass-input" />
                              </div>
                              <div>
                                <Label>Company</Label>
                                <Input placeholder="Company Name" className="glass-input" />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Date & Time</Label>
                                <Input type="datetime-local" className="glass-input" />
                              </div>
                              <div>
                                <Label>Capacity</Label>
                                <Input type="number" placeholder="100" className="glass-input" />
                              </div>
                              <div>
                                <Label>Type</Label>
                                <Select>
                                  <SelectTrigger className="glass-input">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="onsite">On-site</SelectItem>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea placeholder="Drive description and requirements..." className="glass-input" rows={3} />
                            </div>
                            <Button className="w-full neon-button">
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Drive
                            </Button>
                            
                            {/* Existing Events */}
                            <div className="mt-6">
                              <h4 className="font-semibold mb-2">Upcoming Events</h4>
                              {events.map(event => (
                                <Card key={event.id} className="p-3 mb-2">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h5 className="font-medium">{event.name}</h5>
                                      <p className="text-sm text-muted-foreground">{event.company} • {event.date}</p>
                                      <p className="text-xs text-muted-foreground">Registered: {event.registered}/{event.capacity}</p>
                                    </div>
                                    <Badge className={event.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                                      {event.status}
                                    </Badge>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-platform-settings">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="neon-text">Platform Configuration</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <Label>Matching Threshold ({systemSettings.matchingThreshold[0]}%)</Label>
                              <Slider
                                value={systemSettings.matchingThreshold}
                                onValueChange={(value) => setSystemSettings({...systemSettings, matchingThreshold: value})}
                                max={100}
                                min={0}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            
                            <div>
                              <Label>Session Timeout ({systemSettings.sessionTimeout[0]} minutes)</Label>
                              <Slider
                                value={systemSettings.sessionTimeout}
                                onValueChange={(value) => setSystemSettings({...systemSettings, sessionTimeout: value})}
                                max={120}
                                min={5}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            
                            <div>
                              <Label>Max File Size ({systemSettings.maxFileSize[0]} MB)</Label>
                              <Slider
                                value={systemSettings.maxFileSize}
                                onValueChange={(value) => setSystemSettings({...systemSettings, maxFileSize: value})}
                                max={50}
                                min={1}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Email Notifications</Label>
                                <Switch 
                                  checked={systemSettings.emailNotifications}
                                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label>SMS Notifications</Label>
                                <Switch 
                                  checked={systemSettings.smsNotifications}
                                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, smsNotifications: checked})}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label>Auto Backup</Label>
                                <Switch 
                                  checked={systemSettings.autoBackup}
                                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                                />
                              </div>
                            </div>
                            
                            <Button className="w-full neon-button">
                              <Save className="h-4 w-4 mr-2" />
                              Save Configuration
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={aiModelModalOpen} onOpenChange={setAiModelModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid="button-model-config">
                            <Brain className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="neon-text">AI Model Management</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Model Name</Label>
                                <Input placeholder="Resume Analyzer v3.0" className="glass-input" />
                              </div>
                              <div>
                                <Label>Model Type</Label>
                                <Select>
                                  <SelectTrigger className="glass-input">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bert">BERT</SelectItem>
                                    <SelectItem value="gpt">GPT</SelectItem>
                                    <SelectItem value="collaborative">Collaborative Filtering</SelectItem>
                                    <SelectItem value="neural">Neural Network</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Training Data Upload</Label>
                              <Input type="file" accept=".json,.csv" className="glass-input" />
                              <p className="text-xs text-muted-foreground mt-1">Upload job descriptions and placement patterns</p>
                            </div>
                            
                            <Button className="w-full neon-button">
                              <Upload className="h-4 w-4 mr-2" />
                              Deploy Model
                            </Button>
                            
                            {/* Existing Models */}
                            <div className="mt-6">
                              <h4 className="font-semibold mb-2">Active Models</h4>
                              {aiModels.map(model => (
                                <Card key={model.id} className="p-3 mb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">{model.name}</h5>
                                      <p className="text-sm text-muted-foreground">{model.type} • Accuracy: {model.accuracy}%</p>
                                      <p className="text-xs text-muted-foreground">Last trained: {model.lastTrained}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge className={model.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                        {model.status}
                                      </Badge>
                                      <Button size="sm" variant="outline">
                                        <RefreshCw className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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