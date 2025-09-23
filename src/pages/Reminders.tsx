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
import { Bell, BellRing, Plus, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReminders, useCreateReminder, useUpdateReminder, useDeleteReminder } from '@/hooks/useReminders';

export default function Reminders() {
  const { toast } = useToast();
  const { data, isLoading } = useReminders(1, 30);
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();

  const reminders = data?.items ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [upcomingAlerts, setUpcomingAlerts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    notifyBefore: '1day'
  });

  useEffect(() => {
    const checkUpcomingReminders = () => {
      const now = new Date();
      const upcoming = reminders.filter((r: any) => {
        if (r.isCompleted) return false;
        const reminderTime = new Date(r.reminderDate);
        const timeDiff = reminderTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff <= 24 && hoursDiff > 0;
      });
      setUpcomingAlerts(upcoming);
    };
    checkUpcomingReminders();
    const interval = setInterval(checkUpcomingReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

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

  const handleSubmit = async () => {
    if (!formData.title || !formData.dateTime) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    try {
      const payload = { title: formData.title, description: formData.description, reminderDate: new Date(formData.dateTime).toISOString() };
      if (editingReminderId) {
        await updateReminder.mutateAsync({ id: editingReminderId, update: payload });
        toast({ title: 'Reminder updated' });
      } else {
        await createReminder.mutateAsync(payload);
        toast({ title: 'Reminder created' });
      }
      setDialogOpen(false);
      setEditingReminderId(null);
      setFormData({ title: '', description: '', dateTime: '', notifyBefore: '1day' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.response?.data?.error?.message ?? 'Try again', variant: 'destructive' });
    }
  };

  const handleEdit = (reminder: any) => {
    setEditingReminderId(reminder._id);
    setFormData({
      title: reminder.title || '',
      description: reminder.description || '',
      dateTime: reminder.reminderDate ? reminder.reminderDate.substring(0, 16) : '',
      notifyBefore: '1day'
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReminder.mutateAsync(id);
      toast({ title: 'Reminder deleted' });
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.response?.data?.error?.message ?? 'Try again', variant: 'destructive' });
    }
  };

  const handleToggleCompleted = async (id: string, isCompleted: boolean) => {
    try {
      await updateReminder.mutateAsync({ id, update: { isCompleted } });
    } catch {}
  };

  const filteredReminders = reminders.filter((r: any) => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return !r.isCompleted;
    if (filterType === 'inactive') return r.isCompleted;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reminders & Notifications</h1>
          <p className="text-muted-foreground">Never miss an important academic event</p>
        </div>

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
                {upcomingAlerts.map((alert: any) => {
                  const { date, time } = formatDateTime(alert.reminderDate);
                  return (
                    <div key={alert._id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">{date} at {time}</p>
                      </div>
                      <Badge variant="default">{getTimeUntil(alert.reminderDate)}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter reminders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reminders</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)} className="gap-2 ml-auto">
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>

        {isLoading && (<Card className="mb-4"><CardContent>Loading...</CardContent></Card>)}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReminders.map((reminder: any) => {
            const { date, time } = formatDateTime(reminder.reminderDate);
            const isPast = new Date(reminder.reminderDate) < new Date();
            return (
              <Card key={reminder._id} className={`${reminder.isCompleted || isPast ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}>
                <CardHeader>
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
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(reminder)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleToggleCompleted(reminder._id, !reminder.isCompleted)}>
                      {reminder.isCompleted ? 'Mark Active' : 'Mark Done'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(reminder._id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReminders.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reminders found. Create your first reminder!</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReminderId ? 'Edit Reminder' : 'Create New Reminder'}</DialogTitle>
              <DialogDescription>Set up notifications for important academic events</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Physics Midterm Exam" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Additional details..." rows={2} />
              </div>
              <div>
                <Label htmlFor="dateTime">Date & Time *</Label>
                <Input id="dateTime" type="datetime-local" value={formData.dateTime} onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingReminderId(null); setFormData({ title: '', description: '', dateTime: '', notifyBefore: '1day' }); }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createReminder.isPending || updateReminder.isPending}>
                {editingReminderId ? 'Update' : 'Create'} Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}