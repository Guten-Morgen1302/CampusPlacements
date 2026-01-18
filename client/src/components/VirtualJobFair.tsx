import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe,
  Users,
  MessageSquare,
  Video,
  Calendar,
  Map,
  DoorOpen,
  Eye,
  Download,
  UserPlus,
  Briefcase,
  Award,
  Coffee,
  Headphones,
  Camera,
  Monitor,
  Zap
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  recruitersOnline: number;
  positions: string[];
  description: string;
  benefits: string[];
}

interface FairStats {
  studentsOnline: number;
  companiesLive: number;
  activeChats: number;
  interviewsScheduled: number;
}

interface UserActivity {
  boothsVisited: number;
  activeChats: number;
  interviewsScheduled: number;
  resourcesDownloaded: number;
}

export default function VirtualJobFair() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [fairStats, setFairStats] = useState<FairStats>({
    studentsOnline: 1247,
    companiesLive: 23,
    activeChats: 156,
    interviewsScheduled: 42
  });
  const [userActivity, setUserActivity] = useState<UserActivity>({
    boothsVisited: 3,
    activeChats: 2,
    interviewsScheduled: 1,
    resourcesDownloaded: 5
  });

  // Mock companies data
  const [companies] = useState<Company[]>([
    {
      id: 'google',
      name: 'Google',
      logo: '🏢',
      industry: 'Technology',
      recruitersOnline: 5,
      positions: ['Software Engineer', 'Product Manager', 'Data Scientist'],
      description: 'Join us in organizing the world\'s information and making it universally accessible.',
      benefits: ['Health Insurance', 'Stock Options', 'Free Meals', 'Remote Work']
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      logo: '🏢',
      industry: 'Technology',
      recruitersOnline: 8,
      positions: ['Full Stack Developer', 'Azure Engineer', 'AI Researcher'],
      description: 'Empowering every person and organization on the planet to achieve more.',
      benefits: ['Competitive Salary', 'Learning Budget', 'Flexible Hours', 'Wellness Programs']
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: '🏢',
      industry: 'E-commerce',
      recruitersOnline: 12,
      positions: ['Cloud Engineer', 'Operations Manager', 'ML Engineer'],
      description: 'Earth\'s most customer-centric company where you can find and discover anything.',
      benefits: ['Career Growth', 'Innovation Culture', 'Global Impact', 'Diverse Teams']
    },
    {
      id: 'tesla',
      name: 'Tesla',
      logo: '🏢',
      industry: 'Automotive',
      recruitersOnline: 6,
      positions: ['Embedded Engineer', 'Mechanical Engineer', 'Battery Tech'],
      description: 'Accelerating the world\'s transition to sustainable energy.',
      benefits: ['Stock Purchase Plan', 'Medical Coverage', 'Paid Time Off', 'Employee Discounts']
    }
  ]);

  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFairStats(prev => ({
        studentsOnline: prev.studentsOnline + Math.floor(Math.random() * 10) - 5,
        companiesLive: prev.companiesLive,
        activeChats: prev.activeChats + Math.floor(Math.random() * 6) - 3,
        interviewsScheduled: prev.interviewsScheduled + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinFair = () => {
    toast({
      title: "Welcome to Virtual Job Fair! 🎉",
      description: "You're now connected to the virtual environment.",
    });
  };

  const handleVisitBooth = (company: Company) => {
    setSelectedCompany(company);
    setUserActivity(prev => ({
      ...prev,
      boothsVisited: prev.boothsVisited + 1
    }));
    
    toast({
      title: `Visiting ${company.name}`,
      description: `${company.recruitersOnline} recruiters are online to help you!`,
    });
  };

  const handleChatWithRecruiter = (companyName: string) => {
    setUserActivity(prev => ({
      ...prev,
      activeChats: prev.activeChats + 1
    }));
    
    toast({
      title: "Chat Started",
      description: `You're now chatting with ${companyName} recruiter.`,
    });
  };

  const handleScheduleInterview = (companyName: string) => {
    setUserActivity(prev => ({
      ...prev,
      interviewsScheduled: prev.interviewsScheduled + 1
    }));
    
    toast({
      title: "Interview Scheduled! 📅",
      description: `Your interview with ${companyName} has been scheduled.`,
    });
  };

  const handleDownloadResource = (resourceName: string) => {
    setUserActivity(prev => ({
      ...prev,
      resourcesDownloaded: prev.resourcesDownloaded + 1
    }));
    
    toast({
      title: "Resource Downloaded",
      description: `${resourceName} has been downloaded successfully.`,
    });
  };

  return (
    <section id="job-fair" className="min-h-screen px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-text">
            🌐 Virtual Job Fair
          </h2>
          <p className="text-xl text-muted-foreground">
            Enter the metaverse of opportunities
          </p>
        </motion.div>

        {/* 3D Job Fair Environment */}
        <motion.div 
          className="glass-card neon-border p-8 mb-8 hover-lift"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="aspect-video bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 rounded-xl relative overflow-hidden">
            {/* 3D Environment Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center"
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="text-4xl text-white" />
                </motion.div>
                <h3 className="font-orbitron font-bold text-2xl mb-4 neon-text">
                  Entering Virtual Space...
                </h3>
                <div className="dna-loader mx-auto"></div>
              </div>
            </div>

            {/* Floating Company Booths */}
            {companies.slice(0, 4).map((company, index) => {
              const positions = [
                { top: '10%', left: '10%' },
                { top: '20%', right: '20%' },
                { bottom: '20%', left: '25%' },
                { bottom: '30%', right: '15%' }
              ];

              return (
                <motion.div 
                  key={company.id}
                  className="absolute card-3d floating cursor-pointer"
                  style={positions[index]}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  onClick={() => handleVisitBooth(company)}
                  data-testid={`booth-${company.id}`}
                >
                  <div className="glass-card p-4 w-32 hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center text-2xl">
                        {company.logo}
                      </div>
                      <div className="text-xs font-semibold">{company.name}</div>
                      <div className="flex items-center justify-center mt-1">
                        <motion.div 
                          className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs text-neon-green">
                          {company.recruitersOnline} live
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* VR/AR Entry Point */}
            <div className="absolute bottom-4 right-4">
              <motion.button 
                className="glass-card p-3 hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVRMode(!isVRMode)}
                data-testid="button-vr-mode"
              >
                <div className="flex items-center space-x-2">
                  <Monitor className="text-neon-pink group-hover:animate-pulse" />
                  <span className="text-sm font-semibold">
                    {isVRMode ? 'Exit VR' : 'Enter VR Mode'}
                  </span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Fair Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Button 
              className="cyber-btn"
              onClick={handleJoinFair}
              data-testid="button-join-fair"
            >
              <DoorOpen className="mr-2 h-4 w-4" />
              Enter Fair
            </Button>
            <Button 
              className="cyber-btn"
              data-testid="button-schedule-visit"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Visit
            </Button>
            <Button 
              className="cyber-btn"
              data-testid="button-view-map"
            >
              <Map className="mr-2 h-4 w-4" />
              Fair Map
            </Button>
          </div>
        </motion.div>

        {/* Live Companies & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Companies */}
          <div className="lg:col-span-2 glass-card neon-border p-6 hover-lift">
            <h3 className="font-orbitron font-bold text-xl mb-6 neon-text">
              🏢 Live Company Booths
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companies.map((company, index) => (
                <motion.div 
                  key={company.id}
                  className="glass-card p-4 border border-border/20 hover:border-neon-cyan/30 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => handleVisitBooth(company)}
                  data-testid={`company-card-${company.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center text-2xl">
                      {company.logo}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg" data-testid={`company-name-${company.id}`}>
                        {company.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {company.industry} • {company.positions.slice(0, 2).join(' • ')}
                      </p>
                      <div className="flex items-center mt-2">
                        <motion.div 
                          className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-2"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-sm text-neon-green">
                          {company.recruitersOnline} recruiters online
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      size="sm"
                      className="cyber-btn text-xs flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVisitBooth(company);
                      }}
                      data-testid={`button-visit-${company.id}`}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Visit Booth
                    </Button>
                    <Button 
                      size="sm"
                      className="cyber-btn text-xs flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatWithRecruiter(company.name);
                      }}
                      data-testid={`button-chat-${company.id}`}
                    >
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Chat Live
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fair Statistics & User Activity */}
          <div className="space-y-6">
            {/* Live Stats */}
            <motion.div 
              className="glass-card neon-border p-6 hover-lift"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">
                📊 Live Stats
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Students Online', value: fairStats.studentsOnline.toLocaleString(), icon: Users, testId: 'stat-students' },
                  { label: 'Companies Live', value: fairStats.companiesLive, icon: Briefcase, testId: 'stat-companies' },
                  { label: 'Active Chats', value: fairStats.activeChats, icon: MessageSquare, testId: 'stat-chats' },
                  { label: 'Interviews Scheduled', value: fairStats.interviewsScheduled, icon: Calendar, testId: 'stat-interviews' }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="flex justify-between items-center p-2 glass-card border border-border/20 rounded"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    data-testid={stat.testId}
                  >
                    <div className="flex items-center space-x-2">
                      <stat.icon className="h-4 w-4 text-neon-cyan" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <motion.span 
                      className="neon-text font-semibold"
                      key={stat.value}
                      initial={{ scale: 1.2, color: 'var(--neon-green)' }}
                      animate={{ scale: 1, color: 'var(--neon-cyan)' }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Your Activity */}
            <motion.div 
              className="glass-card neon-border p-6 hover-lift"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">
                👤 Your Activity
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Eye, label: `Visited ${userActivity.boothsVisited} booths`, color: 'text-neon-green' },
                  { icon: MessageSquare, label: `${userActivity.activeChats} active chats`, color: 'text-neon-cyan' },
                  { icon: Calendar, label: `${userActivity.interviewsScheduled} interview scheduled`, color: 'text-neon-purple' },
                  { icon: Download, label: `Downloaded ${userActivity.resourcesDownloaded} resources`, color: 'text-neon-pink' }
                ].map((activity, index) => (
                  <motion.div 
                    key={activity.label}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    data-testid={`activity-${index}`}
                  >
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    <span className="text-sm">{activity.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Networking Hub */}
            <motion.div 
              className="glass-card neon-border p-6 hover-lift"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron font-bold text-lg mb-4 neon-text">
                🤝 Networking Hub
              </h3>
              <div className="space-y-3">
                {[
                  { icon: UserPlus, label: 'Find Alumni', testId: 'button-find-alumni' },
                  { icon: Users, label: 'Join Group Chat', testId: 'button-join-group-chat' },
                  { icon: Headphones, label: 'Live Workshop', testId: 'button-live-workshop' }
                ].map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Button 
                      className="w-full cyber-btn text-sm justify-start"
                      data-testid={action.testId}
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Company Detail Modal */}
        <AnimatePresence>
          {selectedCompany && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
            >
              <motion.div 
                className="glass-card neon-border p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                data-testid={`company-modal-${selectedCompany.id}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-3xl">
                      {selectedCompany.logo}
                    </div>
                    <div>
                      <h2 className="font-orbitron font-bold text-2xl neon-text">
                        {selectedCompany.name}
                      </h2>
                      <p className="text-muted-foreground">{selectedCompany.industry}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedCompany(null)}
                    className="text-2xl"
                    data-testid="button-close-modal"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 neon-text">About</h3>
                    <p className="text-muted-foreground">{selectedCompany.description}</p>
                  </div>

                  {/* Open Positions */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 neon-text">Open Positions</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.positions.map(position => (
                        <Badge key={position} className="bg-neon-cyan/20 text-neon-cyan">
                          {position}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 neon-text">Benefits</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCompany.benefits.map(benefit => (
                        <div key={benefit} className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-neon-green" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4 pt-4 border-t border-border/20">
                    <Button 
                      className="cyber-btn flex-1"
                      onClick={() => handleChatWithRecruiter(selectedCompany.name)}
                      data-testid={`button-chat-modal-${selectedCompany.id}`}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Chat
                    </Button>
                    <Button 
                      className="cyber-btn flex-1"
                      onClick={() => handleScheduleInterview(selectedCompany.name)}
                      data-testid={`button-interview-modal-${selectedCompany.id}`}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Schedule Interview
                    </Button>
                    <Button 
                      variant="outline"
                      className="glass-card border-neon-purple/30"
                      onClick={() => handleDownloadResource(`${selectedCompany.name} Company Profile`)}
                      data-testid={`button-download-modal-${selectedCompany.id}`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Resources
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
