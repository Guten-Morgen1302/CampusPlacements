import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Video, 
  MessageSquare, 
  Users, 
  Calendar,
  Building2,
  MapPin,
  Clock,
  Star,
  Send,
  Phone,
  User,
  Mic,
  MicOff,
  VideoOff,
  Globe
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JobFairEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "ended";
  participants: number;
  companies: Company[];
}

interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  location: string;
  boothUrl?: string;
  recruiters: Recruiter[];
  openPositions: number;
  isActive: boolean;
}

interface Recruiter {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  isOnline: boolean;
  rating: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: "text" | "system";
}

export default function JobFair() {
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
  const [currentEvent, setCurrentEvent] = useState<JobFairEvent | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    // Mock job fair event data
    const mockEvent: JobFairEvent = {
      id: "1",
      name: "Tech Career Fair 2024",
      description: "Connect with top tech companies and discover your next career opportunity",
      startDate: "2024-02-01T09:00:00Z",
      endDate: "2024-02-01T18:00:00Z",
      status: "live",
      participants: 1247,
      companies: [
        {
          id: "1",
          name: "Google Inc.",
          logo: "https://via.placeholder.com/60x60?text=TC",
          description: "Leading technology company building the future of AI and cloud computing.",
          industry: "Technology",
          location: "Mountain View, CA",
          boothUrl: "https://techcorp.com/career-fair",
          openPositions: 15,
          isActive: true,
          recruiters: [
            {
              id: "1",
              name: "Priya Sharma",
              position: "Senior Recruiter",
              avatar: "https://via.placeholder.com/40x40?text=SJ",
              isOnline: true,
              rating: 4.8
            },
            {
              id: "2",
              name: "Arjun Patel",
              position: "Engineering Manager",
              avatar: "https://via.placeholder.com/40x40?text=MC",
              isOnline: true,
              rating: 4.9
            }
          ]
        },
        {
          id: "2",
          name: "Microsoft",
          logo: "https://via.placeholder.com/60x60?text=XYZ",
          description: "Fast-growing startup revolutionizing the fintech industry.",
          industry: "Fintech",
          location: "Redmond, WA",
          openPositions: 8,
          isActive: true,
          recruiters: [
            {
              id: "3",
              name: "Kavya Reddy",
              position: "Head of Talent",
              avatar: "https://via.placeholder.com/40x40?text=AR",
              isOnline: false,
              rating: 4.7
            }
          ]
        },
        {
          id: "3",
          name: "Apple Inc.",
          logo: "https://via.placeholder.com/60x60?text=IL",
          description: "R&D company focused on emerging technologies and innovation.",
          industry: "Research & Development",
          location: "Cupertino, CA",
          openPositions: 12,
          isActive: true,
          recruiters: [
            {
              id: "4",
              name: "Dr. Lisa Wang",
              position: "VP of Engineering",
              avatar: "https://via.placeholder.com/40x40?text=LW",
              isOnline: true,
              rating: 4.9
            }
          ]
        }
      ]
    };

    setCurrentEvent(mockEvent);

    // Mock chat messages
    setChatMessages([
      {
        id: "1",
        senderId: "system",
        senderName: "System",
        message: "Welcome to the Tech Career Fair 2024! Feel free to connect with recruiters.",
        timestamp: "10:00 AM",
        type: "system"
      },
      {
        id: "2",
        senderId: "1",
        senderName: "Priya Sharma",
        message: "Hi! Welcome to Google's booth. How can I help you today?",
        timestamp: "10:15 AM",
        type: "text"
      }
    ]);
  }, []);

  const handleJoinCompanyBooth = (company: Company) => {
    setSelectedCompany(company);
    toast({
      title: "Joined Company Booth",
      description: `You're now in ${company.name}'s virtual booth`,
    });
  };

  const handleStartChat = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    if (!recruiter.isOnline) {
      toast({
        title: "Recruiter Offline",
        description: `${recruiter.name} is currently offline. You can leave a message.`,
        variant: "destructive",
      });
    }
  };

  const handleStartVideoCall = (recruiter: Recruiter) => {
    if (!recruiter.isOnline) {
      toast({
        title: "Recruiter Offline",
        description: `${recruiter.name} is not available for video calls right now.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsVideoCallActive(true);
    setSelectedRecruiter(recruiter);
    toast({
      title: "Video Call Started",
      description: `Starting video call with ${recruiter.name}`,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRecruiter) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || "user",
      senderName: `${user?.firstName} ${user?.lastName}`,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate recruiter response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedRecruiter.id,
        senderName: selectedRecruiter.name,
        message: "Thank you for your interest! I'd be happy to discuss our open positions with you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    toast({
      title: "Video Call Ended",
      description: "Thank you for connecting!",
    });
  };

  if (!currentEvent) {
    return (
      <div className="min-h-screen relative">
        <Navigation user={{
          ...user,
          id: user.id,
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: user.role
        }} />
        <main className="pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
                No Active Job Fair
              </h1>
              <p className="text-muted-foreground">Check back later for upcoming job fair events.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" data-testid="job-fair-page">
      <Navigation user={{
        ...user,
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role
      }} />
      
      <main className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-4">
              {currentEvent.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              {currentEvent.description}
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Badge variant="secondary" className="text-neon-green">
                <Globe className="h-3 w-3 mr-1" />
                {currentEvent.status.toUpperCase()}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {currentEvent.participants.toLocaleString()} participants
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(currentEvent.startDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Booths */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-neon-cyan font-orbitron">Company Booths</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="company-booths">
                {currentEvent.companies.map((company) => (
                  <Card key={company.id} className="glass-card hover:border-neon-cyan/30 transition-all duration-300" data-testid={`company-booth-${company.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={company.logo} alt={company.name} />
                            <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-neon-cyan">{company.name}</CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{company.location}</span>
                            </div>
                          </div>
                        </div>
                        {company.isActive && (
                          <Badge variant="secondary" className="text-neon-green">
                            <div className="w-2 h-2 bg-neon-green rounded-full mr-1 animate-pulse" />
                            Live
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {company.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{company.industry}</Badge>
                        <div className="text-sm text-neon-purple">
                          {company.openPositions} open positions
                        </div>
                      </div>

                      {/* Recruiters */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-semibold">Available Recruiters</h4>
                        {company.recruiters.map((recruiter) => (
                          <div key={recruiter.id} className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/20">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={recruiter.avatar} alt={recruiter.name} />
                                <AvatarFallback className="text-xs">{recruiter.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-medium">{recruiter.name}</p>
                                <p className="text-xs text-muted-foreground">{recruiter.position}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                <span className="text-xs">{recruiter.rating}</span>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${recruiter.isOnline ? 'bg-neon-green' : 'bg-muted-foreground'}`} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleJoinCompanyBooth(company)}
                          className="flex-1"
                          data-testid={`button-join-booth-${company.id}`}
                        >
                          <Building2 className="h-3 w-3 mr-1" />
                          Join Booth
                        </Button>
                        {company.boothUrl && (
                          <Button size="sm" variant="outline" asChild data-testid={`button-visit-website-${company.id}`}>
                            <a href={company.boothUrl} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Chat & Video Panel */}
            <div className="space-y-6">
              {/* Active Booth */}
              {selectedCompany && (
                <Card className="glass-card" data-testid="active-booth">
                  <CardHeader>
                    <CardTitle className="text-neon-purple font-orbitron flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      {selectedCompany.name} Booth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCompany.recruiters.map((recruiter) => (
                        <div key={recruiter.id} className="flex items-center justify-between p-3 bg-background/50 rounded border border-border/20">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={recruiter.avatar} alt={recruiter.name} />
                              <AvatarFallback>{recruiter.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{recruiter.name}</p>
                              <p className="text-xs text-muted-foreground">{recruiter.position}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStartChat(recruiter)}
                                  data-testid={`button-chat-${recruiter.id}`}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl h-[600px] flex flex-col">
                                <DialogHeader>
                                  <DialogTitle>Chat with {recruiter.name}</DialogTitle>
                                  <DialogDescription>
                                    {recruiter.position} at {selectedCompany.name}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="flex-1 flex flex-col">
                                  <ScrollArea className="flex-1 p-4 border border-border/20 rounded mb-4">
                                    <div className="space-y-3">
                                      {chatMessages.map((message) => (
                                        <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`max-w-[70%] p-3 rounded-lg ${
                                            message.type === 'system' 
                                              ? 'bg-muted text-center text-sm' 
                                              : message.senderId === user?.id 
                                                ? 'bg-neon-cyan/20 text-neon-cyan' 
                                                : 'bg-background border border-border/20'
                                          }`}>
                                            {message.type !== 'system' && (
                                              <p className="text-xs font-medium mb-1">{message.senderName}</p>
                                            )}
                                            <p className="text-sm">{message.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                  
                                  <div className="flex space-x-2">
                                    <Input
                                      placeholder="Type your message..."
                                      value={newMessage}
                                      onChange={(e) => setNewMessage(e.target.value)}
                                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                      data-testid="input-chat-message"
                                    />
                                    <Button onClick={handleSendMessage} size="sm" data-testid="button-send-message">
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              onClick={() => handleStartVideoCall(recruiter)}
                              disabled={!recruiter.isOnline}
                              data-testid={`button-video-call-${recruiter.id}`}
                            >
                              <Video className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Call Interface */}
              {isVideoCallActive && selectedRecruiter && (
                <Card className="glass-card" data-testid="video-call-interface">
                  <CardHeader>
                    <CardTitle className="text-neon-green font-orbitron flex items-center">
                      <Video className="h-5 w-5 mr-2" />
                      Video Call with {selectedRecruiter.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock Video Area */}
                      <div className="aspect-video bg-background/50 rounded-lg border border-border/20 flex items-center justify-center">
                        <div className="text-center">
                          <Avatar className="h-16 w-16 mx-auto mb-3">
                            <AvatarImage src={selectedRecruiter.avatar} alt={selectedRecruiter.name} />
                            <AvatarFallback>{selectedRecruiter.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium">{selectedRecruiter.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedRecruiter.position}</p>
                        </div>
                      </div>

                      {/* Call Controls */}
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          size="sm"
                          variant={isMicOn ? "outline" : "destructive"}
                          onClick={() => setIsMicOn(!isMicOn)}
                          data-testid="button-toggle-mic"
                        >
                          {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={isVideoOn ? "outline" : "destructive"}
                          onClick={() => setIsVideoOn(!isVideoOn)}
                          data-testid="button-toggle-video"
                        >
                          {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleEndVideoCall}
                          data-testid="button-end-call"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Call duration: 00:05:23
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Event Info */}
              <Card className="glass-card" data-testid="event-info">
                <CardHeader>
                  <CardTitle className="text-neon-cyan font-orbitron">Event Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary" className="text-neon-green">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Participants</span>
                      <span>{currentEvent.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Companies</span>
                      <span>{currentEvent.companies.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>9 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}