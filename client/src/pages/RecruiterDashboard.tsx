import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import RecruiterDashboard from "@/components/RecruiterDashboard";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function RecruiterPage() {
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

    // Check if user has recruiter role
    if (user && user.role !== 'recruiter' && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "This page is only for recruiters.",
        variant: "destructive",
      });
      // Redirect to appropriate dashboard based on role
      if (user.role === 'student') {
        window.location.href = "/student";
      } else if (user.role === 'admin') {
        window.location.href = "/admin";
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

  if (!isAuthenticated || !user || (user.role !== 'recruiter' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Navigation user={user as any} />
      
      <main className="pt-20 pb-10">
        <RecruiterDashboard user={user} />
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-border/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-orbitron font-bold text-xl neon-text mb-4">PlaceNet</h3>
            <p className="text-muted-foreground mb-4">Recruiter Portal • Find Top Talent</p>
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