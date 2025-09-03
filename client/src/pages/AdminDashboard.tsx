import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroDashboard from "@/components/HeroDashboard";
import RecruiterDashboard from "@/components/RecruiterDashboard";
import VirtualJobFair from "@/components/VirtualJobFair";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, TrendingUp, Activity } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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
      <Navigation user={user} />
      
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
        </section>

        <HeroDashboard user={user} />
        <RecruiterDashboard user={user} />
        <VirtualJobFair />
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-border/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-orbitron font-bold text-xl neon-text mb-4">PlaceNet</h3>
            <p className="text-muted-foreground mb-4">Admin Portal • System Control</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}