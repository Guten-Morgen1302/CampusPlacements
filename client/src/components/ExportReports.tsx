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
          filename = `shortlisted_candidates_${Date.now()}`;
          break;
        case 'analytics':
          data = generateAnalyticsData(exportConfig);
          filename = `recruitment_analytics_${Date.now()}`;
          break;
        case 'applications':
          data = generateApplicationsData(exportConfig);
          filename = `job_applications_${Date.now()}`;
          break;
        case 'events':
          data = generateEventsData(exportConfig);
          filename = `drive_events_${Date.now()}`;
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
      toast({
        title: "Report Generated Successfully!",
        description: `Your ${config.format.toUpperCase()} report has been downloaded: ${result.filename}`,
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
      }
    ];

    // Add additional details if requested
    if (exportConfig.includeDetails) {
      return baseData.map(student => ({
        ...student,
        phone: "+91 9876543210",
        college: "IIT Delhi",
        branch: "Computer Science",
        graduationYear: 2024,
        resumeScore: 92,
        interviewScore: 88,
        technicalSkillsRating: 9.2,
        communicationRating: 8.7,
        problemSolvingRating: 9.0,
        linkedinProfile: "linkedin.com/in/profile",
        githubProfile: "github.com/profile",
        previousInternships: "Tech Internship 2023",
        certifications: "AWS Certified Developer"
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
          benchmark: "Industry Average: ₹30,000"
        },
        {
          metric: "Quality of Hire Score",
          value: "8.2/10",
          period: "Last 30 days",
          change: "+0.3",
          category: "Quality",
          breakdown: "Performance: 8.5, Retention: 8.0, Culture Fit: 8.1",
          benchmark: "Target: 8.0+"
        },
        {
          metric: "Diversity Ratio",
          value: "42%",
          period: "Last 30 days",
          change: "+5%",
          category: "Diversity",
          breakdown: "Gender: 38%, Regional: 28%, Background: 52%",
          benchmark: "Target: 40%+"
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
      }
    ];

    // Add additional details if requested
    if (exportConfig.includeDetails) {
      return baseData.map(applicant => ({
        ...applicant,
        phone: "+91 9876543214",
        college: "BITS Pilani",
        branch: "Computer Science",
        graduationYear: 2024,
        portfolioUrl: "portfolio.dev",
        expectedSalary: "₹12,00,000",
        noticePeriod: "Immediate",
        relocatable: "Yes",
        interviewPreference: "Virtual"
      }));
    }

    return baseData;
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
      }
    ];

    // Add additional details if requested
    if (exportConfig.includeDetails) {
      return baseData.map(event => ({
        ...event,
        organizer: "Career Services",
        venue: "Main Campus Auditorium",
        capacity: 200,
        registrationDeadline: "2024-09-20",
        eventType: "Hybrid",
        prerequisites: "Final year students only",
        coordinator: "Dr. Sarah Johnson",
        coordinatorEmail: "sarah.j@college.edu",
        coordinatorPhone: "+91 9876543217"
      }));
    }

    return baseData;
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
    // Create a simple HTML report that can be printed as PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { color: #00fff9; font-size: 24px; font-weight: bold; }
            .subtitle { color: #666; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">PlaceNet - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</div>
            <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map(key => `<th>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            This report was generated by PlaceNet Training & Placement Cell Platform
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
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  config.reportType === type.value
                    ? 'border-neon-cyan bg-neon-cyan/10'
                    : 'border-border/20 hover:border-neon-cyan/30'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, reportType: type.value as any }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`report-type-${type.value}`}
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDetails"
                checked={config.includeDetails}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeDetails: !!checked }))}
                data-testid="checkbox-include-details"
              />
              <Label htmlFor="includeDetails" className="text-sm">
                Include detailed candidate information
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetrics"
                checked={config.includeMetrics}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeMetrics: !!checked }))}
                data-testid="checkbox-include-metrics"
              />
              <Label htmlFor="includeMetrics" className="text-sm">
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