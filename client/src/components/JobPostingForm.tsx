import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Job } from "@shared/schema";
import { Plus, X, Building2, MapPin, DollarSign, Clock, Users } from "lucide-react";

const jobPostSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["full-time", "part-time", "internship", "contract"]),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

type JobPostForm = z.infer<typeof jobPostSchema>;

interface JobPostingFormProps {
  editingJob?: Job | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JobPostingForm({ editingJob, onClose, onSuccess }: JobPostingFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const form = useForm<JobPostForm>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: editingJob ? {
      title: editingJob.title || "",
      company: editingJob.company || "",
      location: editingJob.location || "",
      type: (editingJob.type as any) || "full-time",
      salaryMin: editingJob.salaryMin || undefined,
      salaryMax: editingJob.salaryMax || undefined,
      description: editingJob.description || "",
      requirements: editingJob.requirements || [],
      skills: editingJob.skills || [],
    } : {
      title: "",
      company: "",
      location: "",
      type: "full-time",
      salaryMin: undefined,
      salaryMax: undefined,
      description: "",
      requirements: [],
      skills: [],
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobPostForm) => {
      const method = editingJob ? 'PUT' : 'POST';
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const response = await apiRequest(method, url, jobData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: editingJob ? "Job Updated Successfully!" : "Job Posted Successfully!",
        description: editingJob 
          ? "Your job posting has been updated." 
          : "Your job posting is now live and visible to students.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recruiter/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to Post Job",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive",
      });
      console.error("Job posting error:", error);
    },
  });

  const onSubmit = (data: JobPostForm) => {
    createJobMutation.mutate(data);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const currentRequirements = form.getValues("requirements");
      form.setValue("requirements", [...currentRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = form.getValues("requirements");
    form.setValue("requirements", currentRequirements.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = form.getValues("skills");
      form.setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("skills");
    form.setValue("skills", currentSkills.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card className="glass-card neon-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-orbitron neon-text flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              Post New Job
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-job-form">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Full Stack Developer"
                          className="glass-card"
                          data-testid="input-job-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Google Inc."
                          className="glass-card"
                          data-testid="input-company"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Bangalore, India"
                          className="glass-card"
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Job Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-card" data-testid="select-job-type">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Minimum Salary (₹)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g. 500000"
                          className="glass-card"
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          data-testid="input-salary-min"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary (₹)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g. 1200000"
                          className="glass-card"
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          data-testid="input-salary-max"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                        className="glass-card min-h-[120px]"
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Requirements</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement..."
                      className="glass-card"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      data-testid="input-new-requirement"
                    />
                    <Button type="button" onClick={addRequirement} size="sm" data-testid="button-add-requirement">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("requirements").map((req, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {req}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-500/20"
                          onClick={() => removeRequirement(index)}
                          data-testid={`button-remove-requirement-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Required Skills</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      className="glass-card"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      data-testid="input-new-skill"
                    />
                    <Button type="button" onClick={addSkill} size="sm" data-testid="button-add-skill">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("skills").map((skill, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 border-neon-cyan/30">
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-500/20"
                          onClick={() => removeSkill(index)}
                          data-testid={`button-remove-skill-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-border/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  data-testid="button-cancel-job"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cyber-btn"
                  disabled={createJobMutation.isPending}
                  data-testid="button-submit-job"
                >
                  {createJobMutation.isPending ? (
                    <div className="dna-loader-small"></div>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Post Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}