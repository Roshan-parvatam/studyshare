import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Upload, Download, Share2, Search, Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  subject: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  isPublic: boolean;
  sharedWith: string[];
}

export default function Notes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Physics Chapter 1 - Mechanics',
      subject: 'Physics',
      description: 'Complete notes on classical mechanics including Newton\'s laws',
      fileName: 'physics_ch1.pdf',
      fileSize: '2.4 MB',
      uploadDate: '2024-01-15',
      isPublic: true,
      sharedWith: []
    },
    {
      id: '2',
      title: 'Calculus Integration Methods',
      subject: 'Mathematics',
      description: 'Various integration techniques with solved examples',
      fileName: 'calculus_integration.pdf',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-14',
      isPublic: false,
      sharedWith: ['john.doe@university.edu']
    }
  ]);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    isPublic: false
  });
  const [shareEmail, setShareEmail] = useState('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Literature'];

  const handleUpload = () => {
    if (!formData.title || !formData.subject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      fileName: 'document.pdf',
      fileSize: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      isPublic: formData.isPublic,
      sharedWith: []
    };

    setNotes([newNote, ...notes]);
    setUploadDialogOpen(false);
    setFormData({ title: '', subject: '', description: '', isPublic: false });
    
    toast({
      title: "Success",
      description: "Notes uploaded successfully",
    });
  };

  const handleShare = () => {
    if (!shareEmail || !selectedNote) return;

    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id 
        ? { ...note, sharedWith: [...note.sharedWith, shareEmail] }
        : note
    );
    
    setNotes(updatedNotes);
    setShareDialogOpen(false);
    setShareEmail('');
    
    toast({
      title: "Success",
      description: `Notes shared with ${shareEmail}`,
    });
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Success",
      description: "Notes deleted successfully",
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSubject === 'all' || note.subject === filterSubject;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
          <p className="text-muted-foreground">Upload, organize, and share your study materials</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Notes
          </Button>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground">{note.uploadDate}</span>
                </div>
                <CardTitle className="text-lg mt-2">{note.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {note.subject}
                  </span>
                  {note.isPublic && (
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-full">
                      Public
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{note.description}</CardDescription>
                <div className="text-xs text-muted-foreground mb-4">
                  {note.fileName} • {note.fileSize}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 gap-1"
                    onClick={() => {
                      setSelectedNote(note);
                      setShareDialogOpen(true);
                    }}
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(note.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notes found. Upload your first study material!</p>
            </CardContent>
          </Card>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Study Notes</DialogTitle>
              <DialogDescription>
                Share your study materials with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Physics Chapter 1 Notes"
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
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the notes"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="public" className="text-sm font-normal">
                  Make these notes public
                </Label>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to select file or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX up to 10MB
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Notes</DialogTitle>
              <DialogDescription>
                Share "{selectedNote?.title}" with other students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="student@university.edu"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShare}>Share</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}