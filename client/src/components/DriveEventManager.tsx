import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Bell,
  Building2,
  Target
} from "lucide-react";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().optional(),
  maxParticipants: z.number().min(1).optional(),
  companies: z.array(z.string()).optional(),
});

type EventForm = z.infer<typeof eventSchema>;

interface DriveEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants?: number;
  companies?: string[];
  participantCount: number;
  status: 'upcoming' | 'live' | 'completed';
}

export default function DriveEventManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DriveEvent | null>(null);

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      maxParticipants: undefined,
      companies: [],
    },
  });

  // Mock data for events - in real app this would be from API
  const [events, setEvents] = useState<DriveEvent[]>([
    {
      id: "1",
      name: "Tech Giants Hiring Drive 2024",
      description: "Join top tech companies for exciting opportunities in software development, data science, and product management.",
      startDate: "2024-09-15T09:00:00Z",
      endDate: "2024-09-15T17:00:00Z",
      location: "Main Auditorium",
      maxParticipants: 200,
      companies: ["Google", "Microsoft", "Amazon", "Meta"],
      participantCount: 156,
      status: 'upcoming'
    },
    {
      id: "2", 
      name: "Startup Weekend Recruitment",
      description: "Fast-paced hiring event with emerging startups looking for innovative talent.",
      startDate: "2024-09-22T10:00:00Z",
      endDate: "2024-09-22T16:00:00Z",
      location: "Innovation Hub",
      maxParticipants: 100,
      companies: ["Zomato", "Swiggy", "Razorpay", "Paytm"],
      participantCount: 78,
      status: 'upcoming'
    },
    {
      id: "3",
      name: "Banking & Finance Career Fair",
      description: "Explore opportunities in banking, fintech, and financial services sector.",
      startDate: "2024-09-08T09:30:00Z",
      endDate: "2024-09-08T15:30:00Z",
      location: "Conference Hall A",
      maxParticipants: 150,
      companies: ["HDFC Bank", "ICICI", "Kotak", "Bajaj Finserv"],
      participantCount: 142,
      status: 'completed'
    }
  ]);

  const createEventMutation = useMutation({
    mutationFn: async (eventData: EventForm) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEvent: DriveEvent = {
        id: Date.now().toString(),
        ...eventData,
        participantCount: 0,
        status: 'upcoming'
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    },
    onSuccess: () => {
      toast({
        title: "Event Created Successfully!",
        description: "Your drive event has been scheduled and students will be notified.",
      });
      setIsFormOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: () => {
      toast({
        title: "Failed to Create Event",
        description: "There was an error creating the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (eventId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Reminders Sent!",
        description: "Automated reminders have been sent to all registered students.",
      });
    },
  });

  const onSubmit = (data: EventForm) => {
    createEventMutation.mutate(data);
  };

  const handleEdit = (event: DriveEvent) => {
    setEditingEvent(event);
    form.reset({
      name: event.name,
      description: event.description,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      location: event.location || "",
      maxParticipants: event.maxParticipants,
      companies: event.companies || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "The event has been removed from the schedule.",
    });
  };

  const sendReminder = (eventId: string) => {
    sendReminderMutation.mutate(eventId);
  };

  const getStatusBadge = (status: DriveEvent['status']) => {
    const styles = {
      upcoming: "bg-neon-cyan/20 text-neon-cyan",
      live: "bg-neon-green/20 text-neon-green animate-pulse",
      completed: "bg-gray-500/20 text-gray-400"
    };
    return (
      <Badge className={styles[status]} data-testid={`status-${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-orbitron font-bold neon-text mb-2">
            🚀 Drive & Event Management
          </h3>
          <p className="text-muted-foreground">
            Schedule recruitment drives and manage company events
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="cyber-btn"
          data-testid="button-create-event"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Drive
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card neon-border hover-lift h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-orbitron mb-2" data-testid={`event-title-${event.id}`}>
                      {event.name}
                    </CardTitle>
                    {getStatusBadge(event.status)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      data-testid={`button-edit-${event.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="text-red-400 hover:text-red-300"
                      data-testid={`button-delete-${event.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground" data-testid={`event-description-${event.id}`}>
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.participantCount} / {event.maxParticipants || '∞'} registered
                  </div>
                </div>

                {/* Companies */}
                {event.companies && event.companies.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Participating Companies
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {event.companies.map(company => (
                        <Badge key={company} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-border/20">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendReminder(event.id)}
                    disabled={sendReminderMutation.isPending || event.status === 'completed'}
                    className="flex-1"
                    data-testid={`button-remind-${event.id}`}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Send Reminder
                  </Button>
                  <Button
                    size="sm"
                    className="cyber-btn flex-1"
                    data-testid={`button-manage-${event.id}`}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Event Form Modal */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setIsFormOpen(false)}
        >
          <Card className="glass-card neon-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron neon-text">
                {editingEvent ? 'Edit Event' : 'Schedule New Drive'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Tech Giants Hiring Drive 2024"
                            className="glass-card"
                            data-testid="input-event-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the event, participating companies, and opportunities..."
                            className="glass-card"
                            data-testid="textarea-event-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="datetime-local"
                              className="glass-card"
                              data-testid="input-start-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="datetime-local"
                              className="glass-card"
                              data-testid="input-end-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. Main Auditorium"
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
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="e.g. 200"
                              className="glass-card"
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              data-testid="input-max-participants"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-border/20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsFormOpen(false);
                        setEditingEvent(null);
                        form.reset();
                      }}
                      data-testid="button-cancel-event"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="cyber-btn"
                      disabled={createEventMutation.isPending}
                      data-testid="button-save-event"
                    >
                      {createEventMutation.isPending ? (
                        <div className="dna-loader-small"></div>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          {editingEvent ? 'Update Event' : 'Schedule Event'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}