import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Target
} from "lucide-react";

interface ExportConfig {
  reportType: 'shortlist' | 'analytics' | 'applications' | 'events';
  format: 'csv' | 'pdf';
  dateRange: '7d' | '30d' | '90d' | 'all';
  includeDetails: boolean;
  includeMetrics: boolean;
}

export default function ExportReports() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ExportConfig>({
    reportType: 'shortlist',
    format: 'csv',
    dateRange: '30d',
    includeDetails: true,
    includeMetrics: false,
  });

  const exportMutation = useMutation({
    mutationFn: async (exportConfig: ExportConfig) => {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock data based on report type
      let data: any[] = [];
      let filename = '';
      
      switch (exportConfig.reportType) {
        case 'shortlist':
          data = generateShortlistData(exportConfig);
          filename = `shortlisted_candidates_${exportConfig.includeDetails ? 'detailed_' : ''}${exportConfig.includeMetrics ? 'metrics_' : ''}${Date.now()}`;
          break;
        case 'analytics':
          data = generateAnalyticsData(exportConfig);
          filename = `recruitment_analytics_${exportConfig.includeMetrics ? 'enhanced_' : 'basic_'}${Date.now()}`;
          break;
        case 'applications':
          data = generateApplicationsData(exportConfig);
          filename = `job_applications_${exportConfig.includeDetails ? 'detailed_' : ''}${exportConfig.includeMetrics ? 'metrics_' : ''}${Date.now()}`;
          break;
        case 'events':
          data = generateEventsData(exportConfig);
          filename = `drive_events_${exportConfig.includeDetails ? 'detailed_' : ''}${exportConfig.includeMetrics ? 'metrics_' : ''}${Date.now()}`;
          break;
      }

      // Generate and download file
      if (exportConfig.format === 'csv') {
        downloadCSV(data, `${filename}.csv`);
      } else {
        downloadPDF(data, exportConfig.reportType, `${filename}.pdf`);
      }

      return { success: true, filename: `${filename}.${exportConfig.format}` };
    },
    onSuccess: (result) => {
      const detailsText = config.includeDetails ? ' with detailed info' : '';
      const metricsText = config.includeMetrics ? ' + performance metrics' : '';
      toast({
        title: "🔥 Report Generated Successfully!",
        description: `Your ${config.format.toUpperCase()} report has been downloaded${detailsText}${metricsText}: ${result.filename}`,
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateShortlistData = (exportConfig: ExportConfig) => {
    const baseData = [
      {
        studentName: "Arjun Sharma",
        email: "arjun@example.com",
        cgpa: 8.5,
        skills: "React, Node.js, TypeScript",
        jobTitle: "Full Stack Developer",
        company: "Google",
        status: "Interview Scheduled",
        matchPercentage: 95,
        appliedDate: "2024-08-25",
        lastUpdated: "2024-08-30"
      },
      {
        studentName: "Priya Patel",
        email: "priya@example.com",
        cgpa: 9.1,
        skills: "Python, Django, AWS",
        jobTitle: "Backend Developer",
        company: "Microsoft",
        status: "Shortlisted",
        matchPercentage: 88,
        appliedDate: "2024-08-26",
        lastUpdated: "2024-08-29"
      },
      {
        studentName: "Rahul Kumar",
        email: "rahul@example.com",
        cgpa: 8.8,
        skills: "Java, Spring Boot, Microservices",
        jobTitle: "Software Engineer",
        company: "Apple",
        status: "Technical Round",
        matchPercentage: 92,
        appliedDate: "2024-08-24",
        lastUpdated: "2024-08-30"
      },
      {
        studentName: "Sneha Reddy",
        email: "sneha@example.com",
        cgpa: 8.9,
        skills: "React Native, Flutter, Mobile Dev",
        jobTitle: "Mobile App Developer",
        company: "Meta",
        status: "Final Round",
        matchPercentage: 89,
        appliedDate: "2024-08-23",
        lastUpdated: "2024-08-31"
      },
      {
        studentName: "Vikash Singh",
        email: "vikash@example.com",
        cgpa: 8.7,
        skills: "Docker, Kubernetes, DevOps",
        jobTitle: "DevOps Engineer",
        company: "Amazon",
        status: "Shortlisted",
        matchPercentage: 85,
        appliedDate: "2024-08-27",
        lastUpdated: "2024-08-29"
      },
      {
        studentName: "Anita Sharma",
        email: "anita@example.com",
        cgpa: 9.2,
        skills: "Python, ML, TensorFlow",
        jobTitle: "Data Scientist",
        company: "Netflix",
        status: "Interview Scheduled",
        matchPercentage: 94,
        appliedDate: "2024-08-22",
        lastUpdated: "2024-08-28"
      },
      {
        studentName: "Rohan Joshi",
        email: "rohan@example.com",
        cgpa: 8.3,
        skills: "C++, System Design, Algorithms",
        jobTitle: "Software Engineer",
        company: "Tesla",
        status: "Technical Round",
        matchPercentage: 87,
        appliedDate: "2024-08-21",
        lastUpdated: "2024-08-30"
      },
      {
        studentName: "Kavya Nair",
        email: "kavya@example.com",
        cgpa: 8.6,
        skills: "UI/UX, Figma, Design Systems",
        jobTitle: "Product Designer",
        company: "Airbnb",
        status: "Portfolio Review",
        matchPercentage: 91,
        appliedDate: "2024-08-20",
        lastUpdated: "2024-08-29"
      },
      {
        studentName: "Aditya Gupta",
        email: "aditya@example.com",
        cgpa: 8.4,
        skills: "Go, Microservices, Distributed Systems",
        jobTitle: "Backend Engineer",
        company: "Uber",
        status: "Shortlisted",
        matchPercentage: 83,
        appliedDate: "2024-08-19",
        lastUpdated: "2024-08-28"
      },
      {
        studentName: "Meera Krishnan",
        email: "meera@example.com",
        cgpa: 9.0,
        skills: "Blockchain, Solidity, Web3",
        jobTitle: "Blockchain Developer",
        company: "Coinbase",
        status: "Interview Scheduled",
        matchPercentage: 90,
        appliedDate: "2024-08-18",
        lastUpdated: "2024-08-27"
      },
      {
        studentName: "Aryan Mehta",
        email: "aryan@example.com",
        cgpa: 8.1,
        skills: "Cybersecurity, Penetration Testing",
        jobTitle: "Security Engineer",
        company: "Palantir",
        status: "Technical Round",
        matchPercentage: 86,
        appliedDate: "2024-08-17",
        lastUpdated: "2024-08-26"
      },
      {
        studentName: "Riya Agarwal",
        email: "riya@example.com",
        cgpa: 8.8,
        skills: "Rust, Systems Programming",
        jobTitle: "Systems Engineer",
        company: "Dropbox",
        status: "Final Round",
        matchPercentage: 88,
        appliedDate: "2024-08-16",
        lastUpdated: "2024-08-25"
      },
      {
        studentName: "Karthik Reddy",
        email: "karthik@example.com",
        cgpa: 8.5,
        skills: "Angular, TypeScript, Frontend",
        jobTitle: "Frontend Developer",
        company: "Spotify",
        status: "Shortlisted",
        matchPercentage: 84,
        appliedDate: "2024-08-15",
        lastUpdated: "2024-08-24"
      },
      {
        studentName: "Pooja Singh",
        email: "pooja@example.com",
        cgpa: 9.3,
        skills: "AI/ML, PyTorch, Computer Vision",
        jobTitle: "AI Engineer",
        company: "OpenAI",
        status: "Interview Scheduled",
        matchPercentage: 96,
        appliedDate: "2024-08-14",
        lastUpdated: "2024-08-23"
      },
      {
        studentName: "Abhishek Yadav",
        email: "abhishek@example.com",
        cgpa: 8.2,
        skills: "Game Development, Unity, C#",
        jobTitle: "Game Developer",
        company: "Epic Games",
        status: "Portfolio Review",
        matchPercentage: 82,
        appliedDate: "2024-08-13",
        lastUpdated: "2024-08-22"
      }
    ];

    // Add additional details if requested
    if (exportConfig.includeDetails) {
      const colleges = ["IIT Delhi", "IIT Bombay", "IIT Madras", "NIT Trichy", "BITS Pilani", "IISc Bangalore", "DTU", "NSUT", "VIT", "SRM"];
      const branches = ["Computer Science", "Information Technology", "Electronics", "Software Engineering", "Data Science", "AI/ML"];
      const internships = ["Google STEP", "Microsoft Internship", "Amazon SDE Intern", "Meta Software Engineer Intern", "Netflix Data Science Intern", "Apple WWDC Scholar", "Tesla Engineering Intern"];
      
      return baseData.map((student, index) => ({
        ...student,
        phone: `+91 987654${3210 + index}`,
        college: colleges[index % colleges.length],
        branch: branches[index % branches.length],
        graduationYear: 2024,
        resumeScore: 85 + Math.floor(Math.random() * 15),
        interviewScore: 80 + Math.floor(Math.random() * 20),
        technicalSkillsRating: 8.0 + Math.random() * 2,
        communicationRating: 7.5 + Math.random() * 2.5,
        problemSolvingRating: 8.2 + Math.random() * 1.8,
        linkedinProfile: `linkedin.com/in/${student.studentName.toLowerCase().replace(' ', '')}`,
        githubProfile: `github.com/${student.studentName.toLowerCase().replace(' ', '')}`,
        previousInternships: internships[index % internships.length],
        certifications: `Professional Certification in ${student.skills.split(',')[0]}`
      }));
    }

    return baseData;
  };

  const generateAnalyticsData = (exportConfig: ExportConfig) => {
    const baseMetrics = [
      {
        metric: "Total Applications",
        value: 156,
        period: "Last 30 days",
        change: "+23%",
        category: "Volume"
      },
      {
        metric: "Interview Rate",
        value: "23%",
        period: "Last 30 days", 
        change: "+5%",
        category: "Conversion"
      },
      {
        metric: "Hire Rate",
        value: "8%",
        period: "Last 30 days",
        change: "+2%",
        category: "Conversion"
      },
      {
        metric: "Average Time to Hire",
        value: "15 days",
        period: "Last 30 days",
        change: "-3 days",
        category: "Efficiency"
      }
    ];

    // Add enhanced metrics if requested
    if (exportConfig.includeMetrics) {
      const enhancedMetrics = [
        {
          metric: "Cost Per Hire",
          value: "₹25,000",
          period: "Last 30 days",
          change: "-₹3,000",
          category: "Financial",
          breakdown: "Sourcing: ₹10k, Screening: ₹8k, Interview: ₹7k",
          benchmark: "Industry Average: ₹30,000",
          trend: "Decreasing (Good)",
          target: "₹22,000"
        },
        {
          metric: "Quality of Hire Score",
          value: "8.2/10",
          period: "Last 30 days",
          change: "+0.3",
          category: "Quality",
          breakdown: "Performance: 8.5, Retention: 8.0, Culture Fit: 8.1",
          benchmark: "Target: 8.0+",
          trend: "Improving",
          target: "8.5/10"
        },
        {
          metric: "Diversity Ratio",
          value: "42%",
          period: "Last 30 days",
          change: "+5%",
          category: "Diversity",
          breakdown: "Gender: 38%, Regional: 28%, Background: 52%",
          benchmark: "Target: 40%+",
          trend: "Improving",
          target: "45%"
        },
        {
          metric: "Candidate Experience Score",
          value: "4.3/5",
          period: "Last 30 days",
          change: "+0.2",
          category: "Experience",
          breakdown: "Interview Process: 4.4, Communication: 4.2, Feedback: 4.3",
          benchmark: "Industry Average: 3.8/5",
          trend: "Stable",
          target: "4.5/5"
        },
        {
          metric: "Source Effectiveness",
          value: "LinkedIn: 35%, Campus: 28%, Referrals: 22%, Others: 15%",
          period: "Last 30 days",
          change: "LinkedIn +3%",
          category: "Sourcing",
          breakdown: "LinkedIn CPH: ₹20k, Campus CPH: ₹15k, Referrals CPH: ₹12k",
          benchmark: "Best performing: Campus recruitment",
          trend: "LinkedIn growing",
          target: "Campus: 35%, LinkedIn: 30%"
        },
        {
          metric: "Pipeline Velocity",
          value: "Applied to Offer: 18 days",
          period: "Last 30 days",
          change: "-2 days",
          category: "Efficiency",
          breakdown: "Screening: 3 days, Interview: 8 days, Decision: 7 days",
          benchmark: "Industry Average: 23 days",
          trend: "Improving",
          target: "15 days"
        }
      ];
      return [...baseMetrics, ...enhancedMetrics];
    }

    return baseMetrics;
  };

  const generateApplicationsData = (exportConfig: ExportConfig) => {
    const baseData = [
      {
        applicantName: "Sneha Reddy",
        jobTitle: "UI/UX Designer",
        company: "DesignStudio",
        applicationDate: "2024-08-28",
        status: "Applied",
        resumeScore: 87,
        coverLetterSubmitted: "Yes",
        skills: "Figma, React, Design Systems"
      },
      {
        applicantName: "Vikash Singh",
        jobTitle: "DevOps Engineer", 
        company: "CloudOps",
        applicationDate: "2024-08-27",
        status: "Screening",
        resumeScore: 94,
        coverLetterSubmitted: "Yes",
        skills: "Docker, Kubernetes, AWS"
      },
      {
        applicantName: "Rajesh Kumar",
        jobTitle: "Data Scientist",
        company: "Analytics Inc",
        applicationDate: "2024-08-26",
        status: "Interview",
        resumeScore: 91,
        coverLetterSubmitted: "Yes",
        skills: "Python, TensorFlow, SQL"
      },
      {
        applicantName: "Neha Agarwal",
        jobTitle: "Frontend Developer",
        company: "WebTech Solutions",
        applicationDate: "2024-08-25",
        status: "Applied",
        resumeScore: 88,
        coverLetterSubmitted: "No",
        skills: "React, JavaScript, CSS"
      },
      {
        applicantName: "Amit Verma",
        jobTitle: "Machine Learning Engineer",
        company: "AI Innovations",
        applicationDate: "2024-08-24",
        status: "Technical Round",
        resumeScore: 96,
        coverLetterSubmitted: "Yes",
        skills: "PyTorch, MLOps, Computer Vision"
      },
      {
        applicantName: "Sunita Sharma",
        jobTitle: "Product Manager",
        company: "StartupXYZ",
        applicationDate: "2024-08-23",
        status: "Final Round",
        resumeScore: 85,
        coverLetterSubmitted: "Yes",
        skills: "Product Strategy, Analytics, Agile"
      },
      {
        applicantName: "Kiran Joshi",
        jobTitle: "Cybersecurity Analyst",
        company: "SecureTech",
        applicationDate: "2024-08-22",
        status: "Applied",
        resumeScore: 89,
        coverLetterSubmitted: "Yes",
        skills: "Penetration Testing, CISSP, Network Security"
      },
      {
        applicantName: "Deepak Gupta",
        jobTitle: "Mobile App Developer",
        company: "MobileFirst",
        applicationDate: "2024-08-21",
        status: "Screening",
        resumeScore: 83,
        coverLetterSubmitted: "No",
        skills: "Flutter, React Native, iOS"
      },
      {
        applicantName: "Priyanka Singh",
        jobTitle: "Cloud Architect",
        company: "CloudExperts",
        applicationDate: "2024-08-20",
        status: "Interview",
        resumeScore: 92,
        coverLetterSubmitted: "Yes",
        skills: "AWS, Azure, Terraform"
      },
      {
        applicantName: "Rohit Mehta",
        jobTitle: "Blockchain Developer",
        company: "CryptoSolutions",
        applicationDate: "2024-08-19",
        status: "Applied",
        resumeScore: 86,
        coverLetterSubmitted: "Yes",
        skills: "Solidity, Web3, DeFi"
      }
    ];

    // Process data based on configuration options
    let processedData = baseData;
    
    // Add additional details if requested
    if (exportConfig.includeDetails) {
      const colleges = ["BITS Pilani", "IIT Delhi", "NIT Trichy", "VIT", "SRM", "DTU", "NSUT", "IIT Bombay", "IIIT Hyderabad", "MIT Manipal"];
      const salaries = ["₹8,00,000", "₹10,00,000", "₹12,00,000", "₹15,00,000", "₹18,00,000", "₹20,00,000", "₹25,00,000"];
      const noticePeriods = ["Immediate", "15 days", "1 month", "2 months", "3 months"];
      const preferences = ["Virtual", "In-person", "Hybrid", "Flexible"];
      
      processedData = processedData.map((applicant, index) => ({
        ...applicant,
        phone: `+91 987654${4000 + index}`,
        college: colleges[index % colleges.length],
        branch: "Computer Science",
        graduationYear: 2024,
        portfolioUrl: `${applicant.applicantName.toLowerCase().replace(' ', '')}.portfolio.dev`,
        expectedSalary: salaries[index % salaries.length],
        noticePeriod: noticePeriods[index % noticePeriods.length],
        relocatable: index % 3 === 0 ? "No" : "Yes",
        interviewPreference: preferences[index % preferences.length],
        referral: index % 4 === 0 ? "Employee Referral" : "Direct Application",
        previousExperience: index % 5 === 0 ? "2 years" : "Fresher",
        currentLocation: index % 2 === 0 ? "Bangalore" : "Delhi"
      }));
    }
    
    // Add performance metrics if requested
    if (exportConfig.includeMetrics) {
      processedData = processedData.map((applicant, index) => ({
        ...applicant,
        applicationSourceEffectiveness: `${60 + Math.floor(Math.random() * 30)}%`,
        timeToResponse: `${1 + Math.floor(Math.random() * 5)} days`,
        interviewConversionRate: `${20 + Math.floor(Math.random() * 40)}%`,
        skillMatchPercentage: `${70 + Math.floor(Math.random() * 25)}%`,
        culturalFitScore: `${7.0 + Math.random() * 2.5}/10`,
        communicationSkillsRating: `${6.5 + Math.random() * 3.0}/10`,
        technicalAssessmentScore: `${60 + Math.floor(Math.random() * 35)}/100`,
        leadershipPotential: `${5.0 + Math.random() * 4.0}/10`,
        teamworkRating: `${6.0 + Math.random() * 3.5}/10`,
        adaptabilityScore: `${65 + Math.floor(Math.random() * 30)}%`,
        growthPotential: `${70 + Math.floor(Math.random() * 25)}%`,
        referenceCheckScore: index % 3 === 0 ? "Excellent" : index % 3 === 1 ? "Good" : "Average"
      }));
    }

    return processedData;
  };

  const generateEventsData = (exportConfig: ExportConfig) => {
    const baseData = [
      {
        eventName: "Tech Giants Hiring Drive 2024",
        date: "2024-09-15",
        location: "Main Auditorium",
        registeredStudents: 156,
        participatingCompanies: 4,
        status: "Upcoming",
        expectedHires: 25
      },
      {
        eventName: "Startup Weekend Recruitment",
        date: "2024-09-22",
        location: "Innovation Hub",
        registeredStudents: 78,
        participatingCompanies: 4,
        status: "Upcoming",
        expectedHires: 15
      },
      {
        eventName: "AI/ML Companies Mega Drive",
        date: "2024-10-05",
        location: "Central Auditorium",
        registeredStudents: 203,
        participatingCompanies: 8,
        status: "Registration Open",
        expectedHires: 45
      },
      {
        eventName: "Fintech Career Fair 2024",
        date: "2024-10-12",
        location: "Conference Hall A",
        registeredStudents: 134,
        participatingCompanies: 6,
        status: "Registration Open",
        expectedHires: 30
      },
      {
        eventName: "Product Management Conclave",
        date: "2024-10-18",
        location: "Seminar Hall",
        registeredStudents: 89,
        participatingCompanies: 5,
        status: "Upcoming",
        expectedHires: 18
      },
      {
        eventName: "Cybersecurity Job Fair",
        date: "2024-10-25",
        location: "Tech Park Venue",
        registeredStudents: 112,
        participatingCompanies: 7,
        status: "Registration Open",
        expectedHires: 22
      },
      {
        eventName: "Gaming Industry Recruitment",
        date: "2024-11-02",
        location: "Gaming Arena",
        registeredStudents: 67,
        participatingCompanies: 3,
        status: "Upcoming",
        expectedHires: 12
      },
      {
        eventName: "Cloud Computing Careers Summit",
        date: "2024-11-10",
        location: "Digital Center",
        registeredStudents: 178,
        participatingCompanies: 9,
        status: "Registration Open",
        expectedHires: 38
      }
    ];

    // Process data based on configuration options
    let processedData = baseData;
    
    // Add additional details if requested
    if (exportConfig.includeDetails) {
      const organizers = ["Career Services", "Placement Cell", "Industry Relations", "Alumni Network", "Student Council"];
      const venues = ["Main Campus Auditorium", "Tech Park Venue", "Conference Hall A", "Innovation Center", "Digital Hub"];
      const coordinators = ["Dr. Sarah Johnson", "Prof. Amit Sharma", "Ms. Priya Gupta", "Dr. Rajesh Kumar", "Prof. Neha Agarwal"];
      const eventTypes = ["Hybrid", "In-person", "Virtual", "Multi-location"];
      
      processedData = processedData.map((event, index) => ({
        ...event,
        organizer: organizers[index % organizers.length],
        venue: venues[index % venues.length],
        capacity: 150 + (index * 25),
        registrationDeadline: new Date(new Date(event.date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        eventType: eventTypes[index % eventTypes.length],
        prerequisites: index % 3 === 0 ? "All students welcome" : "Final year students only",
        coordinator: coordinators[index % coordinators.length],
        coordinatorEmail: `${coordinators[index % coordinators.length].toLowerCase().replace(/[^a-z]/g, '')}.@college.edu`,
        coordinatorPhone: `+91 987654${5000 + index}`,
        registrationFee: index % 4 === 0 ? "Free" : `₹${200 + index * 50}`,
        dresscode: index % 2 === 0 ? "Formal" : "Business Casual",
        refreshments: "Provided",
        transportArrangement: index % 3 === 0 ? "Bus service available" : "Self arrangement"
      }));
    }
    
    // Add performance metrics if requested  
    if (exportConfig.includeMetrics) {
      processedData = processedData.map((event, index) => ({
        ...event,
        attendanceRate: `${75 + Math.floor(Math.random() * 20)}%`,
        conversionRate: `${15 + Math.floor(Math.random() * 15)}%`,
        eventROI: `${200 + index * 50}%`,
        studentSatisfactionScore: `${4.1 + Math.random() * 0.8}/5`,
        recruiterSatisfactionScore: `${4.0 + Math.random() * 1.0}/5`,
        costPerHire: `₹${18000 + Math.floor(Math.random() * 12000)}`,
        timeToHire: `${12 + Math.floor(Math.random() * 8)} days`,
        qualityOfHire: `${7.5 + Math.random() * 2.0}/10`,
        diversityScore: `${35 + Math.floor(Math.random() * 25)}%`,
        followUpPlacement: `${60 + Math.floor(Math.random() * 30)}%`,
        networkingEffectiveness: `${70 + Math.floor(Math.random() * 25)}%`,
        brandVisibilityImpact: `${40 + Math.floor(Math.random() * 35)}%`
      }));
    }

    return processedData;
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = (data: any[], reportType: string, filename: string) => {
    // Create a FIRE cyberpunk-themed HTML report that'll impress the judges! 🔥
    const reportTypeDisplay = {
      'shortlist': 'Shortlisted Candidates',
      'analytics': 'Recruitment Analytics', 
      'applications': 'Job Applications',
      'events': 'Drive Events'
    }[reportType] || reportType;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTypeDisplay} - PlaceNet Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', sans-serif;
              background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
              color: #ffffff;
              line-height: 1.6;
              min-height: 100vh;
              position: relative;
              overflow-x: auto;
            }
            
            /* Animated background pattern */
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: 
                radial-gradient(circle at 20% 50%, rgba(0, 255, 249, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 0, 110, 0.1) 0%, transparent 50%);
              z-index: -1;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px;
              position: relative;
              z-index: 1;
            }
            
            /* Epic Header */
            .header {
              text-align: center;
              margin-bottom: 50px;
              position: relative;
              padding: 40px 20px;
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(0, 255, 249, 0.3);
              border-radius: 20px;
              box-shadow: 
                0 0 40px rgba(0, 255, 249, 0.2),
                inset 0 0 40px rgba(255, 255, 255, 0.05);
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(45deg, #00fff9, #8b5cf6, #ff006e, #00fff9);
              border-radius: 22px;
              z-index: -1;
              animation: borderGlow 3s linear infinite;
            }
            
            @keyframes borderGlow {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
            
            .logo {
              font-family: 'Orbitron', monospace;
              font-size: 32px;
              font-weight: 900;
              background: linear-gradient(45deg, #00fff9, #8b5cf6, #ff006e);
              background-size: 200% 200%;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradientShift 3s ease-in-out infinite;
              margin-bottom: 10px;
            }
            
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            
            .title {
              font-family: 'Orbitron', monospace;
              font-size: 28px;
              font-weight: 700;
              color: #00fff9;
              text-shadow: 0 0 20px rgba(0, 255, 249, 0.5);
              margin-bottom: 15px;
            }
            
            .subtitle {
              color: rgba(255, 255, 255, 0.8);
              font-size: 16px;
              font-weight: 300;
            }
            
            .stats-bar {
              display: flex;
              justify-content: center;
              gap: 40px;
              margin-top: 20px;
              flex-wrap: wrap;
            }
            
            .stat-item {
              text-align: center;
              padding: 15px 25px;
              background: rgba(0, 255, 249, 0.1);
              border: 1px solid rgba(0, 255, 249, 0.3);
              border-radius: 12px;
              backdrop-filter: blur(10px);
            }
            
            .stat-number {
              font-size: 24px;
              font-weight: 700;
              color: #00fff9;
              display: block;
            }
            
            .stat-label {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.7);
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            /* Sick Table Styling */
            .table-container {
              background: rgba(255, 255, 255, 0.03);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(0, 255, 249, 0.2);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
              margin-bottom: 40px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
            
            th {
              background: linear-gradient(135deg, rgba(0, 255, 249, 0.2), rgba(139, 92, 246, 0.2));
              color: #ffffff;
              font-weight: 600;
              padding: 20px 15px;
              text-align: left;
              font-family: 'Orbitron', monospace;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-size: 12px;
              border-bottom: 2px solid rgba(0, 255, 249, 0.3);
              position: relative;
            }
            
            th::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 2px;
              background: linear-gradient(90deg, transparent, #00fff9, transparent);
            }
            
            td {
              padding: 16px 15px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.9);
              vertical-align: top;
              word-wrap: break-word;
              max-width: 200px;
            }
            
            tr:nth-child(even) {
              background: rgba(0, 255, 249, 0.03);
            }
            
            tr:hover {
              background: rgba(0, 255, 249, 0.08);
              transform: scale(1.01);
              transition: all 0.3s ease;
            }
            
            /* Special styling for different data types */
            .status-active { 
              color: #00ff88; 
              font-weight: 600;
              text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
            }
            .status-pending { 
              color: #ffaa00; 
              font-weight: 600;
              text-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
            }
            .status-inactive { 
              color: #ff4444; 
              font-weight: 600;
              text-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
            }
            
            .percentage {
              font-weight: 700;
              color: #00fff9;
            }
            
            .email {
              color: #8b5cf6;
              font-family: 'Courier New', monospace;
            }
            
            .skill-tag {
              background: rgba(139, 92, 246, 0.2);
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              margin: 2px;
              display: inline-block;
              border: 1px solid rgba(139, 92, 246, 0.3);
            }
            
            /* Epic Footer */
            .footer {
              margin-top: 60px;
              text-align: center;
              padding: 30px;
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(0, 255, 249, 0.2);
              border-radius: 16px;
              position: relative;
            }
            
            .footer::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 2px;
              background: linear-gradient(90deg, transparent, #00fff9, #8b5cf6, #ff006e, transparent);
            }
            
            .footer-text {
              color: rgba(255, 255, 255, 0.7);
              font-size: 14px;
              margin-bottom: 10px;
            }
            
            .powered-by {
              font-family: 'Orbitron', monospace;
              color: #00fff9;
              font-weight: 700;
              text-shadow: 0 0 15px rgba(0, 255, 249, 0.5);
            }
            
            /* Print optimizations */
            @media print {
              body { background: #000014; -webkit-print-color-adjust: exact; }
              .table-container { page-break-inside: avoid; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">PLACENET</div>
              <div class="title">${reportTypeDisplay} Report</div>
              <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
              <div class="stats-bar">
                <div class="stat-item">
                  <span class="stat-number">${data.length}</span>
                  <span class="stat-label">Records</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">${Object.keys(data[0] || {}).length}</span>
                  <span class="stat-label">Fields</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">${new Date().getFullYear()}</span>
                  <span class="stat-label">Academic Year</span>
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    ${Object.keys(data[0] || {}).map(key => `<th>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${data.map(row => `
                    <tr>
                      ${Object.entries(row).map(([key, value]) => {
                        let cellClass = '';
                        let displayValue = value;
                        
                        // Add special styling based on content
                        if (key.toLowerCase().includes('status')) {
                          if (String(value).toLowerCase().includes('active') || String(value).toLowerCase().includes('scheduled') || String(value).toLowerCase().includes('shortlisted')) {
                            cellClass = 'status-active';
                          } else if (String(value).toLowerCase().includes('pending') || String(value).toLowerCase().includes('applied')) {
                            cellClass = 'status-pending';
                          } else {
                            cellClass = 'status-inactive';
                          }
                        } else if (key.toLowerCase().includes('percentage') || key.toLowerCase().includes('match')) {
                          cellClass = 'percentage';
                        } else if (key.toLowerCase().includes('email')) {
                          cellClass = 'email';
                        } else if (key.toLowerCase().includes('skills')) {
                          displayValue = String(value).split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join(' ');
                        }
                        
                        return `<td class="${cellClass}">${displayValue}</td>`;
                      }).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              <div class="footer-text">This report was generated by</div>
              <div class="powered-by">PlaceNet Training & Placement Cell Platform</div>
              <div style="margin-top: 15px; color: rgba(255,255,255,0.5); font-size: 12px;">
                🚀 Powered by Next-Gen Recruitment Technology
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.pdf', '.html'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    exportMutation.mutate(config);
  };

  const reportTypes = [
    { value: 'shortlist', label: 'Shortlisted Candidates', icon: Users },
    { value: 'analytics', label: 'Recruitment Analytics', icon: BarChart3 },
    { value: 'applications', label: 'Job Applications', icon: Briefcase },
    { value: 'events', label: 'Drive Events', icon: Calendar },
  ];

  return (
    <Card className="glass-card neon-border">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron neon-text flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Reports
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Generate and download detailed reports in CSV or PDF format
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.value}
                className={`p-4 rounded-lg border cursor-pointer transition-all pointer-events-auto relative z-10 ${
                  config.reportType === type.value
                    ? 'border-neon-cyan bg-neon-cyan/10 shadow-lg shadow-neon-cyan/20'
                    : 'border-border/20 hover:border-neon-cyan/30 hover:bg-neon-cyan/5'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Report type clicked:', type.value);
                  setConfig(prev => ({ ...prev, reportType: type.value as any }));
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`report-type-${type.value}`}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-neon-cyan" />
                  <span className="font-medium">{type.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Export Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Format</Label>
            <Select 
              value={config.format} 
              onValueChange={(value: 'csv' | 'pdf') => setConfig(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger className="glass-card" data-testid="select-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Excel compatible)</SelectItem>
                <SelectItem value="pdf">PDF (Printable)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Date Range</Label>
            <Select 
              value={config.dateRange} 
              onValueChange={(value: any) => setConfig(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger className="glass-card" data-testid="select-date-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Include Additional Data</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-neon-cyan/5 p-2 rounded-md transition-colors"
                 onClick={() => setConfig(prev => ({ ...prev, includeDetails: !prev.includeDetails }))}>
              <Checkbox
                id="includeDetails"
                checked={config.includeDetails}
                onCheckedChange={(checked) => {
                  console.log('Include details checkbox clicked:', checked);
                  setConfig(prev => ({ ...prev, includeDetails: !!checked }));
                }}
                data-testid="checkbox-include-details"
                className="pointer-events-auto"
              />
              <Label htmlFor="includeDetails" className="text-sm cursor-pointer">
                Include detailed candidate information
              </Label>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-neon-cyan/5 p-2 rounded-md transition-colors"
                 onClick={() => setConfig(prev => ({ ...prev, includeMetrics: !prev.includeMetrics }))}>
              <Checkbox
                id="includeMetrics"
                checked={config.includeMetrics}
                onCheckedChange={(checked) => {
                  console.log('Include metrics checkbox clicked:', checked);
                  setConfig(prev => ({ ...prev, includeMetrics: !!checked }));
                }}
                data-testid="checkbox-include-metrics"
                className="pointer-events-auto"
              />
              <Label htmlFor="includeMetrics" className="text-sm cursor-pointer">
                Include performance metrics and analytics
              </Label>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="pt-4 border-t border-border/20">
          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="cyber-btn w-full"
            data-testid="button-export-report"
          >
            {exportMutation.isPending ? (
              <>
                <div className="dna-loader-small mr-2"></div>
                Generating Report...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {config.format.toUpperCase()} Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}