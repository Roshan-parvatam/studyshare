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
import { Users, Plus, UserPlus, CheckSquare, Square, Clock, MoreVertical, Edit, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  members: string[];
  tasks: Task[];
  createdDate: string;
}

export default function Projects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Web Development Final Project',
      description: 'Build a full-stack application using React and Node.js',
      members: ['You', 'Alice Johnson', 'Bob Smith'],
      tasks: [
        {
          id: '1',
          title: 'Design Database Schema',
          description: 'Create ERD and define all tables',
          assignee: 'You',
          status: 'done',
          dueDate: '2024-01-18'
        },
        {
          id: '2',
          title: 'Implement Authentication',
          description: 'Set up JWT authentication',
          assignee: 'Alice Johnson',
          status: 'in-progress',
          dueDate: '2024-01-20'
        },
        {
          id: '3',
          title: 'Create Frontend UI',
          description: 'Build responsive React components',
          assignee: 'Bob Smith',
          status: 'todo',
          dueDate: '2024-01-25'
        }
      ],
      createdDate: '2024-01-10'
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    description: ''
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    status: 'todo' as Task['status'],
    dueDate: ''
  });

  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateProject = () => {
    if (!projectFormData.name) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectFormData.name,
      description: projectFormData.description,
      members: ['You'],
      tasks: [],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setProjectDialogOpen(false);
    setProjectFormData({ name: '', description: '' });
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  const handleAddTask = () => {
    if (!taskFormData.title || !taskFormData.assignee || !selectedProject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      ...taskFormData
    };

    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    );

    setProjects(updatedProjects);
    setSelectedProject({...selectedProject, tasks: [...selectedProject.tasks, newTask]});
    setTaskDialogOpen(false);
    setTaskFormData({
      title: '',
      description: '',
      assignee: '',
      status: 'todo',
      dueDate: ''
    });
    
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleUpdateTask = () => {
    if (!editingTask || !selectedProject) return;

    const updatedTasks = selectedProject.tasks.map(t =>
      t.id === editingTask.id ? { ...t, ...taskFormData } : t
    );

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, tasks: updatedTasks } : p
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    setTaskDialogOpen(false);
    setEditingTask(null);
    setTaskFormData({
      title: '',
      description: '',
      assignee: '',
      status: 'todo',
      dueDate: ''
    });

    toast({
      title: "Success",
      description: "Task updated successfully",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.filter(t => t.id !== taskId);
    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, tasks: updatedTasks } : p
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const handleInviteMember = () => {
    if (!inviteEmail || !selectedProject) return;

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id 
        ? { ...p, members: [...p.members, inviteEmail] }
        : p
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, members: [...selectedProject.members, inviteEmail] });
    setInviteDialogOpen(false);
    setInviteEmail('');
    
    toast({
      title: "Success",
      description: `Invited ${inviteEmail} to the project`,
    });
  };

  const getTasksByStatus = (status: Task['status']) => {
    return selectedProject?.tasks.filter(t => t.status === status) || [];
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id ? { ...p, tasks: updatedTasks } : p
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, tasks: updatedTasks });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Group Projects</h1>
          <p className="text-muted-foreground">Collaborate with your peers on academic projects</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Projects Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Button onClick={() => setProjectDialogOpen(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            
            <div className="space-y-2">
              {projects.map(project => (
                <Card 
                  key={project.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedProject?.id === project.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{project.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {project.members.length} members
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedProject.name}</h2>
                    <p className="text-muted-foreground">{selectedProject.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setInviteDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setEditingTask(null);
                        setTaskDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center gap-2 mb-6">
                  {selectedProject.members.map((member, index) => (
                    <div key={index} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>

                {/* Kanban Columns */}
                <div className="grid md:grid-cols-3 gap-4">
                  {(['todo', 'in-progress', 'done'] as const).map(status => (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium capitalize">
                          {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
                        </h3>
                        <Badge variant="secondary">
                          {getTasksByStatus(status).length}
                        </Badge>
                      </div>
                      <div className="space-y-2 min-h-[200px] p-2 bg-muted/30 rounded-lg">
                        {getTasksByStatus(status).map(task => (
                          <Card 
                            key={task.id} 
                            className="cursor-move hover:shadow-md transition-shadow"
                            draggable
                            onDragEnd={(e) => {
                              e.preventDefault();
                              // In a real app, implement drag and drop logic here
                            }}
                          >
                            <CardHeader className="p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-sm">{task.title}</CardTitle>
                                  <CardDescription className="text-xs mt-1">
                                    {task.description}
                                  </CardDescription>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      <User className="h-2 w-2 mr-1" />
                                      {task.assignee}
                                    </Badge>
                                    {task.dueDate && (
                                      <span className="text-xs text-muted-foreground">
                                        <Clock className="inline h-2 w-2 mr-1" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Select
                                  value={task.status}
                                  onValueChange={(value) => handleTaskStatusChange(task.id, value as Task['status'])}
                                >
                                  <SelectTrigger className="w-[100px] h-7 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-1 mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEditingTask(task);
                                    setTaskFormData({
                                      title: task.title,
                                      description: task.description,
                                      assignee: task.assignee,
                                      status: task.status,
                                      dueDate: task.dueDate || ''
                                    });
                                    setTaskDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a project or create a new one to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Create Project Dialog */}
        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new group project for collaboration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectFormData.name}
                  onChange={(e) => setProjectFormData({...projectFormData, name: e.target.value})}
                  placeholder="e.g., Web Development Final Project"
                />
              </div>
              <div>
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                  placeholder="Project objectives and goals..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Task Dialog */}
        <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              <DialogDescription>
                {editingTask ? 'Update task details' : 'Create a new task for the project'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="taskTitle">Title *</Label>
                <Input
                  id="taskTitle"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                  placeholder="e.g., Design Database Schema"
                />
              </div>
              <div>
                <Label htmlFor="taskDescription">Description</Label>
                <Textarea
                  id="taskDescription"
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                  placeholder="Task details..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="assignee">Assignee *</Label>
                <Select 
                  value={taskFormData.assignee} 
                  onValueChange={(value) => setTaskFormData({...taskFormData, assignee: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProject?.members.map(member => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taskStatus">Status</Label>
                <Select 
                  value={taskFormData.status} 
                  onValueChange={(value) => setTaskFormData({...taskFormData, status: value as Task['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taskDueDate">Due Date</Label>
                <Input
                  id="taskDueDate"
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setTaskDialogOpen(false);
                setEditingTask(null);
                setTaskFormData({
                  title: '',
                  description: '',
                  assignee: '',
                  status: 'todo',
                  dueDate: ''
                });
              }}>
                Cancel
              </Button>
              <Button onClick={editingTask ? handleUpdateTask : handleAddTask}>
                {editingTask ? 'Update' : 'Add'} Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Add a new member to {selectedProject?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="student@university.edu"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember}>Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}