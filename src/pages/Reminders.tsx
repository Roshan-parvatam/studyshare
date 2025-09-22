import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, BellRing, Plus, Calendar, Clock, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'exam' | 'meeting' | 'deadline' | 'other';
  dateTime: string;
  isActive: boolean;
  notifyBefore: '1hour' | '1day' | '1week';
}

export default function Reminders() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Physics Midterm Exam',
      description: 'Room 204, Building A. Bring calculator and ID.',
      type: 'exam',
      dateTime: '2024-01-25T09:00',
      isActive: true,
      notifyBefore: '1day'
    },
    {
      id: '2',
      title: 'Project Team Meeting',
      description: 'Discuss final presentation and task allocation',
      type: 'meeting',
      dateTime: '2024-01-22T14:00',
      isActive: true,
      notifyBefore: '1hour'
    },
    {
      id: '3',
      title: 'Research Paper Submission',
      description: 'Submit final draft to professor via email',
      type: 'deadline',
      dateTime: '2024-01-28T23:59',
      isActive: true,
      notifyBefore: '1week'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [upcomingAlerts, setUpcomingAlerts] = useState<Reminder[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as Reminder['type'],
    dateTime: '',
    notifyBefore: '1day' as Reminder['notifyBefore']
  });

  // Check for upcoming reminders
  useEffect(() => {
    const checkUpcomingReminders = () => {
      const now = new Date();
      const upcoming = reminders.filter(reminder => {
        if (!reminder.isActive) return false;
        
        const reminderTime = new Date(reminder.dateTime);
        const timeDiff = reminderTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Check if reminder is within 24 hours
        if (hoursDiff <= 24 && hoursDiff > 0) {
          // Check if we should notify based on notifyBefore setting
          if (reminder.notifyBefore === '1hour' && hoursDiff <= 1) return true;
          if (reminder.notifyBefore === '1day' && hoursDiff <= 24) return true;
          if (reminder.notifyBefore === '1week' && hoursDiff <= 168) return true;
        }
        return false;
      });
      
      setUpcomingAlerts(upcoming);
    };

    checkUpcomingReminders();
    const interval = setInterval(checkUpcomingReminders, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [reminders]);

  // Show notifications for upcoming alerts
  useEffect(() => {
    upcomingAlerts.forEach(alert => {
      const reminderTime = new Date(alert.dateTime);
      const now = new Date();
      const hoursDiff = (reminderTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= 1) {
        toast({
          title: "⏰ Reminder Alert!",
          description: `${alert.title} is coming up soon!`,
          variant: "default"
        });
      }
    });
  }, [upcomingAlerts, toast]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'meeting':
        return '👥';
      case 'deadline':
        return '⏰';
      default:
        return '📌';
    }
  };

  const getTypeColor = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'exam':
        return 'destructive';
      case 'meeting':
        return 'secondary';
      case 'deadline':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.dateTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingReminder) {
      setReminders(reminders.map(r => 
        r.id === editingReminder.id 
          ? { ...r, ...formData, isActive: true }
          : r
      ));
      toast({
        title: "Success",
        description: "Reminder updated successfully",
      });
    } else {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        ...formData,
        isActive: true
      };
      setReminders([newReminder, ...reminders]);
      toast({
        title: "Success",
        description: "Reminder created successfully",
      });
    }

    setDialogOpen(false);
    setEditingReminder(null);
    setFormData({
      title: '',
      description: '',
      type: 'other',
      dateTime: '',
      notifyBefore: '1day'
    });
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      dateTime: reminder.dateTime,
      notifyBefore: reminder.notifyBefore
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Success",
      description: "Reminder deleted successfully",
    });
  };

  const handleToggleActive = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTimeUntil = (dateTime: string) => {
    const now = new Date();
    const target = new Date(dateTime);
    const diff = target.getTime() - now.getTime();
    
    if (diff < 0) return 'Past';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Soon';
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return reminder.isActive;
    if (filterType === 'inactive') return !reminder.isActive;
    return reminder.type === filterType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reminders & Notifications</h1>
          <p className="text-muted-foreground">Never miss an important academic event</p>
        </div>

        {/* Upcoming Alerts */}
        {upcomingAlerts.length > 0 && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary animate-pulse" />
                Active Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingAlerts.map(alert => {
                  const { date, time } = formatDateTime(alert.dateTime);
                  return (
                    <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getTypeIcon(alert.type)}</span>
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{date} at {time}</p>
                        </div>
                      </div>
                      <Badge variant="default">
                        {getTimeUntil(alert.dateTime)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter reminders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reminders</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
              <SelectItem value="exam">Exams</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)} className="gap-2 ml-auto">
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>

        {/* Reminders Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReminders.map(reminder => {
            const { date, time } = formatDateTime(reminder.dateTime);
            const isPast = new Date(reminder.dateTime) < new Date();
            
            return (
              <Card 
                key={reminder.id} 
                className={`${!reminder.isActive || isPast ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(reminder.type)}</span>
                      <Badge variant={getTypeColor(reminder.type)}>
                        {reminder.type}
                      </Badge>
                    </div>
                    <Switch
                      checked={reminder.isActive}
                      onCheckedChange={() => handleToggleActive(reminder.id)}
                      disabled={isPast}
                    />
                  </div>
                  <CardTitle className="text-lg mt-2">{reminder.title}</CardTitle>
                  <CardDescription>{reminder.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Notify {reminder.notifyBefore.replace('1', '1 ')}</span>
                    </div>
                  </div>
                  {!isPast && (
                    <Badge variant="outline" className="mb-3">
                      {getTimeUntil(reminder.dateTime)} remaining
                    </Badge>
                  )}
                  {isPast && (
                    <Badge variant="outline" className="mb-3 text-muted-foreground">
                      Past event
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(reminder)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReminders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reminders found. Create your first reminder!</p>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReminder ? 'Edit Reminder' : 'Create New Reminder'}</DialogTitle>
              <DialogDescription>
                Set up notifications for important academic events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Physics Midterm Exam"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Additional details..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value as Reminder['type']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateTime">Date & Time *</Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="notifyBefore">Notify Before</Label>
                <Select 
                  value={formData.notifyBefore} 
                  onValueChange={(value) => setFormData({...formData, notifyBefore: value as Reminder['notifyBefore']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                    <SelectItem value="1week">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDialogOpen(false);
                setEditingReminder(null);
                setFormData({
                  title: '',
                  description: '',
                  type: 'other',
                  dateTime: '',
                  notifyBefore: '1day'
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingReminder ? 'Update' : 'Create'} Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}