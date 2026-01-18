import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  X, 
  FileText, 
  Github,
  Linkedin,
  ExternalLink,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from "lucide-react";
import type { Application, Job, User } from "@shared/schema";

interface ApplicationViewModalProps {
  application: Application & { 
    student?: User;
    job?: Job;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationViewModal({ application, isOpen, onClose }: ApplicationViewModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(application.status);

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await fetch(`/api/applications/${application.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: `Application status changed to ${selectedStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recruiter/applications'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  });

  const handleStatusUpdate = () => {
    if (selectedStatus !== application.status) {
      updateStatusMutation.mutate(selectedStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'screening': return 'bg-yellow-500';
      case 'interview': return 'bg-purple-500';
      case 'hired': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Application Details
                </h2>
                <p className="text-muted-foreground">
                  {application.job?.title} • {application.job?.company}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge className={`${getStatusColor(application.status)} text-white`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Applied on {formatDate(application.appliedAt)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Candidate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 text-blue-500 mr-2" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Full Name</h4>
                    <p className="text-lg">
                      {application.student?.firstName} {application.student?.lastName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Email</h4>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`mailto:${application.student?.email}`}
                        className="text-neon-cyan hover:underline"
                      >
                        {application.student?.email}
                      </a>
                    </div>
                  </div>
                </div>

                {application.expectedSalary && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Expected Salary</h4>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-lg">₹{application.expectedSalary?.toLocaleString()} LPA</span>
                    </div>
                  </div>
                )}

                {application.availableFrom && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">Available From</h4>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                      <span>{formatDate(application.availableFrom)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume and Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-green-500 mr-2" />
                  Resume & Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.resumeFile && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-red-500 mr-3" />
                      <div>
                        <p className="font-medium">Resume.pdf</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded with application
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {application.linkedinUrl && (
                    <a 
                      href={application.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}

                  {application.githubUrl && (
                    <a 
                      href={application.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <Github className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="text-sm font-medium">GitHub</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}

                  {application.portfolioUrl && (
                    <a 
                      href={application.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium">Portfolio</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            {application.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 text-orange-500 mr-2" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Answers */}
            {application.customAnswers && Object.keys(application.customAnswers).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(application.customAnswers).map(([question, answer]) => (
                    <div key={question} className="space-y-2">
                      <h4 className="font-semibold text-sm">{question}</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {answer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedStatus !== application.status && (
                    <Button 
                      onClick={handleStatusUpdate}
                      disabled={updateStatusMutation.isPending}
                      className="cyber-btn"
                    >
                      {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                    </Button>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(application.updatedAt)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-background border-t border-border p-6">
            <div className="flex items-center justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                className="cyber-btn"
                onClick={() => {
                  // TODO: Add functionality to schedule interview or send email
                  toast({
                    title: "Feature Coming Soon",
                    description: "Interview scheduling will be available soon.",
                  });
                }}
              >
                Schedule Interview
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}