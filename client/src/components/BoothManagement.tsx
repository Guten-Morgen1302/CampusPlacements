import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Eye,
  Clock,
  TrendingUp,
  Edit,
  Save,
  Camera,
  Globe,
  Calendar,
  Star,
  Zap,
  Monitor,
  UserPlus,
  CheckCircle,
  Coffee
} from 'lucide-react';

interface BoothVisitor {
  id: string;
  studentName: string;
  studentEmail: string;
  visitTime: string;
  duration: number;
  actions: string[];
  profilePicture?: string;
}

interface LiveChat {
  id: string;
  studentName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'active' | 'waiting' | 'resolved';
}

interface BoothAnalytics {
  totalVisitors: number;
  activeVisitors: number;
  todayVisitors: number;
  averageVisitDuration: number;
  chatRequests: number;
  interviewsScheduled: number;
}

interface CompanyBooth {
  companyName: string;
  industry: string;
  description: string;
  logo: string;
  benefits: string[];
  positions: string[];
  isLive: boolean;
  recruitersOnline: number;
}

export default function BoothManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Mock booth data (in real app, this would come from API)
  const [boothData, setBoothData] = useState<CompanyBooth>({
    companyName: "TechCorp Solutions",
    industry: "Technology",
    description: "Leading provider of innovative software solutions for enterprise clients. We specialize in AI, cloud computing, and digital transformation.",
    logo: "🏢",
    benefits: ["Health Insurance", "Remote Work", "Stock Options", "Learning Budget", "Flexible Hours"],
    positions: ["Software Engineer", "Data Scientist", "Product Manager", "DevOps Engineer"],
    isLive: true,
    recruitersOnline: 3
  });

  // Mock analytics data
  const [analytics] = useState<BoothAnalytics>({
    totalVisitors: 156,
    activeVisitors: 8,
    todayVisitors: 23,
    averageVisitDuration: 4.5,
    chatRequests: 12,
    interviewsScheduled: 5
  });

  // Mock visitors data
  const [recentVisitors] = useState<BoothVisitor[]>([
    {
      id: '1',
      studentName: 'Rahul Sharma',
      studentEmail: 'rahul.sharma2024@gmail.com',
      visitTime: '2 minutes ago',
      duration: 3.2,
      actions: ['Viewed positions', 'Downloaded brochure', 'Started chat']
    },
    {
      id: '2', 
      studentName: 'Priya Patel',
      studentEmail: 'priya.patel.cs@outlook.com',
      visitTime: '5 minutes ago',
      duration: 2.8,
      actions: ['Viewed company info', 'Asked questions']
    },
    {
      id: '3',
      studentName: 'Arjun Kumar',
      studentEmail: 'arjun.k.dev@gmail.com',
      visitTime: '12 minutes ago',
      duration: 5.1,
      actions: ['Viewed all positions', 'Downloaded resources', 'Scheduled interview']
    }
  ]);

  // Mock live chats
  const [liveChats] = useState<LiveChat[]>([
    {
      id: '1',
      studentName: 'Sneha Reddy',
      lastMessage: 'What are the growth opportunities for software engineers?',
      timestamp: '2 min ago',
      unreadCount: 2,
      status: 'active'
    },
    {
      id: '2',
      studentName: 'Vikash Singh', 
      lastMessage: 'Can you tell me about the interview process?',
      timestamp: '5 min ago',
      unreadCount: 1,
      status: 'waiting'
    },
    {
      id: '3',
      studentName: 'Ananya Mishra',
      lastMessage: 'Thank you for the information!',
      timestamp: '1 hour ago',
      unreadCount: 0,
      status: 'resolved'
    }
  ]);

  const toggleBoothStatus = () => {
    setBoothData(prev => ({ ...prev, isLive: !prev.isLive }));
    toast({
      title: boothData.isLive ? "Booth Offline" : "Booth Online",
      description: boothData.isLive ? "Your booth is now offline" : "Your booth is now live and accepting visitors",
    });
  };

  const saveBooth = () => {
    setIsEditing(false);
    toast({
      title: "Booth Updated",
      description: "Your company booth information has been saved successfully.",
    });
  };

  const handleChatClick = (chat: LiveChat) => {
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${chat.studentName}`,
    });
  };

  return (
    <section id="booth-management" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
            🏢 Your Company Booth
          </h2>
          <p className="text-xl text-muted-foreground">
            Manage your virtual presence and engage with students
          </p>
        </motion.div>

        {/* Booth Status Card */}
        <motion.div 
          className="glass-card neon-border p-6 mb-8 hover-lift"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-3xl">
                {boothData.logo}
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-2xl neon-text">{boothData.companyName}</h3>
                <p className="text-muted-foreground">{boothData.industry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className={`w-3 h-3 rounded-full ${boothData.isLive ? 'bg-neon-green' : 'bg-red-500'} animate-pulse`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className={`font-semibold ${boothData.isLive ? 'text-neon-green' : 'text-red-500'}`}>
                  {boothData.isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <Button 
                onClick={toggleBoothStatus}
                className={`cyber-btn ${boothData.isLive ? 'border-red-500/30' : 'border-neon-green/30'}`}
                data-testid="button-toggle-booth"
              >
                {boothData.isLive ? 'Go Offline' : 'Go Live'}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Visitors', value: analytics.activeVisitors, icon: Users, color: 'text-neon-cyan' },
              { label: 'Today\'s Visits', value: analytics.todayVisitors, icon: Eye, color: 'text-neon-green' },
              { label: 'Active Chats', value: liveChats.filter(c => c.status === 'active').length, icon: MessageSquare, color: 'text-neon-purple' },
              { label: 'Interviews Scheduled', value: analytics.interviewsScheduled, icon: Calendar, color: 'text-neon-pink' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="glass-card p-4 text-center border border-border/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`stat-${index}`}
              >
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold neon-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="chats">Live Chats</TabsTrigger>
            <TabsTrigger value="settings">Booth Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-neon-cyan" />
                    <span>Visitor Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Visitors</span>
                      <span className="font-bold text-neon-cyan">{analytics.totalVisitors}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Visit Duration</span>
                      <span className="font-bold text-neon-green">{analytics.averageVisitDuration} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Chat Conversion</span>
                      <span className="font-bold text-neon-purple">
                        {Math.round((analytics.chatRequests / analytics.totalVisitors) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-neon-green" />
                    <span>Engagement Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Position Views</span>
                      <span className="font-bold text-neon-cyan">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Resource Downloads</span>
                      <span className="font-bold text-neon-green">34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Profile Visits</span>
                      <span className="font-bold text-neon-purple">156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visitors" className="space-y-6">
            <Card className="glass-card neon-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-neon-cyan" />
                  <span>Recent Visitors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVisitors.map((visitor, index) => (
                    <motion.div 
                      key={visitor.id}
                      className="glass-card p-4 border border-border/20 hover:border-neon-cyan/30 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      data-testid={`visitor-${visitor.id}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center text-sm font-bold text-black">
                            {visitor.studentName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{visitor.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{visitor.studentEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{visitor.visitTime}</p>
                          <p className="text-xs text-muted-foreground">{visitor.duration} min</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {visitor.actions.map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats" className="space-y-6">
            <Card className="glass-card neon-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-neon-purple" />
                  <span>Live Chat Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveChats.map((chat, index) => (
                    <motion.div 
                      key={chat.id}
                      className={`glass-card p-4 border cursor-pointer transition-all duration-300 hover:scale-102 ${
                        chat.status === 'active' ? 'border-neon-green/30' : 
                        chat.status === 'waiting' ? 'border-neon-yellow/30' : 
                        'border-border/20'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      onClick={() => handleChatClick(chat)}
                      data-testid={`chat-${chat.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center text-sm font-bold text-black">
                            {chat.studentName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{chat.studentName}</h4>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={`${
                              chat.status === 'active' ? 'bg-neon-green/20 text-neon-green' : 
                              chat.status === 'waiting' ? 'bg-neon-yellow/20 text-neon-yellow' : 
                              'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {chat.status}
                          </Badge>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-neon-cyan/20 text-neon-cyan">
                              {chat.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-card neon-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-neon-cyan" />
                    <span>Booth Configuration</span>
                  </div>
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    className="cyber-btn"
                    data-testid="button-edit-booth"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input
                      value={boothData.companyName}
                      onChange={(e) => setBoothData(prev => ({ ...prev, companyName: e.target.value }))}
                      disabled={!isEditing}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <Input
                      value={boothData.industry}
                      onChange={(e) => setBoothData(prev => ({ ...prev, industry: e.target.value }))}
                      disabled={!isEditing}
                      className="glass-card"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Description</label>
                  <Textarea
                    value={boothData.description}
                    onChange={(e) => setBoothData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    className="glass-card min-h-[100px]"
                    placeholder="Describe your company and what makes it special..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Benefits & Perks</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {boothData.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-neon-green">
                        {benefit}
                        {isEditing && (
                          <button 
                            onClick={() => setBoothData(prev => ({ 
                              ...prev, 
                              benefits: prev.benefits.filter((_, i) => i !== index) 
                            }))}
                            className="ml-1 text-red-400"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <Input
                      placeholder="Add new benefit (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          setBoothData(prev => ({ 
                            ...prev, 
                            benefits: [...prev.benefits, e.currentTarget.value.trim()] 
                          }));
                          e.currentTarget.value = '';
                        }
                      }}
                      className="glass-card"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Open Positions</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {boothData.positions.map((position, index) => (
                      <Badge key={index} variant="outline" className="text-neon-cyan">
                        {position}
                        {isEditing && (
                          <button 
                            onClick={() => setBoothData(prev => ({ 
                              ...prev, 
                              positions: prev.positions.filter((_, i) => i !== index) 
                            }))}
                            className="ml-1 text-red-400"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <Input
                      placeholder="Add new position (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          setBoothData(prev => ({ 
                            ...prev, 
                            positions: [...prev.positions, e.currentTarget.value.trim()] 
                          }));
                          e.currentTarget.value = '';
                        }
                      }}
                      className="glass-card"
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button onClick={saveBooth} className="cyber-btn" data-testid="button-save-booth">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}