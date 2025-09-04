import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ParticleSystem from "@/components/ParticleSystem";
import PageTransition from "@/components/PageTransition";

// Student Pages
import StudentDashboardPage from "@/pages/student/Dashboard";
import ResumeScanner from "@/pages/student/ResumeScanner";
import InterviewPractice from "@/pages/student/InterviewPractice";
import CoverLetterGenerator from "@/pages/student/CoverLetterGenerator";
import Jobs from "@/pages/student/Jobs";
import ProgressPage from "@/pages/student/Progress";
import HackathonTracker from "@/pages/student/HackathonTracker";
import JobFair from "@/pages/student/JobFair";
import SkillGapAnalyzer from "@/pages/student/SkillGapAnalyzer";
import Notifications from "@/pages/student/Notifications";
import AlumniConnect from "@/pages/student/AlumniConnect";
import RecruiterNotifications from "@/pages/recruiter/Notifications";

function Router() {
  // Simplified routing without authentication checks for now
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={() => <PageTransition><Landing /></PageTransition>} />
        <Route path="/login" component={() => <PageTransition><Login /></PageTransition>} />
        
        {/* Legacy route redirects to new student dashboard */}
        <Route path="/student" component={() => <PageTransition><StudentDashboardPage /></PageTransition>} />
        
        {/* New Student Multi-Page Routes */}
        <Route path="/student/dashboard" component={() => <PageTransition><StudentDashboardPage /></PageTransition>} />
        <Route path="/student/resume-scanner" component={() => <PageTransition><ResumeScanner /></PageTransition>} />
        <Route path="/student/interview-practice" component={() => <PageTransition><InterviewPractice /></PageTransition>} />
        <Route path="/student/cover-letter" component={() => <PageTransition><CoverLetterGenerator /></PageTransition>} />
        <Route path="/student/job" component={() => <PageTransition><Jobs /></PageTransition>} />
        <Route path="/student/jobs" component={() => <PageTransition><Jobs /></PageTransition>} />
        <Route path="/student/progress" component={() => <PageTransition><ProgressPage /></PageTransition>} />
        <Route path="/student/hackathons" component={() => <PageTransition><HackathonTracker /></PageTransition>} />
        <Route path="/student/job-fair" component={() => <PageTransition><JobFair /></PageTransition>} />
        <Route path="/student/skill-gap" component={() => <PageTransition><SkillGapAnalyzer /></PageTransition>} />
        <Route path="/student/notifications" component={() => <PageTransition><Notifications /></PageTransition>} />
        <Route path="/student/alumni-connect" component={() => <PageTransition><AlumniConnect /></PageTransition>} />
        
        <Route path="/recruiter" component={() => <PageTransition><RecruiterDashboard /></PageTransition>} />
        <Route path="/recruiter/notifications" component={() => <PageTransition><RecruiterNotifications /></PageTransition>} />
        <Route path="/admin" component={() => <PageTransition><AdminDashboard /></PageTransition>} />
        <Route component={() => <PageTransition><NotFound /></PageTransition>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="cyberpunk-bg"></div>
      {/* <ParticleSystem /> */}
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
