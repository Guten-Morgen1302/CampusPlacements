import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroDashboard from "@/components/HeroDashboard";
import ResumeScanner from "@/components/ResumeScanner";
import InterviewPractice from "@/components/InterviewPractice";
import VirtualJobFair from "@/components/VirtualJobFair";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function StudentDashboard() {
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

    // Check if user has student role
    if (user && user.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "This page is only for students.",
        variant: "destructive",
      });
      // Redirect to appropriate dashboard based on role
      if (user.role === 'recruiter') {
        window.location.href = "/recruiter";
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

  if (!isAuthenticated || !user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Navigation user={user} />
      
      <main className="pt-20 pb-10">
        <HeroDashboard user={user} />
        <ResumeScanner />
        <InterviewPractice />
        <VirtualJobFair />
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-border/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-orbitron font-bold text-xl neon-text mb-4">PlaceNet</h3>
            <p className="text-muted-foreground mb-4">Student Dashboard • Powered by AI</p>
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