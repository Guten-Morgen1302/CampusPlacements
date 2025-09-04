import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ParticleSystem from "@/components/ParticleSystem";

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
import RecruiterNotifications from "@/pages/recruiter/Notifications";

function Router() {
  // Simplified routing without authentication checks for now
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      
      {/* Legacy route redirects to new student dashboard */}
      <Route path="/student" component={StudentDashboardPage} />
      
      {/* New Student Multi-Page Routes */}
      <Route path="/student/dashboard" component={StudentDashboardPage} />
      <Route path="/student/resume-scanner" component={ResumeScanner} />
      <Route path="/student/interview-practice" component={InterviewPractice} />
      <Route path="/student/cover-letter" component={CoverLetterGenerator} />
      <Route path="/student/job" component={Jobs} />
      <Route path="/student/jobs" component={Jobs} />
      <Route path="/student/progress" component={ProgressPage} />
      <Route path="/student/hackathons" component={HackathonTracker} />
      <Route path="/student/job-fair" component={JobFair} />
      <Route path="/student/skill-gap" component={SkillGapAnalyzer} />
      <Route path="/student/notifications" component={Notifications} />
      
      <Route path="/recruiter" component={RecruiterDashboard} />
      <Route path="/recruiter/notifications" component={RecruiterNotifications} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
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
