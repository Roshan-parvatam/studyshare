import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
}

export default function Assignments() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Physics Lab Report',
      description: 'Complete the lab report on electromagnetic induction experiment',
      subject: 'Physics',
      dueDate: '2024-01-20',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Calculus Problem Set 5',
      description: 'Solve problems 1-20 from Chapter 5 on Integration',
      subject: 'Mathematics',
      dueDate: '2024-01-22',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Literature Essay',
      description: 'Write a 1500-word essay on Shakespeare\'s Hamlet',
      subject: 'Literature',
      dueDate: '2024-01-25',
      status: 'completed',
      priority: 'low'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    status: 'pending' as Assignment['status'],
    priority: 'medium' as Assignment['priority']
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Literature'];

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.subject || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingAssignment) {
      setAssignments(assignments.map(a => 
        a.id === editingAssignment.id ? { ...a, ...formData } : a
      ));
      toast({
        title: "Success",
        description: "Assignment updated successfully",
      });
    } else {
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        ...formData
      };
      setAssignments([newAssignment, ...assignments]);
      toast({
        title: "Success",
        description: "Assignment added successfully",
      });
    }

    setDialogOpen(false);
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium'
    });
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      status: assignment.status,
      priority: assignment.priority
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast({
      title: "Success",
      description: "Assignment deleted successfully",
    });
  };

  const handleStatusChange = (id: string, status: Assignment['status']) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status } : a
    ));
    toast({
      title: "Success",
      description: `Assignment marked as ${status}`,
    });
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus === 'all') return true;
    return assignment.status === filterStatus;
  });

  const upcomingDeadlines = assignments
    .filter(a => a.status !== 'completed')
    .filter(a => getDaysUntilDue(a.dueDate) <= 3 && getDaysUntilDue(a.dueDate) >= 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assignment Tracker</h1>
          <p className="text-muted-foreground">Manage your assignments and never miss a deadline</p>
        </div>

        {/* Upcoming Deadlines Alert */}
        {upcomingDeadlines.length > 0 && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingDeadlines.map(assignment => {
                  const daysLeft = getDaysUntilDue(assignment.dueDate);
                  return (
                    <div key={assignment.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                      </div>
                      <Badge variant="destructive">
                        {daysLeft === 0 ? 'Due Today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)} className="gap-2 ml-auto">
            <Plus className="h-4 w-4" />
            Add Assignment
          </Button>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map(assignment => {
            const daysLeft = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysLeft < 0 && assignment.status !== 'completed';
            
            return (
              <Card key={assignment.id} className={isOverdue ? 'border-destructive' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(assignment.status)}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">{assignment.description}</CardDescription>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="outline">{assignment.subject}</Badge>
                          <Badge variant={getPriorityColor(assignment.priority)}>
                            {assignment.priority} priority
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          {isOverdue && (
                            <Badge variant="destructive">Overdue</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={assignment.status}
                        onValueChange={(value) => handleStatusChange(assignment.id, value as Assignment['status'])}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(assignment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {filteredAssignments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assignments found. Add your first assignment!</p>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
              <DialogDescription>
                Track your academic assignments and deadlines
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Physics Lab Report"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Assignment details..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({...formData, subject: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({...formData, priority: value as Assignment['priority']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as Assignment['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDialogOpen(false);
                setEditingAssignment(null);
                setFormData({
                  title: '',
                  description: '',
                  subject: '',
                  dueDate: '',
                  status: 'pending',
                  priority: 'medium'
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingAssignment ? 'Update' : 'Add'} Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}