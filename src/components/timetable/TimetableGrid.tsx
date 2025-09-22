import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Clock, MapPin } from 'lucide-react';
import { TimetableDialog } from './TimetableDialog';

interface TimetableEntry {
  id: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
];

export function TimetableGrid() {
  const [entries, setEntries] = useState<TimetableEntry[]>([
    {
      id: '1',
      subject: 'Mathematics',
      day: 'Monday',
      startTime: '9:00 AM',
      endTime: '10:00 AM',
      location: 'Room 101',
      color: 'bg-gradient-primary',
    },
    {
      id: '2',
      subject: 'Physics',
      day: 'Tuesday',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      location: 'Lab 202',
      color: 'bg-gradient-secondary',
    },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const getEntryForSlot = (day: string, time: string) => {
    return entries.find(
      (entry) => entry.day === day && entry.startTime === time
    );
  };

  const handleAddEntry = (newEntry: Omit<TimetableEntry, 'id'>) => {
    const entry = {
      ...newEntry,
      id: Date.now().toString(),
    };
    setEntries([...entries, entry]);
  };

  const handleEditEntry = (updatedEntry: TimetableEntry) => {
    setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const openEditDialog = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingEntry(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weekly Timetable</h2>
        <Button onClick={openAddDialog} variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-2">
            {/* Header row */}
            <div className="p-3 font-semibold">Time</div>
            {DAYS.map((day) => (
              <div key={day} className="p-3 font-semibold text-center bg-gradient-primary text-primary-foreground rounded-lg">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {TIME_SLOTS.map((time) => (
              <>
                <div key={`time-${time}`} className="p-3 text-sm text-muted-foreground font-medium">
                  {time}
                </div>
                {DAYS.map((day) => {
                  const entry = getEntryForSlot(day, time);
                  return (
                    <div key={`${day}-${time}`} className="relative min-h-[80px]">
                      {entry ? (
                        <Card className={`p-3 h-full ${entry.color} text-primary-foreground group cursor-pointer transition-all hover:shadow-glow`}
                              onClick={() => openEditDialog(entry)}>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">{entry.subject}</p>
                            <div className="flex items-center gap-1 text-xs opacity-90">
                              <MapPin className="h-3 w-3" />
                              <span>{entry.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-90">
                              <Clock className="h-3 w-3" />
                              <span>{entry.endTime}</span>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(entry);
                              }}
                              className="p-1 bg-background/20 rounded hover:bg-background/30"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEntry(entry.id);
                              }}
                              className="p-1 bg-background/20 rounded hover:bg-background/30"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </Card>
                      ) : (
                        <button
                          onClick={openAddDialog}
                          className="w-full h-full min-h-[80px] border-2 border-dashed border-muted rounded-lg hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center group"
                        >
                          <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      <TimetableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editingEntry ? handleEditEntry : handleAddEntry}
        entry={editingEntry}
      />
    </div>
  );
}