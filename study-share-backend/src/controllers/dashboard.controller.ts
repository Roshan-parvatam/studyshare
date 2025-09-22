import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/responses';
import Note from '../models/Note';
import Assignment from '../models/Assignment';
import Reminder from '../models/Reminder';
import TimetableEntry from '../models/TimetableEntry';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];

    const [
      notesCount,
      pendingAssignments,
      inProgressAssignments,
      completedAssignments,
      upcomingReminders,
      todayTimetable
    ] = await Promise.all([
      Note.countDocuments({ userId }),
      Assignment.countDocuments({ userId, status: 'pending' }),
      Assignment.countDocuments({ userId, status: 'in-progress' }),
      Assignment.countDocuments({ userId, status: 'completed' }),
      Reminder.countDocuments({ 
        userId, 
        reminderDate: { $gte: today, $lte: nextWeek },
        isCompleted: false 
      }),
      TimetableEntry.find({ userId, day: todayName }).sort({ startTime: 1 })
    ]);

    const stats = {
      notes: { total: notesCount },
      assignments: {
        pending: pendingAssignments,
        inProgress: inProgressAssignments,
        completed: completedAssignments
      },
      upcomingReminders,
      todayTimetable
    };

    res.json(successResponse(stats));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch dashboard stats', error));
  }
};

export const getDashboardActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const [recentNotes, recentAssignments, recentReminders] = await Promise.all([
      Note.find({ userId }).sort({ updatedAt: -1 }).limit(3).select('title updatedAt'),
      Assignment.find({ userId }).sort({ updatedAt: -1 }).limit(3).select('title updatedAt'),
      Reminder.find({ userId }).sort({ updatedAt: -1 }).limit(4).select('title updatedAt')
    ]);

    const activity = [
      ...recentNotes.map(item => ({ ...item.toObject(), type: 'note' })),
      ...recentAssignments.map(item => ({ ...item.toObject(), type: 'assignment' })),
      ...recentReminders.map(item => ({ ...item.toObject(), type: 'reminder' }))
    ]
      .sort((a, b) => new Date(b.updatedAt as any).getTime() - new Date(a.updatedAt as any).getTime())
      .slice(0, 10);

    res.json(successResponse(activity));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch dashboard activity', error));
  }
};

